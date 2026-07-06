import assert from "node:assert/strict";
import { db, rolePermissions } from "../src/data.js";

assert.ok(db.targets.length >= 2, "Expected demo targets to exist");
assert.equal(db.targets.find((target) => target.id === "tgt-lab-001")?.verified, true, "Expected lab target to be verified");
assert.equal(db.targets.find((target) => target.id === "tgt-unverified-001")?.verified, false, "Expected unverified target to remain unverified");
assert.ok(rolePermissions.security_engineer.includes("run_scan"), "Expected security engineer to run scans");
assert.equal(rolePermissions.auditor.includes("run_scan"), false, "Expected auditor to be blocked from scan execution");

console.log("Smoke tests passed: demo data and RBAC expectations are valid.");
