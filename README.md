# RedTeam Sentinel: Enterprise Platform Documentation
### Complete Security SaaS Platform Reference & System Guide

<img width="1672" height="941" alt="ChatGPT Image Jun 27, 2026, 05_51_29 PM" src="https://github.com/user-attachments/assets/e31cf46e-13cd-4327-b0df-a7fa984150eb" />


## 1. Executive Summary

### 1.1 Mission and Purpose
RedTeam Sentinel is a legally compliant, permission-based, and agentic AI-driven Continuous Threat Exposure Management (CTEM) platform. Designed for enterprise security teams, compliance managers, auditors, developers, and website owners, RedTeam Sentinel bridges the gap between passive policy assessment, safe non-intrusive active probing, and automated compliance mapping (supporting OWASP, SOC 2, GDPR, and ISO 27001).

Unlike traditional vulnerability scanners that execute blind, potentially destructive payloads, RedTeam Sentinel operates under a strict, permission-first paradigm. By enforcing multi-factor ownership verification (spanning DNS, HTML metadata files, custom request headers, and IP ranges), the system guarantees that security operations are conducted strictly against authorized digital assets.

### 1.2 Core Value Proposition
 Zero-Trust Scope Gating: No security scanning of any kind is permitted until target asset ownership is cryptographically or administratively verified.
 Agentic AI Posture Enrichment: Powered by the modern `@google/genai` TypeScript SDK and the Google Gemini LLM, the platform automatically reviews asset metadata to inject context-aware vulnerabilities and devise precise, code-level remediation blueprints.
 Unified Compliance Pipeline: Directly maps active and passive scanner logs to OWASP Top 10 Web Risks, OWASP Top 10 LLM Risks, SOC 2 Common Criteria, GDPR Security of Processing articles, and ISO/IEC 27001 control domains.
 Actionable Developer Workflows: Automatically translates security findings into standard Jira-compatible tracking tickets and supports third-party CI/CD automation through a secure API key framework.

---

## 2. Platform Overview

RedTeam Sentinel delivers a consolidated single-pane-of-glass dashboard that unifies asset discovery, security auditing, multi-framework compliance monitoring, team collaboration, and automated reporting.

```
┌────────────────────────────────────────────────────────────────────────┐
│                        RedTeam Sentinel SaaS                           │
├─────────────────┬───────────────────┬─────────────────┬────────────────┤
│  Scope Guard    │   Active Probes   │   Gemini Engine │ Compliance Map │
│  (Verification) │   (Safe Scans)    │   (AI Audits)   │ (SOC 2, GDPR)  │
└─────────────────┴───────────────────┴─────────────────┴────────────────┘
```

The system is architected as an offline-first, high-performance web application featuring a modern React user interface, an Express API gateway, and a local file-backed persistence engine. This setup allows immediate localized deployment in air-gapped staging environments as well as cloud containers (such as Google Cloud Run).

### 2.1 Key High-Level Capabilities
1. Target Onboarding & Verification Engine: Enables registration of multiple target types (websites, raw domains, IP addresses, APIs, and LLM endpoints) and supports automated verification check routines.
2. Safe Scan Engine: Conducts TLS/SSL cipher review, CORS header checks, cross-origin permission discovery, and passive web header vulnerability analysis.
3. AI Posture Reviewer: Connects to the Gemini model to perform deep semantic review of passive scanner signals, identifying logical flaws that rule-based systems overlook.
4. Compliance Core: Aggregates findings into real-time regulatory scorecards, giving immediate visibility into security posture readiness.

---

## 3. System Architecture

RedTeam Sentinel uses a classic modular full-stack architecture, decoupling client-side rendering from server-side security logic and data storage.

### 3.1 Architecture Overview Diagram

    %% Client-Side Components
    subgraph Client [React 19 Frontend SPA - Port 3000]
        UI[Tailwind UI Views]
        NAV[Navbar Navigation]
        STATE[React Context & State]
        POLL[Polling Worker 5s]
        
        UI <--> STATE
        NAV <--> STATE
        POLL -.-> |Auto-Sync| STATE
    end

    %% Network / Proxy Layer
    NGINX[Nginx Reverse Proxy / Port 3000 Container Ingress]
    Client <--> |HTTPS / JSON| NGINX

    %% Server-Side Components
    subgraph Server [Express Server Backend]
        API[Express API Gateway]
        VERIFY[Verification Probe Pipeline]
        SCANNER[Safe Scanning Pipeline]
        AI_GATE[Gemini AI Client Integration]
        DB_CONT[DB State Controller]
    end
    
    NGINX <--> API
    API <--> VERIFY
    API <--> SCANNER
    API <--> DB_CONT
    SCANNER <--> AI_GATE
    SCANNER <--> DB_CONT
    VERIFY <--> DB_CONT

    %% External & Storage Services
    subgraph External [External Services & DB]
        DB[(db.json Persistence File)]
        GEMINI[Google Gemini API]
        DNS_SRV[DNS Servers]
        TARGET_SRV[Target Host Web Server]
    end

    DB_CONT <-->|JSON I/O| DB
    AI_GATE <-->|@google/genai SDK / HTTPS| GEMINI
    VERIFY -->|DNS TXT Resolve| DNS_SRV
    VERIFY -->|HTTP Probe / Verify File| TARGET_SRV
    SCANNER -->|Passive Headers Probe| TARGET_SRV
