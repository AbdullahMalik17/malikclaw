package security

import (
	"fmt"
	"regexp"
	"strings"
)

// Severity represents the confidence/risk level of a detected prompt-injection finding.
type Severity string

const (
	SeverityNone     Severity = "none"
	SeverityLow      Severity = "low"
	SeverityMedium   Severity = "medium"
	SeverityHigh     Severity = "high"
	SeverityCritical Severity = "critical"
)

// InjectionFinding describes a single matched prompt-injection rule.
type InjectionFinding struct {
	Rule     string   `json:"rule"`
	Category string   `json:"category"`
	Severity Severity `json:"severity"`
	Match    string   `json:"match"`
}

// InjectionReport summarizes the result of scanning untrusted input for
// prompt-injection patterns.
type InjectionReport struct {
	Detected     bool               `json:"detected"`
	Severity     Severity           `json:"severity"`
	MatchedRules []string           `json:"matched_rules,omitempty"`
	Findings     []InjectionFinding `json:"findings,omitempty"`
}

type injectionRule struct {
	name     string
	category string
	severity Severity
	pattern  *regexp.Regexp
}

var (
	// closingTagPattern matches closing untrusted_data tags (including whitespace/case variants)
	// to prevent tag-spoofing breakouts.
	closingTagPattern = regexp.MustCompile(`(?i)</\s*untrusted_data\b[^>]*>`)
	// openingTagPattern matches nested opening untrusted_data tags to prevent boundary confusion.
	openingTagPattern = regexp.MustCompile(`(?i)<\s*untrusted_data\b[^>]*>`)
	// sourceAttrSanitizer strips characters that could break out of XML/HTML attribute quotes.
	sourceAttrSanitizer = regexp.MustCompile(`[^a-zA-Z0-9._:/@\- ]+`)

	injectionRules = []injectionRule{
		// 1. Instruction-ignoring / override attempts
		{
			name:     "ignore_previous_instructions",
			category: "instruction_override",
			severity: SeverityHigh,
			pattern:  regexp.MustCompile(`(?i)\b(ignore|disregard|forget|override|bypass)\b.{0,32}\b(all\s+)?(previous|prior|above|earlier|original|system)\s+(instructions?|prompts?|rules?|directives?|guidelines?)\b`),
		},
		{
			name:     "do_not_follow_system",
			category: "instruction_override",
			severity: SeverityHigh,
			pattern:  regexp.MustCompile(`(?i)\bdo\s+not\s+(follow|obey|adhere\s+to)\s+(the\s+)?(previous|above|prior|system)\s+(instructions?|rules?|constraints?)\b`),
		},

		// 2. System / role override directives
		{
			name:     "system_role_spoof",
			category: "role_override",
			severity: SeverityHigh,
			pattern:  regexp.MustCompile(`(?i)(<\|\s*im_start\s*\|>\s*system|\[system\s*(prompt|message|override)?\]|###\s*system\s*(instructions?|prompt)\b|new\s+system\s+prompt\s*:)`),
		},
		{
			name:     "unrestricted_persona_override",
			category: "role_override",
			severity: SeverityMedium,
			pattern:  regexp.MustCompile(`(?i)\b(you\s+are\s+now\s+(in\s+)?(developer|jailbreak|dan|unrestricted|god)\s+mode|act\s+as\s+an?\s+(unrestricted|unfiltered)\s+(ai|assistant|model))\b`),
		},

		// 3. Secret / environment / system-prompt exfiltration commands
		{
			name:     "system_prompt_exfiltration",
			category: "secret_exfiltration",
			severity: SeverityHigh,
			pattern:  regexp.MustCompile(`(?i)\b(reveal|print|dump|output|leak|disclose|show\s+me)\b.{0,28}\b(your\s+)?(hidden\s+|secret\s+|full\s+|exact\s+)?(system\s+prompt|system\s+instructions?|developer\s+prompt)\b`),
		},
		{
			name:     "env_secret_exfiltration",
			category: "secret_exfiltration",
			severity: SeverityCritical,
			pattern:  regexp.MustCompile(`(?i)\b(exfiltrate|leak|dump|steal|send|upload|post)\b.{0,40}\b(api[\s_-]?keys?|oauth\s+tokens?|secret[\s_-]?keys?|aws_secret|private[\s_-]?key|\.env\b|~/.ssh|environment\s+variables?|process\.env)\b`),
		},
		{
			name:     "direct_secret_file_read",
			category: "secret_exfiltration",
			severity: SeverityHigh,
			pattern:  regexp.MustCompile(`(?i)\b(cat|type|head|tail|printenv|env)\s+(~\/\.ssh\/id_rsa|\/etc\/shadow|\.env\b|~/.aws/credentials)`),
		},

		// 4. Encoded shell payload / remote execution attempts
		{
			name:     "encoded_shell_pipe",
			category: "encoded_payload",
			severity: SeverityCritical,
			pattern:  regexp.MustCompile(`(?i)(base64\s+(-d|--decode)\s*\|\s*(ba)?sh\b|echo\s+[A-Za-z0-9+/=]{16,}\s*\|\s*base64\s+(-d|--decode))`),
		},
		{
			name:     "remote_script_pipe_shell",
			category: "encoded_payload",
			severity: SeverityCritical,
			pattern:  regexp.MustCompile(`(?i)\b(curl|wget)\b[^\n|]{1,200}\|\s*(sudo\s+)?(ba|z|da)?sh\b`),
		},
		{
			name:     "encoded_powershell_command",
			category: "encoded_payload",
			severity: SeverityCritical,
			pattern:  regexp.MustCompile(`(?i)\b(powershell|pwsh)(\.exe)?\b[^\n]{0,80}\s-(enc|encodedcommand)\s+[A-Za-z0-9+/=]{12,}`),
		},
	}
)

