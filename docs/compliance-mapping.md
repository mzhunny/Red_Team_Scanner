# Compliance Mapping

## Purpose

This document explains how RedTeam Sentinel findings can be mapped to security and compliance control themes.

This is a portfolio artifact, not an official audit opinion or certification assessment.

## Mapping Themes

| Finding Type | OWASP Theme | SOC 2 Theme | GDPR Theme | ISO-Style Theme |
|---|---|---|---|---|
| Missing security headers | Security misconfiguration | Logical access / system operations | Security of processing | Technical vulnerability management |
| Weak TLS posture | Cryptographic failure | System operations | Security of processing | Cryptographic controls |
| CORS wildcard exposure | Security misconfiguration / access control | Logical access | Data protection by design | Access control / secure configuration |
| Missing CSP | Security misconfiguration | Risk mitigation | Security of processing | Secure configuration |
| Prompt injection exposure | OWASP LLM prompt injection | Risk management | Security of processing | AI system governance |
| Insecure AI output handling | OWASP LLM insecure output handling | Change management / risk management | Security of processing | AI output validation |

## Example Mapping

| Finding | Risk | Compliance Rationale | Evidence Needed |
|---|---|---|---|
| Missing Content-Security-Policy header | Browser injection risk | Shows potential web security misconfiguration | Scan result, header evidence, remediation ticket |
| Wildcard CORS configuration | Unauthorized cross-origin access risk | Supports access control and data protection review | Response header evidence, API owner approval |
| Missing HSTS header | Weak transport security posture | Supports encryption and secure transmission review | TLS/header evidence, remediation validation |
| AI finding without evidence | Unsupported compliance conclusion | AI governance and auditability issue | AI output log, reviewer notes, evidence reference |

## Evidence Expectations

Compliance mappings should include:

- Finding ID
- Target ID
- Evidence source
- Control theme
- Risk rating
- Recommendation
- Owner
- Remediation status
- Human reviewer

## Human Review Requirement

AI may suggest compliance mappings, but a human GRC, security, or audit reviewer should validate the final mapping before it is used in an audit or risk report.

## Hiring Manager Signal

This file demonstrates the ability to translate technical findings into GRC language, control evidence, and business risk.