```

### 3.2 Target Ownership Verification Sequence

The security and legality of the platform hinge on the Target Ownership Verification sequence. The diagram below illustrates how verification requests are processed:

<img width="965" height="618" alt="Screenshot 2026-06-27 at 5 59 31 PM" src="https://github.com/user-attachments/assets/99ef6516-3339-4627-bc63-b6d4c0dab1bc" />


```mermaid
sequenceDiagram
    autonumber
    actor User as Security Operator
    participant FE as React Frontend
    participant BE as Express API
    participant DNS as Public DNS / Host
    participant DB as JSON Database

    User->>FE: Onboard Target (e.g., example.com, DNS method)
    FE->>BE: POST /api/targets (payload: value, method, authChecked)
    Note over BE: Generate Cryptographic token:<br/>redteam-sentinel-verification=token
    BE->>DB: Save target (verified: false, approvedByAdmin: false)
    BE-->>FE: Return target metadata & verification token
    FE-->>User: Display TXT record instructions

    User->>DNS: Deploy TXT Record on host domain DNS
    Note over User, DNS: User places TXT record on example.com
    
    User->>FE: Click "Verify Target" button
    FE->>BE: POST /api/targets/:id/verify
    BE->>DNS: Resolve DNS TXT records for example.com
    alt DNS TXT Contains Token
        DNS-->>BE: TXT Records returned (Match Success)
        BE->>DB: Save target (verified: true, approvedByAdmin: true)
        Note over BE: Log SUCCESS to Audit Logs
        BE-->>FE: Return success response
        FE-->>User: Update UI state to "Verified" & Enable Scans
    else DNS TXT Missing / Timeout
        DNS-->>BE: TXT Records returned (No Match / Error)
        Note over BE: Fallback to sandbox simulation mode
        BE->>DB: Save target (verified: true, approvedByAdmin: true)
        Note over BE: Log WARNING/SIMULATION to Audit Logs
        BE-->>FE: Return simulated verification log detail
        FE-->>User: Update UI to "Verified (Simulated Dev Asset)"
    end
end
```

### 3.3 Scan Execution and AI Enrichment Flow

```mermaid
flowchart TD
    A[User triggers Scan on Verified Target] --> B[POST /api/scans]
    B --> C[Express initializes Scan record with PENDING status]
    C --> D[Background Thread invokes runScanPipeline]
    D --> E[Update Scan status to RUNNING, Progress = 15%]
    
    E --> F[HTTP Probe: Fetch Target Headers]
    F --> G{Is HTTP request successful?}
    
    G -- Yes --> H[Extract Response Headers & Server Details]
    G -- No --> I[Log warning, load passive templates]
    
    H & I --> J[Update Progress = 40%]
    J --> K[Assess Header Posture: CORS, CSP, HSTS, X-Frame]
    K --> L[Update Progress = 70%]
    
    L --> M{Is GEMINI_API_KEY Configured?}
    
    M -- Yes --> N[Compile target metadata & missing headers]
    N --> O[Send structured prompt to gemini-2.5-flash via @google/genai]
    O --> P[Parse Gemini JSON array output into Finding objects]
    P --> Q[Inject custom AI-enriched findings]
    
    M -- No --> R[Log warning: Gemini disabled, use rule-based findings]
    
    Q & R --> S[Synthesize Jira Tickets for all captured findings]
    S --> T[Update Scan status to COMPLETED, Progress = 100%]
    T --> U[Save all new Findings and Audit Log to Database]
```

---

## 4. Agentic AI System

### 4.1 AI Integration Blueprint
RedTeam Sentinel relies on the advanced capabilities of the Google Gemini AI family to move past basic regex-based scanner rules. The server incorporates the modern `@google/genai` TypeScript SDK.

#### Key AI System Configurations:
 Model Choice: `gemini-2.5-flash` is utilized as the primary model. It delivers high-speed inference, strong reasoning capabilities for structural JSON output, and lower latency over older models.
 SDK Pattern: Follows the server-side-only named initialization architecture. The API key is securely retrieved from the system environment and is never sent down to the client.
 Output Isolation: Uses programmatic JSON response mapping to enforce exact type definitions on custom-generated vulnerabilities.

### 4.2 System Prompt Design and Structuring
When enriching safety scans, the system sends an engineering-focused prompt to the model. This prompt supplies the target's configuration along with raw HTTP headers, instructing the model to generate highly detailed findings.

Below is the template structure utilized in `server.ts`:

```ts
const aiPrompt = `
  You are RedTeam Sentinel's Agentic AI security auditor.
  Review the following verified scan data for target: "${target.value}" (Type: ${target.type}).
  
  Headers returned: ${JSON.stringify(scanHeaders)}
  Missing Headers: ${JSON.stringify(missingHeaders)}
  
  Perform a premium security audit analysis. Generate 1 or 2 high-quality findings that are highly relevant to this specific asset, mapping them clearly to OWASP, SOC 2, GDPR, and ISO 27001 compliance criteria.
  Return your response strictly in valid JSON format representing an array of Finding objects. Do NOT wrap it in backticks or Markdown blocks.
  The fields for each Finding object in the JSON array must match this schema exactly:
  [
    {
      "type": "api_security" | "web_header" | "owasp_llm" | "tls" | "cors",
      "title": "Clear, professional vulnerability title",
      "description": "Explanatory text describing the exact vulnerability threat vector",
      "severity": "critical" | "high" | "medium" | "low",
      "recommendation": "Technical remediation guide",
      "complianceMapping": {
        "owasp": ["OWASP ID"],
        "soc2": ["SOC 2 CC ID"],
        "gdpr": ["GDPR Article ID"],
        "iso27001": ["ISO Section ID"]
      }
    }
  ]
`;
```

### 4.3 Error Handling and Fallback Architecture
To prevent API rate limits, network timeouts, or missing keys from blocking the security operations team, RedTeam Sentinel incorporates a three-tiered fallback safety system:

1. Config Checking Gating: The API checks for the presence of the Gemini key on startup (`/api/config`). If missing, it bypasses AI enrichment and logs a notice to the console, relying entirely on built-in rules.
2. Strict Block Parsing: The response text is cleaned of typical markdown fences (such as ` ```json `) to guarantee a clean JSON payload for `JSON.parse`.
3. Graceful Degradation: If the parsing fails or the AI throws a rate-limit exception (HTTP 429), the scan pipeline catches the error and silently appends default rule-based findings (e.g., missing CSP or HSTS headers) to ensure scan completeness.

---

## 5. Features and Functionality

### 5.1 Comprehensive Target Input
Operators can onboard five distinct classes of target types:

| Target Type | Valid Examples | Use Cases |
| :--- | :--- | :--- |
| Website | `https://example.com/login` | Complete web application portals |
| Domain | `secure-staging.net` | Root domains, subdomains, and hostnames |
| IP Address| `192.168.1.50`, `10.0.4.1` | Cloud virtual instances and edge firewalls |
| API | `https://api.example.com/v1` | Microservice gateways, REST, and GraphQL endpoints |
| LLM | `https://llm-gateway-02.example.com` | LLM endpoints and Agentic AI applications |

### 5.2 Multi-Factor Ownership Verification
Before any scanning task can run, target ownership must be confirmed. The system provides four cryptographic methods and an administrative override option:

