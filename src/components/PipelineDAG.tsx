import React, { useState, useEffect } from "react";
import { 
  Server, 
  Cpu, 
  Layers, 
  GitBranch, 
  Shield, 
  Zap, 
  AlertTriangle, 
  RefreshCw, 
  Activity, 
  Database,
  ArrowRight,
  Terminal,
  Play,
  RotateCw,
  CheckCircle2,
  Lock
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Card, Badge, Button, Tooltip } from "./ui";

interface NodeData {
  id: string;
  name: string;
  type: string;
  status: "active" | "warning" | "critical" | "idle";
  lane: "ingestion" | "intelligence" | "orchestration" | "serving";
  icon: React.ComponentType<any>;
  metric?: string;
  metricLabel?: string;
  description: string;
  details: string[];
}

export default function PipelineDAG() {
  const [selectedNode, setSelectedNode] = useState<string>("drift_evaluator");
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const [isRetraining, setIsRetraining] = useState(false);
  const [retrainProgress, setRetrainProgress] = useState(0);
  const [simulationSpeed, setSimulationSpeed] = useState<"normal" | "fast" | "paused">("normal");
  const [agentLogs, setAgentLogs] = useState<string[]>([
    "🤖 [LLM Agent] Initialized telemetry listener...",
    "🔍 [LLM Agent] Scanning node 'drift_evaluator' - KS-Test: 0.12 (normal)",
    "⚠️ [LLM Agent] Detected drift anomaly (PSI: 0.45) on 'ibm-granite' model.",
    "💡 [LLM Agent] Recommendation: Execute targeted retraining on slice [Day 4-Day 7]"
  ]);
  const [newLogInput, setNewLogInput] = useState("");

  const nodes: NodeData[] = [
    {
      id: "fastapi",
      name: "GKE Ingress Endpoint",
      type: "Prediction API Gateway",
      status: "active",
      lane: "ingestion",
      icon: Server,
      metric: "4.2k rps",
      metricLabel: "Throughput",
      description: "Inbound REST & gRPC endpoints running on Google Kubernetes Engine (GKE).",
      details: [
        "Host: api.phaelitus.io/v1/predict",
        "Average Latency: 12ms",
        "OpenTelemetry Interceptor: Active",
        "Autoscaling Target: 20 pods (current: 12)"
      ]
    },
    {
      id: "kafka",
      name: "model.telemetry.stream",
      type: "Kafka Messaging Topic",
      status: "active",
      lane: "ingestion",
      icon: Database,
      metric: "0ms",
      metricLabel: "Buffer Lag",
      description: "Durable distributed event streaming layer hosted on IBM Red Hat OpenShift.",
      details: [
        "Partitions: 32",
        "Replication Factor: 3",
        "Bytes In/sec: 14.2 MB/s",
        "Retention Config: 7 days, compacted"
      ]
    },
    {
      id: "drift_evaluator",
      name: "Drift Evaluator Pipeline",
      type: "Vertex AI Statistics Engine",
      status: "warning",
      lane: "intelligence",
      icon: Activity,
      metric: "PSI 0.45",
      metricLabel: "Max Drift",
      description: "Vertex AI pipeline monitoring feature distribution divergence vs baseline logs.",
      details: [
        "Algorithm: Population Stability Index (PSI)",
        "Trigger Threshold: > 0.25 (Current: 0.45)",
        "Failing features: user_age, request_channel",
        "Remediation Strategy: Auto-Trigger retraining"
      ]
    },
    {
      id: "feature_store",
      name: "Vertex Feature Store",
      type: "Feature Distribution Lake",
      status: "active",
      lane: "intelligence",
      icon: Database,
      metric: "99.98%",
      metricLabel: "Query SLA",
      description: "Low-latency offline & online feature engine storing telemetry variables.",
      details: [
        "Total Entities: 142M records",
        "Read Latency (p99): 1.4ms",
        "Write Latency: 8.2ms",
        "Sync Rate: Hourly micro-batches"
      ]
    },
    {
      id: "argo_retrainer",
      name: "Argo Retraining Pipeline",
      type: "Kubernetes Operator CRD",
      status: "idle",
      lane: "orchestration",
      icon: RefreshCw,
      metric: "v1.2.0",
      metricLabel: "CRD Spec",
      description: "Automated container training DAG compiling datasets and testing candidates.",
      details: [
        "Namespace: phaelitus-orchestrator",
        "Underlying Nodes: Spot-preemptible Tesla A100s",
        "Base Image: custom-pytorch-cuda-12",
        "Validation Gate: Accuracy > Baseline (98.2%)"
      ]
    },
    {
      id: "rl_scheduler",
      name: "PPO GPU Scheduler",
      type: "Reinforcement Learning Engine",
      status: "active",
      lane: "orchestration",
      icon: Cpu,
      metric: "88%",
      metricLabel: "GPU Util",
      description: "PPO RL scheduler allocating pipeline execution tasks on spot servers.",
      details: [
        "Model: Proximal Policy Optimization (PPO)",
        "Action Space: Multi-node orchestration",
        "Reward: Minimize cost & duration while preventing spot eviction",
        "Epoch Interval: 120s"
      ]
    },
    {
      id: "primary_model",
      name: "Gemini Pro Serving Node",
      type: "Vertex AI Inference Engine",
      status: "active",
      lane: "serving",
      icon: Shield,
      metric: "90%",
      metricLabel: "Traffic Split",
      description: "Primary server routing 90% of user queries securely.",
      details: [
        "Version: v1.5-pro",
        "Provider: Google Vertex AI",
        "Framework: Vertex AI / JAX",
        "Verification: cosign ECDSA sha256"
      ]
    },
    {
      id: "shadow_model",
      name: "Llama-3 Shadow Node",
      type: "PyTorch TorchServe Module",
      status: "warning",
      lane: "serving",
      icon: GitBranch,
      metric: "10%",
      metricLabel: "Shadow Route",
      description: "Shadow model receiving live traffic mirrors for parallel performance tests.",
      details: [
        "Version: v3.1-instruct",
        "Provider: Meta AI",
        "Framework: PyTorch",
        "Discrepancy: +4.2% output variance vs Primary"
      ]
    }
  ];

  // Retraining Simulation Loop
  useEffect(() => {
    let timer: any;
    if (isRetraining) {
      timer = setInterval(() => {
        setRetrainProgress(prev => {
          if (prev >= 100) {
            setIsRetraining(false);
            setAgentLogs(l => [
              ...l,
              `✅ [LLM Agent] Retraining finished. Candidate accuracy verified: 98.9% (+0.2% vs baseline).`,
              `🚀 [LLM Agent] Dispatching zero-downtime traffic route update.`
            ]);
            return 0;
          }
          return prev + 10;
        });
      }, 800);
    }
    return () => clearInterval(timer);
  }, [isRetraining]);

  const handleTriggerRetrain = () => {
    setIsRetraining(true);
    setRetrainProgress(0);
    setAgentLogs(l => [
      ...l,
      `🔄 [LLM Agent] Manual retrain initiated on 'argo_retrainer'. Spawning spot GPU slice...`
    ]);
  };

  const activeNodeData = nodes.find(n => n.id === selectedNode) || nodes[0];

  return (
    <div className="flex flex-col lg:flex-row gap-5 min-h-[500px]">
      
      {/* Left Column: Interactive Interactive Pipeline DAG */}
      <div className="flex-1 bg-[#080C14] border border-white/4 p-5 rounded-lg relative overflow-hidden flex flex-col gap-4">
        {/* Futuristic Top Lines */}
        <div className="absolute top-0 left-0 w-12 h-[1px] bg-[#00D9E8]" />
        <div className="absolute top-0 left-0 w-[1px] h-6 bg-[#00D9E8]" />
        
        {/* Swimlane Layout Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/4 pb-4">
          <div className="flex items-center gap-2">
            <Layers className="text-[#00D9E8] w-4.5 h-4.5 animate-pulse" />
            <div>
              <h2 className="font-serif font-bold text-sm uppercase tracking-wider text-white">Phaelitus SDK System Blueprint</h2>
              <p className="text-[10px] text-[#8891A8] font-mono">Multicloud MLOps Integration &bull; Live Telemetry Paths</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[9px] font-mono text-white/50">SPEED:</span>
            <div className="flex border border-white/5 rounded p-0.5 bg-[#050810]">
              {(["paused", "normal", "fast"] as const).map(speed => (
                <button
                  key={speed}
                  onClick={() => setSimulationSpeed(speed)}
                  className={`px-2 py-0.5 text-[8px] font-mono rounded capitalize transition-all cursor-pointer ${
                    simulationSpeed === speed ? "bg-[#00D9E8] text-[#050810] font-bold" : "text-[#8891A8] hover:text-white"
                  }`}
                >
                  {speed}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Cinematic SVG Pipeline Canvas */}
        <div className="relative min-h-[440px] bg-[#050810] border border-white/4 rounded-lg p-4 flex flex-col justify-between overflow-hidden">
          
          {/* Cyber Background Mesh */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(0,217,232,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(0,217,232,0.015)_1px,transparent_1px)] bg-[size:24px_24px] opacity-40 pointer-events-none" />
          
          {/* Real-time SVG Connection Paths */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
            <defs>
              <linearGradient id="cyan-violet-grad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#00D9E8" stopOpacity="0.4" />
                <stop offset="50%" stopColor="#7B61FF" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#00C48C" stopOpacity="0.4" />
              </linearGradient>
              <linearGradient id="glow-grad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#00D9E8" />
                <stop offset="100%" stopColor="#7B61FF" />
              </linearGradient>
            </defs>

            {/* Ingestion to Intelligence bezier path */}
            <path 
              d="M 120 100 C 180 100, 180 150, 240 150" 
              fill="none" 
              stroke="url(#cyan-violet-grad)" 
              strokeWidth="2" 
              className="transition-all"
            />
            {simulationSpeed !== "paused" && (
              <circle r="4" fill="#00D9E8" className="shadow-[0_0_8px_#00D9E8]">
                <animateMotion 
                  path="M 120 100 C 180 100, 180 150, 240 150" 
                  dur={simulationSpeed === "fast" ? "1.5s" : "3s"} 
                  repeatCount="indefinite" 
                />
              </circle>
            )}

            {/* Intelligence to Orchestration path */}
            <path 
              d="M 280 200 C 350 200, 350 220, 420 220" 
              fill="none" 
              stroke="url(#cyan-violet-grad)" 
              strokeWidth="2" 
              className="transition-all"
            />
            {simulationSpeed !== "paused" && (
              <circle r="4" fill="#7B61FF" className="shadow-[0_0_8px_#7B61FF]">
                <animateMotion 
                  path="M 280 200 C 350 200, 350 220, 420 220" 
                  dur={simulationSpeed === "fast" ? "1s" : "2s"} 
                  repeatCount="indefinite" 
                />
              </circle>
            )}

            {/* Orchestration to Serving path */}
            <path 
              d="M 460 270 C 530 270, 530 300, 600 300" 
              fill="none" 
              stroke="url(#cyan-violet-grad)" 
              strokeWidth="2" 
              className="transition-all"
            />
            {simulationSpeed !== "paused" && (
              <circle r="4" fill="#00C48C" className="shadow-[0_0_8px_#00C48C]">
                <animateMotion 
                  path="M 460 270 C 530 270, 530 300, 600 300" 
                  dur={simulationSpeed === "fast" ? "1.2s" : "2.5s"} 
                  repeatCount="indefinite" 
                />
              </circle>
            )}
          </svg>

          {/* Grid structure columns (Lanes) */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 h-full relative z-10">
            
            {/* Lane 1: Ingestion */}
            <div className="flex flex-col gap-4 border-r border-white/2 pr-2 h-full">
              <span className="text-[9px] font-mono font-bold text-[#00D9E8] tracking-widest uppercase mb-1 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#00D9E8] animate-ping" />
                INGESTION LAYER
              </span>
              
              <div className="flex flex-col gap-3 justify-center flex-1">
                {nodes.filter(n => n.lane === "ingestion").map(node => {
                  const NodeIcon = node.icon;
                  const isSelected = selectedNode === node.id;
                  const isHovered = hoveredNode === node.id;
                  return (
                    <motion.div
                      key={node.id}
                      onClick={() => setSelectedNode(node.id)}
                      onMouseEnter={() => setHoveredNode(node.id)}
                      onMouseLeave={() => setHoveredNode(null)}
                      className={`p-3 rounded border bg-[#080C14] transition-all cursor-pointer relative ${
                        isSelected 
                          ? "border-[#00D9E8] shadow-[0_0_15px_rgba(0,217,232,0.15)]" 
                          : isHovered 
                          ? "border-white/20" 
                          : "border-white/5"
                      }`}
                      whileHover={{ y: -2 }}
                    >
                      <div className="flex items-center justify-between gap-1">
                        <div className="flex items-center gap-2">
                          <NodeIcon className={`w-4 h-4 ${node.status === "warning" ? "text-amber-500" : "text-[#00D9E8]"}`} />
                          <span className="text-[11px] font-serif font-bold text-white block truncate max-w-[110px]">{node.name}</span>
                        </div>
                        {node.metric && (
                          <span className="text-[8px] font-mono text-[#00D9E8] bg-[#00D9E8]/10 px-1 py-0.5 rounded">{node.metric}</span>
                        )}
                      </div>
                      <span className="text-[8px] font-mono text-white/40 block mt-1 uppercase">{node.type}</span>
                    </motion.div>
                  );
                })}
              </div>
            </div>

            {/* Lane 2: Intelligence */}
            <div className="flex flex-col gap-4 border-r border-white/2 pr-2 h-full">
              <span className="text-[9px] font-mono font-bold text-[#7B61FF] tracking-widest uppercase mb-1 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#7B61FF]" />
                STAT INTEL
              </span>
              
              <div className="flex flex-col gap-3 justify-center flex-1">
                {nodes.filter(n => n.lane === "intelligence").map(node => {
                  const NodeIcon = node.icon;
                  const isSelected = selectedNode === node.id;
                  const isHovered = hoveredNode === node.id;
                  return (
                    <motion.div
                      key={node.id}
                      onClick={() => setSelectedNode(node.id)}
                      onMouseEnter={() => setHoveredNode(node.id)}
                      onMouseLeave={() => setHoveredNode(null)}
                      className={`p-3 rounded border bg-[#080C14] transition-all cursor-pointer relative ${
                        isSelected 
                          ? "border-[#7B61FF] shadow-[0_0_15px_rgba(123,97,255,0.15)]" 
                          : node.status === "warning"
                          ? "border-amber-500/30"
                          : isHovered 
                          ? "border-white/20" 
                          : "border-white/5"
                      }`}
                      whileHover={{ y: -2 }}
                    >
                      {node.status === "warning" && (
                        <div className="absolute -top-1.5 -right-1.5 bg-amber-500 text-black rounded-full p-0.5 animate-pulse">
                          <AlertTriangle className="w-2.5 h-2.5" />
                        </div>
                      )}
                      <div className="flex items-center justify-between gap-1">
                        <div className="flex items-center gap-2">
                          <NodeIcon className={`w-4 h-4 ${node.status === "warning" ? "text-amber-500" : "text-[#7B61FF]"}`} />
                          <span className="text-[11px] font-serif font-bold text-white block truncate max-w-[110px]">{node.name}</span>
                        </div>
                        {node.metric && (
                          <span className={`text-[8px] font-mono px-1 py-0.5 rounded ${node.status === "warning" ? "text-amber-500 bg-amber-500/10" : "text-[#7B61FF] bg-[#7B61FF]/10"}`}>{node.metric}</span>
                        )}
                      </div>
                      <span className="text-[8px] font-mono text-white/40 block mt-1 uppercase">{node.type}</span>
                    </motion.div>
                  );
                })}
              </div>
            </div>

            {/* Lane 3: Orchestration */}
            <div className="flex flex-col gap-4 border-r border-white/2 pr-2 h-full">
              <span className="text-[9px] font-mono font-bold text-[#7B61FF] tracking-widest uppercase mb-1 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                ORCHESTRATION
              </span>
              
              <div className="flex flex-col gap-3 justify-center flex-1">
                {nodes.filter(n => n.lane === "orchestration").map(node => {
                  const NodeIcon = node.icon;
                  const isSelected = selectedNode === node.id;
                  const isHovered = hoveredNode === node.id;
                  const activeRetrainingNow = isRetraining && node.id === "argo_retrainer";
                  return (
                    <motion.div
                      key={node.id}
                      onClick={() => setSelectedNode(node.id)}
                      onMouseEnter={() => setHoveredNode(node.id)}
                      onMouseLeave={() => setHoveredNode(null)}
                      className={`p-3 rounded border bg-[#080C14] transition-all cursor-pointer relative ${
                        isSelected 
                          ? "border-indigo-500 shadow-[0_0_15px_rgba(99,102,241,0.15)]" 
                          : isHovered 
                          ? "border-white/20" 
                          : "border-white/5"
                      }`}
                      whileHover={{ y: -2 }}
                    >
                      {activeRetrainingNow && (
                        <div className="absolute inset-0 bg-indigo-500/10 rounded overflow-hidden">
                          <div 
                            className="h-full bg-indigo-500/30 transition-all duration-300"
                            style={{ width: `${retrainProgress}%` }}
                          />
                        </div>
                      )}
                      <div className="flex items-center justify-between gap-1 relative z-10">
                        <div className="flex items-center gap-2">
                          <NodeIcon className={`w-4 h-4 ${activeRetrainingNow ? "animate-spin text-indigo-400" : "text-indigo-400"}`} />
                          <span className="text-[11px] font-serif font-bold text-white block truncate max-w-[110px]">{node.name}</span>
                        </div>
                        <span className="text-[8px] font-mono text-indigo-400 bg-indigo-500/10 px-1 py-0.5 rounded">
                          {activeRetrainingNow ? `${retrainProgress}%` : node.metric}
                        </span>
                      </div>
                      <span className="text-[8px] font-mono text-white/40 block mt-1 uppercase relative z-10">{node.type}</span>
                    </motion.div>
                  );
                })}
              </div>
            </div>

            {/* Lane 4: Serving */}
            <div className="flex flex-col gap-4 h-full">
              <span className="text-[9px] font-mono font-bold text-[#00C48C] tracking-widest uppercase mb-1 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#00C48C]" />
                SERVING LAYER
              </span>
              
              <div className="flex flex-col gap-3 justify-center flex-1">
                {nodes.filter(n => n.lane === "serving").map(node => {
                  const NodeIcon = node.icon;
                  const isSelected = selectedNode === node.id;
                  const isHovered = hoveredNode === node.id;
                  return (
                    <motion.div
                      key={node.id}
                      onClick={() => setSelectedNode(node.id)}
                      onMouseEnter={() => setHoveredNode(node.id)}
                      onMouseLeave={() => setHoveredNode(null)}
                      className={`p-3 rounded border bg-[#080C14] transition-all cursor-pointer relative ${
                        isSelected 
                          ? "border-[#00C48C] shadow-[0_0_15px_rgba(0,196,140,0.15)]" 
                          : isHovered 
                          ? "border-white/20" 
                          : "border-white/5"
                      }`}
                      whileHover={{ y: -2 }}
                    >
                      <div className="flex items-center justify-between gap-1">
                        <div className="flex items-center gap-2">
                          <NodeIcon className="w-4 h-4 text-[#00C48C]" />
                          <span className="text-[11px] font-serif font-bold text-white block truncate max-w-[110px]">{node.name}</span>
                        </div>
                        {node.metric && (
                          <span className="text-[8px] font-mono text-[#00C48C] bg-[#00C48C]/10 px-1 py-0.5 rounded">{node.metric}</span>
                        )}
                      </div>
                      <span className="text-[8px] font-mono text-white/40 block mt-1 uppercase">{node.type}</span>
                    </motion.div>
                  );
                })}
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Right Column: Node Details & LLM Real-time Root Cause Console */}
      <div className="w-full lg:w-80 shrink-0 flex flex-col gap-5">
        
        {/* Node Telemetry Card */}
        <Card 
          title="Telemetry Inspection" 
          subtitle="Real-time node diagnostics"
          statusColor={activeNodeData.status === "warning" ? "warning" : "success"}
        >
          <div className="flex flex-col gap-4">
            <div>
              <span className="text-[9px] font-mono text-white/30 uppercase tracking-widest block">Node Name</span>
              <h4 className="text-white font-serif font-bold text-sm mt-0.5">{activeNodeData.name}</h4>
              <p className="text-[11px] text-[#8891A8] mt-1 leading-relaxed">{activeNodeData.description}</p>
            </div>

            <div className="bg-[#050810] border border-white/5 rounded p-3">
              <span className="text-[9px] font-mono text-white/30 uppercase tracking-widest block mb-2">Internal Variables</span>
              <div className="flex flex-col gap-2 font-mono text-[10.5px]">
                {activeNodeData.details.map((detail, idx) => (
                  <div key={idx} className="flex items-start gap-1.5 text-[#9CA3AF] border-b border-white/3 pb-1 last:border-0 last:pb-0">
                    <span className="text-[#00D9E8]">&bull;</span>
                    <span className="break-all">{detail}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Node Action Center */}
            <div className="flex flex-col gap-2.5 pt-1">
              {activeNodeData.id === "argo_retrainer" || activeNodeData.lane === "intelligence" ? (
                <Button 
                  variant={isRetraining ? "warning" : "primary"}
                  onClick={handleTriggerRetrain}
                  disabled={isRetraining}
                  className="w-full justify-center"
                >
                  {isRetraining ? (
                    <span className="flex items-center gap-1.5">
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      RETRAINING... {retrainProgress}%
                    </span>
                  ) : (
                    <span className="flex items-center gap-1.5">
                      <Play className="w-3.5 h-3.5" />
                      Trigger Retraining Run
                    </span>
                  )}
                </Button>
              ) : (
                <Button variant="ghost" disabled className="w-full justify-center text-[10px]">
                  <Lock className="w-3.5 h-3.5 opacity-60" />
                  Operator Locked for Ingestion
                </Button>
              )}
            </div>
          </div>
        </Card>

        {/* Cinematic LLM Root Cause Agent Console */}
        <Card
          title="LLM Copilot Console"
          subtitle="Autonomous Remediation Agent"
          statusColor="cyan"
        >
          <div className="flex flex-col gap-3">
            <div className="bg-[#050810] border border-white/5 rounded p-3 h-48 overflow-y-auto flex flex-col gap-2 scrollbar-thin">
              {agentLogs.map((log, idx) => (
                <div key={idx} className="text-[10px] font-mono leading-relaxed">
                  {log.startsWith("🤖") || log.startsWith("🔍") ? (
                    <span className="text-[#00D9E8]">{log}</span>
                  ) : log.startsWith("⚠️") ? (
                    <span className="text-amber-400">{log}</span>
                  ) : log.startsWith("✅") ? (
                    <span className="text-[#00C48C]">{log}</span>
                  ) : (
                    <span className="text-[#9CA3AF]">{log}</span>
                  )}
                </div>
              ))}
            </div>

            {/* Input logs manually for simulation */}
            <form 
              onSubmit={(e) => {
                e.preventDefault();
                if (!newLogInput.trim()) return;
                setAgentLogs(prev => [...prev, `💬 [Operator] ${newLogInput}`]);
                const response = `🤖 [LLM Agent] Acknowledged input: "${newLogInput}". Inspecting active telemetry clusters...`;
                setTimeout(() => {
                  setAgentLogs(prev => [...prev, response]);
                }, 1000);
                setNewLogInput("");
              }}
              className="flex gap-2"
            >
              <input
                type="text"
                placeholder="Ask MLOps Agent..."
                value={newLogInput}
                onChange={(e) => setNewLogInput(e.target.value)}
                className="bg-[#050810] border border-white/10 px-2.5 py-1.5 rounded text-[10px] font-mono text-white placeholder-white/30 outline-none focus:border-[#00D9E8]/50 flex-1"
              />
              <Button type="submit" variant="ghost" className="px-2.5">
                Send
              </Button>
            </form>
          </div>
        </Card>

      </div>

    </div>
  );
}
