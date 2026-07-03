# 📋 NeuralOps Release Changelog

All notable changes to this project will be documented in this file.

---

## [v1.2.0] — 2026-07-01
### Added
*   **Interactive Onboarding Tour Wizard**: Implemented a stateful, three-step guide helping operators configure model streams, set real-time drift limits, and setup automated notification alerts. Completion dynamically configures the live control loop state!
*   **Multi-Tenancy & Tenant Switcher**: Added a dropdown menu in the header to switch active tenants (e.g., `Global Retail Corp`, `Risk Assessment Dept`, `Compliance Node`) and administrative roles (`Cluster Admin`, `Security Auditor`, `Compliance Officer`) instantly.
*   **Diagnostic Sandbox Panel**: Added simulated outage controls. Operators can simulate active connection drops, trigger heavy Kafka backlog scenarios, or force-reload the dashboard skeleton loading state.
*   **Notification Preferences UI**: Expanded the "Integrations" section of the Governance panel to support configuring custom incoming Slack Webhooks, PagerDuty Integration Keys, and alert severities. Added a **"Send Test Alert"** trigger with real feedback.
*   **Comprehensive Resource Hub**: Built a centralized Documentation Hub containing installation guides, CLI cheat sheets, an interactive API Playground, CRD specifications, and the changelog itself.

---

## [v1.1.0] — 2026-06-15
### Added
*   **Stateful Authentication & AuthGate**: Integrated secure authentication supporting email/password accounts, Google SSO, and a local operator demo override.
*   **Active Telemetry Sync**: Built a server-side telemetry sync proxy reading directly from active PostgreSQL schemas.
*   **Interactive Toast Notifications**: Replaced native browser alert dialogs with a custom React toast component for licence proposals, exports, and status checks.

---

## [v1.0.0] — 2026-05-10
### Added
*   **Drift Monitoring Core**: Live population stability index (PSI) calculators, graph visualizations, and state machine simulation boards.
*   **Active Incident Feed**: Interactive incident feed detailing drift alerts, feature variance, and autonomous hot-rollback triggers.
*   **Declarative Policy Managers**: Custom sliders to change PSI drift parameters and Canary routing ratios in real time.
*   **Developer CLI**: Embedded shell client to run local commands, retrieve raw YAML configurations, and test NIST compliance audits.
*   **Enterprise Proposal Hub**: ROI calculation boards showing commercial tiers, net savings estimation, and export tools.

---

*NeuralOps Changelog — Continuous improvement, autonomous assurance.*