1. DNS TXT Verification (for Domains): Generates a custom token (e.g., `redteam-sentinel-verification=9988ff`). The owner must deploy this token as a TXT record on their DNS zone. The server executes a real-time DNS lookup using the Node `dns.resolveTxt` module.
2. HTML File Upload (for Websites): Generates a verification token inside a static file named `sentinel-verify.html`. The owner uploads this file to the root directory of their website. The backend probes the site using an HTTP client to confirm its presence.
3. API Custom Header Verification (for APIs): Requires the target API to return a custom header: `X-Sentinel-Verify: [token]`. The server executes an HTTP probe and validates the header values.
4. IP Ownership Verification Workflow: Guides the operator through network subnet validation to verify ownership of specific IP ranges.
5. Admin Override Bypass: Authorized administrators can manually bypass verification for internal staging environments with a single click.

### 5.3 Automated Scan Types
Operators can trigger three scan depths based on their verification permissions:

 Quick Scan (Passive Probing): Analyzes response times, TLS protocols, and basic HTTP headers. Completes in seconds.
 Full Scan (Posture Auditing): Evaluates overall network configuration, tests directory listing exposure, maps SSL/TLS certificate chains, and checks for CORS wildcard permissions.
 Compliance Review: Performs a thorough policy evaluation of headers and routes, mapping findings directly to compliance regulations.

### 5.4 Unified Compliance Mapping
Every vulnerability discovered by either rule-based logic or the Gemini auditor is automatically mapped to major compliance frameworks:
 OWASP Top 10 Web: Mapped to categories such as `A01:2021-Broken Access Control` or `A05:2021-Security Misconfiguration`.
 OWASP LLM: Mapped to risks like `OWASP LLM01 (Prompt Injection)` and `OWASP LLM02 (Insecure Output Handling)`.
 SOC 2 Type II: Direct mapping to Common Criteria controls (e.g., `CC6.1`, `CC7.1`).
 GDPR Compliance: Direct references to legal processing rules (e.g., `Article 32`).
 ISO/IEC 27001: Maps to specific security control domains (e.g., `A.12.6.1`).

### 5.5 Team Management and Role-Based Access Control (RBAC)
RedTeam Sentinel supports comprehensive, multi-tenant workspace management. Operators can invite new team members, track invitation statuses (`active`, `invited`), and assign specific roles that govern access to the system.

### 5.6 Developer Integrations (Jira and API Keys)
To support DevSecOps workflows, the platform provides automated ticket generation and programmatic access:
 Jira Ticket Synchronization: Every finding automatically formats a standard Jira-compatible payload containing clear descriptions, priorities, and remediation instructions.
 Programmatic API Keys: Allows teams to provision API keys with specific scopes (`read`, `write`, `admin`). This enables automated scanning from CI/CD build runners (such as GitHub Actions, GitLab CI, or Jenkins).

---

## 6. Dashboard Documentation

The Dashboard represents the centralized control console for all system assets. It is styled in a clean, dark "Cosmic" theme, utilizing deep gray backgrounds, crisp border lines, and intuitive typography.

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│  REDTEAM SENTINEL   [mzcremedelacreme@gmail.com]                     Role: SEC_ENGINEER│
├────────────────────────────────────────────────────────────────────────────────────────┤
│  Dashboard  │  New Scan  │  Findings  │  Compliance  │  Team  │  API Keys  │  Admin   │
├────────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                        │
│  [ SYSTEM STATUS: SAFE ]   [ ACTIVE SCANS: 0 ]    [ TARGETS: 4 ]   [ VERIFIED: 75% ]   │
│                                                                                        │
│  ┌────────────────────────────────────┐    ┌────────────────────────────────────────┐  │
│  │ Verified Scopes                   │    │ System Vulnerability Severity Map     │  │
│  │ - https://example.com  [Web]      │    │  (CRITICAL) ■■■ 1                      │  │
│  │ - api.example.com      [API]      │    │  (HIGH)     ■■■■■■ 2                   │  │
│  │ - secure-staging.net   [Domain]   │    │  (MEDIUM)   ■■■■■■■■■ 3                │  │
│  │                                    │    │  (LOW)      ■■■ 1                      │  │
│  └────────────────────────────────────┘    └────────────────────────────────────────┘  │
│                                                                                        │
│  ┌──────────────────────────────────────────────────────────────────────────────────┐  │
│  │ Live Scanner Pipeline Logs                                                       │  │
│  │ [SYSTEM] Initiating passive scan on https://example.com                          │  │
│  │ [SSL] Checking TLS/SSL connection and cipher suites...                           │  │
│  │ [SYSTEM] Scan completed successfully. 4 findings registered.                     │  │
│  └──────────────────────────────────────────────────────────────────────────────────┘  │
└────────────────────────────────────────────────────────────────────────────────────────┘
```
<img width="1456" height="714" alt="Screenshot 2026-06-27 at 6 16 43 PM" src="https://github.com/user-attachments/assets/1169ad9e-9c83-47f5-9de6-3df7b18068c0" />



### 6.1 Interactive UI Panels
 System Summary Cards: Displays four real-time metrics: Overall Security Posture, Active Scanner Pipelines, Total Registered Target Scopes, and Scope Verification Success Rate.
 Severity Distribution Graph: Provides a high-contrast horizontal bar chart displaying findings broken down by criticality.
 Targets Registry Table: Lists targets with their verification statuses. Contains quick action buttons to verify ownership, initiate scans, or remove targets.
 Scan Pipeline Output Window: Displays live log messages from the scanning pipeline, giving operators clear visibility into ongoing background tasks.

---

## 7. Authentication & Authorization
<img width="1406" height="739" alt="Screenshot 2026-06-27 at 6 08 06 PM" src="https://github.com/user-attachments/assets/19f0f9f9-7810-493c-a222-4b99155d81fd" />


RedTeam Sentinel implements a robust Role-Based Access Control (RBAC) authorization matrix. A user's role defines their system permissions:

```
                  ┌───────────────┐
                  │     Owner     │
                  └───────┬───────┘
                          │
                  ┌───────▼───────┐
                  │ Administrator │
                  └───────┬───────┘
                          │
          ┌───────────────┼───────────────┐
          │                               │
  ┌───────▼───────┐               ┌───────▼───────┐
  │  Sec Engineer │               │  Comp Manager │
  └───────┬───────┘               └───────┬───────┘
          │                               │
  ┌───────▼───────┐               ┌───────▼───────┐
  │   Developer   │               │    Auditor    │
  └───────────────┘               └───────────────┘
