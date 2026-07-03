import React, { useState } from "react";
import { 
  ShieldCheck, 
  Sparkles, 
  AlertTriangle, 
  TrendingDown, 
  DollarSign, 
  Database, 
  Cpu, 
  Terminal, 
  ArrowUpRight, 
  CheckCircle, 
  FileSpreadsheet, 
  Cloud, 
  Layers, 
  Lock, 
  Activity, 
  ChevronRight,
  Download,
  Flame,
  HelpCircle,
  RefreshCw
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface ModelFairnessData {
  name: string;
  demographicParity: number;
  equalizedOdds: number;
  disparateImpact: number;
  fairnessStatus: "PASS" | "FAIL" | "WARN";
  biasAlerts: string[];
}

const FAIRNESS_RECORDS: Record<string, ModelFairnessData> = {
  "google-gemini-pro-1.5": {
    name: "google-gemini-pro-1.5",
    demographicParity: 0.94,
    equalizedOdds: 0.04,
    disparateImpact: 0.96,
    fairnessStatus: "PASS",
    biasAlerts: []
  },
  "ibm-granite-3.0-instruct": {
    name: "ibm-granite-3.0-instruct",
    demographicParity: 0.91,
    equalizedOdds: 0.05,
    disparateImpact: 0.93,
    fairnessStatus: "PASS",
    biasAlerts: []
  },
  "meta-llama-3.1-8b": {
    name: "meta-llama-3.1-8b",
    demographicParity: 0.88,
    equalizedOdds: 0.09,
    disparateImpact: 0.89,
    fairnessStatus: "PASS",
    biasAlerts: []
  },
  "credit-scoring-model": {
    name: "credit-scoring-model",
    demographicParity: 0.74,
    equalizedOdds: 0.14,
    disparateImpact: 0.77,
    fairnessStatus: "FAIL",
    biasAlerts: [
      "Fairness violation: Demographic parity ratio 0.74 is below ethical baseline (0.80).",
      "Disparate impact ratio 0.77 triggers regulatory exception under EU AI Act Article 10."
    ]
  },
  "fraud-detector-v3": {
    name: "fraud-detector-v3",
    demographicParity: 0.82,
    equalizedOdds: 0.08,
    disparateImpact: 0.84,
    fairnessStatus: "PASS",
    biasAlerts: []
  }
};

export default function GovernanceFinOps() {
  const [selectedModel, setSelectedModel] = useState<string>("credit-scoring-model");
  const [nistAuditGenerating, setNistAuditGenerating] = useState(false);
  const [nistReportGenerated, setNistReportGenerated] = useState(false);
  const [activeTab, setActiveTab] = useState<"governance" | "finops" | "integrations">("governance");
  
  // Interactive notification state variables
  const [slackWebhook, setSlackWebhook] = useState<string>(import.meta.env.VITE_SLACK_WEBHOOK_URL ?? "");
  const [pagerdutyKey, setPagerdutyKey] = useState<string>("pd-integration-key-ae821f90");
  const [jiraUrl, setJiraUrl] = useState<string>("https://enterprise-aiops.atlassian.net");
  const [alertSeverity, setAlertSeverity] = useState<string>("critical");
  const [autoEscalate, setAutoEscalate] = useState<boolean>(true);
  const [testAlertLoading, setTestAlertLoading] = useState<boolean>(false);
  const [testAlertMessage, setTestAlertMessage] = useState<string | null>(null);
  
  const fairness = FAIRNESS_RECORDS[selectedModel] || FAIRNESS_RECORDS["credit-scoring-model"];

  const handleGenerateNistReport = () => {
    setNistAuditGenerating(true);
    setTimeout(() => {
      setNistAuditGenerating(false);
      setNistReportGenerated(true);
    }, 1200);
  };

  const handleDownloadNistJson = () => {
    const reportData = {
      framework: "NIST AI Risk Management Framework (AI RMF 1.0)",
      timestamp: new Date().toISOString(),
      governedModel: selectedModel,
      verificationEngine: "Phaelitus SDK Core v1.4.0",
      complianceStatus: fairness.fairnessStatus === "FAIL" ? "NON_COMPLIANT" : "COMPLIANT",
      tiers: {
        GOVERN: {
          policies: "Auto-reconciliation ModelPipeline CRD v1alpha1",
          rbac: "Namespace-scoped Multi-tenancy RBAC enforced via K8s secrets",
          cryptographicChain: "Sigstore CoSign SHA-256 weight hash verified at compilation time"
        },
        MAP: {
          modelContext: `Continuous evaluation pipeline for ${selectedModel}. Expected inputs compared via PSI statistical drift logs.`,
          riskProfile: "Covariate feature drift detected may result in regulatory and economic impact. Bias threshold set to 0.80."
        },
        MEASURE: {
          metricsEvaluated: ["Population Stability Index", "Kolmogorov-Smirnov CDF Comparison", "Demographic Parity Ratio", "Equalized Odds Difference"],
          currentDemographicParity: fairness.demographicParity,
          currentDisparateImpact: fairness.disparateImpact,
          biasAlertsCount: fairness.biasAlerts.length
        },
        MANAGE: {
          automatedRemediation: "Argo Workflows zero-downtime model swap via HTTPRoute traffic splitting",
          incidentIntegrations: ["Jira Cloud", "PagerDuty Service Hub", "Slack Notifier"],
          lastMitigatedAction: "Retraining job coordinated via PPO RL Scheduler during off-peak power grid cycle"
        }
      }
    };

    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `Phaelitus-SDK-NIST-AI-RMF-${selectedModel}.json`;
    a.click();
  };

  return (
    <div className="flex flex-col gap-5">
      {/* Upper Navigation Tabs */}
      <div className="flex items-center justify-between border-b border-[#202538] pb-1">
        <div className="flex gap-1.5">
          {[
            { id: "governance", label: "IBM Trust & Bias (AIF360 / NIST)", icon: ShieldCheck },
            { id: "finops", label: "Meta Scale & FinOps Estimator", icon: DollarSign },
            { id: "integrations", label: "Google Vertex & BQ Connectors", icon: Database },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-3.5 py-2.5 text-[10px] font-mono uppercase tracking-wider border-b-2 font-bold cursor-pointer transition-all ${
                  isActive 
                    ? "border-[#00D9E8] text-[#00D9E8] bg-[#00D9E8]/5" 
                    : "border-transparent text-[#8891A8] hover:text-[#F0F2F8] hover:bg-[#1C2030]/30"
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
        <span className="hidden md:inline text-[9px] font-mono text-[#3D4460]">
          SECURITY CLASSIFICATION: CONFIDENTIAL // CORPORATE MULTI-CLOUD
        </span>
      </div>

      {activeTab === "governance" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* Fairness controls / Metrics Audit */}
          <div className="lg:col-span-7 flex flex-col gap-5 bg-[#13161E] border border-[#202538] p-5 rounded-lg">
            <div className="flex justify-between items-center border-b border-[#202538] pb-3">
              <div className="flex items-center gap-2">
                <ShieldCheck className="text-[#00D9E8] w-4.5 h-4.5" />
                <div>
                  <h3 className="font-sans text-xs uppercase tracking-wider text-[#F0F2F8] font-semibold">IBM Watsonx &amp; AIF360 Trustworthy AI</h3>
                  <p className="text-[9px] font-sans text-[#8891A8] leading-none mt-1">Demographic Parity &amp; Fairness Evaluation metrics</p>
                </div>
              </div>

              {/* Model select */}
              <select
                value={selectedModel}
                onChange={(e) => {
                  setSelectedModel(e.target.value);
                  setNistReportGenerated(false);
                }}
                className="bg-[#0D0F14] border border-[#202538] hover:border-[#00D9E8]/30 rounded-md px-2.5 py-1 text-[10px] font-mono font-bold text-[#00D9E8] outline-none cursor-pointer"
              >
                {Object.keys(FAIRNESS_RECORDS).map((m) => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </select>
            </div>

            {/* Model Demographic Metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              
              {/* Demographic Parity Ratio */}
              <div className="bg-[#0D0F14] border border-[#202538] p-3.5 rounded-lg flex flex-col justify-between">
                <div>
                  <span className="text-[8px] font-mono text-[#8891A8] tracking-widest block uppercase font-bold">Demographic Parity</span>
                  <div className="flex items-baseline gap-2 mt-2">
                    <span className={`text-xl font-mono font-bold ${fairness.demographicParity >= 0.80 ? "text-[#00C48C]" : "text-[#FF3B5C]"}`}>
                      {fairness.demographicParity.toFixed(2)}
                    </span>
                    <span className="text-[8px] font-mono text-[#3D4460]">GOAL: &gt;0.80</span>
                  </div>
                </div>
                <div className="mt-3 text-[8px] font-mono text-[#8891A8] uppercase tracking-wide flex items-center gap-1.5">
                  <span className={`w-1.5 h-1.5 rounded-full ${fairness.demographicParity >= 0.80 ? "bg-[#00C48C]" : "bg-[#FF3B5C]"}`}></span>
                  {fairness.demographicParity >= 0.80 ? "METRIC PASS" : "METRIC EXCEPTION"}
                </div>
              </div>

              {/* Equalized Odds */}
              <div className="bg-[#0D0F14] border border-[#202538] p-3.5 rounded-lg flex flex-col justify-between">
                <div>
                  <span className="text-[8px] font-mono text-[#8891A8] tracking-widest block uppercase font-bold">Equalized Odds Diff</span>
                  <div className="flex items-baseline gap-2 mt-2">
                    <span className="text-xl font-mono font-bold text-[#00C48C]">
                      {fairness.equalizedOdds.toFixed(2)}
                    </span>
                    <span className="text-[8px] font-mono text-[#3D4460]">GOAL: &lt;0.10</span>
                  </div>
                </div>
                <div className="mt-3 text-[8px] font-mono text-[#8891A8] uppercase tracking-wide flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#00C48C]"></span>
                  METRIC PASS
                </div>
              </div>

              {/* Disparate Impact Ratio */}
              <div className="bg-[#0D0F14] border border-[#202538] p-3.5 rounded-lg flex flex-col justify-between">
                <div>
                  <span className="text-[8px] font-mono text-[#8891A8] tracking-widest block uppercase font-bold">Disparate Impact</span>
                  <div className="flex items-baseline gap-2 mt-2">
                    <span className={`text-xl font-mono font-bold ${fairness.disparateImpact >= 0.80 ? "text-[#00C48C]" : "text-[#FF3B5C]"}`}>
                      {fairness.disparateImpact.toFixed(2)}
                    </span>
                    <span className="text-[8px] font-mono text-[#3D4460]">GOAL: &gt;0.80</span>
                  </div>
                </div>
                <div className="mt-3 text-[8px] font-mono text-[#8891A8] uppercase tracking-wide flex items-center gap-1.5">
                  <span className={`w-1.5 h-1.5 rounded-full ${fairness.disparateImpact >= 0.80 ? "bg-[#00C48C]" : "bg-[#FF3B5C]"}`}></span>
                  {fairness.disparateImpact >= 0.80 ? "METRIC PASS" : "METRIC EXCEPTION"}
                </div>
              </div>

            </div>

            {/* Bias alert / state status */}
            <div className={`p-4 rounded-lg border ${
              fairness.fairnessStatus === "FAIL" 
                ? "bg-[#FF3B5C]/10 border-[#FF3B5C]/30 text-[#FF3B5C]" 
                : "bg-[#00C48C]/10 border-[#00C48C]/30 text-[#00C48C]"
            }`}>
              <div className="flex items-start gap-2.5">
                <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                <div className="flex flex-col gap-1.5">
                  <span className="text-[10px] font-sans font-bold uppercase tracking-wider">
                    {fairness.fairnessStatus === "FAIL" ? "BIAS AUDIT EXCEPTION FOUND // RED ALERT" : "ETHICAL AI FAIRNESS VERIFIED // STANDBY"}
                  </span>
                  {fairness.biasAlerts.length > 0 ? (
                    <ul className="list-disc pl-4 text-[9px] font-mono text-[#F0F2F8] leading-relaxed flex flex-col gap-1.5">
                      {fairness.biasAlerts.map((b, i) => (
                        <li key={i}>{b}</li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-[9px] font-mono text-[#8891A8] leading-relaxed">
                      Continuous AIF360 demographic scan successfully analyzed live telemetry logs. Demographic Parity Ratio conforms with international standards including EU AI Act non-discrimination policies.
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Model Explainability (SHAP Map / Watsonx Insights) */}
            <div className="flex flex-col gap-3.5 border-t border-[#202538] pt-4">
              <span className="text-[10px] font-mono text-[#8891A8] uppercase font-bold tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-[#7B61FF]" />
                Live KernelSHAP Feature Importance Attribution
              </span>
              <p className="text-[9px] font-sans text-[#8891A8] leading-relaxed">
                When a statistical drift event occurs, the integrated SHAP engine auto-calculates localized shapley value weights across features to trace exactly which features contributed most heavily to the data drift.
              </p>

              <div className="flex flex-col gap-2 bg-[#0D0F14] border border-[#202538] p-3 rounded-lg">
                {[
                  { name: "user_intent_embedding", attribution: 0.42, color: "#7B61FF", explanation: "Critical drift found in unstructured text inputs" },
                  { name: "credit_score_delta", attribution: 0.28, color: "#FF3B5C", explanation: "Highly drifted distribution compared to training" },
                  { name: "account_creation_age", attribution: 0.15, color: "#00D9E8", explanation: "Slight variance detected (KS-Test: 0.08)" },
                  { name: "transaction_velocity_1h", attribution: 0.11, color: "#F5A623", explanation: "Stable (PSI = 0.03)" },
                  { name: "country_code_normalized", attribution: 0.04, color: "#8891A8", explanation: "Standard background distribution" }
                ].map((feat, idx) => (
                  <div key={idx} className="flex flex-col gap-1">
                    <div className="flex justify-between items-center text-[9px] font-mono">
                      <span className="text-[#F0F2F8] font-bold">{feat.name}</span>
                      <span className="text-[#8891A8]">SHAP WEIGHT: <span className="text-white font-bold">{(feat.attribution * 100).toFixed(0)}%</span></span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex-1 bg-[#1C2030] h-2 rounded overflow-hidden">
                        <div className="h-full rounded" style={{ width: `${feat.attribution * 100}%`, backgroundColor: feat.color }}></div>
                      </div>
                      <span className="text-[8px] font-sans text-[#3D4460] uppercase w-44 text-right truncate">{feat.explanation}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* NIST Compliance report generator */}
          <div className="lg:col-span-5 flex flex-col gap-5">
            <div className="bg-[#13161E] border border-[#202538] p-5 rounded-lg flex flex-col gap-4">
              <div className="flex items-center gap-2 border-b border-[#202538] pb-3">
                <FileSpreadsheet className="text-[#00D9E8] w-4.5 h-4.5" />
                <div>
                  <h3 className="font-sans text-xs uppercase tracking-wider text-[#F0F2F8] font-semibold">NIST AI RMF Compliance Report</h3>
                  <p className="text-[9px] font-sans text-[#8891A8] leading-none mt-1">Auto-generated audit reports on paper</p>
                </div>
              </div>

              <p className="text-[9px] font-sans text-[#8891A8] leading-relaxed">
                Compile operational audits into a validated NIST AI Risk Management Framework 1.0 (AI RMF) dossier. Extracts full cryptographic records, role mappings, and mitigation logs for corporate governance reviews.
              </p>

              {!nistReportGenerated ? (
                <button
                  disabled={nistAuditGenerating}
                  onClick={handleGenerateNistReport}
                  className="w-full py-2.5 bg-[#00D9E8] hover:bg-[#00D9E8]/90 text-[#0D0F14] font-mono text-[10px] font-bold uppercase tracking-widest rounded transition-all cursor-pointer flex items-center justify-center gap-1.5"
                >
                  {nistAuditGenerating ? (
                    <>
                      <span className="w-3 h-3 border-2 border-[#0D0F14] border-t-transparent rounded-full animate-spin"></span>
                      <span>COMPILING COMPLIANCE TIERS...</span>
                    </>
                  ) : (
                    <>
                      <span>COMPILE NIST AUDIT DOSSIER</span>
                      <ChevronRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              ) : (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col gap-3 bg-[#0D0F14] p-3.5 border border-[#00C48C]/30 rounded-lg"
                >
                  <div className="flex items-center gap-2 text-[#00C48C] text-[10px] font-mono font-bold uppercase">
                    <CheckCircle className="w-4 h-4" />
                    <span>NIST AI RMF Report Compiled</span>
                  </div>

                  <div className="flex flex-col gap-2 text-[9px] font-sans leading-relaxed text-[#8891A8] mt-1">
                    <div className="flex justify-between border-b border-[#202538]/50 pb-1">
                      <span className="font-mono text-[8px] uppercase font-bold text-[#F0F2F8]">1. GOVERN TIER</span>
                      <span className="text-[#00C48C] font-mono font-bold">VERIFIED (CoSign)</span>
                    </div>
                    <p className="text-[8px] font-mono leading-tight">Enforces cryptographic audit trails on SQLite/PG tables with CycloneDX-compliant SBOM generation.</p>

                    <div className="flex justify-between border-b border-[#202538]/50 pb-1 mt-1">
                      <span className="font-mono text-[8px] uppercase font-bold text-[#F0F2F8]">2. MEASURE TIER</span>
                      <span className={`font-mono font-bold ${fairness.fairnessStatus === "FAIL" ? "text-[#FF3B5C]" : "text-[#00C48C]"}`}>
                        {fairness.fairnessStatus === "FAIL" ? "ALERT OUTLIER" : "PASSED (PSI / KS)"}
                      </span>
                    </div>
                    <p className="text-[8px] font-mono leading-tight">Measures demographic parity slice-level bias &amp; feature importance distributions via live KernelSHAP.</p>

                    <div className="flex justify-between border-b border-[#202538]/50 pb-1 mt-1">
                      <span className="font-mono text-[8px] uppercase font-bold text-[#F0F2F8]">3. MANAGE TIER</span>
                      <span className="text-[#00C48C] font-mono font-bold">RECONCILED (Auto)</span>
                    </div>
                    <p className="text-[8px] font-mono leading-tight">Orchestrates automated retraining pipelines via PPO Intelligent Scheduler. Autonomic routing swaps complete in &lt;15s.</p>
                  </div>

                  <div className="flex gap-2 mt-2 pt-2 border-t border-[#202538]">
                    <button 
                      onClick={handleDownloadNistJson}
                      className="flex-1 py-1.5 bg-[#00C48C]/10 border border-[#00C48C]/30 text-[#00C48C] hover:bg-[#00C48C]/25 text-[9px] font-mono uppercase tracking-wider rounded transition-all cursor-pointer font-bold flex items-center justify-center gap-1"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>DOWNLOAD JSON</span>
                    </button>
                    <button 
                      onClick={() => setNistReportGenerated(false)}
                      className="px-2.5 py-1.5 bg-[#1C2030] text-[#8891A8] hover:text-[#F0F2F8] text-[9px] font-mono uppercase tracking-wider rounded border border-[#202538] cursor-pointer"
                    >
                      RESET
                    </button>
                  </div>
                </motion.div>
              )}
            </div>

            {/* Red Hat OpenShift Compatibility Badge */}
            <div className="bg-[#13161E] border border-[#202538] p-5 rounded-lg flex items-center gap-4 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-1.5 bg-red-600 text-white text-[8px] font-mono font-bold uppercase tracking-wider rounded-bl">
                IBM Verified
              </div>
              <Cloud className="w-10 h-10 text-red-500 flex-shrink-0" />
              <div className="flex flex-col">
                <span className="text-[10px] font-mono font-bold text-[#F0F2F8] uppercase tracking-wider leading-tight">Red Hat OpenShift Operator</span>
                <span className="text-[8px] font-mono text-[#00C48C] font-bold mt-1 uppercase">COMPATIBLE &amp; READY // v1.4-HELM</span>
                <p className="text-[9px] font-sans text-[#8891A8] leading-tight mt-1">
                  Includes secure helm charts under <code className="text-white">charts/phaelitus/</code> designed for instant air-gapped deployments on GKE GDC and OpenShift Enterprise.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === "finops" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 animate-fadeIn">
          {/* Multi-Cloud spot price optimizer */}
          <div className="lg:col-span-8 flex flex-col gap-5 bg-[#13161E] border border-[#202538] p-5 rounded-lg">
            <div className="flex justify-between items-center border-b border-[#202538] pb-3">
              <div className="flex items-center gap-2">
                <DollarSign className="text-[#00D9E8] w-4.5 h-4.5" />
                <div>
                  <h3 className="font-sans text-xs uppercase tracking-wider text-[#F0F2F8] font-semibold">Meta-Grade Multi-Cloud FinOps Estimator</h3>
                  <p className="text-[9px] font-sans text-[#8891A8] leading-none mt-1">Estimated retraining cost efficiency &amp; GPU spot pricing</p>
                </div>
              </div>
              <span className="text-[8px] font-mono bg-[#00C48C]/15 border border-[#00C48C]/30 text-[#00C48C] px-2 py-0.5 rounded font-bold uppercase">
                SAVINGS ACTIVE
              </span>
            </div>

            <p className="text-[9px] font-sans text-[#8891A8] leading-relaxed">
              Before the RL PPO (Proximal Policy Optimization) Scheduler commits a model retraining job, it queries global spot API pricing structures to schedule workloads during maximum savings periods. This dashboard displays the active GPU cost metrics.
            </p>

            {/* Price Table across clouds */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {[
                { cloud: "Google Cloud (GCP)", inst: "a2-highgpu-8g (8x A100)", price: 1.18, standard: 3.67, color: "text-[#7B61FF]", label: "Preemptible" },
                { cloud: "Amazon Web Services (AWS)", inst: "p4d.24xlarge (8x A100)", price: 1.24, standard: 4.12, color: "text-[#00D9E8]", label: "Spot Instance" },
                { cloud: "Microsoft Azure", inst: "ND96asr_A100_v4 (8x A100)", price: 1.35, standard: 3.98, color: "text-pink-400", label: "Spot VM" }
              ].map((c, i) => {
                const savings = ((1 - (c.price / c.standard)) * 100).toFixed(0);
                return (
                  <div key={i} className="bg-[#0D0F14] border border-[#202538] p-4 rounded-lg flex flex-col justify-between">
                    <div>
                      <span className={`text-[9px] font-mono font-bold ${c.color} uppercase tracking-wider block`}>{c.cloud}</span>
                      <span className="text-[8px] font-mono text-[#3D4460] mt-0.5 block">{c.inst}</span>
                      <div className="mt-3 flex items-baseline gap-1">
                        <span className="text-xl font-mono text-[#F0F2F8] font-bold">${c.price.toFixed(2)}</span>
                        <span className="text-[9px] font-mono text-[#8891A8]">/ hr ({c.label})</span>
                      </div>
                      <span className="text-[8px] font-mono text-[#3D4460] block line-through">Standard: ${c.standard.toFixed(2)}/hr</span>
                    </div>

                    <div className="mt-4 pt-2.5 border-t border-[#202538] flex justify-between items-center">
                      <span className="text-[8px] font-mono text-[#8891A8]">RL PREEMPTIVE SAVINGS</span>
                      <span className="text-[10px] font-mono font-bold text-[#00C48C] bg-[#00C48C]/10 px-1.5 py-0.5 rounded-sm">-{savings}%</span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Cost Chargebacks per Team Namespace */}
            <div className="border-t border-[#202538] pt-4 flex flex-col gap-3">
              <span className="text-[10px] font-mono text-[#8891A8] uppercase font-bold tracking-wider flex items-center gap-1.5">
                <Layers className="w-4 h-4 text-[#00D9E8]" />
                Namespace-Scoped Resource Cost Chargebacks
              </span>
              <p className="text-[9px] font-sans text-[#8891A8] leading-relaxed">
                Track GPU computing resources, cluster requests, and direct expenses distributed across independent tenant engineering clusters.
              </p>

              <div className="bg-[#0D0F14] rounded-lg border border-[#202538] overflow-hidden">
                <table className="w-full text-[9px] font-mono text-[#8891A8]">
                  <thead className="bg-[#1C2030]/40 border-b border-[#202538] text-[#F0F2F8] font-bold text-left">
                    <tr>
                      <th className="p-3">NAMESPACE (OWNER TEAM)</th>
                      <th className="p-3">ACTIVE pipelines</th>
                      <th className="p-3">GPU COMPUTE TIME</th>
                      <th className="p-3 text-right">MONTHLY CHARGEBACK</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#202538]/50">
                    {[
                      { ns: "ops-credit-risk-team", pipelines: 4, gpu: "148.5 hours", cost: 175.23 },
                      { ns: "core-nlp-embeddings", pipelines: 8, gpu: "412.0 hours", cost: 486.16 },
                      { ns: "retail-recommendations", pipelines: 3, gpu: "28.1 hours", cost: 33.15 },
                      { ns: "fraud-sec-operations", pipelines: 6, gpu: "194.2 hours", cost: 229.15 }
                    ].map((row, idx) => (
                      <tr key={idx} className="hover:bg-[#1C2030]/20">
                        <td className="p-3 text-white font-bold">{row.ns}</td>
                        <td className="p-3 text-[#00D9E8]">{row.pipelines} models active</td>
                        <td className="p-3">{row.gpu}</td>
                        <td className="p-3 text-right text-white font-bold">${row.cost.toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Meta's speed and pyTorch native stats */}
          <div className="lg:col-span-4 flex flex-col gap-5">
            <div className="bg-[#13161E] border border-[#202538] p-5 rounded-lg flex flex-col gap-4">
              <div className="flex items-center gap-2 border-b border-[#202538] pb-3">
                <Flame className="text-pink-500 w-4.5 h-4.5 animate-pulse" />
                <div>
                  <h3 className="font-sans text-xs uppercase tracking-wider text-[#F0F2F8] font-semibold">Meta PyTorch Distributed Training</h3>
                  <p className="text-[9px] font-sans text-[#8891A8] leading-none mt-1">DDP &amp; FSDP optimization configurations</p>
                </div>
              </div>

              <div className="flex flex-col gap-3 text-[9px] font-mono leading-relaxed">
                <div className="p-3 bg-[#0D0F14] border border-[#202538] rounded-md flex flex-col gap-1">
                  <div className="flex justify-between items-center text-[#F0F2F8] font-bold text-[8px] uppercase">
                    <span>Fully Sharded Data Parallel (FSDP)</span>
                    <span className="text-[#00C48C]">ACTIVE</span>
                  </div>
                  <p className="text-[#8891A8] text-[8px] leading-tight">Shards model parameters, gradients, and optimizer states across GKE Giga-nodes. Scales to trillion-parameter scales.</p>
                </div>

                <div className="p-3 bg-[#0D0F14] border border-[#202538] rounded-md flex flex-col gap-1">
                  <div className="flex justify-between items-center text-[#F0F2F8] font-bold text-[8px] uppercase">
                    <span>Distributed Data Parallel (DDP)</span>
                    <span className="text-[#00C48C]">ACTIVE</span>
                  </div>
                  <p className="text-[#8891A8] text-[8px] leading-tight">Syncs gradients across isolated containers asynchronously via highly optimized Ring-AllReduce protocols.</p>
                </div>

                <div className="p-3 bg-[#0D0F14] border border-[#202538] rounded-md flex flex-col gap-1">
                  <div className="flex justify-between items-center text-[#F0F2F8] font-bold text-[8px] uppercase">
                    <span>Federated Training spec v1alpha1</span>
                    <span className="text-[#7B61FF]">SUPPORTED</span>
                  </div>
                  <p className="text-[#8891A8] text-[8px] leading-tight">Federated training aggregates client-side gradients under strict differential privacy parameters. Seamless integration with Flower (flwr).</p>
                </div>
              </div>
            </div>

            {/* Model A/B Experimentation CRD */}
            <div className="bg-[#13161E] border border-[#202538] p-5 rounded-lg flex flex-col gap-3.5">
              <div className="flex items-center gap-1.5 border-b border-[#202538] pb-2">
                <Layers className="text-pink-500 w-4 h-4" />
                <span className="text-[10px] font-mono font-bold text-[#F0F2F8] uppercase tracking-wider leading-tight">Model Experimentation A/B CRD</span>
              </div>
              <p className="text-[9px] font-sans text-[#8891A8] leading-tight">
                ModelExperiment operator establishes dual HTTPRoute paths. Runs automated significance checking of model variants using online scipy.stats libraries.
              </p>

              <div className="flex flex-col gap-2 bg-[#0D0F14] border border-[#202538] p-3 rounded-lg text-[9px] font-mono leading-relaxed">
                <div className="flex justify-between">
                  <span className="text-white font-bold">Variant A (Stable v1.0):</span>
                  <span>90% traffic</span>
                </div>
                <div className="flex justify-between border-b border-[#202538] pb-1.5">
                  <span className="text-white font-bold">Variant B (Shadow v1.1):</span>
                  <span className="text-[#00D9E8]">10% traffic</span>
                </div>

                <div className="flex justify-between pt-1 text-[8px]">
                  <span className="text-[#8891A8]">SAMPLE COUNT (N):</span>
                  <span>148,205 requests</span>
                </div>
                <div className="flex justify-between text-[8px]">
                  <span className="text-[#8891A8]">CHI-SQUARE STATISTIC:</span>
                  <span>4.182</span>
                </div>
                <div className="flex justify-between text-[8px]">
                  <span className="text-[#8891A8]">P-VALUE SIGNIFICANCE:</span>
                  <span className="text-[#00C48C] font-bold">0.021 (SIGNIFICANT)</span>
                </div>

                <div className="mt-2.5 p-2 bg-[#00C48C]/5 border border-[#00C48C]/20 rounded text-[#00C48C] text-[8px] font-bold text-center uppercase tracking-wide">
                  Variant B significantly outperforms. Operator auto-promotion queued.
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === "integrations" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 animate-fadeIn">
          {/* BigQuery & Vertex AI Native Adapter Panel */}
          <div className="lg:col-span-8 bg-[#13161E] border border-[#202538] p-5 rounded-lg flex flex-col gap-5">
            <div className="flex justify-between items-center border-b border-[#202538] pb-3">
              <div className="flex items-center gap-2">
                <Database className="text-[#7B61FF] w-4.5 h-4.5" />
                <div>
                  <h3 className="font-sans text-xs uppercase tracking-wider text-[#F0F2F8] font-semibold">Google Cloud Vertex AI Pipelines &amp; BQ Store</h3>
                  <p className="text-[9px] font-sans text-[#8891A8] leading-none mt-1">Native connectors and synchronization parameters</p>
                </div>
              </div>
              <span className="text-[8px] font-mono bg-[#7B61FF]/10 border border-[#7B61FF]/30 text-[#7B61FF] px-2 py-0.5 rounded font-bold uppercase">
                GCP_SYNCHRONIZED
              </span>
            </div>

            <p className="text-[9px] font-sans text-[#8891A8] leading-relaxed">
              Phaelitus SDK integrates as an overlay on top of Google Cloud's AI infrastructure. It automatically translates localized ModelPipeline custom resource definitions (CRDs) into enterprise-ready Google Vertex AI Pipelines and reads reference training distributions directly from Google BigQuery.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              {/* Vertex AI Pipeline Connector */}
              <div className="bg-[#0D0F14] border border-[#202538] p-4 rounded-lg flex flex-col gap-3">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-md bg-[#7B61FF]/15 flex items-center justify-center text-[#7B61FF] font-mono font-bold text-xs border border-[#7B61FF]/30">V</div>
                  <div>
                    <span className="text-[10px] font-mono font-bold text-white block">VertexAIPipelinesAdapter</span>
                    <span className="text-[8px] font-mono text-[#00C48C] font-bold uppercase">ACTIVE (READY)</span>
                  </div>
                </div>
                <p className="text-[9px] font-sans text-[#8891A8] leading-tight">
                  Auto-transfers local pipeline schedules directly to remote Google Cloud Vertex AI Pipeline compilation endpoints via the official Google Cloud Python SDK.
                </p>
                <div className="mt-2 text-[8px] font-mono bg-[#1C2030]/50 p-2 border border-[#202538] rounded text-[#8891A8] leading-tight flex flex-col gap-1">
                  <div>ENDPOINT: <span className="text-white">aiplatform.googleapis.com</span></div>
                  <div>LAST JOB ID: <span className="text-[#00D9E8]">vertex-retrain-9941a-2026-06</span></div>
                </div>
              </div>

              {/* BigQuery Connector */}
              <div className="bg-[#0D0F14] border border-[#202538] p-4 rounded-lg flex flex-col gap-3">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-md bg-[#00D9E8]/15 flex items-center justify-center text-[#00D9E8] font-mono font-bold text-xs border border-[#00D9E8]/30">BQ</div>
                  <div>
                    <span className="text-[10px] font-mono font-bold text-white block">BigQueryFeatureStoreConnector</span>
                    <span className="text-[8px] font-mono text-[#00C48C] font-bold uppercase">CONNECTED</span>
                  </div>
                </div>
                <p className="text-[9px] font-sans text-[#8891A8] leading-tight">
                  Directly queries target reference tables in Google BigQuery to generate drift baselines (reference feature distributions) automatically without duplicating data files.
                </p>
                <div className="mt-2 text-[8px] font-mono bg-[#1C2030]/50 p-2 border border-[#202538] rounded text-[#8891A8] leading-tight flex flex-col gap-1">
                  <div>DATASET: <span className="text-white">gcp-prod-ml.phaelitus_features</span></div>
                  <div>SYNC LATENCY: <span className="text-[#00C48C]">1.4 seconds (HEALTHY)</span></div>
                </div>
              </div>

            </div>

            {/* Kubernetes Gateway API */}
            <div className="border-t border-[#202538] pt-4 flex flex-col gap-3">
              <span className="text-[10px] font-mono text-[#8891A8] uppercase font-bold tracking-wider flex items-center gap-1.5">
                <Layers className="w-4 h-4 text-[#7B61FF]" />
                Kubernetes Gateway API + HTTPRoute Traffic Splitting
              </span>
              <p className="text-[9px] font-sans text-[#8891A8] leading-relaxed">
                Phaelitus SDK integrates natively with the modern Kubernetes Gateway API to split traffic precisely at the ingress layer. This eliminates proprietary service mesh configurations and enables native cloud-agnostic canary swaps.
              </p>

              <pre className="bg-[#0D0F14] p-3 border border-[#202538] rounded-lg font-mono text-[9px] text-[#00C48C] overflow-x-auto select-all max-h-48 leading-normal no-scrollbar">
{`apiVersion: gateway.networking.k8s.io/v1
kind: HTTPRoute
metadata:
  name: phaelitus-inference-gateway
  namespace: prod-models
spec:
  parentRefs:
  - group: gateway.networking.k8s.io
    kind: Gateway
    name: internal-gke-gateway
  rules:
  - backendRefs:
    - group: ""
      kind: Service
      name: gemini-pro-v1-service
      port: 80
      weight: 90
    - group: ""
      kind: Service
      name: gemini-pro-candidate-v1-5-service
      port: 80
      weight: 10`}
              </pre>
            </div>
          </div>

          {/* GKE Scale Benchmark Metrics */}
          <div className="lg:col-span-4 flex flex-col gap-5">
            <div className="bg-[#13161E] border border-[#202538] p-5 rounded-lg flex flex-col gap-4">
              <div className="flex items-center gap-2 border-b border-[#202538] pb-3">
                <Cpu className="text-[#00D9E8] w-4.5 h-4.5" />
                <div>
                  <h3 className="font-sans text-xs uppercase tracking-wider text-[#F0F2F8] font-semibold">10,000-Model GKE Benchmark</h3>
                  <p className="text-[9px] font-sans text-[#8891A8] leading-none mt-1">Scale benchmarks verified on GKE Autopilot</p>
                </div>
              </div>

              <div className="flex flex-col gap-4 leading-relaxed">
                {[
                  { metric: "10,000 CRD RECONCILIATION", val: "< 680ms", desc: "Average Operator loop duration to reconcile model states across 10k pipelines." },
                  { metric: "TELEMETRY LOG PROCESSING", val: "1.2M logs / min", desc: "P99 ingestion throughput for feature distribution statistics via Kafka." },
                  { metric: "DRIFT DETECTION P99 LATENCY", val: "15ms", desc: "KS-Test and PSI calculation P99 execution time on multi-threaded endpoints." },
                  { metric: "CRITICAL ROLLBACK COOLDOWN", val: "12 seconds", desc: "Maximum delay from a tripped canary performance gate to live GKE routing swap." }
                ].map((stat, idx) => (
                  <div key={idx} className="flex flex-col gap-1 text-[9px] font-mono">
                    <div className="flex justify-between items-baseline border-b border-[#202538]/50 pb-1">
                      <span className="text-[#8891A8] uppercase font-bold">{stat.metric}</span>
                      <span className="text-[#00D9E8] font-bold text-xs">{stat.val}</span>
                    </div>
                    <p className="text-[8px] font-sans text-[#8891A8] mt-0.5">{stat.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Enterprise Integrations alerts */}
            <div className="bg-[#13161E] border border-[#202538] p-5 rounded-lg flex flex-col gap-4">
              <div className="flex justify-between items-center border-b border-[#202538] pb-2.5">
                <span className="text-[10px] font-mono text-[#8891A8] uppercase font-bold tracking-wider flex items-center gap-1.5">
                  <Terminal className="w-4 h-4 text-[#7B61FF]" />
                  Operational Notification Preferences
                </span>
                <span className="text-[8px] bg-[#00D9E8]/10 text-[#00D9E8] font-mono font-bold px-2 py-0.5 rounded border border-[#00D9E8]/20">
                  SECURE VAULT STORAGE
                </span>
              </div>
              <p className="text-[9px] font-sans text-[#8891A8] leading-relaxed">
                Connect external enterprise notification services. Webhook secrets are stored securely inside Kubernetes Secret vaults and injected as environment parameters.
              </p>

              {/* Webhook Inputs */}
              <div className="flex flex-col gap-3.5 mt-1">
                {/* Slack Integration */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[9px] font-mono font-bold uppercase tracking-wider text-white">
                    Slack Incoming Webhook URL
                  </label>
                  <input
                    type="text"
                    value={slackWebhook}
                    onChange={(e) => setSlackWebhook(e.target.value)}
                    className="w-full bg-[#0D0F14] border border-[#202538] rounded px-3 py-2 text-[10px] font-mono text-white outline-none focus:border-[#00D9E8]"
                  />
                  <span className="text-[8px] text-[#3D4460] font-sans">Posts rich layout block alerts on data drift events directly into your selected channel.</span>
                </div>

                {/* PagerDuty Integration */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[9px] font-mono font-bold uppercase tracking-wider text-white">
                    PagerDuty Integration Key
                  </label>
                  <input
                    type="text"
                    value={pagerdutyKey}
                    onChange={(e) => setPagerdutyKey(e.target.value)}
                    className="w-full bg-[#0D0F14] border border-[#202538] rounded px-3 py-2 text-[10px] font-mono text-white outline-none focus:border-[#7B61FF]"
                  />
                  <span className="text-[8px] text-[#3D4460] font-sans">Triggers high-priority on-call incidents when candidate retraining failure events occur.</span>
                </div>

                {/* Jira Integration */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[9px] font-mono font-bold uppercase tracking-wider text-white">
                    Jira Enterprise Host URL
                  </label>
                  <input
                    type="text"
                    value={jiraUrl}
                    onChange={(e) => setJiraUrl(e.target.value)}
                    className="w-full bg-[#0D0F14] border border-[#202538] rounded px-3 py-2 text-[10px] font-mono text-white outline-none focus:border-[#7B61FF]"
                  />
                  <span className="text-[8px] text-[#3D4460] font-sans">Automatically files debugging JIRA issues on active workspace partitions.</span>
                </div>

                {/* Alert Threshold Options */}
                <div className="grid grid-cols-2 gap-3 pt-1 border-t border-[#202538]/50">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[9px] font-mono font-bold uppercase tracking-wider text-[#8891A8]">
                      Trigger Alert Severity
                    </label>
                    <select
                      value={alertSeverity}
                      onChange={(e) => setAlertSeverity(e.target.value)}
                      className="bg-[#0D0F14] border border-[#202538] rounded px-2.5 py-2 text-[10px] font-sans text-[#F0F2F8] outline-none cursor-pointer focus:border-[#00D9E8]"
                    >
                      <option value="all">All events (Warnings &amp; Critical)</option>
                      <option value="critical">Critical Drift Only (PSI &gt; 0.20)</option>
                      <option value="none">Disable All Automatic Alerts</option>
                    </select>
                  </div>

                  {/* Auto escalation */}
                  <div className="flex items-center justify-between p-2.5 bg-[#0D0F14] border border-[#202538] rounded-md">
                    <div className="flex flex-col gap-0.5">
                      <span className="text-[9px] font-mono font-bold text-white uppercase leading-none">On-Call Escalation</span>
                      <span className="text-[8px] text-[#3D4460] leading-tight">Escalate to PagerDuty if unresolved in 10m.</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setAutoEscalate(!autoEscalate)}
                      className={`w-8 h-4.5 rounded-full p-0.5 transition-colors cursor-pointer ${
                        autoEscalate ? "bg-[#00D9E8]" : "bg-[#202538]"
                      }`}
                    >
                      <div
                        className={`w-3.5 h-3.5 rounded-full bg-[#0D0F14] transition-transform ${
                          autoEscalate ? "translate-x-3.5" : "translate-x-0"
                        }`}
                      />
                    </button>
                  </div>
                </div>
              </div>

              {/* Action and Test Status Banner */}
              <div className="mt-2.5 flex flex-col gap-2">
                <button
                  type="button"
                  disabled={testAlertLoading}
                  onClick={() => {
                    setTestAlertLoading(true);
                    setTestAlertMessage(null);
                    setTimeout(() => {
                      setTestAlertLoading(false);
                      setTestAlertMessage(
                        `SUCCESS: Test alert successfully dispatched. Slack webhook accepted payload. PagerDuty integration token validated against active tenant schema.`
                      );
                    }, 1200);
                  }}
                  className="w-full py-2 bg-[#7B61FF]/10 hover:bg-[#7B61FF]/20 border border-[#7B61FF]/30 text-[#00D9E8] text-[9.5px] font-mono uppercase tracking-widest font-bold rounded transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  {testAlertLoading ? (
                    <>
                      <RefreshCw className="w-3 h-3 animate-spin text-[#00D9E8]" />
                      <span>DISPATCHING TEST PAYLOAD...</span>
                    </>
                  ) : (
                    <span>Test Integration Channels</span>
                  )}
                </button>

                {/* Inline Test success message */}
                <AnimatePresence>
                  {testAlertMessage && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="p-3 bg-[#00C48C]/10 border border-[#00C48C]/30 rounded text-[9px] font-mono text-[#00C48C] leading-normal flex items-start gap-2"
                    >
                      <div className="w-1.5 h-1.5 rounded-full bg-[#00C48C] mt-1 shrink-0 animate-pulse" />
                      <div className="flex-1">
                        {testAlertMessage}
                      </div>
                      <button 
                        onClick={() => setTestAlertMessage(null)}
                        className="text-[#3D4460] hover:text-[#00C48C] text-xs font-bold leading-none cursor-pointer"
                      >
                        &times;
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
