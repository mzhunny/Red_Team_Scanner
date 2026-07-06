export const db = {
  targets: [
    {
      id: "tgt-lab-001",
      type: "website",
      value: "https://example-lab.local",
      verified: true,
      verificationMethod: "html_file_challenge",
      authChecked: true,
      approvedByAdmin: false,
      createdAt: "2026-07-06T10:00:00Z"
    },
    {
      id: "tgt-unverified-001",
      type: "api",
      value: "https://unverified-lab.local/api",
      verified: false,
      verificationMethod: "api_header_challenge",
      authChecked: true,
      approvedByAdmin: false,
      createdAt: "2026-07-06T10:05:00Z"
    }
  ],
  scans: [],
  findings: [],
  auditLogs: [],
  team: [
    {
      id: "user-owner-001",
      name: "Portfolio Owner",
      role: "owner"
    },
    {
      id: "user-sec-001",
      name: "Security Engineer",
      role: "security_engineer"
    },
    {
      id: "user-auditor-001",
      name: "Audit Reviewer",
      role: "auditor"
    }
  ]
};

export const rolePermissions = {
  owner: ["read", "manage_workspace", "onboard_target", "verify_target", "run_scan", "update_finding", "view_logs"],
  administrator: ["read", "onboard_target", "verify_target", "run_scan", "update_finding", "view_logs"],
  security_engineer: ["read", "onboard_target", "run_scan", "update_finding"],
  developer: ["read", "update_finding"],
  compliance_manager: ["read", "view_logs"],
  auditor: ["read", "view_logs"]
};
