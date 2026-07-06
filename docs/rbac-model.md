# RBAC Model

## Purpose

This document defines the role-based access control model for RedTeam Sentinel.

The goal is to demonstrate IAM, least privilege, separation of duties, and audit-friendly access design.

## Roles

| Role | Purpose | Access Level |
|---|---|---|
| Owner | Full workspace accountability and final authority. | Full access |
| Administrator | Manages configuration, users, and approved overrides. | High privilege |
| Security Engineer | Onboards verified targets, runs approved scans, reviews findings. | Operational write access |
| Developer | Reviews findings and remediation tickets. | Limited write access |
| Compliance Manager | Reviews compliance mappings, reports, and evidence. | Read/review access |
| Auditor | Reviews reports and logs. | Read-only access |

## Permission Matrix

| Action | Owner | Admin | Security Engineer | Developer | Compliance Manager | Auditor |
|---|---|---|---|---|---|---|
| Manage workspace | Yes | Limited | No | No | No | No |
| Invite users | Yes | Yes | No | No | No | No |
| Assign roles | Yes | Yes | No | No | No | No |
| Onboard target | Yes | Yes | Yes | No | No | No |
| Approve target override | Yes | Yes | No | No | No | No |
| Run scan | Yes | Yes | Yes | No | No | No |
| View findings | Yes | Yes | Yes | Yes | Yes | Yes |
| Update finding status | Yes | Yes | Yes | Limited | No | No |
| Generate Jira ticket | Yes | Yes | Yes | Yes | No | No |
| View compliance mapping | Yes | Yes | Yes | Yes | Yes | Yes |
| View audit logs | Yes | Yes | No | No | Yes | Yes |
| Manage API keys | Yes | Yes | No | No | No | No |

## Segregation of Duties Considerations

The following combinations should be reviewed carefully:

- User who approves target bypass should not be the only reviewer of scan scope.
- User who manages API keys should not be the only auditor of API key activity.
- Developer should not be able to approve their own remediation as validated.
- Auditor should not be able to modify findings or audit logs.

## Audit Evidence

RBAC evidence should include:

- User-role matrix
- Permission matrix
- Role assignment history
- Approval records for elevated roles
- Access review results
- Removed or changed access evidence

## Hiring Manager Signal

This file demonstrates IAM testing awareness, least privilege thinking, RBAC validation, and access governance documentation.
