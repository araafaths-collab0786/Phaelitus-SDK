import React, { useState } from "react";
import { Search, Filter, Download, ShieldCheck, ChevronRight, Check, Play, AlertTriangle } from "lucide-react";

interface AuditRecord {
  id: string;
  action: string;
  actor: string;
  model: string;
  severity: "nominal" | "warning" | "critical";
  status: "success" | "dispatched" | "failed";
  timestamp: string;
  details: string;
}

const INITIAL_AUDIT_LOGS: AuditRecord[] = [
  {
    id: "aud-9a18cf",
    action: "Canary Rollback Executed",
    actor: "Slack Auto-Mitigator",
    model: "credit-scoring-xgboost",
    severity: "critical",
    status: "success",
    timestamp: "2026-07-02T06:12:15Z",
    details: "Automated trigger: Population Stability Index crossed critical threshold (PSI = 0.28). Rerouted traffic from XGBoost candidate to v1.1 safe baseline."
  },
  {
    id: "aud-1a22bd",
    action: "Policy Configuration Modified",
    actor: "System Operator",
    model: "google-gemini-pro-1.5",
    severity: "nominal",
    status: "success",
    timestamp: "2026-07-02T05:44:10Z",
    details: "Adjusted PSI alert bound limit from 0.25 down to 0.20 to align with continuous monitoring rules."
  },
  {
    id: "aud-5c44ea",
    action: "Ingestion Queue Flushed",
    actor: "System Operator",
    model: "ibm-granite-3.0-instruct",
    severity: "warning",
    status: "success",
    timestamp: "2026-07-02T04:15:02Z",
    details: "Forced partition queue flush. backlogged telemetry count cleared successfully (+142,800 records processed)."
  },
  {
    id: "aud-8b77cd",
    action: "Compliance Audit Triggered",
    actor: "Auth0 SSO (Auditor Role)",
    model: "credit-scoring-xgboost",
    severity: "nominal",
    status: "success",
    timestamp: "2026-07-01T23:50:41Z",
    details: "Exported high-fidelity NIST AI RMF scorecards for Sovereign fintech compliance logs."
  },
  {
    id: "aud-1a99ef",
    action: "Active Retraining Dispatched",
    actor: "Argo Workflow Engine",
    model: "watsonx-credit-v2",
    severity: "warning",
    status: "dispatched",
    timestamp: "2026-07-01T21:10:05Z",
    details: "Drift trigger: P99 latency degraded to 42.1s. Dispatched retraining task 'argo-mitigate-drift-9fa28c' on spot GPU instance."
  },
  {
    id: "aud-0c11fd",
    action: "Multi-Tenant Switch Executed",
    actor: "System Operator",
    model: "All Clusters",
    severity: "nominal",
    status: "success",
    timestamp: "2026-07-01T18:22:15Z",
    details: "Switched cluster tenant view from Compliance Node to Global Retail Corp (Primary)."
  },
  {
    id: "aud-3e55df",
    action: "Canary Promotion Approved",
    actor: "Slack Auto-Mitigator",
    model: "google-gemini-pro-1.5",
    severity: "nominal",
    status: "success",
    timestamp: "2026-07-01T14:15:22Z",
    details: "Continuous evaluation criteria fully satisfied. Promoted google-gemini-pro-1.5 from 10% canary split to 100% main cluster allocation."
  }
];

