import React, { useState } from "react";
import { 
  Cpu, 
  Layers, 
  Server, 
  ShieldCheck, 
  Zap, 
  Sliders, 
  Play, 
  RefreshCw, 
  AlertTriangle, 
  Shield,
  Monitor,
  GitPullRequest,
  CheckCircle2
} from "lucide-react";
import { Card, Badge, Button, Tooltip as UITooltip } from "./ui";
import { motion, AnimatePresence } from "motion/react";
import { ANIMATIONS } from "./ui/animations";

interface DriftDashboardProps {
  psiThreshold?: number;
  canaryLatency?: number;
  autoMitigate?: boolean;
  onUpdatePolicies?: (updates: { psiThreshold?: number; canaryLatency?: number; autoMitigate?: boolean }) => void;
}

export default function DriftDashboard({
  psiThreshold: propPsiThreshold,
  canaryLatency: propCanaryLatency,
  autoMitigate: propAutoMitigate,
  onUpdatePolicies,
}: DriftDashboardProps = {}) {
  const [activeState, setActiveState] = useState<string>("Monitoring");
  const [simulating, setSimulating] = useState(false);
  const [simulationLog, setSimulationLog] = useState<string[]>(() => {
    const pad = (n: number) => String(n).padStart(2, "0");
    const now = new Date();
    const h = now.getHours();
    const m = now.getMinutes();
    
    const t1 = `${pad(h)}:${pad((m - 4 + 60) % 60)}:12`;
    const t2 = `${pad(h)}:${pad((m - 3 + 60) % 60)}:45`;
    const t3 = `${pad(h)}:${pad((m - 2 + 60) % 60)}:18`;
    const t4 = `${pad(h)}:${pad((m - 1 + 60) % 60)}:59`;
    const t5 = `${pad(h)}:${pad(m)}:04`;

    return [
      `[${t5}] [SYSTEM] Operator online. State initialized: Monitoring. Ready for drift detection.`,
      `[${t4}] [SECURITY] CoSign verification of candidate model artifact passed successfully.`,
      `[${t3}] [MONITOR] Continuous telemetry pipeline established for target cluster US-EAST-PROD-01.`,
      `[${t2}] [COMPLIANCE] Automated fairness scan and SHAP maps audited with zero boundary exceptions.`,
      `[${t1}] [OPERATOR] Controller synchronized. Listening to Kubernetes deployment ingress router.`
    ];
  });
  
  // Local fallbacks if props are not passed
  const [localPsiThreshold, setLocalPsiThreshold] = useState<number>(0.20);
  const [localCanaryLatency, setLocalCanaryLatency] = useState<number>(50);
  const [localAutoMitigate, setLocalAutoMitigate] = useState<boolean>(true);

  const psiThreshold = propPsiThreshold !== undefined ? propPsiThreshold : localPsiThreshold;
  const canaryLatency = propCanaryLatency !== undefined ? propCanaryLatency : localCanaryLatency;
  const autoMitigate = propAutoMitigate !== undefined ? propAutoMitigate : localAutoMitigate;

  const setPsiThreshold = (val: number) => {
    if (onUpdatePolicies) {
      onUpdatePolicies({ psiThreshold: val });
    } else {
      setLocalPsiThreshold(val);
    }
  };

  const setCanaryLatency = (val: number) => {
    if (onUpdatePolicies) {
      onUpdatePolicies({ canaryLatency: val });
    } else {
      setLocalCanaryLatency(val);
    }
  };

  const setAutoMitigate = (val: boolean) => {
    if (onUpdatePolicies) {
      onUpdatePolicies({ autoMitigate: val });
    } else {
      setLocalAutoMitigate(val);
    }
  };

  const states = [
    { id: "Pending", label: "Pending", desc: "Pod validation", icon: Shield, activeColor: "text-white/40", glow: "border-white/10" },
    { id: "Monitoring", label: "Monitoring", desc: "Live inference", icon: Monitor, activeColor: "text-[#00D9E8]", glow: "border-[#00D9E8]/30 shadow-[0_0_10px_rgba(0,217,232,0.1)]" },
    { id: "DriftDetected", label: "Drift Detected", desc: "PSI trigger flagged", icon: AlertTriangle, activeColor: "text-[#F5A623]", glow: "border-[#F5A623]/30 shadow-[0_0_10px_rgba(245,166,35,0.1)]" },
    { id: "RetrainingQueued", label: "Retrain Queued", desc: "Spot GPU assigned", icon: RefreshCw, activeColor: "text-indigo-400", glow: "border-indigo-500/30" },
    { id: "Validating", label: "Validating", desc: "Fairness audits", icon: ShieldCheck, activeColor: "text-[#7B61FF]", glow: "border-[#7B61FF]/30" },
    { id: "Deploying", label: "Deploying", desc: "Canary rollout", icon: GitPullRequest, activeColor: "text-[#00C48C]", glow: "border-[#00C48C]/30" }
  ];

  const addLog = (msg: string) => {
    const pad = (n: number) => String(n).padStart(2, "0");
    const now = new Date();
    const ts = `${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;
    setSimulationLog(prev => [`[${ts}] ${msg}`, ...prev]);
  };

  const handleStateSimulation = () => {
    if (simulating) return;
    setSimulating(true);
    addLog("Manual state-machine lifecycle cycle initiated.");

    const steps = [
      { state: "Pending", delay: 800, log: "Re-verifying baseline environment and secrets..." },
      { state: "Monitoring", delay: 1200, log: "Telemetry feed established. Drift score within standard bounds (PSI = 0.04)." },
      { state: "DriftDetected", delay: 2000, log: "ALERT! Feature 'user_intent' PSI exceeded threshold (> 0.20). Emitting drift event." },
      { state: "RetrainingQueued", delay: 1800, log: "Retraining queued. Job coordinated by PPO scheduler during GPU off-peak hours." },
      { state: "Validating", delay: 1800, log: "Candidate model generated. Validating accuracy & auditing Fairness limits." },
      { state: "Deploying", delay: 1500, log: "Initiating canary deployment swap... Route 10% live traffic to candidate." },
      { state: "Monitoring", delay: 1000, log: "Verification complete. Candidate promoted to global production. Stability state: STABLE." }
    ];

    let currentTimeout = 0;
    steps.forEach((step, idx) => {
      currentTimeout += step.delay;
      setTimeout(() => {
        setActiveState(step.state);
        addLog(step.log);
        if (idx === steps.length - 1) {
          setSimulating(false);
          addLog("Drift automation simulation loop completed successfully.");
        }
      }, currentTimeout);
    });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
      
      {/* Policy Tuning Form Card */}
      <div className="lg:col-span-1 flex flex-col gap-5">
        <Card 
          title="Policy Configuration" 
          subtitle="Define automated triggers"
          statusColor="cyan"
        >
          <div className="flex flex-col gap-5">
            
            {/* PSI Slider */}
            <div className="flex flex-col gap-1.5">
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-mono text-white/50 uppercase tracking-widest font-bold">PSI Threshold</span>
                <span className="text-xs font-mono text-[#00D9E8] font-bold">PSI &gt; {psiThreshold.toFixed(2)}</span>
              </div>
              <input 
                type="range" 
                min="0.05" 
                max="0.50" 
                step="0.01" 
                value={psiThreshold}
                onChange={(e) => setPsiThreshold(parseFloat(e.target.value))}
                className="w-full accent-[#00D9E8] h-1.5 bg-[#050810] rounded outline-none cursor-pointer"
              />
              <span className="text-[9px] text-[#8891A8] leading-relaxed">
                Population Stability Index limit. Exceeding this triggers automated retraining logs.
              </span>
            </div>

            {/* Ingestion Latency Slider */}
            <div className="flex flex-col gap-1.5">
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-mono text-white/50 uppercase tracking-widest font-bold">Max Canary SLA</span>
                <span className="text-xs font-mono text-[#7B61FF] font-bold">{canaryLatency} ms</span>
              </div>
              <input 
                type="range" 
                min="10" 
                max="200" 
                step="5" 
                value={canaryLatency}
                onChange={(e) => setCanaryLatency(parseInt(e.target.value))}
                className="w-full accent-[#7B61FF] h-1.5 bg-[#050810] rounded outline-none cursor-pointer"
              />
              <span className="text-[9px] text-[#8891A8] leading-relaxed">
                Maximum acceptable latency for candidate checks. Overages trigger automated rollbacks.
              </span>
            </div>

            {/* Auto Mitigate Toggle */}
            <div className="flex items-center justify-between p-3 bg-[#050810] border border-white/5 rounded-lg">
              <div className="flex flex-col gap-0.5">
                <span className="text-[10px] font-mono text-white uppercase tracking-wider font-bold">Auto-Remediation</span>
                <span className="text-[9px] text-[#8891A8]">Auto-trigger retraining &amp; swap</span>
              </div>
              <button
                onClick={() => setAutoMitigate(!autoMitigate)}
                className={`w-10 h-5.5 rounded-full p-1 transition-colors cursor-pointer relative flex items-center ${
                  autoMitigate ? "bg-[#00D9E8]" : "bg-white/10"
                }`}
              >
                <div 
                  className={`w-3.5 h-3.5 rounded-full bg-[#050810] shadow transition-transform ${
                    autoMitigate ? "translate-x-4.5" : "translate-x-0"
                  }`} 
                />
              </button>
            </div>

            {/* Save notice */}
            <div className="bg-[#050810]/50 border border-[#00D9E8]/10 p-3 rounded text-[9.5px] text-[#8891A8] leading-relaxed flex items-start gap-2">
              <ShieldCheck className="w-4 h-4 text-[#00D9E8] shrink-0 mt-0.5" />
              <span>
                Changes are automatically propagated to Kubernetes Operators and ConfigMaps.
              </span>
            </div>
          </div>
        </Card>
      </div>

      {/* Controller State and Log Card */}
      <div className="lg:col-span-2 flex flex-col gap-5">
        <Card 
          title="Telemetry State Machine" 
          subtitle="Real-time controller tracking"
          statusColor={activeState === "DriftDetected" ? "warning" : "success"}
          headerActions={
            <Button
              variant={simulating ? "ghost" : "primary"}
              onClick={handleStateSimulation}
              disabled={simulating}
              size="xs"
              icon={simulating ? RefreshCw : Play}
            >
              {simulating ? "SIMULATING..." : "RUN FULL LOOP"}
            </Button>
          }
        >
          <div className="flex flex-col gap-5">
            {/* Step Indicators */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2.5">
              {states.map((st) => {
                const isActive = activeState === st.id;
                const IconComp = st.icon;
                return (
                  <div
                    key={st.id}
                    className={`p-3 rounded border transition-all flex flex-col gap-1.5 relative overflow-hidden ${
                      isActive 
                        ? `${st.glow} bg-white/2` 
                        : "bg-[#050810] border-white/5 opacity-50"
                    }`}
                  >
                    {isActive && (
                      <div className="absolute top-0 left-0 w-full h-[1px] bg-current" />
                    )}
                    <IconComp className={`w-4 h-4 ${isActive ? st.activeColor : "text-white/40"} ${isActive && st.id === "RetrainingQueued" ? "animate-spin" : ""}`} />
                    <div>
                      <span className={`text-[10px] font-mono font-bold block ${isActive ? "text-white" : "text-white/60"}`}>{st.label}</span>
                      <span className="text-[8px] font-sans text-[#8891A8] leading-tight block">{st.desc}</span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* State Machine Log Console */}
            <div className="flex flex-col gap-2">
              <span className="text-[10px] font-mono text-white/50 uppercase tracking-wider font-bold">
                Controller Transaction Log
              </span>
              <div className="bg-[#050810] border border-white/5 p-4 rounded-lg h-56 font-mono text-[10.5px] leading-relaxed text-[#9CA3AF] overflow-y-auto flex flex-col gap-1.5 scrollbar-thin">
                {simulationLog.map((log, idx) => {
                  let colorClass = "text-[#9CA3AF]";
                  if (log.includes("[ALERT]")) colorClass = "text-[#FF3B5C]";
                  else if (log.includes("[SYSTEM]")) colorClass = "text-[#00D9E8]";
                  else if (log.includes("[SECURITY]")) colorClass = "text-[#00C48C]";
                  else if (log.includes("[COMPLIANCE]")) colorClass = "text-[#7B61FF]";

                  return (
                    <div key={idx} className={colorClass}>
                      {log}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </Card>
      </div>

    </div>
  );
}