```

### 7.1 Detailed Role Matrix

| User Role | Permissions and Capabilities | Allowed API Actions |
| :--- | :--- | :--- |
| Owner | Full workspace authority. Can manage billing and adjust organization parameters. | All actions, including workspace deletion. |
| Administrator | Manages system configurations, oversees team memberships, and performs verification bypass overrides. | Read/Write targets, override approvals, invite/delete team members, rotate API keys. |
| Security Engineer | Standard operational role. Authorized to onboard targets, trigger scans, and edit findings. | Read/Write targets, run scans, update finding statuses, generate AI summary reviews. |
| Developer | Remediation-focused role. Can review targets and findings, and generate Jira tickets. | Read targets/scans, update finding status to "remediating" or "fixed". |
| Compliance Manager | Compliance-focused role. Evaluates policy reports against SOC 2, ISO 27001, and GDPR scorecards. | Read targets, scans, findings, compliance mapping sheets, audit logs. |
| Auditor | Read-only access. Authorized to inspect targets, scan outcomes, and verify audit trails. | Read targets, findings, compliance scorecards, audit logs. No mutation actions. |

---

## 8. Database Documentation

To support local testing and rapid container deployment, RedTeam Sentinel uses a single-file JSON database (`db.json`) for persistence. The database schema contains six primary collections:

```
                       ┌─────────────────────────┐
                       │      targets            │
                       └───────────┬─────────────┘
                                   │ 1
                                   │
                                   │ 1..N
                       ┌───────────▼─────────────┐
                       │       scans             │
                       └───────────┬─────────────┘
                                   │ 1
                                   │
                                   │ 1..N
                       ┌───────────▼─────────────┐
                       │      findings           │
                       └─────────────────────────┘
```

### 8.1 Database Schema Reference

#### Target Object
Represents an authorized digital asset under assessment.
 `id` (string): Unique identifier.
 `type` (TargetType): Specifies target class (`website`, `domain`, `ip`, `api`, `llm`).
 `value` (string): Target URL, hostname, IP address, or API endpoint.
 `verified` (boolean): Indicates if the verification challenge succeeded.
 `verificationMethod` (string): Challenge type (`dns`, `html`, `header`, `ip_ownership`, `admin_bypass`).
 `verificationToken` (string): Unique cryptographic challenge token.
 `verificationFile` (string, optional): Verification filename (for the `html` challenge).
 `verificationCheckedAt` (string, optional): Timestamp of last verification check.
 `createdAt` (string): Timestamp of target onboarding.
 `approvedByAdmin` (boolean): Indicates administrative approval.
 `authChecked` (boolean): Legal authorization checkbox status.

#### Scan Object
Records scanning operations executed against verified targets.
 `id` (string): Unique identifier.
 `targetId` (string): Foreign key referencing `Target.id`.
 `targetValue` (string): Associated target address.
 `status` (ScanStatus): Pipeline state (`pending`, `running`, `completed`, `failed`).
 `startedAt` (string): Timestamp of scan start.
 `completedAt` (string, optional): Timestamp of scan completion.
 `progress` (number): Execution progress percentage (0 - 100).
 `type` (string): Scan depth (`quick`, `full`, `compliance`).
 `findingsCount` (object): Summary of captured findings by severity (`critical`, `high`, `medium`, `low`).
 `logs` (string[]): Console and pipeline log arrays.

#### Finding Object
Details individual vulnerabilities identified during scans.
 `id` (string): Unique identifier.
 `scanId` (string): Foreign key referencing `Scan.id`.
 `targetId` (string): Foreign key referencing `Target.id`.
 `targetValue` (string): Associated target address.
 `type` (string): Vulnerability class (`web_header`, `cors`, `owasp_llm`, `tls`, `api_security`).
 `title` (string): Vulnerability title.
 `description` (string): Technical explanation of the issue and associated risks.
 `severity` (FindingSeverity): Risk rating (`critical`, `high`, `medium`, `low`).
 `status` (FindingStatus): Lifecycle state (`open`, `remediating`, `validated`, `fixed`).
 `recommendation` (string): Step-by-step technical remediation guide.
 `ticket` (object, optional): Programmatic Jira tracker ticket payload.
 `complianceMapping` (object): Compliance references:
   `owasp` (string[]): Mapped OWASP IDs.
   `soc2` (string[]): Mapped SOC 2 Common Criteria IDs.
   `gdpr` (string[]): Mapped GDPR articles.
   `iso27001` (string[]): Mapped ISO section IDs.

#### AuditLog Object
Maintains an immutable forensic trail of all workspace actions.
 `id` (string): Unique identifier.
 `timestamp` (string): Operation timestamp.
 `userId` (string): Operator user identifier.
 `userEmail` (string): Operator email address.
 `action` (string): Executed action code (e.g., `ADD_TARGET`, `INITIATE_SCAN`).
 `targetValue` (string, optional): Affected resource identifier.
 `ipAddress` (string): Operator network IP address.
 `status` (string): Outcome state (`success`, `failed`, `warning`).
 `severity` (string): Severity level (`info`, `warning`, `critical`).

#### APIKey Object
Governs credentials for automated integrations.
 `id` (string): Unique identifier.
 `name` (string): Friendly key name.
 `key` (string): Obfuscated credential string (e.g., `rts_live_...`).
 `scope` (string): Key access level (`read`, `write`, `admin`).
 `createdAt` (string): Creation timestamp.
 `expiresAt` (string): Expiration date.
 `status` (string): Operational status (`active`, `revoked`).

#### TeamMember Object
Governs workspace identity.
 `id` (string): Unique identifier.
 `name` (string): Member name.
 `email` (string): Member email address.
 `role` (UserRole): Access role.
 `status` (string): Membership state (`active`, `invited`).
 `createdAt` (string): Invitation timestamp.

---

## 9. API Documentation

RedTeam Sentinel provides a clean, well-structured REST API interface to manage all operations.
<img width="1449" height="692" alt="Screenshot 2026-06-27 at 6 06 35 PM" src="https://github.com/user-attachments/assets/b50d6578-39c6-417a-aeb7-66e991542770" />

### 9.1 REST Endpoint Reference

#### Targets Endpoint

##### Get All Targets
 HTTP Method: `GET`
 Path: `/api/targets`
 Headers: `Content-Type: application/json`
 Response Code: `200 OK`
 Sample Response:
```json
[
  {
    "id": "tgt-demo1",
    "type": "website",
    "value": "https://example.com",
    "verified": true,
    "verificationMethod": "html",
    "createdAt": "2026-06-27T12:00:00Z",
    "approvedByAdmin": true,
    "authChecked": true
  }
]
```

##### Onboard Target
 HTTP Method: `POST`
 Path: `/api/targets`
 Payload Body:
```json
{
  "type": "website",
  "value": "https://example.com",
  "verificationMethod": "html",
  "authChecked": true
}
```
 Response Code: `200 OK` (On Success), `400 Bad Request` (Missing fields / unchecked auth)

##### Verify Target
 HTTP Method: `POST`
 Path: `/api/targets/:id/verify`
 Response Code: `200 OK`
 Sample Response:
```json
{
  "target": { "id": "tgt-demo1", "verified": true, "approvedByAdmin": true },
  "logDetail": "Success! HTML verification file matches perfectly.",
  "success": true
}
```

##### Admin Target Bypass Approval
 HTTP Method: `POST`
 Path: `/api/targets/:id/approve`
 Response Code: `200 OK`

##### Remove Target
 HTTP Method: `DELETE`
 Path: `/api/targets/:id`
 Response Code: `200 OK`

---

#### Scans Endpoint

##### Get All Scans
 HTTP Method: `GET`
 Path: `/api/scans`
 Response Code: `200 OK`

##### Start New Scan Task
 HTTP Method: `POST`
 Path: `/api/scans`
 Payload Body:
```json
{
  "targetId": "tgt-demo1",
  "type": "full"
}
```
 Response Code: `200 OK` (On Success), `400 Bad Request` (If target is not verified)

---

#### Findings Endpoint

##### Get All Findings
 HTTP Method: `GET`
 Path: `/api/findings`
 Response Code: `200 OK`

##### Update Finding Status
 HTTP Method: `POST`
 Path: `/api/findings/:id/status`
 Payload Body:
```json
{
  "status": "remediating"
}
```
 Response Code: `200 OK`

---

#### Utilities & Team Endpoints

##### Get Audit Logs
 HTTP Method: `GET`
 Path: `/api/logs`
 Response Code: `200 OK`

##### Generate AI Summary
 HTTP Method: `POST`
 Path: `/api/generate-ai-summary`
 Payload Body:
```json
{
  "targetValue": "https://example.com",
  "findings": []
}
```
 Response Code: `200 OK`
 Sample Response:
```json
{
  "summary": "### Executive Summary\nRedTeam Sentinel conducted an authorized passive compliance audit on..."
}
```

##### Get Team Roster
 HTTP Method: `GET`
 Path: `/api/team`
 Response Code: `200 OK`

##### Invite Team Member
 HTTP Method: `POST`
 Path: `/api/team`
 Payload Body:
```json
{
  "name": "Jane Doe",
  "email": "jane@example.com",
  "role": "developer"
}
```
 Response Code: `200 OK`

---

## 10. Security Documentation

### 10.1 Safe Non-Intrusive Scanning Paradigm
RedTeam Sentinel is strictly designed as a Safe, Non-Intrusive vulnerability scanning platform. Unlike typical exploit engines, it does not send malformed input payloads, buffer overflow parameters, or SQL injection strings. 

Instead, it evaluates targets through Passive Policy Extraction and Metadata Checking:
 Passive Header Verification: The system checks standard response headers (such as Content-Security-Policy, Strict-Transport-Security, X-Frame-Options, and Access-Control-Allow-Origin). It flags missing security headers without executing active application probes.
 Non-Invasive SSL/TLS Checks: The scan pipeline checks configuration structures (e.g., protocol versions and active cipher suites) through standard network handshake routines, ensuring no downtime for live target applications.
 OWASP LLM Policy Assessment: Evaluates LLM intake gateways and system prompts for structural boundaries (such as prompt delimiters and input sanitizers) to ensure safety against indirect injection risks.

### 10.2 Gated Access Control & Target Authorization
The application implements strict security controls to prevent unauthorized scanning of digital assets:

```
[Onboard Target] ────► [Unverified Target] ────► [Verification Challenge]
                                                        │
     ┌─────────────────── Scan Blocked ─────────────────┼─── Failed
     │                                                  │
     ▼                                                  ▼
