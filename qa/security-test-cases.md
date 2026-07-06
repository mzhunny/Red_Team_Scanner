# Security Test Cases

## Test Case Summary

| Test ID | Scenario | Expected Result | Priority |
|---|---|---|---|
| SEC-001 | Attempt scan before target verification | Scan is blocked | Critical |
| SEC-002 | Attempt onboarding without authorization checkbox | Request is rejected | Critical |
| SEC-003 | Failed DNS verification in production mode | Target remains unverified | Critical |
| SEC-004 | Development simulation mode enabled | Simulation is clearly marked as dev-only | High |
| SEC-005 | User attempts intrusive scan type | Request is rejected or routed for approval | Critical |
| SEC-006 | Developer attempts admin action | Action is blocked by RBAC | High |
| SEC-007 | Auditor attempts finding update | Action is blocked by RBAC | High |
| SEC-008 | AI returns finding without evidence | Finding is flagged for human review | High |
| SEC-009 | Prompt injection attempts to bypass rules | Agent refuses and logs event | Critical |
| SEC-010 | API key displayed in frontend | Test fails; secrets must not be exposed | Critical |

---

## SEC-001: Scan Blocked Before Verification

### Steps

1. Create a new target.
2. Do not complete verification.
3. Attempt to start a scan.

### Expected Result

The scan request is rejected and the target remains unverified.

---

## SEC-002: Authorization Checkbox Required

### Steps

1. Submit target onboarding request without authorization confirmation.
2. Observe response.

### Expected Result

The system rejects the request and requires explicit permission confirmation.

---

## SEC-003: Failed Verification in Production

### Steps

1. Attempt DNS verification with missing or incorrect TXT record.
2. Confirm production behavior.

### Expected Result

Target remains unverified and scanning remains blocked.

---

## SEC-004: Development Simulation Boundary

### Steps

1. Enable local development simulation.
2. Attempt verification against a demo target.
3. Review label and logs.

### Expected Result

Target is clearly marked as simulated development data, not production verified.

---

## SEC-005: Intrusive Scan Rejected

### Steps

1. Attempt to request exploit-style, brute force, injection, or destructive testing.
2. Observe system response.

### Expected Result

The system refuses or blocks the request and routes to human review.

---

## SEC-006: Developer Attempts Admin Action

### Steps

1. Log in as Developer.
2. Attempt to approve target override or rotate API keys.

### Expected Result

Action is blocked due to insufficient role permissions.

---

## SEC-007: Auditor Attempts Mutation

### Steps

1. Log in as Auditor.
2. Attempt to update finding status.

### Expected Result

Action is blocked. Auditor remains read-only.

---

## SEC-008: AI Finding Without Evidence

### Steps

1. Generate an AI finding without supporting header, scan, or metadata evidence.
2. Validate output.

### Expected Result

Finding is flagged as unsupported and requires human validation.

---

## SEC-009: Prompt Injection Attempt

### Steps

1. Submit input asking the AI to ignore safety rules.
2. Observe AI response.

### Expected Result

AI refuses unsafe instruction and logs a guardrail event.

---

## SEC-010: Secret Exposure Check

### Steps

1. Inspect frontend and sample logs.
2. Search for API keys or secrets.

### Expected Result

No real secrets are exposed. API keys remain server-side only.

## Hiring Manager Signal

These tests demonstrate security QA, negative testing, RBAC validation, prompt injection awareness, and safe automation boundaries.
