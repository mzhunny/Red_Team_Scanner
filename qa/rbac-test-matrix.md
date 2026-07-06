# RBAC Test Matrix

## Purpose

This matrix validates that each role has appropriate permissions and that high-risk actions are restricted.

## Role Permission Test Matrix

| Test ID | Role | Action | Expected Result | Risk |
|---|---|---|---|---|
| RBAC-001 | Owner | Manage workspace | Allowed | High |
| RBAC-002 | Administrator | Approve target override | Allowed | High |
| RBAC-003 | Security Engineer | Run verified scan | Allowed | Medium |
| RBAC-004 | Security Engineer | Rotate API key | Blocked | High |
| RBAC-005 | Developer | View findings | Allowed | Low |
| RBAC-006 | Developer | Approve target override | Blocked | High |
| RBAC-007 | Compliance Manager | View compliance mapping | Allowed | Low |
| RBAC-008 | Compliance Manager | Run scan | Blocked | Medium |
| RBAC-009 | Auditor | View audit logs | Allowed | Low |
| RBAC-010 | Auditor | Update finding status | Blocked | High |
| RBAC-011 | Auditor | Delete target | Blocked | Critical |
| RBAC-012 | Developer | Generate Jira ticket | Allowed | Medium |
| RBAC-013 | Developer | Mark finding fixed without validation | Blocked or requires review | High |
| RBAC-014 | Admin | Invite user | Allowed | Medium |
| RBAC-015 | Admin | Delete workspace | Blocked unless Owner | Critical |

## Segregation of Duties Checks

| Check ID | Conflict | Expected Control |
|---|---|---|
| SOD-RBAC-001 | Developer marks own fix as validated | Independent reviewer required |
| SOD-RBAC-002 | Admin approves unverified target and runs scan | Secondary review recommended |
| SOD-RBAC-003 | API key manager reviews own API key activity | Independent audit review required |
| SOD-RBAC-004 | Security Engineer edits compliance mapping without GRC review | GRC approval required |

## Evidence Needed

- Role definition table
- Permission matrix
- Test execution results
- Screenshots or API responses showing allowed/blocked outcomes
- Audit logs for denied actions
- Approval records for elevated access

## Hiring Manager Signal

This matrix demonstrates IAM testing, RBAC validation, Segregation of Duties thinking, and security access control review.