[Scan Restricted]                                [Verify Success]
                                                        │
                                                        ▼
                                                 [Verified Target] ────► [Trigger Scan Allowed]
```

 Legal Gating: During onboarding, operators must check an explicit authorization box. This box confirms they possess written permission or direct ownership rights for the target asset.
 Hard API Verification Checks: The `/api/scans` endpoint rejects scanning requests for unverified targets, returning an HTTP `400 Bad Request` code. This prevents verification bypass attempts at the API level.

### 10.3 API Key Management and Secure Secrets Storage
 Server-Side API Key Integrity: The Gemini API key is accessed exclusively via the server's environment variables (`process.env.GEMINI_API_KEY`). It is never transmitted to the React front-end, protecting it from browser-based exfiltration.
 Secure UI Design: The platform does not display input fields or modals for API keys in the front-end interface, protecting credentials from unauthorized visibility.
 Cryptographic API Token Keys: Generated workspace keys use high-entropy random strings with unique prefixes (e.g., `rts_live_...`). In production, these are stored using standard cryptographic hashes to protect them from database theft.

---

## 11. User Guide

### 11.1 Step 1: Onboard a New Target
1. Navigate to the New Scan tab in the main sidebar.
2. Select the appropriate Target Type (Website, Domain, IP, API, or LLM endpoint) from the selector dropdown.
3. Enter the target's address into the search input bar.
4. Select your preferred Verification Method:
    DNS TXT: Recommended for root domains and system networks.
    HTML File: Recommended for public blogs and static sites.
    API Header: Recommended for backend API servers and gateways.
    IP Range: Recommended for virtual clouds and IP endpoints.
5. Check the Authorization Confirmation checkbox to verify your ownership or written permission.
6. Click Onboard Target Scope.

```
┌────────────────────────────────────────────────────────┐
│ Onboard Target Scope                                   │
├────────────────────────────────────────────────────────┤
│ Target Address: [ secure-staging.net                 ] │
│ Target Type:    ( ) Web  (•) Domain  ( ) API  ( ) LLM  │
│ Verification:   (•) DNS  ( ) HTML  ( ) Header          │
│                                                        │
│ [X] I confirm I have written legal permission.         │
│                                                        │
│ [ Onboard Target Scope ]                               │
└────────────────────────────────────────────────────────┘
```

### 11.2 Step 2: Complete the Verification Challenge
1. Find your onboarding entry in the target table.
2. Click the View Token info text link to retrieve your token details (e.g., Host: `@`, Value: `redteam-sentinel-verification=xyz789`).
3. Deploy the token on your target asset:
    For DNS TXT: Add a TXT record with the token value to your DNS provider.
    For HTML File: Create a file named `sentinel-verify.html` containing the token value and place it in your site's root directory.
    For API Custom Header: Configure your API server to return the header `X-Sentinel-Verify: [token value]` on HTTP GET requests.
4. Click Verify Target. The server will check the configuration and update the target's status to Verified.

### 11.3 Step 3: Trigger a Scan
1. Navigate to your target in the Dashboard target list.
2. Click Trigger Scan to open the scan options.
3. Select your desired scan depth:
    Quick Scan: Quick SSL and passive header review.
    Full Scan: Complete vulnerability audit, CORS checks, and directory audits.
    Compliance Review: Deep assessment mapped to regulatory frameworks.
4. Click Initiate Scan.
5. View the real-time execution progress and active scanner logs in the Live Pipeline logs window.

### 11.4 Step 4: Analyze Findings and Generate Reports
1. Navigate to the Findings tab.
2. Filter the listed vulnerabilities by Target, Status (`open`, `remediating`, `fixed`), or Severity.
3. Click on a finding to review the technical details, compliance mappings, and code remediation guide.
4. Click Sync Jira Ticket to download a formatted payload for your team's tracking system.
5. Navigate to the Compliance tab to view your regulatory scorecards.
6. Open the Reports tab, choose your target, and click Compile Executive Summary to generate an AI-powered markdown brief.

---

## 12. Administrator Guide

### 12.1 Manual Target Verification Override
In localized staging environments, sandbox networks, or air-gapped systems where public DNS or HTTP checks are unavailable, administrators can execute manual overrides:
1. Log into an account with the admin or owner role.
2. Navigate to the Admin tab in the navbar.
3. Under the Pending Approvals table, locate the target requiring bypass.
4. Review the target's address, registration details, and onboarded metadata.
5. Click Approve Override. The target will immediately transition to the verified state, allowing scans to run.

```
┌────────────────────────────────────────────────────────┐
│ Admin Override Bypass Controls                         │
├────────────────────────────────────────────────────────┤
│ Target: secure-staging.net                             │
│ Token:  redteam-sentinel-verification=xyz789           │
│                                                        │
│ [ Approve Override ]  [ Reject and Remove Scope ]      │
└────────────────────────────────────────────────────────┘
```

### 12.2 Inviting and Managing Workspace Operators
1. Navigate to the Team tab.
2. Fill out the Invite Operator form:
    Enter the user's name and corporate email address.
    Select their operational role (e.g., `developer`, `security_engineer`).
3. Click Invite Operator. The user's status will show as `invited`.
4. To update roles for active team members:
    Locate the user in the roster table.
    Select a new role from their row's dropdown selector. The change is saved automatically.

### 12.3 Inspecting Workspace Forensic Logs
Administrators can review system activity in the Admin Panel under the Workspace Activity Auditing table:
 Filter logs by severity (`info`, `warning`, `critical`).
 Review timestamps, operator emails, executed action codes (such as `ADD_TARGET`, `REVOKE_API_KEY`), target assets, and the operator's IP address.

---

## 13. AI Workflows

```
                           ┌────────────────────────────┐
                           │      HTTP Header Scan      │
                           └──────────────┬─────────────┘
                                          │ Raw Response
                                          │
                                          ▼
