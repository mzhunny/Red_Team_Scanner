# Example Scan Report

## Report Summary

| Field | Value |
|---|---|
| Target | https://example-lab.local |
| Target Type | Website |
| Verification Method | HTML file challenge |
| Verification Status | Verified lab target |
| Scan Type | Passive security posture review |
| Review Date | 2026-07-06 |
| Scanner Mode | Non-intrusive |
| Human Review Required | Yes |

## Executive Summary

RedTeam Sentinel completed a passive security posture review of the authorized lab target. The review identified missing browser security headers and a potential CORS configuration concern.

No exploit payloads, brute force activity, or destructive testing were performed.

## Findings Summary

| Finding ID | Title | Severity | Status |
|---|---|---|---|
| F-001 | Missing Content-Security-Policy Header | Medium | Open |
| F-002 | Missing Strict-Transport-Security Header | Medium | Open |
| F-003 | Wildcard CORS Configuration | High | Needs Review |

## Finding Detail: F-001

**Title:** Missing Content-Security-Policy Header  
**Severity:** Medium  
**Type:** Web Header  
**Evidence:** Response headers did not include `Content-Security-Policy`.

### Risk

Without a Content Security Policy, the application may have weaker browser-side protection against certain injection or content loading risks.

### Recommendation

Implement a Content-Security-Policy header aligned to application requirements and test it in report-only mode before enforcement.

### Compliance Mapping

- OWASP: Security Misconfiguration
- SOC 2: Logical and system operations controls
- GDPR: Security of processing
- ISO-style: Secure configuration management

## Finding Detail: F-002

**Title:** Missing Strict-Transport-Security Header  
**Severity:** Medium  
**Type:** TLS / Web Header  
**Evidence:** Response headers did not include `Strict-Transport-Security`.

### Recommendation

Add HSTS after confirming HTTPS is correctly configured across the application.

## Finding Detail: F-003

**Title:** Wildcard CORS Configuration  
**Severity:** High  
**Type:** CORS  
**Evidence:** Response included permissive CORS behavior.

### Recommendation

Restrict allowed origins to approved application domains and avoid wildcard origins for authenticated or sensitive endpoints.

## Human Review Statement

All findings require human security review before remediation decisions are finalized.
