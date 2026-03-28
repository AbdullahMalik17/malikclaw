package eval

// EvaluationResult defines the structured output of the evaluator's self-reflection.
type EvaluationResult struct {
	// Success indicates if the ultimate user goal was fully achieved.
	Success bool `json:"success"`
	// SuccessScore is a float between 0.0 and 1.0 indicating degree of success.
	SuccessScore float64 `json:"success_score"`
	// Efficiency is a float between 0.0 and 1.0 indicating how optimally the task was solved.
	Efficiency float64 `json:"efficiency"`
	// Correctness is a float between 0.0 and 1.0 indicating if the output is factually/logically correct.
	Correctness float64 `json:"correctness"`
	// WhatWentWrong describes any errors, missteps, or inefficiencies.
	WhatWentWrong string `json:"what_went_wrong"`
	// HowToImprove provides actionable advice to avoid these mistakes in the future.
	HowToImprove string `json:"how_to_improve"`
	// Feedback is a textual summary returned to refine the plan if not fully successful.
	Feedback string `json:"feedback"`
}