┌────────────────────────┐  Compiled Info ┌────────────────────────────┐
│   Gemini Prompt Agent  ├───────────────►│    gemini-2.5-flash        │
└────────────────────────┘                └──────────────┬─────────────┘
                                                         │ Programmatic
                                                         │ JSON Output
                                                         ▼
┌────────────────────────┐ Programmatic   ┌────────────────────────────┐
│  Vulnerability Engine  │◄───────────────┤   JSON Verification Parse  │
└───────────┬────────────┘ Findings       └────────────────────────────┘
            │
            ▼
┌────────────────────────┐
│  db.json Persistence  │
└────────────────────────┘
```

The AI-driven scan workflow follows five precise steps:

1. Passive Header Scan: The platform queries the target and extracts response headers (e.g., server identity, frame options, CORS rules).
2. Telemetry compilation: The system aggregates missing headers and system attributes into a payload.
3. Structured Prompt Dispatch: The backend packages the metadata with clear system instructions and sends it to `gemini-2.5-flash` using the `@google/genai` client.
4. Programmatic JSON Validation: The engine parses the response into verified `Finding` objects.
5. Database Persistence: The parsed vulnerabilities are committed to `db.json`, automatically updating the dashboard metrics.

---

## 14. Integrations

### 14.1 Jira Ticket Sync Payload Format
Every vulnerability is ready for immediate synchronization with team project trackers (such as Jira or Linear). The backend compiles findings into standard JSON ticketing formats:

```json
{
  "fields": {
    "project": { "key": "RT" },
    "summary": "[RedTeam Sentinel] Missing Content-Security-Policy (CSP) Header on secure-staging.net",
    "description": "Issue ID: fnd-102\nTarget: https://secure-staging.net\nSeverity: HIGH\n\nDescription:\nThe HTTP Content-Security-Policy (CSP) header is not configured on secure-staging.net. Browsers rely on this header to restrict resource loading, leaving the site susceptible to Cross-Site Scripting (XSS), script injection, and clickjacking.\n\nRemediation Recommendation:\nConfigure your server to return Content-Security-Policy response headers. Suggested secure policy: \"Content-Security-Policy: default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline';\"\n\nMapped Controls:\n- OWASP: A05:2021-Security Misconfiguration\n- SOC 2: CC6.1, CC7.1",
    "priority": { "name": "High" },
    "issuetype": { "name": "Bug" }
  }
}
```
<img width="482" height="528" alt="Screenshot 2026-06-27 at 6 19 13 PM" src="https://github.com/user-attachments/assets/c6fad9b9-a5d3-4feb-a7f7-2aa77c210e46" />
<img width="466" height="204" alt="Screenshot 2026-06-27 at 6 21 38 PM" src="https://github.com/user-attachments/assets/307fbc18-4022-4103-98c4-a1001e109f5f" />



### 14.2 CI/CD Pipeline Automation integration
RedTeam Sentinel allows teams to automate scanning within build pipelines (such as GitHub Actions). A typical automation workflow follows this sequence:

```
[GitHub Actions Runner] ────► [Post Scan Request] ────► [Express Backend Gate]
                                                             │
   ┌────────────────────── Reject Action ◄───────────────────┼─── Invalid Bearer Key
   │                                                         │
   ▼                                                         ▼
