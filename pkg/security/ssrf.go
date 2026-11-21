package security

import (
	"errors"
	"fmt"
	"net"
	"net/netip"
	"net/url"
	"strings"
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
