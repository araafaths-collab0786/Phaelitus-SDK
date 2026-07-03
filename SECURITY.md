# Security Policy & Vulnerability Disclosure Program

NeuralOps is committed to ensuring the safety, integrity, and security of our continuous evaluation control plane and our enterprise customers' machine learning pipelines. This document details our responsible disclosure program, CVE response Service Level Agreements (SLAs), and security standards.

## 🛡️ Responsible Disclosure Process

If you identify a security vulnerability in NeuralOps, we ask that you report it to us confidentially. Do not disclose the vulnerability publicly until we have collaborated to release a patch.

### How to Report a Vulnerability

Please send your reports to **security@neuralops.io**. 

For sensitive reports, please encrypt your email using our PGP Key:
- **Key ID:** `0x7B61FF5A623AA`
- **Fingerprint:** `9F9B C48C 00D9 E8A5 E9D3  7B61 FF5A 623A AE52`

In your report, please include:
1. A descriptive title and high-level summary of the issue.
2. Step-by-step reproduction instructions (or PoC script) demonstrating the impact.
3. The environments/versions tested (e.g., GKE Autopilot v1.30, NeuralOps Helm Chart v1.5.0).
4. Potential remediation suggestions.

---

## ⏱️ CVE Response & Patching SLAs

We hold our engineering team to strict response boundaries when resolving verified security vulnerabilities:

| Severity Level | Initial Acknowledgment | Remediation Plan & SLA | Patch / Advisory Release |
| :--- | :--- | :--- | :--- |
| 🔴 **Critical (CVSS 9.0–10.0)** | Within 2 Hours | Within 24 Hours | Within 48 Hours |
| 🟠 **High (CVSS 7.0–8.9)** | Within 6 Hours | Within 3 Days | Within 5 Days |
| 🟡 **Medium (CVSS 4.0–6.9)** | Within 12 Hours | Within 7 Days | Within 14 Days |
| 🔵 **Low (CVSS 0.1–3.9)** | Within 24 Hours | Within 14 Days | Within 30 Days |

---

## 🔒 Enterprise Security Guardrails

NeuralOps builds on enterprise-grade foundation principles:
1. **Sigstore Cosign Weight Audits:** NeuralOps cryptographically signs model weight hashes on GKE container admission to protect against weight tampering attacks.
2. **PostgreSQL Column Encryption:** Telemetry and alert records persisted in Cloud SQL PostgreSQL are fully encrypted at-rest using Google-managed KMS keys.
3. **SSO Role-Based Access Control (RBAC):** SSO credentials verified through Auth0/OIDC enforce namespace-scoped authorization boundaries across multiple departments.
