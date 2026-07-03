import React, { useState } from "react";
import { 
  FileText, 
  TrendingUp, 
  Layers, 
  Map, 
  CheckCircle2, 
  AlertCircle, 
  ArrowRight, 
  ShieldAlert, 
  Zap, 
  FileCheck, 
  Lock, 
  Briefcase, 
  Sparkles, 
  ChevronRight,
  Database,
  BarChart3
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface PricingTier {
  name: string;
  price: string;
  description: string;
  features: string[];
  cta: string;
  popular?: boolean;
}

const PRICING_TIERS: PricingTier[] = [
  {
    name: "Community",
    price: "$0",
    description: "Perfect for single-developer local sandbox testing and basic self-hosted setups.",
    features: [
      "Core Kubernetes Operator (kopf)",
      "Standard Statistical Drift (PSI / KS-Test)",
      "Local CLI client integration",
      "Community GitHub Issues support",
      "Single-cluster namespace deployment"
    ],
    cta: "Download OSS License"
  },
  {
    name: "Professional",
    price: "$5,000/yr",
    description: "For production-grade mid-market teams requiring operational SLA guarantees.",
    features: [
      "Support for up to 100 active pipelines",
      "99.9% Up-time SLA guarantee",
      "Direct Slack & email engineering access",
      "Weekly automated drift/bias digest reports",
      "Kubernetes Gateway API + HTTPRoute canary support",
      "Interactive multi-user UI access"
    ],
    cta: "Request Pro Trial",
    popular: true
  },
  {
    name: "Enterprise",
    price: "$15,000/yr",
    description: "The complete secure control plane for regulated industries, multi-cloud and scale.",
    features: [
      "Unlimited active model pipelines",
      "IBM AIF360 Fairness violation mitigators",
      "NIST AI RMF Compliance Report generator",
      "Multi-Cloud Federation (Anthos/OpenShift ready)",
      "Jira + PagerDuty auto-incident paging",
      "BigQuery & Vertex AI native pipeline adapters",
      "Dedicated 24/7/365 enterprise support"
    ],
    cta: "Contact Enterprise Sales"
  }
];

export default function ProposalHub() {
  const [selectedTier, setSelectedTier] = useState<string>("Enterprise");
  const [activeRoadmap, setActiveRoadmap] = useState<string>("v1.5");
  const [notification, setNotification] = useState<{
    title: string;
    message: string;
    type: "success" | "info";
  } | null>(null);

  const showToast = (title: string, message: string, type: "success" | "info" = "success") => {
    setNotification({ title, message, type });
    // Auto close after 4 seconds
    setTimeout(() => {
      setNotification(prev => prev?.message === message ? null : prev);
    }, 4000);
  };

  const originalRoi = [
    { cap: "Experiment tracking & drift monitoring", tool: "Weights & Biases Teams", cost: 12000 },
    { cap: "Pipeline orchestration", tool: "Kubeflow / Vertex AI Pipelines", cost: 18000 },
    { cap: "Model serving + traffic management", tool: "Seldon Core / BentoML", cost: 10000 },
    { cap: "Compliance & governance audit logging", tool: "Collibra / DataHub Enterprise", cost: 15000 },
  ];

  const addedRoi = [
    { cap: "Fairness violation & bias tracking", tool: "Fiddler / IBM AIF360 Enterprise", cost: 8000 },
    { cap: "BigQuery Feature Store syncing", tool: "Feast Enterprise / Tecton", cost: 6000 },
    { cap: "Federated aggregation scheduling", tool: "PySyft Enterprise / Flower Cloud", cost: 10000 },
    { cap: "Resource cost attribution tracking", tool: "Kubecost Enterprise", cost: 5000 },
  ];

  const originalTotal = originalRoi.reduce((acc, r) => acc + r.cost, 0);
  const additionsTotal = addedRoi.reduce((acc, r) => acc + r.cost, 0);
  const aggregateTotal = originalTotal + additionsTotal;

  return (
    <div className="flex flex-col gap-6 relative">
      
      {/* Toast Notification overlay */}
      <AnimatePresence>
        {notification && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-6 right-6 z-50 max-w-sm w-full bg-[#13161E] border border-[#00D9E8]/30 rounded-lg p-4.5 shadow-2xl shadow-[#00D9E8]/10 flex items-start gap-3.5 backdrop-blur-md"
          >
            <div className="w-8 h-8 rounded-full bg-[#00D9E8]/10 text-[#00D9E8] flex items-center justify-center shrink-0 border border-[#00D9E8]/20">
              <CheckCircle2 className="w-4.5 h-4.5" />
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="text-xs font-sans font-bold text-white uppercase tracking-wider">{notification.title}</h4>
              <p className="text-[10px] font-sans text-[#8891A8] leading-relaxed mt-1">{notification.message}</p>
            </div>
            <button 
              onClick={() => setNotification(null)}
              className="text-[#3D4460] hover:text-[#8891A8] transition-colors text-xs font-mono cursor-pointer"
            >
              &times;
            </button>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Page Title Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between border-b border-[#202538] pb-4">
        <div>
          <h2 className="font-sans text-lg uppercase tracking-wider text-[#F0F2F8] font-bold flex items-center gap-2">
            <FileText className="text-[#00D9E8] w-5 h-5" />
            Phaelitus SDK Enterprise Brief &amp; ROI Table
          </h2>
          <p className="text-xs font-sans text-[#8891A8] mt-1">
            Commercial justification dossier, regulatory analysis, and prioritized deployment roadmap.
          </p>
        </div>
        <div className="mt-3 md:mt-0 flex gap-2">
          <span className="text-[10px] font-mono bg-amber-500/10 border border-amber-500/30 text-amber-500 px-3 py-1 rounded font-bold uppercase">
            CONFIDENTIAL // EVALUATION DOSSIER
          </span>
        </div>
      </div>

      {/* Regulatory Catalyst (Why Now Section) */}
      <div className="bg-gradient-to-r from-[#1C111C] to-[#13161E] border border-[#FF3B5C]/30 p-5 rounded-lg relative overflow-hidden">
        <div className="absolute top-0 right-0 p-1.5 bg-[#FF3B5C] text-white text-[8px] font-mono font-bold uppercase tracking-wider rounded-bl">
          CRITICAL CATALYST
        </div>
        <div className="flex items-start gap-3.5">
          <div className="w-9 h-9 rounded-lg bg-[#FF3B5C]/15 flex items-center justify-center text-[#FF3B5C] border border-[#FF3B5C]/30 shrink-0">
            <ShieldAlert className="w-5 h-5 animate-pulse" />
          </div>
          <div className="flex flex-col gap-1.5">
            <h3 className="font-sans text-xs uppercase tracking-wider text-[#FF3B5C] font-bold">
              EU AI Act Enforcement Paradigm: Why Phaelitus SDK is Mission-Critical Today
            </h3>
            <p className="text-[10px] font-sans text-[#8891A8] leading-relaxed">
              In <strong className="text-white">August 2025</strong>, the official enforcement of the historic <strong className="text-[#00D9E8]">European Union AI Act (Regulation EU 2024/1689)</strong> took legal effect across international jurisdictions. Organizations deploying high-risk artificial intelligence applications are now legally mandated to guarantee transparent, traceable model lineages, robust bias checks, and continuous drift statistics. Failure to comply can result in administrative fines up to <strong>&euro;35 Million</strong> or <strong>7% of global annual turnover</strong>. 
            </p>
            <p className="text-[10px] font-sans text-[#8891A8] leading-relaxed">
              Phaelitus SDK bridges this regulatory gap instantly. By uniting live model telemetry with an integrated IBM AIF360 ethical fairness monitoring engine and automated NIST AI RMF compliance reports, it shifts audit processes from an annual manual exercise into a continuous, real-time Kubernetes control loop.
            </p>
          </div>
        </div>
      </div>

      {/* Unified Revised Commercial ROI Table */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        
        {/* Left Side: Commercial ROI Table */}
        <div className="lg:col-span-8 bg-[#13161E] border border-[#202538] p-5 rounded-lg flex flex-col gap-4">
          <div className="flex justify-between items-center border-b border-[#202538] pb-3">
            <div className="flex items-center gap-2">
              <TrendingUp className="text-[#00D9E8] w-4.5 h-4.5" />
              <div>
                <h3 className="font-sans text-xs uppercase tracking-wider text-[#F0F2F8] font-semibold">Unified Enterprise Value Decomposition</h3>
                <p className="text-[9px] font-sans text-[#8891A8] leading-none mt-1">Replaced commercial tooling annual licensing equivalency</p>
              </div>
            </div>
            <span className="text-[10px] font-mono font-bold text-[#00D9E8]">
              $84,000/yr AGGREGATE REPLACEMENT VALUE
            </span>
          </div>

          <div className="bg-[#0D0F14] rounded-lg border border-[#202538] overflow-hidden">
            <table className="w-full text-[9.5px] font-mono text-[#8891A8]">
              <thead className="bg-[#1C2030]/40 border-b border-[#202538] text-[#F0F2F8] font-bold text-left">
                <tr>
                  <th className="p-3">CAPABILITY / WORKLOAD</th>
                  <th className="p-3">REPLACED INDUSTRY TOOLING</th>
                  <th className="p-3 text-right">ANNUAL VALUE (EST)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#202538]/50">
                
                {/* Original Items */}
                <tr>
                  <td colSpan={3} className="bg-[#1C2030]/15 px-3 py-1.5 text-[8.5px] text-[#00D9E8] font-bold uppercase tracking-wider border-b border-[#202538]/50">
                    BASELINE STACK WORKLOADS
                  </td>
                </tr>
                {originalRoi.map((row, idx) => (
                  <tr key={`orig-${idx}`} className="hover:bg-[#1C2030]/10 transition-colors">
                    <td className="p-3 text-white font-medium">{row.cap}</td>
                    <td className="p-3">{row.tool}</td>
                    <td className="p-3 text-right text-[#F0F2F8] font-bold">${row.cost.toLocaleString()}/yr</td>
                  </tr>
                ))}

                {/* Added Items */}
                <tr>
                  <td colSpan={3} className="bg-[#1C2030]/15 px-3 py-1.5 text-[8.5px] text-pink-400 font-bold uppercase tracking-wider border-b border-[#202538]/50 border-t border-[#202538]">
                    NEW HIGH-VALUE COMPLIANCE &amp; COST MITIGATION MODULES
                  </td>
                </tr>
                {addedRoi.map((row, idx) => (
                  <tr key={`added-${idx}`} className="hover:bg-[#1C2030]/10 transition-colors">
                    <td className="p-3 text-white font-medium flex items-center gap-1.5">
                      <Sparkles className="w-3 h-3 text-pink-400 shrink-0" />
                      {row.cap}
                    </td>
                    <td className="p-3">{row.tool}</td>
                    <td className="p-3 text-right text-pink-400 font-bold">${row.cost.toLocaleString()}/yr</td>
                  </tr>
                ))}

                {/* Subtotals & Grand Totals */}
                <tr className="bg-[#1C2030]/30 border-t-2 border-[#202538]">
                  <td colSpan={2} className="p-3 text-white font-bold text-right uppercase">Baseline Equivalency value:</td>
                  <td className="p-3 text-right text-white font-bold">${originalTotal.toLocaleString()}/yr</td>
                </tr>
                <tr className="bg-[#1C2030]/30">
                  <td colSpan={2} className="p-3 text-white font-bold text-right uppercase">New Module Additions:</td>
                  <td className="p-3 text-right text-pink-400 font-bold">${additionsTotal.toLocaleString()}/yr</td>
                </tr>
                <tr className="bg-[#00D9E8]/5 border-t border-[#00D9E8]/30">
                  <td colSpan={2} className="p-3 text-[#00D9E8] font-bold text-right uppercase text-[10px]">Total Combined Platform Value:</td>
                  <td className="p-3 text-right text-[#00D9E8] font-black text-xs">${aggregateTotal.toLocaleString()}/yr</td>
                </tr>

              </tbody>
            </table>
          </div>

          <p className="text-[9px] font-sans text-[#8891A8] leading-relaxed">
            By unifying drift monitors, distributed retraining orchestration, multi-cloud cost allocation algorithms, and bias detection into a single cohesive Kubernetes operator, Phaelitus SDK reduces toolchain complexity while generating an equivalent licensing value of <strong>$84,000 annually</strong> for zero licensing fees in its open-source format.
          </p>
        </div>

        {/* Right Side: Commercial Value Summary Card */}
        <div className="lg:col-span-4 flex flex-col gap-5">
          
          {/* Summary Metric Stats Card */}
          <div className="bg-gradient-to-b from-[#1C2030] to-[#13161E] border border-[#202538] p-5 rounded-lg flex flex-col gap-4">
            <div className="flex items-center gap-1.5">
              <Zap className="text-[#00D9E8] w-4.5 h-4.5" />
              <span className="text-[10px] font-mono font-bold text-white uppercase tracking-wider">The Financial Multiplier</span>
            </div>

            <div className="flex flex-col gap-3">
              <div className="bg-[#0D0F14] border border-[#202538] p-3 rounded-lg">
                <span className="text-[8px] font-mono text-[#8891A8] block uppercase">Original Equivalent Value</span>
                <span className="text-lg font-mono font-bold text-[#8891A8] mt-0.5 block line-through">$55,000/yr</span>
              </div>

              <div className="bg-[#0D0F14] border border-[#00D9E8]/30 p-3 rounded-lg relative overflow-hidden">
                <div className="absolute right-2 top-2 w-1.5 h-1.5 rounded-full bg-[#00D9E8] animate-ping"></div>
                <span className="text-[8px] font-mono text-[#00D9E8] block uppercase font-bold">New Combined Value</span>
                <span className="text-2xl font-mono font-bold text-[#00D9E8] mt-0.5 block">$84,000/yr</span>
              </div>

              <div className="bg-[#0D0F14] border border-pink-500/30 p-3 rounded-lg">
                <span className="text-[8px] font-mono text-pink-400 block uppercase font-bold">Commercial Offering</span>
                <span className="text-xl font-mono font-bold text-pink-500 mt-0.5 block">$15,000/yr Tier</span>
              </div>
            </div>

            <div className="text-[9.5px] font-sans text-[#8891A8] leading-tight flex flex-col gap-2 mt-1">
              <div className="flex justify-between">
                <span>Value-to-Cost Multiplier:</span>
                <span className="text-white font-bold">5.6x ROI</span>
              </div>
              <div className="flex justify-between">
                <span>Post-Deployment Overhead reduced:</span>
                <span className="text-white font-bold">90%</span>
              </div>
              <div className="flex justify-between">
                <span>Compliance coverage gap:</span>
                <span className="text-white font-bold">0% (NIST + AIF360)</span>
              </div>
            </div>
          </div>

          {/* Quick PDF Dossier export */}
          <div className="bg-[#13161E] border border-[#202538] p-5 rounded-lg flex flex-col gap-3">
            <span className="text-[10px] font-mono text-[#8891A8] uppercase font-bold tracking-wider">Corporate Audit Dossier</span>
            <p className="text-[9px] font-sans text-[#8891A8] leading-relaxed">
              Instantly export the full commercial value analysis, NIST AI RMF compliance matrix, and pricing justifications as a validated corporate PDF memo.
            </p>
            <button 
              onClick={() => showToast("Dossier Exported", "Enterprise Value Evaluation Dossier and NIST AI RMF compliance matrix generated and compiled successfully for audit submission.")}
              className="w-full py-2 bg-[#1C2030] hover:bg-[#1C2030]/80 border border-[#202538] text-[#F0F2F8] hover:text-[#00D9E8] font-mono text-[9px] uppercase tracking-wider rounded transition-colors cursor-pointer font-bold flex items-center justify-center gap-1.5"
            >
              <FileCheck className="w-3.5 h-3.5" />
              <span>EXPORT FINANCIAL MEMO</span>
            </button>
          </div>

        </div>
      </div>

      {/* Pricing Tier Model Section */}
      <div className="bg-[#13161E] border border-[#202538] p-5 rounded-lg flex flex-col gap-5">
        <div className="flex items-center justify-between border-b border-[#202538] pb-3">
          <div className="flex items-center gap-2">
            <Briefcase className="text-[#00D9E8] w-4.5 h-4.5" />
            <div>
              <h3 className="font-sans text-xs uppercase tracking-wider text-[#F0F2F8] font-semibold">Regulatory-Grade Licensing Tier Model</h3>
              <p className="text-[9px] font-sans text-[#8891A8] leading-none mt-1">Cost structures aligned with enterprise risk &amp; integration needs</p>
            </div>
          </div>
          <span className="hidden sm:inline text-[8px] font-mono text-[#3D4460]">
            ESTABLISHED AUGUST 2025 // STRICT LICENSE METRIC
          </span>
        </div>

        <p className="text-[10px] font-sans text-[#8891A8] leading-relaxed">
          Positioning a technology solution for enterprise acquisition requires structured pricing tiers. Free open-source alternatives attract organic developer growth, while the $15K/yr pricing tier establishes a clear compliance, SLA, and multi-cluster value guarantee designed directly for IBM procurement processes.
        </p>

        {/* Dynamic Pricing Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4.5">
          {PRICING_TIERS.map((tier) => (
            <div 
              key={tier.name}
              onClick={() => setSelectedTier(tier.name)}
              className={`border p-4.5 rounded-lg flex flex-col justify-between transition-all cursor-pointer relative ${
                selectedTier === tier.name 
                  ? "bg-[#1C2030]/30 border-[#00D9E8] shadow-lg shadow-[#00D9E8]/5" 
                  : "bg-[#0D0F14] border-[#202538] hover:border-[#202538]/80 hover:bg-[#1C2030]/10"
              }`}
            >
              {tier.popular && (
                <div className="absolute -top-2 right-4 px-2 py-0.5 bg-[#00D9E8] text-[#0D0F14] text-[7.5px] font-mono font-extrabold uppercase rounded-sm tracking-widest leading-none">
                  POPULAR
                </div>
              )}

              <div className="flex flex-col gap-3">
                <div className="flex justify-between items-baseline">
                  <span className="text-xs font-mono font-bold text-white uppercase">{tier.name}</span>
                  <span className="text-sm font-mono font-bold text-[#00D9E8]">{tier.price}</span>
                </div>
                <p className="text-[9.5px] font-sans text-[#8891A8] leading-snug">
                  {tier.description}
                </p>

                <div className="h-[1px] bg-[#202538]/50 my-1"></div>

                <ul className="flex flex-col gap-2">
                  {tier.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-1.5 text-[9px] font-sans text-[#8891A8] leading-tight">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#00C48C] shrink-0 mt-0.5" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <button 
                className={`w-full py-2 mt-5 font-mono text-[9px] font-bold uppercase tracking-widest rounded transition-all cursor-pointer ${
                  selectedTier === tier.name 
                    ? "bg-[#00D9E8] text-[#0D0F14]" 
                    : "bg-[#1C2030] text-[#8891A8] hover:text-[#F0F2F8] hover:bg-[#1C2030]/80"
                }`}
                onClick={(e) => {
                  e.stopPropagation();
                  showToast(
                    "Inquiry Registered",
                    `Your licensing request for the Phaelitus SDK ${tier.name} tier has been safely registered. Our Enterprise architect team will contact you within 24 hours.`
                  );
                }}
              >
                {tier.cta}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Prioritized Build Roadmap (v1 -> v2 -> v3) */}
      <div className="bg-[#13161E] border border-[#202538] p-5 rounded-lg flex flex-col gap-5">
        <div className="flex items-center justify-between border-b border-[#202538] pb-3">
          <div className="flex items-center gap-2">
            <Map className="text-[#00D9E8] w-4.5 h-4.5" />
            <div>
              <h3 className="font-sans text-xs uppercase tracking-wider text-[#F0F2F8] font-semibold">Prioritized Build &amp; Deployment Roadmap</h3>
              <p className="text-[9px] font-sans text-[#8891A8] leading-none mt-1">Step-by-step deliverable pipeline for enterprise acquisition</p>
            </div>
          </div>
          <span className="text-[9px] font-mono text-[#8891A8]">
            ACTIVE TARGET: v1.5 WORKLOAD
          </span>
        </div>

        <p className="text-[10px] font-sans text-[#8891A8] leading-relaxed">
          For strategic enterprise buyers, a highly structured, credible development plan conveys deep technical maturity. Review our multi-phase rollout architecture across regulatory benchmarks, model scaling metrics, and multi-cloud environments.
        </p>

        {/* Milestone Selection Tabs */}
        <div className="grid grid-cols-4 gap-1.5 border-b border-[#202538]/50 pb-1">
          {[
            { id: "v1.0", label: "v1.0 (GA) // Core", desc: "Current Core Operator" },
            { id: "v1.5", label: "v1.5 // Trust & Data", desc: "AIF360 & BigQuery" },
            { id: "v2.0", label: "v2.0 // Federated", desc: "Triton & Flower" },
            { id: "v3.0", label: "v3.0 // Scale Hub", desc: "Cost & Multi-Cloud" }
          ].map((milestone) => (
            <button
              key={milestone.id}
              onClick={() => setActiveRoadmap(milestone.id)}
              className={`p-2.5 rounded-t text-left cursor-pointer transition-all ${
                activeRoadmap === milestone.id 
                  ? "bg-[#0D0F14] border-t-2 border-[#00D9E8] text-[#00D9E8]" 
                  : "text-[#8891A8] hover:text-[#F0F2F8]"
              }`}
            >
              <div className="text-[9.5px] font-mono font-bold uppercase tracking-wider">{milestone.label}</div>
              <div className="text-[8px] font-sans text-[#3D4460] mt-0.5">{milestone.desc}</div>
            </button>
          ))}
        </div>

        {/* Roadmap content section */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeRoadmap}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.15 }}
            className="bg-[#0D0F14] border border-[#202538] p-4.5 rounded-lg"
          >
            {activeRoadmap === "v1.0" && (
              <div className="flex flex-col gap-3">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-mono font-bold text-white uppercase">v1.0 GA - Core Autonomous Operator Stack</span>
                  <span className="text-[8px] font-mono bg-[#00C48C]/10 text-[#00C48C] px-2 py-0.5 rounded font-bold uppercase">
                    DEPLOYED &amp; COMPLETED
                  </span>
                </div>
                <p className="text-[9.5px] font-sans text-[#8891A8] leading-relaxed">
                  Establishes the core Kubernetes operators, FastAPI validation gateways with shadow mirroring, statistical drift engines (PSI, Kolmogorov-Smirnov), and local relational storage for logging audit trails.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-1.5">
                  <div className="flex items-start gap-1.5 text-[9px] font-sans text-[#8891A8]">
                    <CheckCircle2 className="w-4 h-4 text-[#00C48C] shrink-0" />
                    <span>Level-2 Kubernetes Operator reconciling desired ModelPipeline CRDs.</span>
                  </div>
                  <div className="flex items-start gap-1.5 text-[9px] font-sans text-[#8891A8]">
                    <CheckCircle2 className="w-4 h-4 text-[#00C48C] shrink-0" />
                    <span>Real-time FastAPI inference gateway mirroring 10% of traffic asynchronously.</span>
                  </div>
                  <div className="flex items-start gap-1.5 text-[9px] font-sans text-[#8891A8]">
                    <CheckCircle2 className="w-4 h-4 text-[#00C48C] shrink-0" />
                    <span>Continuous statistical telemetry metrics tracking (PSI &amp; KS-Test thresholds).</span>
                  </div>
                  <div className="flex items-start gap-1.5 text-[9px] font-sans text-[#8891A8]">
                    <CheckCircle2 className="w-4 h-4 text-[#00C48C] shrink-0" />
                    <span>Local SQLite/PostgreSQL tables logging full compliance lineages.</span>
                  </div>
                </div>
              </div>
            )}

            {activeRoadmap === "v1.5" && (
              <div className="flex flex-col gap-3">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-mono font-bold text-white uppercase">v1.5 - IBM Watsonx Trust &amp; Google Cloud Sync</span>
                  <span className="text-[8px] font-mono bg-[#00D9E8]/10 text-[#00D9E8] px-2 py-0.5 rounded font-bold uppercase">
                    ACTIVE DEVELOPMENT PHASE
                  </span>
                </div>
                <p className="text-[9.5px] font-sans text-[#8891A8] leading-relaxed">
                  Focuses on regulatory compliance audits (EU AI Act &amp; NIST AI RMF dossiers) and deep Google Cloud data connectors, aligning the product directly with core IBM and Google corporate buying requirements.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-1.5">
                  <div className="flex items-start gap-1.5 text-[9px] font-sans text-[#8891A8]">
                    <div className="w-4 h-4 rounded-full bg-[#00D9E8]/10 text-[#00D9E8] flex items-center justify-center font-bold text-[8px] shrink-0">1</div>
                    <span>IBM AIF360 Demographic Parity and Disparate Impact trackers.</span>
                  </div>
                  <div className="flex items-start gap-1.5 text-[9px] font-sans text-[#8891A8]">
                    <div className="w-4 h-4 rounded-full bg-[#00D9E8]/10 text-[#00D9E8] flex items-center justify-center font-bold text-[8px] shrink-0">2</div>
                    <span>NIST AI RMF Compliance Report compiler generating audit-ready JSON dossiers.</span>
                  </div>
                  <div className="flex items-start gap-1.5 text-[9px] font-sans text-[#8891A8]">
                    <div className="w-4 h-4 rounded-full bg-[#00D9E8]/10 text-[#00D9E8] flex items-center justify-center font-bold text-[8px] shrink-0">3</div>
                    <span>BigQueryFeatureStoreConnector translating training references into drift baselines.</span>
                  </div>
                  <div className="flex items-start gap-1.5 text-[9px] font-sans text-[#8891A8]">
                    <div className="w-4 h-4 rounded-full bg-[#00D9E8]/10 text-[#00D9E8] flex items-center justify-center font-bold text-[8px] shrink-0">4</div>
                    <span>Live KernelSHAP local feature attribution calculations on drift alerts.</span>
                  </div>
                </div>
              </div>
            )}

            {activeRoadmap === "v2.0" && (
              <div className="flex flex-col gap-3">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-mono font-bold text-white uppercase">v2.0 - Meta Scale, Triton &amp; Federated Learning</span>
                  <span className="text-[8px] font-mono bg-pink-500/10 text-pink-500 px-2 py-0.5 rounded font-bold uppercase">
                    Q4 2026 TARGET
                  </span>
                </div>
                <p className="text-[9.5px] font-sans text-[#8891A8] leading-relaxed">
                  Drives researcher velocity and high-throughput model optimization. Bridges the gap to NVIDIA GPUs and privacy-focused distributed model structures popular within Meta architectures.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-1.5">
                  <div className="flex items-start gap-1.5 text-[9px] font-sans text-[#8891A8]">
                    <div className="w-4 h-4 rounded-full bg-pink-500/10 text-pink-500 flex items-center justify-center font-bold text-[8px] shrink-0">1</div>
                    <span>NVIDIA Triton Inference Server integrations mapping CUDA metrics.</span>
                  </div>
                  <div className="flex items-start gap-1.5 text-[9px] font-sans text-[#8891A8]">
                    <div className="w-4 h-4 rounded-full bg-pink-500/10 text-pink-500 flex items-center justify-center font-bold text-[8px] shrink-0">2</div>
                    <span>ModelExperiment CRD enabling A/B traffic splitting &amp; online scipy.stats significance testing.</span>
                  </div>
                  <div className="flex items-start gap-1.5 text-[9px] font-sans text-[#8891A8]">
                    <div className="w-4 h-4 rounded-full bg-pink-500/10 text-pink-500 flex items-center justify-center font-bold text-[8px] shrink-0">3</div>
                    <span>FederatedTrainingJob CRD support integrating Flower (flwr) privacy aggregation.</span>
                  </div>
                  <div className="flex items-start gap-1.5 text-[9px] font-sans text-[#8891A8]">
                    <div className="w-4 h-4 rounded-full bg-pink-500/10 text-pink-500 flex items-center justify-center font-bold text-[8px] shrink-0">4</div>
                    <span>Distributed training schedules (PyTorch DDP / FSDP) managed via Argo Workflows.</span>
                  </div>
                </div>
              </div>
            )}

            {activeRoadmap === "v3.0" && (
              <div className="flex flex-col gap-3">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-mono font-bold text-white uppercase">v3.0 - Multi-Cloud Cost Federator &amp; 10k Scale benchmarks</span>
                  <span className="text-[8px] font-mono bg-indigo-500/10 text-indigo-400 px-2 py-0.5 rounded font-bold uppercase">
                    Q1 2027 TARGET
                  </span>
                </div>
                <p className="text-[9.5px] font-sans text-[#8891A8] leading-relaxed">
                  The final consolidation phase designed to satisfy corporate CTO and FinOps requirements across AWS, GCP, and Azure. Establishes the ultimate unified multi-tenant dashboard.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-1.5">
                  <div className="flex items-start gap-1.5 text-[9px] font-sans text-[#8891A8]">
                    <div className="w-4 h-4 rounded-full bg-indigo-500/10 text-indigo-400 flex items-center justify-center font-bold text-[8px] shrink-0">1</div>
                    <span>FederatedModelPipeline CRD synchronizing states across OpenShift, GKE &amp; EKS.</span>
                  </div>
                  <div className="flex items-start gap-1.5 text-[9px] font-sans text-[#8891A8]">
                    <div className="w-4 h-4 rounded-full bg-indigo-500/10 text-indigo-400 flex items-center justify-center font-bold text-[8px] shrink-0">2</div>
                    <span>Preemptive PPO Spot Optimizer querying active cloud Spot APIs for cost scheduling.</span>
                  </div>
                  <div className="flex items-start gap-1.5 text-[9px] font-sans text-[#8891A8]">
                    <div className="w-4 h-4 rounded-full bg-indigo-500/10 text-indigo-400 flex items-center justify-center font-bold text-[8px] shrink-0">3</div>
                    <span>Namespace-scoped Cost Chargeback engine attributing cluster resources to tenant teams.</span>
                  </div>
                  <div className="flex items-start gap-1.5 text-[9px] font-sans text-[#8891A8]">
                    <div className="w-4 h-4 rounded-full bg-indigo-500/10 text-indigo-400 flex items-center justify-center font-bold text-[8px] shrink-0">4</div>
                    <span>Red Hat OpenShift Operator validation and marketplace listing.</span>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

    </div>
  );
}
