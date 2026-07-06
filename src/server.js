import express from "express";
import { db, rolePermissions } from "./data.js";

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static("public"));

function now() {
  return new Date().toISOString();
}

function getRole(req) {
  return req.headers["x-demo-role"] || "security_engineer";
}

function hasPermission(role, permission) {
  return rolePermissions[role]?.includes(permission) || false;
}

function audit(action, actorRole, status, detail, severity = "info") {
  const log = {
    id: `log-${Date.now()}`,
    timestamp: now(),
    actorRole,
    action,
    status,
    severity,
    detail
  };
  db.auditLogs.unshift(log);
  return log;
}

function passiveFindingTemplates(target) {
  return [
    {
      id: `finding-${Date.now()}-csp`,
      targetId: target.id,
      targetValue: target.value,
      type: "web_header",
      title: "Missing Content-Security-Policy Header",
      severity: "medium",
      evidence: "Demo passive review observed that CSP was not present in the sample header set.",
      recommendation: "Define and test a Content-Security-Policy. Start with report-only mode before enforcement.",
      complianceMapping: {
        owasp: ["Security Misconfiguration"],
        soc2: ["Logical access and system operations"],
        gdpr: ["Security of processing"],
        isoStyle: ["Secure configuration management"]
      },
      humanReviewRequired: true,
      status: "open"
    },
    {
      id: `finding-${Date.now()}-cors`,
      targetId: target.id,
      targetValue: target.value,
      type: "cors",
      title: "Permissive CORS Configuration Requires Review",
      severity: "high",
      evidence: "Demo passive review detected a sample wildcard CORS policy.",
      recommendation: "Restrict allowed origins to approved application domains and validate with the application owner.",
      complianceMapping: {
        owasp: ["Broken Access Control", "Security Misconfiguration"],
        soc2: ["Logical access controls"],
        gdpr: ["Data protection by design"],
        isoStyle: ["Access control"]
      },
      humanReviewRequired: true,
      status: "needs_review"
    }
  ];
}

app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    app: "RedTeam Sentinel Safe Demo",
    mode: process.env.NODE_ENV || "development",
    safeUseOnly: true
  });
});

app.get("/api/targets", (req, res) => {
  res.json(db.targets);
});

app.post("/api/targets", (req, res) => {
  const role = getRole(req);

  if (!hasPermission(role, "onboard_target")) {
    audit("TARGET_ONBOARD_DENIED", role, "blocked", "Role is not allowed to onboard targets", "warning");
    return res.status(403).json({ error: "Role is not allowed to onboard targets." });
  }

  const { type, value, verificationMethod, authChecked } = req.body;

  if (!type || !value || !verificationMethod || authChecked !== true) {
    audit("TARGET_ONBOARD_REJECTED", role, "blocked", "Missing required target fields or authorization confirmation", "warning");
    return res.status(400).json({
      error: "type, value, verificationMethod, and authChecked=true are required. Only onboard targets you own or have written permission to assess."
    });
  }

  const target = {
    id: `tgt-${Date.now()}`,
    type,
    value,
    verificationMethod,
    verified: false,
    authChecked: true,
    approvedByAdmin: false,
    createdAt: now(),
    verificationToken: `redteam-sentinel-verification=${Math.random().toString(16).slice(2)}`
  };

  db.targets.unshift(target);
  audit("TARGET_ONBOARDED", role, "success", `Target onboarded but not verified: ${value}`);
  res.status(201).json(target);
});

