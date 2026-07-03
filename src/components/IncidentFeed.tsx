import React, { useState } from "react";
import { 
  AlertCircle, 
  AlertTriangle, 
  CheckCircle, 
  BrainCircuit, 
  Activity, 
  RefreshCw, 
  Zap, 
  Server, 
  ChevronRight, 
  X, 
  Play, 
  Clock, 
  Terminal,
  ShieldAlert,
  Sliders,
  CheckCircle2,
  Lock,
  User as UserIcon
} from "lucide-react";
import { Incident } from "../types";
import { motion, AnimatePresence } from "motion/react";
import { User as FirebaseUser } from "firebase/auth";
import { Card, Badge, Button, Tooltip as UITooltip } from "./ui";
import { ANIMATIONS, Typewriter } from "./ui/animations";

interface IncidentFeedProps {
  incidents: Incident[];
  onMitigate: (id: string) => void;
  onSimulate: (model: string, metric: string, severity: "critical" | "warning", feature?: string) => void;
  user?: FirebaseUser | null;
}

export default function IncidentFeed({ incidents, onMitigate, onSimulate, user }: IncidentFeedProps) {
  const [filter, setFilter] = useState<string>("all");
  const [selectedIncident, setSelectedIncident] = useState<Incident | null>(null);
  const [diagnosis, setDiagnosis] = useState<string>("");
  const [diagnosing, setDiagnosing] = useState(false);
  const [diagnosisSource, setDiagnosisSource] = useState("");
  
  // State machine simulation states
  const [stateMachineActive, setStateMachineActive] = useState(false);
  const [stateMachineStep, setStateMachineStep] = useState<string | null>(null);

  // Filtered list
  const filteredIncidents = incidents.filter((inc) => {
    if (filter === "all") return true;
    if (filter === "critical") return inc.severity === "critical";
    if (filter === "warning") return inc.severity === "warning";
    if (filter === "resolved") return inc.severity === "resolved";
    return true;
  });

  const activeDriftCount = incidents.filter((inc) => inc.severity === "critical").length;

  const handleDiagnose = async (inc: Incident) => {
    setDiagnosing(true);
    setDiagnosis("");
    setDiagnosisSource("");
    try {
      let token = "";
      if (user) {
        try {
          if (user.uid === "demo-operator-id") {
            token = "demo-token-phaelitus";
          } else if (typeof user.getIdToken === "function") {
            token = await user.getIdToken();
          } else {
            const { auth } = await import("../lib/firebase");
            if (auth.currentUser && typeof auth.currentUser.getIdToken === "function") {
              token = await auth.currentUser.getIdToken();
            }
          }
        } catch (tokenErr) {
          console.error("Failed to get ID token:", tokenErr);
        }
      }
      const response = await fetch("/api/drift/diagnose", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          ...(token ? { "Authorization": `Bearer ${token}` } : {})
        },
        body: JSON.stringify(inc),
      });
      const data = await response.json();
      if (data.success) {
        setDiagnosis(data.diagnosis);
        setDiagnosisSource(data.source);
      } else if (data.diagnosis) {
        setDiagnosis(data.diagnosis);
        setDiagnosisSource(data.source || "Fallback Engine");
      } else {
        setDiagnosis("Failed to complete LLM analysis.");
      }
    } catch (err: any) {
      setDiagnosis(`Diagnostic engine failure: ${err.message}`);
    } finally {
      setDiagnosing(false);
    }
  };

  const handleMitigateSequence = (inc: Incident) => {
    setStateMachineActive(true);
    const steps = [
      { name: "DriftDetected", duration: 1000 },
      { name: "RetrainingQueued", duration: 1500 },
      { name: "Validating", duration: 1500 },
      { name: "Deploying", duration: 1200 },
      { name: "Monitoring (STABLE)", duration: 800 }
    ];

    let currentTimeout = 0;
    steps.forEach((step, idx) => {
      setTimeout(() => {
        setStateMachineStep(step.name);
        if (idx === steps.length - 1) {
          onMitigate(inc.id);
          setSelectedIncident(prev => prev && prev.id === inc.id ? { ...prev, severity: "resolved", statusText: "STABLE", description: "Mitigated and validated. Model retrained and rolled out successfully." } : prev);
          setTimeout(() => {
            setStateMachineActive(false);
            setStateMachineStep(null);
          }, 1000);
        }
      }, currentTimeout);
      currentTimeout += step.duration;
    });
  };

  return (
    <div className="flex flex-col gap-5">
      
      {/* Simulation Quick Launcher Panel */}
      <Card 
        title="Incident Drills & Training" 
        subtitle="Trigger simulated pipeline drift events"
        statusColor="cyan"
      >
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
          <Button
            onClick={() => onSimulate("google-gemini-pro-1.5", "KL-Divergence", "critical", "prompt_token_entropy")}
            variant="ghost"
            className="justify-center hover:border-[#FF3B5C]/40 hover:bg-[#FF3B5C]/4 text-white/70"
            icon={Activity}
          >
            Gemini Drift
          </Button>
          <Button
            onClick={() => onSimulate("ibm-granite-3.0-instruct", "Schema Integrity", "critical", "sys_intent_id")}
            variant="ghost"
            className="justify-center hover:border-[#FF3B5C]/40 hover:bg-[#FF3B5C]/4 text-white/70"
            icon={AlertTriangle}
          >
            Schema Divergence
          </Button>
          <Button
            onClick={() => onSimulate("meta-llama-3.1-8b", "P99 Latency", "warning", "gpu_coordination_queue")}
            variant="ghost"
            className="justify-center hover:border-indigo-500/40 hover:bg-indigo-500/4 text-white/70"
            icon={Clock}
          >
            Latency Spike
          </Button>
        </div>
      </Card>

      {/* Filter Tabs */}
      <div className="sticky top-14 z-20 py-2 border-b border-white/5 bg-[#080C14]/90 backdrop-blur flex flex-wrap gap-2">
        <Button
          onClick={() => setFilter("all")}
          variant={filter === "all" ? "primary" : "ghost"}
          size="xs"
        >
          ALL CONTEXTS ({incidents.length})
        </Button>
        <Button
          onClick={() => setFilter("critical")}
          variant={filter === "critical" ? "primary" : "ghost"}
          size="xs"
          className={filter !== "critical" ? "text-[#FF3B5C] border-[#FF3B5C]/20 hover:bg-[#FF3B5C]/10" : "bg-[#FF3B5C] hover:bg-[#FF3B5C]/90"}
        >
          CRITICAL ({incidents.filter((i) => i.severity === "critical").length})
        </Button>
        <Button
          onClick={() => setFilter("warning")}
          variant={filter === "warning" ? "primary" : "ghost"}
          size="xs"
          className={filter !== "warning" ? "text-indigo-400 border-indigo-500/20 hover:bg-indigo-500/10" : "bg-indigo-600 hover:bg-indigo-500"}
        >
          WARNINGS ({incidents.filter((i) => i.severity === "warning").length})
        </Button>
        <Button
          onClick={() => setFilter("resolved")}
          variant={filter === "resolved" ? "primary" : "ghost"}
          size="xs"
          className={filter !== "resolved" ? "text-[#00C48C] border-[#00C48C]/20 hover:bg-[#00C48C]/10" : "bg-[#00C48C] hover:bg-[#00C48C]/90"}
        >
          RECONCILED ({incidents.filter((i) => i.severity === "resolved").length})
        </Button>
      </div>

      {/* System Stats Snapshot */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-[#080C14] border border-white/5 p-4 rounded relative overflow-hidden group">
          <div className="absolute top-0 left-0 right-0 h-[1.5px] bg-[#FF3B5C]/60" />
          <div className="flex justify-between items-start">
            <span className="font-mono text-[9px] uppercase tracking-widest text-[#8891A8] font-bold">Active Drift Alerts</span>
            <Badge variant="critical" glow={false}>GKE CLUSTER</Badge>
          </div>
          <div className="font-mono text-[2.25rem] text-white mt-1 font-bold leading-none">
            {String(activeDriftCount).padStart(2, "0")}
          </div>
        </div>
        
        <div className="bg-[#080C14] border border-white/5 p-4 rounded relative overflow-hidden group">
          <div className="absolute top-0 left-0 right-0 h-[1.5px] bg-[#00D9E8]/60" />
          <div className="flex justify-between items-start">
            <span className="font-mono text-[9px] uppercase tracking-widest text-[#8891A8] font-bold">Avg Retrain SLA (MTTR)</span>
            <Badge variant="cyan" glow={false}>WATSONX</Badge>
          </div>
          <div className="font-mono text-[2.25rem] text-white mt-1 font-bold leading-none">14m</div>
        </div>
      </div>

      {/* Reconciliation progress tracking */}
      {stateMachineActive && (
        <div className="bg-[#080C14] border border-white/5 p-4 rounded flex flex-col gap-3">
          <div className="flex items-center gap-2 justify-between">
            <span className="text-[10px] font-mono font-semibold uppercase tracking-wider text-[#00D9E8] flex items-center gap-2">
              <RefreshCw className="w-3.5 h-3.5 animate-spin text-[#00D9E8]" />
              Model Controller Reconciliation Active
            </span>
            <Badge variant="cyan">DEPLOYING</Badge>
          </div>
          {/* Animated Stepper */}
          <div className="grid grid-cols-5 gap-1.5 text-[9px] font-mono text-center">
            <div className={`p-1.5 rounded border ${stateMachineStep === "DriftDetected" ? "bg-[#FF3B5C]/10 text-[#FF3B5C] border-[#FF3B5C]/30" : "bg-[#050810] text-[#8891A8] border-transparent"}`}>
              DRIFT
            </div>
            <div className={`p-1.5 rounded border ${stateMachineStep === "RetrainingQueued" ? "bg-indigo-500/10 text-indigo-400 border-indigo-500/30" : "bg-[#050810] text-[#8891A8] border-transparent"}`}>
              RETRAIN
            </div>
            <div className={`p-1.5 rounded border ${stateMachineStep === "Validating" ? "bg-purple-500/10 text-purple-400 border-purple-500/30" : "bg-[#050810] text-[#8891A8] border-transparent"}`}>
              VALIDATE
            </div>
            <div className={`p-1.5 rounded border ${stateMachineStep === "Deploying" ? "bg-[#00D9E8]/10 text-[#00D9E8] border-[#00D9E8]/30" : "bg-[#050810] text-[#8891A8] border-transparent"}`}>
              DEPLOY
            </div>
            <div className={`p-1.5 rounded border ${stateMachineStep === "Monitoring (STABLE)" ? "bg-[#00C48C]/10 text-[#00C48C] border-[#00C48C]/30" : "bg-[#050810] text-[#8891A8] border-transparent"}`}>
              STABLE
            </div>
          </div>
        </div>
      )}

      {/* List of Incidents */}
      <div className="flex flex-col gap-3">
        <AnimatePresence mode="popLayout">
          {filteredIncidents.length === 0 ? (
            <motion.div
              variants={ANIMATIONS.entrance}
              initial="initial"
              animate="animate"
              exit="exit"
              className="bg-[#080C14] border border-white/5 p-12 rounded text-center"
            >
              <CheckCircle className="w-8 h-8 text-[#00C48C] mx-auto mb-3 animate-bounce" />
              <span className="font-serif text-sm font-bold text-white block">All Pipelines Operational</span>
              <p className="font-mono text-[9px] uppercase tracking-widest text-[#8891A8] mt-2">
                No active divergence anomalies detected.
              </p>
            </motion.div>
          ) : (
            filteredIncidents.map((inc) => {
              const severityColor = 
                inc.severity === "critical" 
                  ? "border-l-[#FF3B5C] bg-[#FF3B5C]/3 hover:border-l-red-500" 
                  : inc.severity === "warning"
                  ? "border-l-indigo-500 bg-indigo-500/3 hover:border-l-indigo-400"
                  : "border-l-[#00C48C] bg-[#00C48C]/3 hover:border-l-[#00C48C]";

              return (
                <motion.div
                  layout
                  variants={ANIMATIONS.entrance}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  key={inc.id}
                  onClick={() => {
                    setSelectedIncident(inc);
                    setDiagnosis("");
                  }}
                  className={`p-4 border border-white/5 border-l-[3px] rounded cursor-pointer transition-all ${severityColor} hover:bg-[#0C1120] hover:border-white/10`}
                >
                  <div className="flex justify-between items-start gap-2 mb-2 flex-wrap">
                    <div className="flex items-center gap-1.5">
                      <span className="font-mono text-[9px] uppercase tracking-wider text-white/50 font-bold">
                        {inc.statusText.toUpperCase()}
                      </span>
                      {inc.severity === "critical" && (
                        <span className="w-1.5 h-1.5 rounded-full bg-[#FF3B5C] animate-ping" />
                      )}
                    </div>
                    <div className="flex items-center gap-2 font-mono text-[9px] text-[#8891A8]">
                      <span>{inc.timestamp}</span>
                      <span className="text-white/20">|</span>
                      <span>{inc.subtext}</span>
                    </div>
                  </div>
                  <div>
                    <span className="font-serif text-sm font-bold text-white group-hover:text-[#00D9E8] transition-colors">
                      {inc.title}
                    </span>
                    <p className="text-[11px] text-[#8891A8] mt-1.5 leading-relaxed">
                      {inc.description}
                    </p>
                  </div>
                </motion.div>
              );
            })
          )}
        </AnimatePresence>
      </div>

      {/* Diagnostics Dialog/Drawer overlay */}
      <AnimatePresence>
        {selectedIncident && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md"
          >
            <motion.div
              variants={ANIMATIONS.entrance}
              initial="initial"
              animate="animate"
              exit="exit"
              className="relative w-full max-w-2xl bg-[#080C14] border border-white/8 rounded shadow-2xl flex flex-col max-h-[85vh] overflow-hidden"
            >
              {/* Header */}
              <div className="flex justify-between items-center p-5 border-b border-white/5 bg-[#050810]">
                <div className="flex items-center gap-3">
                  <BrainCircuit className="w-5 h-5 text-[#00D9E8] animate-pulse" />
                  <div>
                    <h3 className="font-serif text-sm font-bold text-white uppercase tracking-wider">Incident Diagnostics &bull; {selectedIncident.id}</h3>
                    <p className="text-[9px] font-mono uppercase tracking-widest text-white/50 mt-1">MODEL: {selectedIncident.model.toUpperCase()} &bull; STATUS: {selectedIncident.statusText}</p>
                  </div>
                </div>
                <button 
                  onClick={() => setSelectedIncident(null)}
                  className="text-white/50 hover:text-white p-1.5 rounded hover:bg-white/5 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Content Body */}
              <div className="p-5 overflow-y-auto flex flex-col gap-4 scrollbar-thin">
                
                {/* Info parameters */}
                <div className="grid grid-cols-3 gap-3 text-center text-xs font-mono">
                  <div className="p-3 bg-[#050810] border border-white/5 rounded">
                    <span className="text-[8px] text-[#8891A8] block uppercase tracking-wider font-bold">Metric Type</span>
                    <span className="text-white font-bold mt-1 block">{selectedIncident.metric}</span>
                  </div>
                  <div className="p-3 bg-[#050810] border border-white/5 rounded">
                    <span className="text-[8px] text-[#8891A8] block uppercase tracking-wider font-bold">Value / Score</span>
                    <span className="text-[#FF3B5C] font-bold mt-1 block">{selectedIncident.score}</span>
                  </div>
                  <div className="p-3 bg-[#050810] border border-white/5 rounded">
                    <span className="text-[8px] text-[#8891A8] block uppercase tracking-wider font-bold">Feature Key</span>
                    <span className="text-white font-bold mt-1 truncate block">{selectedIncident.feature || "N/A"}</span>
                  </div>
                </div>

                {/* Logs Display */}
                <div className="flex flex-col gap-1.5">
                  <span className="text-[9px] font-mono uppercase tracking-widest text-[#8891A8] font-bold block">Telemetry Logs</span>
                  <pre className="bg-[#050810] p-4 rounded border border-white/5 font-mono text-[10px] text-white/60 max-h-36 overflow-y-auto whitespace-pre-wrap leading-relaxed select-text scrollbar-thin">
                    {selectedIncident.logs}
                  </pre>
                </div>

                {/* Run Diagnostics Buttons */}
                <div className="flex flex-col sm:flex-row gap-2.5">
                  <Button
                    onClick={() => handleDiagnose(selectedIncident)}
                    disabled={diagnosing}
                    className="flex-1 justify-center"
                    icon={BrainCircuit}
                  >
                    {diagnosing ? "Invoking Diagnostics..." : "LLM Diagnostics Report"}
                  </Button>

                  {selectedIncident.severity !== "resolved" && (
                    <Button
                      onClick={() => handleMitigateSequence(selectedIncident)}
                      disabled={stateMachineActive}
                      className="flex-1 justify-center bg-[#00C48C] hover:bg-[#00C48C]/90 text-black border-transparent"
                      icon={RefreshCw}
                    >
                      Reconcile &amp; Mitigate
                    </Button>
                  )}
                </div>

                {/* Gemini AI diagnostic response */}
                <AnimatePresence>
                  {(diagnosing || diagnosis) && (
                    <motion.div
                      variants={ANIMATIONS.entrance}
                      initial="initial"
                      animate="animate"
                      exit="exit"
                      className="bg-[#050810] border border-white/5 p-4 rounded flex flex-col gap-3 relative overflow-hidden"
                    >
                      <div className="flex justify-between items-center border-b border-white/5 pb-2">
                        <span className="text-[9.5px] font-mono uppercase tracking-wider text-[#00D9E8] font-bold flex items-center gap-1.5">
                          <BrainCircuit className="w-4 h-4 text-[#00D9E8]" />
                          LLM INCIDENT REPORT
                        </span>
                        <Badge variant="cyan">
                          {diagnosing ? "GENERATING..." : diagnosisSource}
                        </Badge>
                      </div>

                      {diagnosing ? (
                        <div className="flex items-center gap-2 py-4 justify-center text-xs font-mono text-[#00D9E8] animate-pulse">
                          <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                          <span>Gemini is compiling cluster diagnostics logs...</span>
                        </div>
                      ) : (
                        <div className="text-[11px] font-mono text-white/80 leading-relaxed select-text whitespace-pre-wrap">
                          <Typewriter text={diagnosis} speed={8} />
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Footer */}
              <div className="p-4 border-t border-white/5 bg-[#050810] flex justify-end">
                <Button 
                  onClick={() => setSelectedIncident(null)}
                  variant="ghost"
                  size="xs"
                >
                  Dismiss
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
