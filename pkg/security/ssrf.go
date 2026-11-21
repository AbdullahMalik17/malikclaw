package security

import (
	"context"
	"errors"
	"fmt"
	"net"
	"net/http"
	"net/netip"
	"net/url"
	"strings"
	"time"
)

var (
	// ErrInvalidURL indicates the URL is empty, malformed, or missing a host.
	ErrInvalidURL = errors.New("security: invalid URL")
	// ErrDisallowedScheme indicates the URL scheme is not http or https.
	ErrDisallowedScheme = errors.New("security: disallowed URL scheme")
	// ErrBlockedHost indicates the hostname is explicitly blocked (e.g. localhost or cloud metadata).
	ErrBlockedHost = errors.New("security: blocked host")
	// ErrBlockedIP indicates the target IP address falls in a blocked network range.
	ErrBlockedIP = errors.New("security: blocked IP address")
	// ErrDNSResolution indicates the target hostname could not be resolved to any IP address.
	ErrDNSResolution = errors.New("security: DNS resolution failed")
)

var blockedPrefixes = []netip.Prefix{
	netip.MustParsePrefix("0.0.0.0/8"),       // RFC 1122 "this network" / unspecified
	netip.MustParsePrefix("10.0.0.0/8"),      // RFC 1918 private
	netip.MustParsePrefix("100.64.0.0/10"),   // RFC 6598 CGNAT
	netip.MustParsePrefix("169.254.0.0/16"),  // RFC 3927 link-local & cloud metadata (169.254.169.254)
	netip.MustParsePrefix("172.16.0.0/12"),   // RFC 1918 private
	netip.MustParsePrefix("192.168.0.0/16"),  // RFC 1918 private
	netip.MustParsePrefix("fc00::/7"),        // RFC 4193 IPv6 ULA
	netip.MustParsePrefix("fe80::/10"),       // RFC 4291 IPv6 link-local
	netip.MustParsePrefix("224.0.0.0/4"),     // IPv4 multicast
	netip.MustParsePrefix("240.0.0.0/4"),     // IPv4 reserved / broadcast
	netip.MustParsePrefix("ff00::/8"),        // IPv6 multicast
}

// lookupIPFunc is used by ValidateURL for DNS resolution and may be overridden in tests.
var lookupIPFunc = net.LookupIP

// IsBlockedIP reports whether ip falls into a disallowed network range for outbound
// agent requests. It blocks invalid addresses, IPv4-mapped IPv6 addresses, unspecified
// addresses (0.0.0.0, ::), RFC 1918 private ranges, CGNAT (100.64.0.0/10), link-local
// and cloud metadata ranges (169.254.0.0/16, fe80::/10), IPv6 ULA (fc00::/7), and
// multicast/reserved ranges.
//
// Loopback addresses (127.0.0.0/8, ::1) are blocked unless allowLocalhost is true.
func IsBlockedIP(ip netip.Addr, allowLocalhost bool) bool {
	if !ip.IsValid() {
		return true
	}

	// Reject IPv4-mapped IPv6 addresses (e.g. ::ffff:127.0.0.1, ::ffff:169.254.169.254)
	// unconditionally to prevent dual-stack SSRF filter bypasses.
	if ip.Is4In6() {
		return true
	}

	// Strip any IPv6 zone identifier before range checks.
	addr := ip.WithZone("")

	if addr.IsUnspecified() {
		return true
	}

	if addr.IsLoopback() {
		return !allowLocalhost
	}

	if addr.IsPrivate() ||
		addr.IsLinkLocalUnicast() ||
		addr.IsLinkLocalMulticast() ||
		addr.IsInterfaceLocalMulticast() ||
		addr.IsMulticast() {
		return true
	}

	for _, prefix := range blockedPrefixes {
		if prefix.Contains(addr) {
			return true
		}
	}

	if addr.Is6() {
		b := addr.As16()
		// 6to4 (2002::/16): embedded IPv4 address at bytes [2:6].
		if b[0] == 0x20 && b[1] == 0x02 {
			embedded := netip.AddrFrom4([4]byte{b[2], b[3], b[4], b[5]})
			return IsBlockedIP(embedded, allowLocalhost)
		}
		// Teredo (2001:0000::/32): XOR-inverted client IPv4 at bytes [12:16].
		if b[0] == 0x20 && b[1] == 0x01 && b[2] == 0x00 && b[3] == 0x00 {
			client := netip.AddrFrom4([4]byte{b[12] ^ 0xff, b[13] ^ 0xff, b[14] ^ 0xff, b[15] ^ 0xff})
			return IsBlockedIP(client, allowLocalhost)
		}
	}

	return false
}