// WrapUntrusted isolates untrusted external content (web pages, MCP tool results,
// emails, chat messages) inside explicit <untrusted_data> data-boundary tags.
// Any embedded <untrusted_data> or </untrusted_data> tags in content are escaped
// to prevent boundary-spoofing attacks.
func WrapUntrusted(source, content string) string {
	cleanSource := strings.TrimSpace(sourceAttrSanitizer.ReplaceAllString(source, ""))
	if cleanSource == "" {
		cleanSource = "unknown"
	}

	escaped := closingTagPattern.ReplaceAllStringFunc(content, func(m string) string {
		return strings.ReplaceAll(strings.ReplaceAll(m, "<", "&lt;"), ">", "&gt;")
	})
	escaped = openingTagPattern.ReplaceAllStringFunc(escaped, func(m string) string {
		return strings.ReplaceAll(strings.ReplaceAll(m, "<", "&lt;"), ">", "&gt;")
	})

	return fmt.Sprintf("<untrusted_data source=%q>\n%s\n</untrusted_data>", cleanSource, escaped)
}

// ScanPromptInjection inspects input for high-confidence prompt-injection patterns
// including role/system overrides, instruction-ignoring directives, secret/env
// exfiltration attempts, and encoded shell payloads.
func ScanPromptInjection(input string) InjectionReport {
	report := InjectionReport{
		Detected: false,
		Severity: SeverityNone,
	}
	if strings.TrimSpace(input) == "" {
		return report
	}

	for _, rule := range injectionRules {
		match := rule.pattern.FindString(input)
		if match == "" {
			continue
		}
		report.Detected = true
		report.MatchedRules = append(report.MatchedRules, rule.name)
		report.Findings = append(report.Findings, InjectionFinding{
			Rule:     rule.name,
			Category: rule.category,
			Severity: rule.severity,
			Match:    strings.TrimSpace(match),
		})
		if severityRank(rule.severity) > severityRank(report.Severity) {
			report.Severity = rule.severity
		}
	}

	return report
}

func severityRank(s Severity) int {
	switch s {
	case SeverityCritical:
		return 4
	case SeverityHigh:
		return 3
	case SeverityMedium:
		return 2
	case SeverityLow:
		return 1
	default:
		return 0
	}
}