export default function AuditLogViewer() {
  const [logs, setLogs] = useState<AuditRecord[]>(INITIAL_AUDIT_LOGS);
  const [searchTerm, setSearchTerm] = useState("");
  const [actorFilter, setActorFilter] = useState("all");
  const [severityFilter, setSeverityFilter] = useState("all");
  const [selectedLog, setSelectedLog] = useState<AuditRecord | null>(null);
  const [exportNotification, setExportNotification] = useState<string | null>(null);

  const filteredLogs = logs.filter((log) => {
    const matchesSearch =
      log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.actor.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.model.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesActor = actorFilter === "all" || log.actor.toLowerCase().includes(actorFilter.toLowerCase());
    const matchesSeverity = severityFilter === "all" || log.severity === severityFilter;

    return matchesSearch && matchesActor && matchesSeverity;
  });

  const triggerExport = (format: "json" | "csv") => {
    setExportNotification(`Generating secure cryptographically signed SHA-256 audit manifest (${format.toUpperCase()})...`);
    setTimeout(() => {
      setExportNotification(`Audit log successfully exported in ${format.toUpperCase()} format with hash: 0x9f9...ae52`);
      setTimeout(() => setExportNotification(null), 3500);
    }, 800);
  };

  return (
    <div className="flex flex-col gap-6" id="audit-log-root">
      
      {/* Title Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between border-b border-[#202538] pb-4 gap-4">
        <div>
          <h2 className="font-serif text-lg font-bold text-white tracking-wide flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-[#00D9E8]" />
            Continuous Audit Trail &amp; Verification Log
          </h2>
          <p className="text-[10px] font-sans text-[#8891A8] mt-1">
            Complete, immutable log of policy updates, autonomous mitigations, operator overrides, and sovereign tenancy transactions.
          </p>
        </div>
        
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => triggerExport("json")}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-[#1C2030] border border-[#202538] hover:border-[#00D9E8]/30 text-[10px] font-mono uppercase tracking-wider font-bold transition-all cursor-pointer text-white"
          >
            <Download className="w-3.5 h-3.5 text-[#8891A8]" />
            <span>Export Manifest (JSON)</span>
          </button>
        </div>
      </div>

      {/* Export Feedback notification banner */}
      {exportNotification && (
        <div className="bg-[#00C48C]/15 border border-[#00C48C]/35 p-3.5 rounded-lg flex items-center gap-3 text-xs text-white">
          <div className="w-2 h-2 rounded-full bg-[#00C48C] animate-pulse" />
          <span className="font-mono">{exportNotification}</span>
        </div>
      )}

      {/* Interactive Controls & Filters row */}
      <div className="bg-[#13161E] border border-[#202538] p-4 rounded-lg flex flex-col md:flex-row gap-4 items-center justify-between">
        
        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-[#3D4460] absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search action, actor, or model..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-[#0D0F14] border border-[#202538] hover:border-[#00D9E8]/20 focus:border-[#00D9E8] rounded pl-9 pr-3 py-2 text-xs text-white font-sans outline-none transition-colors"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          
          {/* Actor Filter */}
          <div className="flex items-center gap-1.5 text-[10px] font-mono text-[#8891A8]">
            <span>Actor:</span>
            <select
              value={actorFilter}
              onChange={(e) => setActorFilter(e.target.value)}
              className="bg-[#0D0F14] border border-[#202538] text-xs font-mono text-white rounded px-2.5 py-1.5 outline-none focus:border-[#00D9E8] cursor-pointer"
            >
              <option value="all">All Actors</option>
              <option value="operator">System Operator</option>
              <option value="slack">Slack Bot</option>
              <option value="argo">Argo Engine</option>
              <option value="sso">Auth0 SSO</option>
            </select>
          </div>

          {/* Severity Filter */}
          <div className="flex items-center gap-1.5 text-[10px] font-mono text-[#8891A8]">
            <span>Severity:</span>
            <select
              value={severityFilter}
              onChange={(e) => setSeverityFilter(e.target.value)}
              className="bg-[#0D0F14] border border-[#202538] text-xs font-mono text-white rounded px-2.5 py-1.5 outline-none focus:border-[#00D9E8] cursor-pointer"
            >
              <option value="all">All Severities</option>
              <option value="nominal">Nominal</option>
              <option value="warning">Warning</option>
              <option value="critical">Critical</option>
            </select>
          </div>

        </div>

      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Main Logs Table */}
        <div className="lg:col-span-8 bg-[#13161E] border border-[#202538] rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-[#0D0F14] border-b border-[#202538] font-mono text-[9px] text-[#8891A8] uppercase tracking-wider">
                  <th className="p-3.5 pl-5">Action Logged</th>
                  <th className="p-3.5">Actor Entity</th>
                  <th className="p-3.5">Target Model</th>
                  <th className="p-3.5 text-center">Severity</th>
                  <th className="p-3.5 text-right pr-5">Timestamp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#202538]/40">
                {filteredLogs.length > 0 ? (
                  filteredLogs.map((log) => (
                    <tr
                      key={log.id}
                      onClick={() => setSelectedLog(selectedLog?.id === log.id ? null : log)}
                      className={`hover:bg-[#1C2030]/30 transition-colors cursor-pointer ${
                        selectedLog?.id === log.id ? "bg-[#7B61FF]/5" : ""
                      }`}
                    >
                      <td className="p-3.5 pl-5 font-sans font-bold text-white flex flex-col gap-1">
                        <span>{log.action}</span>
                        <span className="text-[9px] font-mono text-[#8891A8] font-normal uppercase tracking-wider">{log.id}</span>
                      </td>
                      <td className="p-3.5 font-mono text-[#8891A8]">{log.actor}</td>
                      <td className="p-3.5 font-mono text-[#00D9E8]">{log.model}</td>
                      <td className="p-3.5 text-center">
                        <span className={`inline-block px-2 py-0.5 rounded text-[8px] font-mono font-bold uppercase ${
                          log.severity === "critical"
                            ? "bg-[#FF3B5C]/15 text-[#FF3B5C]"
                            : log.severity === "warning"
                            ? "bg-[#F5A623]/15 text-[#F5A623]"
                            : "bg-[#00C48C]/15 text-[#00C48C]"
                        }`}>
                          {log.severity}
                        </span>
                      </td>
                      <td className="p-3.5 text-right font-mono text-[#8891A8] pr-5">
                        {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="p-10 text-center font-mono text-[#3D4460]">
                      No audit log entries matched search criteria.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Selected Log Detail Sidebar */}
        <div className="lg:col-span-4 flex flex-col gap-5">
          <div className="bg-[#13161E] border border-[#202538] p-5 rounded-lg flex flex-col gap-4">
            <span className="text-[10px] font-mono text-white uppercase tracking-wider font-bold">Log Record Inspector</span>
            
            {selectedLog ? (
              <div className="flex flex-col gap-4">
                <div className="flex justify-between items-center pb-2 border-b border-[#202538]">
                  <span className="text-[10px] font-mono text-[#00D9E8] font-bold">{selectedLog.id}</span>
                  <span className={`px-1.5 py-0.5 rounded text-[8px] font-mono uppercase font-bold ${
                    selectedLog.status === "success" ? "bg-[#00C48C]/15 text-[#00C48C]" : "bg-[#7B61FF]/15 text-[#7B61FF]"
                  }`}>{selectedLog.status}</span>
                </div>

                <div className="flex flex-col gap-2.5 text-xs text-[#8891A8]">
                  <div>
                    <span className="text-[8px] font-mono uppercase text-[#3D4460] block font-bold">Action Type</span>
                    <span className="text-white font-sans font-bold">{selectedLog.action}</span>
                  </div>
                  <div>
                    <span className="text-[8px] font-mono uppercase text-[#3D4460] block font-bold">Authorized Actor</span>
                    <span className="text-white font-mono">{selectedLog.actor}</span>
                  </div>
                  <div>
                    <span className="text-[8px] font-mono uppercase text-[#3D4460] block font-bold">Target Pipeline Model</span>
                    <span className="text-white font-mono">{selectedLog.model}</span>
                  </div>
                  <div>
                    <span className="text-[8px] font-mono uppercase text-[#3D4460] block font-bold">Detailed Transaction Payload</span>
                    <p className="text-[10px] font-sans leading-relaxed text-[#8891A8] mt-1 bg-[#0D0F14] border border-[#202538] p-3 rounded">
                      {selectedLog.details}
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-[10px] font-sans text-[#3D4460] leading-relaxed italic text-center py-10">
                Click any row in the audit trail to inspect its full cryptographic details, Actor roles, and JSON event parameters.
              </p>
            )}
          </div>
        </div>

      </div>

    </div>
  );
}