// ValidateURL validates that rawURL is safe for an outbound HTTP(S) request.
// It enforces HTTP/HTTPS schemes, blocks cloud metadata hostnames, and checks all
// literal or DNS-resolved IP addresses against IsBlockedIP.
//
// Loopback targets (localhost, 127.0.0.0/8, ::1) are permitted only when
// allowLocalhost is true (e.g. for local Ollama or vLLM servers).
func ValidateURL(rawURL string, allowLocalhost bool) error {
	trimmed := strings.TrimSpace(rawURL)
	if trimmed == "" {
		return fmt.Errorf("%w: empty URL", ErrInvalidURL)
	}

	parsed, err := url.Parse(trimmed)
	if err != nil {
		return fmt.Errorf("%w: %v", ErrInvalidURL, err)
	}

	scheme := strings.ToLower(parsed.Scheme)
	if scheme != "http" && scheme != "https" {
		return fmt.Errorf("%w: %q (only http and https are allowed)", ErrDisallowedScheme, parsed.Scheme)
	}

	host := strings.TrimSpace(parsed.Hostname())
	if host == "" {
		return fmt.Errorf("%w: missing host", ErrInvalidURL)
	}

	lowerHost := strings.ToLower(strings.TrimSuffix(host, "."))

	// Explicitly block cloud metadata hostnames regardless of DNS state.
	if lowerHost == "metadata.google.internal" ||
		lowerHost == "metadata.goog" ||
		strings.HasSuffix(lowerHost, ".metadata.google.internal") {
		return fmt.Errorf("%w: %q", ErrBlockedHost, host)
	}

	// Block localhost hostnames immediately when allowLocalhost is false.
	if !allowLocalhost && (lowerHost == "localhost" || strings.HasSuffix(lowerHost, ".localhost")) {
		return fmt.Errorf("%w: %q (localhost is not allowed)", ErrBlockedHost, host)
	}

	// Handle IP literal hosts directly without DNS lookup.
	if ip, err := netip.ParseAddr(host); err == nil {
		if IsBlockedIP(ip, allowLocalhost) {
			return fmt.Errorf("%w: %s", ErrBlockedIP, ip.String())
		}
		return nil
	}

	// Resolve hostname to IPs and validate every resolved address.
	ips, err := lookupIPFunc(host)
	if err != nil {
		return fmt.Errorf("%w: %s: %v", ErrDNSResolution, host, err)
	}
	if len(ips) == 0 {
		return fmt.Errorf("%w: %s resolved to no IP addresses", ErrDNSResolution, host)
	}

	for _, rawIP := range ips {
		addr, ok := netip.AddrFromSlice(rawIP)
		if !ok {
			return fmt.Errorf("%w: invalid resolved IP %q for host %s", ErrBlockedIP, rawIP.String(), host)
		}
		// net.LookupIP represents IPv4 addresses as 16-byte slices; normalize native IPv4
		// responses while keeping genuine IPv6 addresses intact.
		if rawIP.To4() != nil {
			addr = addr.Unmap()
		}
		if IsBlockedIP(addr, allowLocalhost) {
			return fmt.Errorf("%w: host %s resolved to blocked IP %s", ErrBlockedIP, host, addr.String())
		}
	}

	return nil
}

// NewSafeDialContext returns a net.Dialer DialContext function that validates
// target IP addresses at connect time via IsBlockedIP to prevent DNS-rebinding
// (TOCTOU) SSRF attacks.
func NewSafeDialContext(dialer *net.Dialer, allowLocalhost bool) func(context.Context, string, string) (net.Conn, error) {
	return NewSafeDialContextFunc(dialer, func() bool { return allowLocalhost })
}

