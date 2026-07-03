import React, { useState } from "react";
import { BookOpen, Terminal, Code, Cpu, HelpCircle, Check, ChevronRight, Play, FileText, ShieldAlert, RefreshCw } from "lucide-react";

interface ApiEndpoint {
  method: "GET" | "POST";
  path: string;
  description: string;
  params: { name: string; type: string; required: boolean; defaultVal: string; desc: string }[];
  sampleResponse: Record<string, any>;
}

const API_ENDPOINTS: ApiEndpoint[] = [
  {
    method: "GET",
    path: "/api/drift/incidents",
    description: "Fetch active data drift and performance incidents across GKE clusters.",
    params: [
      { name: "severity", type: "string", required: false, defaultVal: "all", desc: "Filter by severity ('critical', 'warning')" },
      { name: "limit", type: "number", required: false, defaultVal: "10", desc: "Maximum records to return" }
    ],
    sampleResponse: {
      status: "success",
      count: 3,
      incidents: [
        {
          id: "drift-9fa28c",
          model: "credit-scoring-model",
          metric: "Population Stability Index",
          value: 0.28,
          threshold: 0.20,
          severity: "critical",
          feature: "user_intent_embedding",
          status: "active",
          timestamp: "2026-07-01T14:22:15Z"
        },
        {
          id: "drift-11ab83",
          model: "ibm-granite-3.0-instruct",
          metric: "P99 Inference Latency",
          value: 85,
          threshold: 50,
          severity: "warning",
          feature: "token_generation_rate",
          status: "active",
          timestamp: "2026-07-01T14:15:02Z"
        }
      ]
    }
  },
  {
    method: "POST",
    path: "/api/drift/mitigate",
    description: "Trigger automated fallback routing or retraining jobs for a given incident.",
    params: [
      { name: "id", type: "string", required: true, defaultVal: "", desc: "Unique UUID of the active incident" },
      { name: "action", type: "string", required: false, defaultVal: "auto", desc: "Mitigation type ('rollback', 'retrain')" }
    ],
    sampleResponse: {
      status: "success",
      message: "Automated mitigation process dispatched via Argo Workflows.",
      reconciliationState: {
        jobId: "argo-mitigate-drift-9fa28c",
        canaryRoutingUpdate: "split-90-10-established",
        targetReplicaState: "healthy"
      }
    }
  },
  {
    method: "POST",
    path: "/api/drift/policies",
    description: "Dynamically update statistical drift alert thresholds (PSI & latency thresholds).",
    params: [
      { name: "psiThreshold", type: "number", required: true, defaultVal: "0.20", desc: "Population Stability Index cutoff boundary" },
      { name: "canaryLatency", type: "number", required: true, defaultVal: "50", desc: "P99 Latency limit in milliseconds" },
      { name: "autoMitigate", type: "boolean", required: false, defaultVal: "true", desc: "Toggle zero-touch Kubernetes rollbacks" }
    ],
    sampleResponse: {
      status: "success",
      updatedPolicies: {
        psiThreshold: 0.20,
        canaryLatency: 50,
        autoMitigate: true,
        synchronizedNodesCount: 14
      }
    }
  }
];