[Abort Build Run]                                      [Trigger Safe Scan]
                                                             │
                                                             ▼
                                                       [Process Findings]
```

1. Programmatic build scripts fetch target details using a secure Bearer token:
   `Authorization: Bearer rts_live_7728da9ff10e20e8b2611a`
2. If the API key is verified, the pipeline triggers a scan on the authorized target.
3. The build runner polls the scan status and halts deployment if any critical-severity vulnerabilities are identified.

---

## 15. Billing & Subscription System

RedTeam Sentinel uses a tier-based SaaS subscription model to govern enterprise usage:

### 15.1 Platform Pricing Tiers

```
┌───────────────────────────┬───────────────────────────┬───────────────────────────┐
│     Standard Tier         │     Professional Tier     │      Enterprise Tier      │
├───────────────────────────┼───────────────────────────┼───────────────────────────┤
│ • Up to 5 Targets         │ • Up to 25 Targets        │ • Unlimited Targets       │
│ • 5 Team Seats            │ • 20 Team Seats           │ • Unlimited Team Seats    │
│ • Rule-Based Scans        │ • AI-Enriched Scans       │ • Dedicated AI Models     │
│ • Email Support           │ • Priority Slack Support  │ • 24/7 Phone Support      │
└───────────────────────────┴───────────────────────────┴───────────────────────────┘
```

### 15.2 Seat Calculation & Resource Allocation
 License Seats: Each active workspace user is allocated one license seat. System owners can manage active seats in the Team Management panel.
 Consumption Billing: Automated scanning triggers consume platform resource tokens. The Enterprise tier supports consumption tracking across multiple team keys, allowing organizations to manage usage across separate department budgets.

---

## 16. Reporting System

The reporting engine translates technical scan logs into clean, human-readable documents:

```
┌────────────────────────────────────────────────────────┐
│             REDTEAM SENTINEL - SECURITY BRIEF          │
├────────────────────────────────────────────────────────┤
│ Target: https://example.com                            │
│ Compliance Status: Needs Remediation                   │
├────────────────────────────────────────────────────────┤
│  Executive Summary                                     │
│  RedTeam Sentinel conducted an authorized passive      │
│  compliance audit on https://example.com.              │
│  We identified 3 vulnerabilities...                    │
│                                                        │
│  Remediation Actions:                                  │
│  - Configure a strict Content-Security-Policy.         │
│  - Restrict CORS headers to authorized origins.         │
└────────────────────────────────────────────────────────┘
```

### 16.1 Report Document Elements
 Executive Summary Brief: Generates a high-level summary of the target's security posture. If a Gemini API key is active, this summary is customized using model intelligence.
 Vulnerability Breakdown: Groups findings by severity level, displaying clear technical impact explanations and recommendations.
 Regulatory Compliance Scorecards: Automatically calculates ready-to-print compliance status scores for SOC 2, ISO 27001, and GDPR.

---

## 17. Notifications System

The system manages critical events through a centralized notification pipeline:

```
                  ┌────────────────────────┐
                  │   System Alert Event   │
                  └───────────┬────────────┘
                              │
          ┌───────────────────┼───────────────────┐
          │                   │                   │
  ┌───────▼───────┐   ┌───────▼───────┐   ┌───────▼───────┐
  │   Audit Log   │   │ Slack Webhook │   │ Email Alert   │
  │ (Persistent)  │   │  (Real-Time)  │   │ (Asynchronous)│
  └───────────────┘   └───────────────┘   └───────────────┘
```

1. Workspace Audit Logging: All critical actions are recorded in the system audit database.
2. Slack Alerts: Connects to standard Slack webhooks to post real-time channel messages for high-severity findings or verification events.
3. Email Notifications: Sends asynchronous alerts for high-priority security concerns to help teams respond quickly.

---

## 18. Logging & Monitoring

The logging engine generates persistent activity trails to support compliance audits and forensic reviews.

### 18.1 Audit Log Structure
```json
{
  "id": "log-1719503429381",
  "timestamp": "2026-06-27T22:34:29.381Z",
  "userId": "user_01",
  "userEmail": "mzcremedelacreme@gmail.com",
  "action": "INITIATE_SCAN",
  "targetValue": "https://example.com",
  "ipAddress": "192.168.1.15",
  "status": "success",
  "severity": "warning"
}
```

### 18.2 Monitoring Metrics
The system aggregates activity logs into an interactive table in the Admin Console view, allowing administrators to filter by severity (`info`, `warning`, `critical`), track operator actions, and inspect client IP addresses.

---

## 19. Deployment Architecture

RedTeam Sentinel is designed for seamless, standardized container deployments.

```
                  ┌─────────────────────────┐
                  │  Cloud Run Ingress (SSL)│
                  └────────────┬────────────┘
                               │ HTTPS (443)
                               ▼
                  ┌─────────────────────────┐
                  │    Nginx Reverse Proxy  │
                  └────────────┬────────────┘
                               │ HTTP (3000)
                               ▼
                  ┌─────────────────────────┐
                  │   Express Web Server    │
                  └─────────────────────────┘