app.post("/api/targets/:id/verify-demo", (req, res) => {
  const role = getRole(req);
  const allowDevSimulation = process.env.ALLOW_DEV_VERIFICATION_SIMULATION === "true";

  if (!hasPermission(role, "verify_target")) {
    audit("TARGET_VERIFY_DENIED", role, "blocked", "Role is not allowed to verify targets", "warning");
    return res.status(403).json({ error: "Role is not allowed to verify targets." });
  }

  if (!allowDevSimulation) {
    audit("TARGET_VERIFY_SIM_BLOCKED", role, "blocked", "Development verification simulation is disabled", "warning");
    return res.status(400).json({
      error: "Development verification simulation is disabled. Production-style verification must keep failed targets unverified."
    });
  }

  const target = db.targets.find((item) => item.id === req.params.id);
  if (!target) {
    return res.status(404).json({ error: "Target not found." });
  }

  target.verified = true;
  target.approvedByAdmin = true;
  target.verifiedAt = now();
  target.demoOnly = true;

  audit("TARGET_VERIFIED_DEMO_ONLY", role, "warning", `Demo-only verification enabled for ${target.value}`, "warning");
  res.json({ target, warning: "Demo-only verification. Do not use this as a production verification bypass." });
});

app.post("/api/scans", (req, res) => {
  const role = getRole(req);

  if (!hasPermission(role, "run_scan")) {
    audit("SCAN_DENIED_RBAC", role, "blocked", "Role is not allowed to run scans", "warning");
    return res.status(403).json({ error: "Role is not allowed to run scans." });
  }

  const { targetId, type = "passive_demo" } = req.body;
  const target = db.targets.find((item) => item.id === targetId);

  if (!target) {
    audit("SCAN_REJECTED_TARGET_NOT_FOUND", role, "blocked", `Target not found: ${targetId}`, "warning");
    return res.status(404).json({ error: "Target not found." });
  }

  if (!target.verified || !target.authChecked) {
    audit("SCAN_BLOCKED_UNVERIFIED", role, "blocked", `Attempted scan against unverified target: ${target.value}`, "critical");
    return res.status(400).json({
      error: "Scan blocked. Target must be verified and authorization must be confirmed before scanning."
    });
  }

  const scan = {
    id: `scan-${Date.now()}`,
    targetId: target.id,
    targetValue: target.value,
    type,
    status: "completed",
    startedAt: now(),
    completedAt: now(),
    mode: "safe_passive_demo_only",
    notes: [
      "No exploit payloads executed.",
      "No credential attacks performed.",
      "No destructive testing performed.",
      "Demo uses static passive-style findings."
    ]
  };

  const findings = passiveFindingTemplates(target);
  db.scans.unshift(scan);
  db.findings.unshift(...findings);

  audit("PASSIVE_SCAN_COMPLETED", role, "success", `Safe demo scan completed for ${target.value}`);

  res.status(201).json({
    scan,
    findings,
    humanReviewRequired: true,
    safeUseReminder: "Only test systems you own or have explicit written permission to assess."
  });
});

app.get("/api/findings", (req, res) => {
  res.json(db.findings);
});

app.post("/api/findings/:id/status", (req, res) => {
  const role = getRole(req);

  if (!hasPermission(role, "update_finding")) {
    audit("FINDING_UPDATE_DENIED", role, "blocked", "Role is not allowed to update finding status", "warning");
    return res.status(403).json({ error: "Role is not allowed to update finding status." });
  }

  const finding = db.findings.find((item) => item.id === req.params.id);
  if (!finding) {
    return res.status(404).json({ error: "Finding not found." });
  }

  const allowedStatuses = ["open", "needs_review", "remediating", "fixed", "validated"];
  if (!allowedStatuses.includes(req.body.status)) {
    return res.status(400).json({ error: `status must be one of: ${allowedStatuses.join(", ")}` });
  }

  finding.status = req.body.status;
  finding.updatedAt = now();
  audit("FINDING_STATUS_UPDATED", role, "success", `Finding ${finding.id} updated to ${finding.status}`);
  res.json(finding);
});

app.get("/api/logs", (req, res) => {
  const role = getRole(req);

  if (!hasPermission(role, "view_logs")) {
    return res.status(403).json({ error: "Role is not allowed to view audit logs." });
  }

  res.json(db.auditLogs);
});

app.get("/api/rbac", (req, res) => {
  res.json(rolePermissions);
});

app.listen(port, () => {
  console.log(`RedTeam Sentinel safe demo running at http://localhost:${port}`);
});

export default app;
