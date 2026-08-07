package supervisor

import "fmt"

// RoleDefinition defines a specialized persona in a multi-agent team.
type RoleDefinition struct {
	Role              string   `json:"role"`
	Name              string   `json:"name"`
	Description       string   `json:"description"`
	SystemPrompt      string   `json:"system_prompt"`
	PreferredProvider string   `json:"preferred_provider,omitempty"`
	Capabilities      []string `json:"capabilities,omitempty"`
}

// TeamConfig defines a team of specialized agents working together.
type TeamConfig struct {
	ID            string                    `json:"id"`
	Name          string                    `json:"name"`
	Description   string                    `json:"description"`
	LeadAgentRole string                    `json:"lead_agent_role"`
	Roles         map[string]RoleDefinition `json:"roles"`
}

// NewSoftwareDevTeam returns a pre-configured team for software development tasks.
func NewSoftwareDevTeam() *TeamConfig {
	return &TeamConfig{
		ID:            "software-dev-team",
		Name:          "Software Development Team",
		Description:   "Autonomous team for architecture, research, coding, QA, and communication",
		LeadAgentRole: "architect",
		Roles: map[string]RoleDefinition{
			"architect": {
				Role:         "architect",
				Name:         "Chief Software Architect",
				Description:  "Decomposes goals into architecture, modular tasks, and DAG workflows",
				SystemPrompt: "You are a Chief Software Architect. Analyze goals, break them into modular subtasks with clear dependencies, and oversee quality.",
				Capabilities: []string{"planning", "design", "coordination"},
			},
			"researcher": {
				Role:         "researcher",
				Name:         "Research & Context Specialist",
				Description:  "Gathers requirements, docs, web context, and existing code analysis",
				SystemPrompt: "You are a Senior Researcher. Search documentation, gather context, and provide clear summaries of technical specifications.",
				Capabilities: []string{"search", "documentation", "analysis"},
			},
			"engineer": {
				Role:         "engineer",
				Name:         "Senior Go Software Engineer",
				Description:  "Implements features, writes tests, and refactors codebase with clean Go code",
				SystemPrompt: "You are a Senior Go Developer. Write idiomatic, robust, well-tested Go code following project conventions.",
				Capabilities: []string{"coding", "refactoring", "testing"},
			},
			"qa": {
				Role:         "qa",
				Name:         "QA & Security Auditor",
				Description:  "Validates implementation against requirements, runs lints, and checks security",
				SystemPrompt: "You are a QA and Security Auditor. Audit code changes, test edge cases, and ensure security and correctness.",
				Capabilities: []string{"testing", "security", "auditing"},
			},
			"communicator": {
				Role:         "communicator",
				Name:         "DevRel & Technical Writer",
				Description:  "Formats release notes, documentation, and user notifications",
				SystemPrompt: "You are a Technical Communicator. Summarize technical outcomes clearly for users and stakeholders.",
				Capabilities: []string{"documentation", "formatting", "communication"},
			},
		},
	}
}

// NewSkillsInnovationTeam returns a pre-configured team for discovering, polishing, and innovating AI skills.
func NewSkillsInnovationTeam() *TeamConfig {
	return &TeamConfig{
		ID:            "skills-innovation-team",
		Name:          "AI Skills Innovation & Enhancement Team",
		Description:   "Autonomous team dedicated to evaluating, enhancing, and creating cutting-edge AI Agent skills",
		LeadAgentRole: "skill-architect",
		Roles: map[string]RoleDefinition{
			"skill-architect": {
				Role:         "skill-architect",
				Name:         "Skills Systems Architect",
				Description:  "Evaluates skill ecosystem, identifies gaps, and designs standardized SKILL.md specs",
				SystemPrompt: "You are an AI Skills Systems Architect. Standardize skill definitions, specify YAML frontmatter, and design clear tool interaction protocols.",
				Capabilities: []string{"skill-design", "frontmatter", "standardization"},
			},
			"api-specialist": {
				Role:         "api-specialist",
				Name:         "API & Protocol Specialist",
				Description:  "Integrates dynamic Web APIs, MCP protocols, and Browser CDP automation patterns",
				SystemPrompt: "You are an API Protocol Specialist. Ensure skills leverage modern JSON-RPC, SSE, CDP, and REST endpoints efficiently.",
				Capabilities: []string{"mcp", "cdp", "api-integration"},
			},
			"edge-iot-specialist": {
				Role:         "edge-iot-specialist",
				Name:         "Edge & Hardware Specialist",
				Description:  "Enhances Android ADB control and SBC hardware bus (I2C/SPI) skill capabilities",
				SystemPrompt: "You are an Edge Hardware Specialist. Optimize skills for ARM/RISC-V SBCs, Termux, ADB Android control, and GPIO/I2C/SPI buses.",
				Capabilities: []string{"android", "termux", "i2c", "spi"},
			},
			"prompt-engineer": {
				Role:         "prompt-engineer",
				Name:         "Agentic Prompt Engineer",
				Description:  "Crafts clear instruction guides and structured examples for zero-shot skill execution",
				SystemPrompt: "You are an Agentic Prompt Engineer. Write clear, unambiguous SKILL.md instructions with concrete JSON payloads and usage examples.",
				Capabilities: []string{"prompting", "instruction-design", "examples"},
			},
			"qa-auditor": {
				Role:         "qa-auditor",
				Name:         "Skill Compliance & QA Auditor",
				Description:  "Validates skill schemas against loader constraints and tests skill loading",
				SystemPrompt: "You are a Skill QA Auditor. Validate metadata constraints (max name 64 chars, description 1024 chars) and verify loader compatibility.",
				Capabilities: []string{"validation", "compliance", "testing"},
			},
		},
	}
}

// GetRole returns a RoleDefinition by name, or an error if not found.
func (tc *TeamConfig) GetRole(roleName string) (RoleDefinition, error) {
	if role, ok := tc.Roles[roleName]; ok {
		return role, nil
	}
	return RoleDefinition{}, fmt.Errorf("role %q not found in team %q", roleName, tc.ID)
}