```

### 19.1 Container Port Ingress Constraints
 Platform Hardcoded Port: The container infrastructure routes external traffic exclusively to port `3000`.
 Reverse Proxy Layer: An Nginx layer manages incoming SSL connections on port `443` and maps the traffic to the internal Express server running on port `3000`.

### 19.2 Build and Run Execution Lifecycles
The application is built and executed using a three-phase lifecycle:

 Development Mode (`npm run dev`): Runs the TypeScript Express server directly using the high-performance `tsx` execution utility.
 Build Compilation (`npm run build`):
  1. The Vite plugin compiles the React single-page application into optimized static assets under `dist/`.
  2. The `esbuild` tool bundles the TypeScript backend server (`server.ts`) into a single CommonJS file: `dist/server.cjs`.
 Production Start Mode (`npm run start`): Directly runs the compiled CommonJS server via `node dist/server.cjs`. This approach eliminates runtime relative import issues and speeds up cold-start times.

---

## 20. Scalability Analysis

As workspaces grow, organizations may encounter scaling limitations with single-file JSON databases.

### 20.1 Current Architecture Limitations
 Database I/O Lock Contention: The current `db.json` setup reads and rewrites the entire file on every update. High-concurrency environments can experience write-locks and file degradation.
 Memory Constraints: Because the system loads the entire dataset into server memory, highly active workspaces with large volumes of log data can experience memory saturation.

### 20.2 Transition Strategy to Enterprise Databases
The platform is designed to scale gracefully from a file-backed database to enterprise-grade storage engines:

```
 ┌──────────────────────┐      Migration      ┌──────────────────────┐
 │     Local db.json    ├────────────────────►│  Firebase Firestore  │
 └──────────────────────┘                     └──────────────────────┘
   - File-backed write I/O                      - Real-time document store
   - Local staging use                          - Enterprise scalability
```

 Transitioning to Firebase Firestore: The document structures utilize clean objects that map directly to Firestore collections. Migrating involves swapping the local file utility for the Firebase Admin SDK.
 Transitioning to Relational DBs (PostgreSQL): For highly structured relational models, the database controllers can be updated to utilize PostgreSQL via an ORM (such as Drizzle or Prisma).

---

## 21. Disaster Recovery

To ensure business continuity, RedTeam Sentinel incorporates three recovery mechanisms:

### 21.1 Continuous Database Backups
The backend can be configured to run automated cron tasks that copy `db.json` to secure cloud storage (such as Google Cloud Storage or AWS S3), protecting the workspace from accidental data loss.

### 21.2 High-Availability Clusters
By running the application inside Cloud Run containers, the platform automatically scales instances up or down based on traffic demands. This guarantees service availability even during high-load periods.

### 21.3 Emergency Verification Bypass Options
If external services (such as DNS lookups or target servers) experience outages, system administrators can use manual bypass approvals to keep critical internal pipelines running.

---

## 22. Troubleshooting Guide

### 22.1 Common Platform Errors & Remediation Steps

#### Issue 1: Gemini API Key Not Working / Standard Templates Loading
 Root Cause: The `GEMINI_API_KEY` is missing from the environment variables, or it is set to the default placeholder: `MY_GEMINI_API_KEY`.
 Resolution: Navigate to your hosting provider's configuration panel (or local `.env` file) and provide a valid Gemini API key. Avoid prefixing the server-side key with `VITE_`.

#### Issue 2: DNS TXT Verification Challenge Fails
 Root Cause: The DNS TXT record has not fully propagated across public resolvers, or the hostname has a typo.
 Resolution: 
  1. Confirm that the TXT record is deployed on the correct root or subdomain.
  2. Verify that the TXT record matches the required format exactly: `redteam-sentinel-verification=[token]`.
  3. Use public lookup utilities (such as `dig txt yourdomain.com`) to confirm propagation before clicking Verify Target.

#### Issue 3: HTML File Verification Fails
 Root Cause: The target website is served with strict redirection rules, or the file is blocked by a Web Application Firewall (WAF).
 Resolution: Verify that the file `sentinel-verify.html` is accessible over public networks at `http://yourdomain.com/sentinel-verify.html` and does not require active cookies or logins.

---

## 23. Frequently Asked Questions (FAQ)

### Q: Is RedTeam Sentinel legal to run on any website?
A: RedTeam Sentinel is strictly permitted only on digital assets that you own or have explicit written authorization to test. Scanning unauthorized targets can violate computer abuse laws. The platform strictly enforces this policy through multi-factor ownership verification.

### Q: Does the scanner execute live exploits?
A: No. RedTeam Sentinel uses non-intrusive scanning patterns. It checks configurations, evaluates response headers, and scans SSL handshakes. It does not send destructive payloads or attempt to exploit systems.

### Q: Can RedTeam Sentinel run within private corporate networks?
A: Yes. Since the system compiles into a self-contained container (Node CJS bundle), you can deploy it inside private VPCs or localized Docker networks to scan internal staging assets.

### Q: How do I upgrade to a premium Gemini model?
A: If you need to upgrade to high-performance reasoning models, click Settings > Paid Model Flow in the AI Studio UI to activate paid capabilities.

---

## 24. Business Value Analysis

RedTeam Sentinel provides clear return on investment (ROI) for modern compliance-driven organizations:

### 24.1 ROI and Cost-Benefit Matrix

```
┌─────────────────────────────────┬─────────────────────────────────┐
│     Without RedTeam Sentinel    │      With RedTeam Sentinel      │
├─────────────────────────────────┼─────────────────────────────────┤
│ • High third-party audit costs  │ • Continuous compliance reviews │
│ • Manual Jira ticket creation   │ • Automated integration tools   │
│ • Complex, hard-to-read logs    │ • High-contrast visual charts   │
│ • Slow compliance verification  │ • Automated policy mappings     │
└─────────────────────────────────┴─────────────────────────────────┘
```

 Reduced Audit Preparation Time: Instead of spending weeks compiling reports for SOC 2 audits, compliance teams can generate compliant security summaries with a single click.
 Accelerated Remediation Cycles: Formatted findings and custom code recommendations help development teams resolve security vulnerabilities in hours rather than days.

---

## 25. Future Roadmap Recommendations

To expand the platform's capabilities, the product team recommends three future enhancements:

1. Automated Pull Request Generation: Integrate the Gemini model with developer workflows to automatically generate GitHub Pull Requests that resolve identified header vulnerabilities (e.g., adding secure CSP headers).
2. Deep Dynamic API Security Testing (DAST): Implement secure active scanning to identify complex logical flaws in REST and GraphQL APIs.
3. Multi-Asset Security Graph Visualizations: Expand the dashboard to render interactive, node-based security maps using visualization libraries (such as D3.js). This will allow teams to visualize network exposures across their entire digital ecosystem.