// NewSafeDialContextFunc is like NewSafeDialContext but evaluates allowLocalhost
// dynamically per connection via allowLocalhostFn.
func NewSafeDialContextFunc(dialer *net.Dialer, allowLocalhostFn func() bool) func(context.Context, string, string) (net.Conn, error) {
	if dialer == nil {
		dialer = &net.Dialer{
			Timeout:   15 * time.Second,
			KeepAlive: 30 * time.Second,
		}
	}

	return func(ctx context.Context, network, address string) (net.Conn, error) {
		allowLocalhost := allowLocalhostFn != nil && allowLocalhostFn()

		host, port, err := net.SplitHostPort(address)
		if err != nil {
			return nil, fmt.Errorf("%w: invalid target address %q: %v", ErrInvalidURL, address, err)
		}
		host = strings.TrimSpace(host)
		if host == "" {
			return nil, fmt.Errorf("%w: empty target host", ErrInvalidURL)
		}

		lowerHost := strings.ToLower(strings.TrimSuffix(host, "."))
		if lowerHost == "metadata.google.internal" ||
			lowerHost == "metadata.goog" ||
			strings.HasSuffix(lowerHost, ".metadata.google.internal") {
			return nil, fmt.Errorf("%w: %q", ErrBlockedHost, host)
		}
		if !allowLocalhost && (lowerHost == "localhost" || strings.HasSuffix(lowerHost, ".localhost")) {
			return nil, fmt.Errorf("%w: %q (localhost is not allowed)", ErrBlockedHost, host)
		}

		if ip, parseErr := netip.ParseAddr(host); parseErr == nil {
			if IsBlockedIP(ip, allowLocalhost) {
				return nil, fmt.Errorf("%w: %s", ErrBlockedIP, ip.String())
			}
			return dialer.DialContext(ctx, network, net.JoinHostPort(ip.String(), port))
		}

		ipAddrs, err := net.DefaultResolver.LookupIPAddr(ctx, host)
		if err != nil {
			return nil, fmt.Errorf("%w: %s: %v", ErrDNSResolution, host, err)
		}
		if len(ipAddrs) == 0 {
			return nil, fmt.Errorf("%w: %s resolved to no IP addresses", ErrDNSResolution, host)
		}

		attempted := 0
		var lastErr error
		for _, ipAddr := range ipAddrs {
			addr, ok := netip.AddrFromSlice(ipAddr.IP)
			if !ok {
				continue
			}
			if ipAddr.IP.To4() != nil {
				addr = addr.Unmap()
			}
			if IsBlockedIP(addr, allowLocalhost) {
				continue
			}
			attempted++
			conn, dialErr := dialer.DialContext(ctx, network, net.JoinHostPort(addr.String(), port))
			if dialErr == nil {
				return conn, nil
			}
			lastErr = dialErr
		}

		if attempted == 0 {
			return nil, fmt.Errorf("%w: all resolved addresses for %s are blocked", ErrBlockedIP, host)
		}
		if lastErr != nil {
			return nil, fmt.Errorf("failed connecting to public addresses for %s: %w", host, lastErr)
		}
		return nil, fmt.Errorf("failed connecting to public addresses for %s", host)
	}
}

// NewSafeCheckRedirect returns an http.Client CheckRedirect callback that caps
// redirect hops and validates every redirect target URL via ValidateURL.
func NewSafeCheckRedirect(allowLocalhost bool, maxRedirects int) func(*http.Request, []*http.Request) error {
	return NewSafeCheckRedirectFunc(func() bool { return allowLocalhost }, maxRedirects)
}

// NewSafeCheckRedirectFunc is like NewSafeCheckRedirect but evaluates allowLocalhost
// dynamically via allowLocalhostFn.
func NewSafeCheckRedirectFunc(allowLocalhostFn func() bool, maxRedirects int) func(*http.Request, []*http.Request) error {
	if maxRedirects <= 0 {
		maxRedirects = 10
	}
	return func(req *http.Request, via []*http.Request) error {
		if len(via) >= maxRedirects {
			return fmt.Errorf("stopped after %d redirects", maxRedirects)
		}
		allowLocalhost := allowLocalhostFn != nil && allowLocalhostFn()
		if err := ValidateURL(req.URL.String(), allowLocalhost); err != nil {
			return fmt.Errorf("redirect target blocked: %w", err)
		}
		return nil
	}
}

// NewSafeHTTPClient builds an *http.Client with SSRF-safe DialContext, redirect
// validation, optional proxy support (http/https/socks5/socks5h), and timeout.
func NewSafeHTTPClient(timeout time.Duration, proxyURL string, allowLocalhost bool) (*http.Client, error) {
	return NewSafeHTTPClientWithPolicy(timeout, proxyURL, func() bool { return allowLocalhost }, 10)
}

// NewSafeHTTPClientWithPolicy builds an SSRF-safe *http.Client using a dynamic
// allowLocalhostFn policy and configurable redirect limit.
func NewSafeHTTPClientWithPolicy(
	timeout time.Duration,
	proxyURL string,
	allowLocalhostFn func() bool,
	maxRedirects int,
) (*http.Client, error) {
	dialer := &net.Dialer{
		Timeout:   15 * time.Second,
		KeepAlive: 30 * time.Second,
	}

	transport := &http.Transport{
		DialContext:         NewSafeDialContextFunc(dialer, allowLocalhostFn),
		MaxIdleConns:        10,
		IdleConnTimeout:     30 * time.Second,
		TLSHandshakeTimeout: 15 * time.Second,
	}

	if proxyURL != "" {
		parsedProxy, err := url.Parse(proxyURL)
		if err != nil {
			return nil, fmt.Errorf("invalid proxy URL: %w", err)
		}
		switch strings.ToLower(parsedProxy.Scheme) {
		case "http", "https", "socks5", "socks5h":
		default:
			return nil, fmt.Errorf(
				"unsupported proxy scheme %q (supported: http, https, socks5, socks5h)",
				parsedProxy.Scheme,
			)
		}
		if parsedProxy.Host == "" {
			return nil, fmt.Errorf("invalid proxy URL: missing host")
		}
		transport.Proxy = http.ProxyURL(parsedProxy)
	} else {
		transport.Proxy = http.ProxyFromEnvironment
	}

	return &http.Client{
		Timeout:       timeout,
		Transport:     transport,
		CheckRedirect: NewSafeCheckRedirectFunc(allowLocalhostFn, maxRedirects),
	}, nil
}
