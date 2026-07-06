# QA Test Plan

## Test Plan Purpose

This test plan demonstrates how RedTeam Sentinel would be validated from a Security QA, IAM, and GRC perspective.

## Scope

In scope:

- Target onboarding
- Authorization confirmation
- Verification challenge workflow
- Scan blocking for unverified targets
- Passive scan workflow
- Finding generation
- Compliance mapping
- RBAC permissions
- Audit logging
- AI recommendation review

Out of scope:

- Real exploit testing
- Unauthorized scans
- Destructive payloads
- Credential attacks
- Production penetration testing

## Test Objectives

- Confirm scans cannot run before target verification.
- Confirm passive scanning stays non-intrusive.
- Confirm RBAC prevents unauthorized actions.
- Confirm AI recommendations require human review.
- Confirm findings include evidence, severity, recommendation, and compliance mapping.
- Confirm audit logs capture security-relevant actions.

## Test Types

| Test Type | Purpose |
|---|---|
| Functional Testing | Validate core workflows. |
| Negative Testing | Confirm unsafe or unauthorized actions are blocked. |
| Security Testing | Validate scope gating, RBAC, and safe scanning controls. |
| API Testing | Validate endpoint behavior and response codes. |
| GRC Validation | Confirm compliance mapping and audit evidence fields. |
| AI Output Testing | Validate AI recommendations are structured and human-reviewed. |

## Entry Criteria

- Requirements are documented.
- Test data is available.
- RBAC matrix is defined.
- Sample targets are defined.
- Safe-use policy is documented.

## Exit Criteria

- Critical and high-risk control tests pass.
- Unauthorized scanning is blocked.
- RBAC restrictions are validated.
- AI output is reviewed by a human.
- Audit logs show required evidence.

## Risks

| Risk | Mitigation |
|---|---|
| Scanner could be misunderstood as offensive tooling | Add authorized-use disclaimer and safe scanning policy. |
| Simulation mode could appear unsafe | Document development-only boundary. |
| AI output could be trusted without evidence | Require human validation and evidence references. |
| RBAC could allow excessive permissions | Maintain RBAC test matrix. |

## Hiring Manager Signal

This plan shows practical QA thinking applied to security, IAM, compliance, and Agentic AI workflows.
