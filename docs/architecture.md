# Architecture Overview

## Purpose

This document explains the intended architecture for RedTeam Sentinel as a defensive, permission-based security assessment platform.

## High-Level Components

```text
User / Security Operator
        |
        v
React Frontend / Security Dashboard
        |
        v
Express API Gateway
        |
        +--> Scope Verification Service
        +--> Passive Scan Service
        +--> AI Finding Enrichment Service
        +--> Compliance Mapping Service
        +--> Audit Logging Service
        +--> Local Persistence Layer
```

## Component Responsibilities

| Component | Responsibility |
|---|---|
| Frontend Dashboard | Allows users to onboard targets, review verification status, trigger approved scans, view findings, and inspect compliance mappings. |
| API Gateway | Handles target onboarding, scan requests, finding status updates, audit logs, and team operations. |
| Scope Verification Service | Confirms target ownership or authorization before scans are allowed. |
| Passive Scan Service | Performs non-intrusive checks such as headers, TLS posture, CORS configuration, and metadata review. |
| AI Finding Enrichment Service | Produces human-reviewed security recommendations and compliance context. |
| Compliance Mapping Service | Maps findings to OWASP, SOC 2, GDPR, ISO-style controls, and audit evidence needs. |
| Audit Logging Service | Records security-relevant actions for traceability and review. |
| Persistence Layer | Stores sample targets, scans, findings, team roles, API keys, and logs. |

## Data Flow

1. User onboards a target.
2. System generates a verification challenge.
3. User proves ownership through DNS, HTML file, API header, IP ownership workflow, or approved admin override.
4. System marks the target verified only after successful authorization.
5. User triggers a passive scan.
6. Passive scan results are converted into findings.
7. AI enrichment may add remediation context if enabled.
8. Findings are mapped to compliance themes.
9. Audit logs capture the workflow.
10. Human reviewer validates and approves final actions.

## Design Priorities

- Permission-first scanning
- Defensive use only
- Passive/non-intrusive assessment
- Human approval before decisions
- Auditability
- RBAC separation of duties
- Compliance mapping
- AI output validation

## Development Simulation Boundary

Simulation mode may be useful for demos or local development, but it must not be used as a production verification bypass. In production, failed verification should keep the target unverified and scanning should remain blocked.
