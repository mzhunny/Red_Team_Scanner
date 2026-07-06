# Safe Scanning Policy

## Purpose

This policy defines the safe-use boundaries for RedTeam Sentinel.

The project is designed to demonstrate defensive, authorized, non-intrusive scanning concepts. It should not be used for unauthorized testing or destructive security activity.

## Authorized Scope Requirement

No scan should run unless the target has been verified through an approved authorization method.

Approved verification methods:

- DNS TXT challenge
- HTML file challenge
- API response header challenge
- IP ownership workflow
- Admin-approved internal lab override

## Prohibited Activity

RedTeam Sentinel must not perform:

- Exploit payload execution
- Credential stuffing
- Brute force attempts
- SQL injection payload attacks
- Cross-site scripting payload execution
- Denial of service testing
- Malware delivery
- Destructive fuzzing
- Unauthorized enumeration

## Allowed Passive Checks

The project may demonstrate passive, non-intrusive checks such as:

- Security header review
- TLS/SSL posture review
- CORS configuration review
- HTTP response metadata review
- Public configuration review
- LLM endpoint policy boundary review

## Safe Failure Rules

The system should stop and route to human review when:

- Target verification fails
- Authorization is unclear
- A user attempts to bypass verification
- The requested action would be intrusive
- The target appears out of scope
- The agent is uncertain about whether a scan is allowed

## Production Guardrail

Development simulation is allowed only for demo data and local lab environments. Production mode must require successful verification before scanning.

## Audit Evidence

Every scan should produce evidence showing:

- Target identifier
- Verification method
- Authorization confirmation
- Scan type
- Scan timestamp
- User who initiated scan
- Findings generated
- Compliance mapping
- Remediation or review status

## Hiring Manager Signal

This policy demonstrates secure product thinking, authorization design, legal scope awareness, and non-destructive security testing boundaries.