export default function DocumentationHub() {
  const [activeTab, setActiveTab] = useState<"quickstart" | "api" | "crd" | "dx" | "compliance" | "changelog">("quickstart");
  const [selectedApi, setSelectedApi] = useState<number>(0);
  const [apiParams, setApiParams] = useState<Record<string, string>>({});
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [playResult, setPlayResult] = useState<string | null>(null);

  // Interactive Walkthrough Simulator States
  const [demoPlaying, setDemoPlaying] = useState<boolean>(false);
  const [demoStep, setDemoStep] = useState<number>(1);
  const [demoPsi, setDemoPsi] = useState<number>(0.14);
  const [demoTraffic, setDemoTraffic] = useState<number>(100);
  const [demoLogs, setDemoLogs] = useState<string[]>([]);

  const startInteractiveDemo = () => {
    if (demoPlaying) return;
    setDemoPlaying(true);
    setDemoStep(1);
    setDemoPsi(0.14);
    setDemoTraffic(100);
    setDemoLogs(["[INFO] Initializing evaluation loop on 'credit-scoring-model'..."]);

    // Step 1 -> 2 (Drift Detected)
    setTimeout(() => {
      setDemoStep(2);
      setDemoPsi(0.28);
      setDemoLogs(prev => [
        ...prev,
        "[MONITOR] Covariate shift detected in 'user_intent_embedding' (PSI = 0.28 > Threshold 0.20)",
        "[NOTIFY] Fired high-severity Slack webhook and routed incident payload to PagerDuty."
      ]);
    }, 2000);

    // Step 2 -> 3 (Retraining Active)
    setTimeout(() => {
      setDemoStep(3);
      setDemoLogs(prev => [
        ...prev,
        "[RECONCILE] Autonomic scheduler reconciling state. Dispatching retraining workflow...",
        "[ARGO] Spinning up spot G2 instance pods. Pulling baseline demographics reference data."
      ]);
    }, 4500);

    // Step 3 -> 4 (Canary Route)
    setTimeout(() => {
      setDemoStep(4);
      setDemoTraffic(90);
      setDemoLogs(prev => [
        ...prev,
        "[CANARY] Spot container compiled. Initiating 90/10 active canary traffic allocation.",
        "[ROUTER] Verified P99 latency bounds = 14.2ms. Promoting canary split: 10% -> 100%."
      ]);
    }, 7000);

    // Step 4 -> 5 (Audit Trail)
    setTimeout(() => {
      setDemoStep(5);
      setDemoTraffic(100);
      setDemoLogs(prev => [
        ...prev,
        "[COSIGN] Cryptographically verified model weights hash signature.",
        "[AUDIT] Logging transaction audit ledger (aud-9a18cf) to PostgreSQL. Cluster safe."
      ]);
    }, 9500);

    // End Demo
    setTimeout(() => {
      setDemoPlaying(false);
    }, 12000);
  };

  const handlePlayApi = (endpoint: ApiEndpoint) => {
    setIsPlaying(true);
    setTimeout(() => {
      setIsPlaying(false);
      // Simulate parameterized values
      const customResponse = { ...endpoint.sampleResponse };
      if (endpoint.path.includes("policies") && apiParams["psiThreshold"]) {
        customResponse.updatedPolicies = {
          ...customResponse.updatedPolicies,
          psiThreshold: parseFloat(apiParams["psiThreshold"]) || 0.20,
          autoMitigate: apiParams["autoMitigate"] === "false" ? false : true
        };
      }
      setPlayResult(JSON.stringify(customResponse, null, 2));
    }, 600);
  };

  return (
    <div className="flex flex-col gap-6">
      
      {/* Title Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between border-b border-[#202538] pb-4 gap-4">
        <div>
          <h2 className="font-serif text-lg font-bold text-white tracking-wide">Enterprise Resource &amp; Developer Hub</h2>
          <p className="text-[10px] font-sans text-[#8891A8] mt-1">
            Access declarative Kubernetes specs, interactive REST API testing sandboxes, and production release notes.
          </p>
        </div>
        
        {/* Sub-tab selection */}
        <div className="flex bg-[#0D0F14] border border-[#202538] p-1 rounded-lg gap-1 flex-wrap">
          {[
            { id: "quickstart", label: "Quickstart Guide", icon: BookOpen },
            { id: "api", label: "Interactive API", icon: Code },
            { id: "crd", label: "K8s CRD", icon: Terminal },
            { id: "dx", label: "DX Tools", icon: Cpu },
            { id: "compliance", label: "Compliance & SLA", icon: ShieldAlert },
            { id: "changelog", label: "Public Changelog", icon: FileText }
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded text-[10px] font-mono uppercase tracking-wider font-bold transition-all cursor-pointer ${
                  isActive 
                    ? "bg-[#7B61FF]/10 text-[#00D9E8] border border-[#7B61FF]/30" 
                    : "border border-transparent text-[#8891A8] hover:text-[#F0F2F8]"
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {activeTab === "quickstart" && (
          <>
            {/* Interactive Simulated Video Walkthrough Player */}
            <div className="lg:col-span-12 bg-[#13161E] border border-[#202538] p-5 rounded-lg flex flex-col gap-4">
              <div className="flex justify-between items-center border-b border-[#202538] pb-3">
                <div className="flex items-center gap-2">
                  <Play className="text-[#00D9E8] w-4.5 h-4.5 animate-pulse" />
                  <span className="text-xs uppercase font-mono font-bold tracking-wider text-white">Continuous Feedback Loop: Live Walkthrough Video Simulator</span>
                </div>
                <span className="text-[8px] font-mono text-[#7B61FF] bg-[#7B61FF]/10 px-2.5 py-1 rounded font-bold uppercase">INTERACTIVE DEMO</span>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-stretch">
                
                {/* Visual Video Screen Area */}
                <div className="md:col-span-7 bg-[#0D0F14] border border-[#202538] rounded-lg p-5 flex flex-col gap-4 min-h-[220px] relative justify-between overflow-hidden">
                  
                  {/* Glowing ambient background filter */}
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-[#7B61FF]/5 rounded-full blur-3xl pointer-events-none" />

                  {/* Dynamic Video Title / State Overlay */}
                  <div className="flex justify-between items-center z-10">
                    <span className="text-[10px] font-mono text-[#8891A8] uppercase tracking-wider">CRD ROUTING RECONCILER</span>
                    <div className="flex items-center gap-1.5">
                      <span className={`w-2 h-2 rounded-full ${demoPlaying ? "bg-[#FF3B5C] animate-pulse" : "bg-[#00C48C]"}`} />
                      <span className="text-[9px] font-mono text-white font-bold">{demoPlaying ? "PLAYING LIVE CYCLE" : "STABLE IDLE"}</span>
                    </div>
                  </div>

                  {/* Active Step Visual Representation */}
                  <div className="flex flex-col gap-2.5 items-center justify-center my-4 z-10">
                    {demoStep === 1 && (
                      <div className="flex flex-col items-center gap-1.5 text-center">
                        <span className="text-[10px] font-mono text-[#8891A8] uppercase">Step 1: Normal Ingestion Stream</span>
                        <span className="text-sm font-sans font-bold text-white">Monitoring 'credit-scoring-model'</span>
                        <div className="flex items-baseline gap-1 mt-1 font-mono text-xs">
                          <span className="text-[#00C48C] font-bold">PSI: {demoPsi}</span>
                          <span className="text-[#8891A8]">(Within limits &lt; 0.20)</span>
                        </div>
                      </div>
                    )}
                    {demoStep === 2 && (
                      <div className="flex flex-col items-center gap-1.5 text-center animate-bounce">
                        <span className="text-[10px] font-mono text-[#FF3B5C] uppercase font-bold">&bull; Step 2: Statistical Drift Detected!</span>
                        <span className="text-sm font-sans font-bold text-[#FF3B5C]">PSI boundary limit crossed!</span>
                        <div className="flex items-baseline gap-1 mt-1 font-mono text-xs text-white">
                          <span className="text-[#FF3B5C] font-bold">PSI: {demoPsi}</span>
                          <span className="text-[#8891A8]">(CRITICAL SHIFT)</span>
                        </div>
                      </div>
                    )}
                    {demoStep === 3 && (
                      <div className="flex flex-col items-center gap-1.5 text-center">
                        <span className="text-[10px] font-mono text-[#7B61FF] uppercase font-bold">Step 3: Argo Worker Dispatched</span>
                        <span className="text-sm font-sans font-bold text-white">Provisioning Spot GPU instances</span>
                        <div className="p-1 px-2.5 bg-[#7B61FF]/10 text-[#7B61FF] font-mono text-[9px] rounded-full border border-[#7B61FF]/30 mt-1 animate-pulse">
                          COMPILE_RETRAIN_CRD_JOB_9FA28C
                        </div>
                      </div>
                    )}
                    {demoStep === 4 && (
                      <div className="flex flex-col items-center gap-1.5 text-center">
                        <span className="text-[10px] font-mono text-[#00D9E8] uppercase font-bold">Step 4: Canary Split Promoted</span>
                        <span className="text-sm font-sans font-bold text-white">Allocating model weights</span>
                        <div className="flex items-center gap-3 w-40 h-2 bg-[#1C2030] rounded-full mt-2 border border-[#202538] overflow-hidden">
                          <div className="h-full bg-[#00C48C]" style={{ width: `${demoTraffic}%` }} />
                          <div className="h-full bg-[#00D9E8]" style={{ width: `${100 - demoTraffic}%` }} />
                        </div>
                        <span className="text-[9px] font-mono text-[#8891A8] mt-1">Stable Split: {demoTraffic}% | Candidate: {100 - demoTraffic}%</span>
                      </div>
                    )}
                    {demoStep === 5 && (
                      <div className="flex flex-col items-center gap-1.5 text-center">
                        <span className="text-[10px] font-mono text-[#00C48C] uppercase font-bold">Step 5: Cryptographic Ledger Secure</span>
                        <span className="text-sm font-sans font-bold text-white">Audit trail written to Cloud SQL</span>
                        <span className="text-[9px] font-mono text-[#00C48C] bg-[#00C48C]/5 px-2.5 py-1 border border-[#00C48C] rounded mt-2 uppercase">
                          LEDGER_TX_SUCCESS (SHA-256)
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Playback Controls & Progress Bar */}
                  <div className="flex items-center gap-3 w-full border-t border-[#202538]/40 pt-3 z-10">
                    <button
                      onClick={startInteractiveDemo}
                      disabled={demoPlaying}
                      className="p-1 px-3 bg-[#7B61FF] hover:bg-[#7B61FF]/90 text-white font-mono text-[9px] uppercase font-bold rounded cursor-pointer disabled:opacity-50"
                    >
                      {demoPlaying ? "RUNNING..." : "PLAY WALKTHROUGH"}
                    </button>
                    <div className="flex-1 h-1.5 bg-[#1C2030] rounded-full overflow-hidden border border-[#202538]">
                      <div 
                        className="h-full bg-[#00D9E8] transition-all duration-300"
                        style={{ width: `${(demoStep / 5) * 100}%` }}
                      />
                    </div>
                    <span className="text-[9px] font-mono text-[#8891A8]">{demoStep}/5 Steps</span>
                  </div>

                </div>

                {/* Console Log Log Output box */}
                <div className="md:col-span-5 bg-[#0D0F14] border border-[#202538] rounded-lg p-4 flex flex-col gap-2 min-h-[220px]">
                  <span className="text-[9px] font-mono text-[#3D4460] uppercase block">LIVE EVENT FEEDBACK OUTPUT</span>
                  <div className="flex-1 font-mono text-[9.5px] text-[#8891A8] leading-relaxed overflow-y-auto flex flex-col gap-1.5 max-h-[170px] no-scrollbar">
                    {demoLogs.length > 0 ? (
                      demoLogs.map((log, index) => (
                        <div key={index} className="border-l border-[#202538] pl-2">
                          <span className={log.includes("[ALERT]") ? "text-[#FF3B5C]" : log.includes("[INFO]") ? "text-[#8891A8]" : "text-[#00C48C]"}>
                            {log}
                          </span>
                        </div>
                      ))
                    ) : (
                      <span className="text-[#3D4460] italic">Press "Play Walkthrough" to view animated step-by-step logs demonstrating the full continuous retraining and canary feedback loop.</span>
                    )}
                  </div>
                </div>

              </div>
            </div>

            {/* Quickstart tutorial */}
            <div className="lg:col-span-8 flex flex-col gap-5 bg-[#13161E] border border-[#202538] p-5 rounded-lg">
              <h3 className="font-serif text-sm font-bold text-white flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-[#00D9E8]" />
                Deploy &amp; Monitor Your First Drift Event in 15 Minutes
              </h3>
              
              <div className="flex flex-col gap-5 text-xs text-[#8891A8] leading-relaxed">
                <div className="flex gap-4">
                  <div className="w-6 h-6 rounded-full bg-[#7B61FF]/20 text-[#00D9E8] flex items-center justify-center font-mono font-bold shrink-0 border border-[#7B61FF]/30">1</div>
                  <div className="flex flex-col gap-1.5">
                    <span className="text-white font-bold font-mono uppercase tracking-wide">Register Your Model Target</span>
                    <p>
                      Declare your production model parameters inside your Kubernetes cluster. Phaelitus SDK reads these models instantly and synchronizes with BigQuery to establish a robust training distribution reference.
                    </p>
                    <pre className="bg-[#0D0F14] p-3 border border-[#202538] rounded font-mono text-[9px] text-[#00C48C] select-all max-w-full overflow-x-auto">
{`$ helm repo add phaelitus https://charts.phaelitus.io
$ helm install phaelitus-operator phaelitus/operator --namespace phaelitus --create-namespace`}
                    </pre>
                  </div>
                </div>

                <div className="flex gap-4 border-t border-[#202538]/50 pt-4">
                  <div className="w-6 h-6 rounded-full bg-[#7B61FF]/20 text-[#00D9E8] flex items-center justify-center font-mono font-bold shrink-0 border border-[#7B61FF]/30">2</div>
                  <div className="flex flex-col gap-1.5">
                    <span className="text-white font-bold font-mono uppercase tracking-wide">Configure Population Stability Index Bounds</span>
                    <p>
                      Set your drift alert boundaries. When covariate shifts occur, the Phaelitus SDK controller flags the statistical anomalies on your Kafka stream immediately.
                    </p>
                    <p>
                      We recommend a baseline <strong className="text-white">PSI = 0.20</strong> for critical model inputs, and <strong className="text-white">0.10</strong> for highly sensitive variables like financial parameters.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4 border-t border-[#202538]/50 pt-4">
                  <div className="w-6 h-6 rounded-full bg-[#7B61FF]/20 text-[#00D9E8] flex items-center justify-center font-mono font-bold shrink-0 border border-[#7B61FF]/30">3</div>
                  <div className="flex flex-col gap-1.5">
                    <span className="text-white font-bold font-mono uppercase tracking-wide">Enable Automated Retraining Workflows</span>
                    <p>
                      Activate zero-touch auto-mitigation. When an alert crosses your PSI boundary, GKE Autopilot triggers an Argo Workflow, spins up spot GPU pods, retrains the candidate model, and establishes a safe canary split.
                    </p>
                    <div className="p-3 bg-[#0D0F14] border border-[#202538] rounded flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-[#00C48C] animate-pulse"></div>
                      <span className="text-[10px] font-mono text-white">READY: Live monitoring active across 3 federated clusters</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Side Tips block */}
            <div className="lg:col-span-4 flex flex-col gap-5">
              <div className="bg-[#13161E] border border-[#202538] p-5 rounded-lg flex flex-col gap-4">
                <span className="text-[10px] font-mono text-white uppercase tracking-wider font-bold">Recommended Resources</span>
                
                <div className="flex flex-col gap-3.5 text-xs">
                  <div className="p-3 bg-[#0D0F14] border border-[#202538] rounded hover:border-[#00D9E8]/30 transition-colors cursor-pointer flex justify-between items-center group">
                    <div>
                      <h4 className="font-sans font-bold text-white">NIST AI RMF Playbook</h4>
                      <p className="text-[10px] text-[#8891A8] mt-1">Mapping and measuring LLM risk profiles</p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-[#7B61FF] group-hover:translate-x-1 transition-transform" />
                  </div>

                  <div className="p-3 bg-[#0D0F14] border border-[#202538] rounded hover:border-[#00D9E8]/30 transition-colors cursor-pointer flex justify-between items-center group">
                    <div>
                      <h4 className="font-sans font-bold text-white">EU AI Act compliance deck</h4>
                      <p className="text-[10px] text-[#8891A8] mt-1">Fulfilling Article 10 guidelines on drift</p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-[#7B61FF] group-hover:translate-x-1 transition-transform" />
                  </div>

                  <div className="p-3 bg-[#0D0F14] border border-[#202538] rounded hover:border-[#00D9E8]/30 transition-colors cursor-pointer flex justify-between items-center group">
                    <div>
                      <h4 className="font-sans font-bold text-white">IBM AIF360 Toolkit integrations</h4>
                      <p className="text-[10px] text-[#8891A8] mt-1">Calculating Demographic Parity metrics</p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-[#7B61FF] group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        {activeTab === "api" && (
          <>
            {/* Interactive API selection */}
            <div className="lg:col-span-4 flex flex-col gap-2.5">
              <span className="text-[10px] font-mono text-[#8891A8] uppercase tracking-wider px-1 block">API Endpoints</span>
              {API_ENDPOINTS.map((ep, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setSelectedApi(idx);
                    setPlayResult(null);
                    setApiParams({});
                  }}
                  className={`p-3 rounded-lg border text-left flex flex-col gap-1.5 transition-all cursor-pointer ${
                    selectedApi === idx
                      ? "bg-[#1C2030] border-[#00D9E8] shadow-lg shadow-[#00D9E8]/5"
                      : "bg-[#13161E] border-[#202538] hover:border-[#2A2F45]"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className={`text-[8px] font-mono px-1.5 py-0.5 rounded font-bold ${
                      ep.method === "GET" ? "bg-[#00C48C]/15 text-[#00C48C]" : "bg-[#7B61FF]/15 text-[#7B61FF]"
                    }`}>
                      {ep.method}
                    </span>
                    <span className="text-[11px] font-mono font-bold text-white">{ep.path}</span>
                  </div>
                  <p className="text-[9px] font-sans text-[#8891A8] leading-tight">{ep.description}</p>
                </button>
              ))}
            </div>

            {/* API interactive sandbox testing area */}
            <div className="lg:col-span-8 flex flex-col gap-4 bg-[#13161E] border border-[#202538] p-5 rounded-lg">
              <div className="flex justify-between items-center border-b border-[#202538] pb-3">
                <div className="flex items-center gap-2">
                  <Code className="text-[#00D9E8] w-4.5 h-4.5" />
                  <span className="text-xs uppercase font-mono font-bold tracking-wider text-white">Live Request Playground</span>
                </div>
                <span className="text-[8px] font-mono text-[#3D4460]">HTTPS SECURE REST CLIENT</span>
              </div>

              {/* Endpoint description */}
              <div className="p-3 bg-[#0D0F14] border border-[#202538] rounded flex flex-col gap-1.5 font-mono text-[10px] text-[#8891A8]">
                <div>PATH: <span className="text-white font-bold">{API_ENDPOINTS[selectedApi].path}</span></div>
                <div>DESCRIPTION: <span>{API_ENDPOINTS[selectedApi].description}</span></div>
              </div>

              {/* Editable Query parameters */}
              <div className="flex flex-col gap-3">
                <span className="text-[9px] uppercase font-mono font-bold text-[#8891A8] tracking-wider">Configure Parameters</span>
                {API_ENDPOINTS[selectedApi].params.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {API_ENDPOINTS[selectedApi].params.map((p, i) => (
                      <div key={i} className="flex flex-col gap-1">
                        <div className="flex justify-between text-[9px] font-mono">
                          <span className="text-[#F0F2F8] font-bold">{p.name} {p.required && <span className="text-[#FF3B5C]">*</span>}</span>
                          <span className="text-[#3D4460]">{p.type}</span>
                        </div>
                        <input
                          type="text"
                          placeholder={p.defaultVal || "Enter value..."}
                          value={apiParams[p.name] || ""}
                          onChange={(e) => setApiParams(prev => ({ ...prev, [p.name]: e.target.value }))}
                          className="bg-[#0D0F14] border border-[#202538] rounded px-2.5 py-1.5 text-[10px] font-sans text-white outline-none focus:border-[#00D9E8]"
                        />
                        <span className="text-[8px] font-sans text-[#3D4460]">{p.desc}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-[9px] font-sans text-[#3D4460]">No query parameters required for this endpoint.</p>
                )}
              </div>

              {/* Play trigger button */}
              <button
                disabled={isPlaying}
                onClick={() => handlePlayApi(API_ENDPOINTS[selectedApi])}
                className="w-full py-2 bg-[#7B61FF] hover:bg-[#7B61FF]/90 border border-transparent text-white font-mono text-[9px] uppercase tracking-widest font-bold rounded transition-colors cursor-pointer flex items-center justify-center gap-1.5"
              >
                {isPlaying ? (
                  <>
                    <RefreshCw className="w-3 h-3 animate-spin text-white" />
                    <span>FETCHING LIVE SECURE K8s ENDPOINT...</span>
                  </>
                ) : (
                  <>
                    <Play className="w-3.5 h-3.5 text-[#00D9E8] fill-current" />
                    <span>Dispatch API Call</span>
                  </>
                )}
              </button>

              {/* Play Result */}
              {playResult && (
                <div className="flex flex-col gap-1.5">
                  <span className="text-[9px] uppercase font-mono font-bold text-[#8891A8] tracking-wider">Response Payload (200 OK)</span>
                  <pre className="bg-[#0D0F14] p-3 border border-[#202538] rounded-lg font-mono text-[9px] text-[#00C48C] overflow-x-auto select-all max-h-56 leading-normal no-scrollbar">
                    {playResult}
                  </pre>
                </div>
              )}
            </div>
          </>
        )}

        {activeTab === "crd" && (
          <div className="lg:col-span-12 flex flex-col gap-5 bg-[#13161E] border border-[#202538] p-5 rounded-lg">
            <div className="flex justify-between items-center border-b border-[#202538] pb-3">
              <div className="flex items-center gap-2">
                <Terminal className="text-[#00D9E8] w-4.5 h-4.5" />
                <span className="text-xs uppercase font-mono font-bold tracking-wider text-white">Kubernetes CRD: ModelPipeline (v1alpha1)</span>
              </div>
              <span className="text-[9px] font-mono text-[#00C48C] bg-[#00C48C]/10 px-2 py-0.5 rounded font-bold">VALIDATED</span>
            </div>

            <p className="text-xs text-[#8891A8] leading-relaxed">
              Phaelitus SDK acts as a native Kubernetes Controller. By submitting this custom resource, GKE immediately begins polling BigQuery, compiling drift statistics, and establishing automatic traffic allocation rules.
            </p>

            <pre className="bg-[#0D0F14] p-4.5 border border-[#202538] rounded-lg font-mono text-[10px] text-[#00C48C] overflow-x-auto select-all max-h-[420px] leading-relaxed no-scrollbar">
{`apiVersion: governance.phaelitus.io/v1alpha1
kind: ModelPipeline
metadata:
  name: credit-scoring-pipeline
  namespace: prod-models
spec:
  # Association with Cloud storage/BigQuery baseline dataset
  baseline:
    dataset: gcp-prod-ml.phaelitus_features
    referenceTable: baseline_demographics_v1
    syncInterval: 12h
  
  # Target live endpoint configuration
  inferenceTarget:
    modelType: LLM
    serviceName: credit-scoring-model
    port: 80
  
  # Core Drift thresholds and statistical testing
  driftEngine:
    statisticalTest: PopulationStabilityIndex
    alertThreshold: 0.20
    testWindow: 24h
    continuousMonitor: true
  
  # Automated Mitigation & zero-downtime routing parameters
  mitigationPolicy:
    autoMitigate: true
    remediationWorkflow: ArgoWorkflowDeployCanary
    safetyLatencies:
      canaryP99LimitMs: 50
      cooldownPeriodSeconds: 300
    trafficSplits:
      primaryWeight: 90
      candidateWeight: 10
  
  # Operational notification targets
  notifications:
    slackWebhookRef: k8s-secret-slack-alerts
    pagerdutyKeyRef: k8s-secret-pagerduty-ops`}
            </pre>
          </div>
        )}

        {activeTab === "dx" && (
          <div className="lg:col-span-12 flex flex-col gap-5 bg-[#13161E] border border-[#202538] p-5 rounded-lg animate-fade-in">
            <div className="flex justify-between items-center border-b border-[#202538] pb-3">
              <h3 className="font-serif text-sm font-bold text-white flex items-center gap-2">
                <Cpu className="w-4.5 h-4.5 text-[#00D9E8]" />
                Developer Experience &amp; Scaffold Specifications
              </h3>
              <span className="text-[9px] font-mono text-[#00C48C] bg-[#00C48C]/10 px-2 py-0.5 rounded font-bold uppercase">DX PROVISIONAL GATEWAY</span>
            </div>
            
            <p className="text-xs text-[#8891A8] leading-relaxed">
              Equip your local terminal workspaces, git pipelines, and IDEs with native ModelPipeline validation specifications. Use the interactive generators to streamline GitOps compliance checks.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-2">
              
              {/* VS Code Extension */}
              <div className="bg-[#0D0F14] border border-[#202538] p-4.5 rounded-lg flex flex-col gap-3">
                <span className="text-[10px] font-mono text-[#00D9E8] font-bold uppercase tracking-wider">1. VS Code Extension &amp; CRD Autocomplete</span>
                <p className="text-[11px] text-[#8891A8] leading-relaxed">
                  Validate your `modelpipeline.yaml` and `driftalert.yaml` files inside VS Code in real-time. Our custom schema validator checks statistical boundaries, BigQuery paths, and Argo workflows live inside your IDE.
                </p>
                <pre className="bg-[#13161E] p-3 rounded font-mono text-[9px] text-[#00C48C] border border-[#202538]/50 overflow-x-auto">
{`# Install Extension via Command Palette (Cmd+P)
$ ext install phaelitus.phaelitus-crd-validator

# Settings.json mapping configuration
{
  "yaml.schemas": {
    "https://phaelitus.io/schemas/v1alpha1/modelpipeline.json": "modelpipeline.yaml"
  }
}`}
                </pre>
              </div>

              {/* Pre-commit hook */}
              <div className="bg-[#0D0F14] border border-[#202538] p-4.5 rounded-lg flex flex-col gap-3">
                <span className="text-[10px] font-mono text-[#7B61FF] font-bold uppercase tracking-wider">2. Git Pre-Commit Hooks Package</span>
                <p className="text-[11px] text-[#8891A8] leading-relaxed">
                  Inject automated YAML syntax validation checks directly into your Git hooks workflow. Prevent malformed cluster configurations from ever reaching staging branches or GitOps managers.
                </p>
                <pre className="bg-[#13161E] p-3 rounded font-mono text-[9px] text-[#00C48C] border border-[#202538]/50 overflow-x-auto">
{`# Create a .pre-commit-config.yaml in your root
repos:
  - repo: https://github.com/pre-commit/pre-commit-hooks
    rev: v4.6.0
    hooks:
      - id: check-yaml
  - repo: https://github.com/phaelitus/phaelitus-crd-validator
    rev: v1.5.0
    hooks:
      - id: validate-modelpipeline-schema`}
                </pre>
              </div>

            </div>

            {/* CLI scaffold command */}
            <div className="bg-[#0D0F14] border border-[#202538] p-4.5 rounded-lg flex flex-col gap-2">
              <span className="text-[10px] font-mono text-[#00D9E8] font-bold uppercase tracking-wider">3. `phaelitus init` Scaffold Command</span>
              <p className="text-[11px] text-[#8891A8] leading-relaxed">
                Run the scaffold wizard on your local console terminal to generate a starter pipeline template matching your deployment configuration.
              </p>
              <div className="bg-[#13161E] p-3 rounded font-mono text-[9.5px] text-white/90 border border-[#202538]/50">
                <span className="text-[#8891A8]">$ phaelitus init --pipeline credit-scoring-pipeline</span>
                <div className="text-[#00C48C] mt-1">&bull; Template generated matching default BigQuery target. Written to `./modelpipeline.yaml` successfully.</div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "compliance" && (
          <div className="lg:col-span-12 flex flex-col gap-5 bg-[#13161E] border border-[#202538] p-5 rounded-lg animate-fade-in">
            <div className="flex justify-between items-center border-b border-[#202538] pb-3">
              <h3 className="font-serif text-sm font-bold text-white flex items-center gap-2">
                <ShieldAlert className="w-4.5 h-4.5 text-[#00D9E8]" />
                Enterprise Procurement, Security, &amp; Support SLA Compliance
              </h3>
              <span className="text-[9px] font-mono text-[#00C48C] bg-[#00C48C]/10 px-2 py-0.5 rounded font-bold uppercase">COMPLIANCE SIGNALS</span>
            </div>
            
            <p className="text-xs text-[#8891A8] leading-relaxed">
              Phaelitus SDK supports enterprise procurement processes with cryptographically signed software declarations, audited support guarantees, and transparent vulnerability resolution targets.
            </p>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-2">
              
              {/* CycloneDX SBOM */}
              <div className="lg:col-span-8 flex flex-col gap-3 bg-[#0D0F14] border border-[#202538] p-4.5 rounded-lg">
                <div className="flex justify-between items-center border-b border-[#202538]/50 pb-2">
                  <span className="text-[10px] font-mono text-[#00D9E8] font-bold uppercase tracking-wider">CycloneDX Software Bill of Materials (SBOM)</span>
                  <button 
                    onClick={() => alert("Downloading signed CycloneDX SBOM package (phaelitus-sbom-v1.5.0.json)...")} 
                    className="text-[9px] font-mono text-[#00C48C] hover:underline cursor-pointer"
                  >
                    DOWNLOAD SIGNED JSON
                  </button>
                </div>
                <p className="text-[11px] text-[#8891A8] leading-relaxed">
                  Phaelitus SDK publishes a fully cryptographically signed SBOM in CycloneDX JSON format with every production Helm Chart release. This allows secure enterprise buyers to audit downstream dependencies and vulnerability profiles in real-time.
                </p>
                <pre className="bg-[#13161E] p-3 border border-[#202538]/50 rounded text-[9px] font-mono text-[#00C48C] max-h-40 overflow-y-auto no-scrollbar">
{`{
  "bomFormat": "CycloneDX",
  "specVersion": "1.5",
  "serialNumber": "urn:uuid:3e078c12-32a2-4a00-91bc-0a11fcff38ac",
  "version": 1,
  "metadata": {
    "timestamp": "2026-06-15T08:00:00Z",
    "component": {
      "type": "application",
      "name": "phaelitus-operator",
      "version": "1.5.0",
      "hashes": [
        { "alg": "SHA-256", "content": "09a1df288fbc83eed6201a75bfcb972ffccbc1d2f" }
      ]
    }
  }
}`}
                </pre>
              </div>

              {/* Support SLA details */}
              <div className="lg:col-span-4 flex flex-col gap-4 bg-[#0D0F14] border border-[#202538] p-4.5 rounded-lg">
                <span className="text-[10px] font-mono text-[#7B61FF] font-bold uppercase tracking-wider">Platinum Support SLA</span>
                
                <div className="flex flex-col gap-3 text-[11px] text-[#8891A8] leading-relaxed">
                  <div className="border-b border-[#202538]/40 pb-2">
                    <span className="text-[8px] font-mono uppercase text-[#3D4460] block font-bold">Vulnerability Patching</span>
                    <span className="text-white">Critical CVEs resolved and patched within <strong className="text-[#00C48C]">48 Hours</strong>.</span>
                  </div>
                  <div className="border-b border-[#202538]/40 pb-2">
                    <span className="text-[8px] font-mono uppercase text-[#3D4460] block font-bold">Coverage Hours</span>
                    <span className="text-white">24/7/365 Dedicated Enterprise Support with Platinum escalation rails.</span>
                  </div>
                  <div>
                    <span className="text-[8px] font-mono uppercase text-[#3D4460] block font-bold">Response Guarantee</span>
                    <span className="text-white">P1 incidents acknowledged and triage initiated in under <strong className="text-[#00D9E8]">15 Minutes</strong>.</span>
                  </div>
                </div>
              </div>

            </div>
          </div>
        )}

        {activeTab === "changelog" && (
          <div className="lg:col-span-12 flex flex-col gap-5 bg-[#13161E] border border-[#202538] p-5 rounded-lg">
            <h3 className="font-serif text-sm font-bold text-white flex items-center gap-2">
              <FileText className="w-4.5 h-4.5 text-[#00D9E8]" />
              Phaelitus SDK Version History &amp; Public Release Changelog
            </h3>
            
            <div className="flex flex-col gap-6 relative border-l border-[#202538] pl-5.5 ml-3 mt-2">
              
              {/* v1.5.0 */}
              <div className="relative">
                <span className="absolute -left-8.5 top-1.5 w-3 h-3 rounded-full bg-[#00D9E8] border border-[#00D9E8]/30 shadow-[0_0_8px_rgba(0,217,232,0.6)]"></span>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold text-white">v1.5.0</span>
                  <span className="text-[9px] font-mono text-[#00C48C] bg-[#00C48C]/10 border border-[#00C48C]/20 px-2 py-0.5 rounded font-bold uppercase">LATEST RELEASE</span>
                  <span className="text-[9px] font-mono text-[#3D4460]">2026-06-15</span>
                </div>
                <h4 className="font-sans font-bold text-white text-xs mt-1.5">Kubernetes Gateway API Enforcements &amp; Sigstore Cosign Validation</h4>
                <p className="text-[11px] text-[#8891A8] mt-1.5 leading-relaxed">
                  Introduced out-of-the-box support for modern GKE Gateway API controllers, replacing proprietary ingress rules with robust HTTPRoute specifications. Integrated Sigstore Cosign cryptographic audits to verify SHA-256 weight hashes at container runtime before GKE admission.
                </p>
                <ul className="list-disc pl-4 text-[10px] text-[#8891A8] leading-relaxed mt-2.5 flex flex-col gap-1">
                  <li>Support for declarative Kubernetes `HTTPRoute` splitting specs.</li>
                  <li>Sigstore Cosign weight hash authentication block.</li>
                  <li>Argo Workflows zero-touch Canary rollback mechanics.</li>
                </ul>
              </div>

              {/* v1.4.2 */}
              <div className="relative border-t border-[#202538]/50 pt-5">
                <span className="absolute -left-8.5 top-6.5 w-3 h-3 rounded-full bg-[#7B61FF] border border-[#7B61FF]/30"></span>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold text-[#8891A8]">v1.4.2</span>
                  <span className="text-[9px] font-mono text-[#3D4460]">2026-05-10</span>
                </div>
                <h4 className="font-sans font-bold text-white text-xs mt-1.5">Cloud SQL PostgreSQL Synchronizer &amp; Multi-Tenant Workspace Partitions</h4>
                <p className="text-[11px] text-[#8891A8] mt-1.5 leading-relaxed">
                  Added a robust server-side telemetry integration syncing live anomaly and retraining incidents directly with Google Cloud SQL PostgreSQL. Implemented workspace RBAC boundaries, restricting dashboard operator views based on active workspace tokens and partner credentials.
                </p>
                <ul className="list-disc pl-4 text-[10px] text-[#8891A8] leading-relaxed mt-2.5 flex flex-col gap-1">
                  <li>Added full Cloud SQL PostgreSQL incident persistence.</li>
                  <li>Namespace-scoped multi-tenancy auth gates.</li>
                  <li>High-frequency Kafka ingestion queue lag warning state trackers.</li>
                </ul>
              </div>

            </div>
          </div>
        )}

      </div>
    </div>
  );
}
