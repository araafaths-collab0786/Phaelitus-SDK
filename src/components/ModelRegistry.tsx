import React, { useState } from "react";
import { 
  Shield, 
  FileText, 
  CheckCircle, 
  AlertTriangle, 
  ChevronRight, 
  BarChart3, 
  Lock, 
  Code, 
  Download, 
  Search, 
  BrainCircuit,
  Settings,
  FlameKindling
} from "lucide-react";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, ReferenceLine } from "recharts";
import { ModelMetadata } from "../types";
import { Card, Badge, Button, Tooltip as UITooltip } from "./ui";
import { motion, AnimatePresence } from "motion/react";
import { ANIMATIONS } from "./ui/animations";

const INITIAL_MODELS: ModelMetadata[] = [
  {
    name: "google-gemini-pro-1.5",
    version: "v1.5-pro",
    status: "active",
    trafficSplit: 100,
    lastUpdated: "2026-06-26 12:15:30",
    signature: "sha256:vErTex99... [cosign verified]",
    shaHash: "f2ca1bb6c7e907d06dafe4687e579fce76b3774e94b7ff4357eefb8bdf1542850",
    sbomUrl: "/compliance/sboms/google-gemini-pro-1.5.json",
    accuracy: 99.1,
    driftTrend: [
      { name: "Day 1", score: 0.02 },
      { name: "Day 2", score: 0.01 },
      { name: "Day 3", score: 0.02 },
      { name: "Day 4", score: 0.01 },
      { name: "Day 5", score: 0.03 },
      { name: "Day 6", score: 0.02 },
      { name: "Day 7", score: 0.02 },
    ],
    provider: "Google Vertex AI",
    framework: "Vertex AI / JAX",
  },
  {
    name: "ibm-granite-3.0-instruct",
    version: "v3.0",
    status: "drift_detected",
    trafficSplit: 90,
    lastUpdated: "2026-06-25 18:22:11",
    signature: "sha256:ibmG8A1... [cosign verified]",
    shaHash: "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
    sbomUrl: "/compliance/sboms/ibm-granite-v3.0.json",
    accuracy: 94.2,
    driftTrend: [
      { name: "Day 1", score: 0.05 },
      { name: "Day 2", score: 0.08 },
      { name: "Day 3", score: 0.12 },
      { name: "Day 4", score: 0.22 },
      { name: "Day 5", score: 0.45 },
      { name: "Day 6", score: 0.72 },
      { name: "Day 7", score: 0.88 },
    ],
    provider: "IBM watsonx.ai",
    framework: "watsonx.governance",
  },
  {
    name: "meta-llama-3.1-8b",
    version: "v3.1-instruct",
    status: "drift_detected",
    trafficSplit: 100,
    lastUpdated: "2026-06-26 11:05:00",
    signature: "sha256:metaL99... [cosign verified]",
    shaHash: "cf83e1357eefb8bdf1542850d66d8007d620e4050b5715dc83f4a921d36ce9ce4",
    sbomUrl: "/compliance/sboms/meta-llama-3.1-8b.json",
    accuracy: 98.7,
    driftTrend: [
      { name: "Day 1", score: 0.01 },
      { name: "Day 2", score: 0.02 },
      { name: "Day 3", score: 0.01 },
      { name: "Day 4", score: 0.03 },
      { name: "Day 5", score: 0.15 },
      { name: "Day 6", score: 0.45 },
      { name: "Day 7", score: 1.00 },
    ],
    provider: "Meta AI",
    framework: "PyTorch",
  },
  {
    name: "credit-scoring-model",
    version: "v1.0",
    status: "active",
    trafficSplit: 100,
    lastUpdated: "2026-06-20 14:33:10",
    signature: "sha256:q5W2e11... [cosign verified]",
    shaHash: "904b7ff4357eefb8bdf1542850e3b0c44298fc1c149afbf4c8996fb92427ae41e",
    sbomUrl: "/compliance/sboms/credit-scoring-model-v1.0.json",
    accuracy: 91.8,
    driftTrend: [
      { name: "Day 1", score: 0.01 },
      { name: "Day 2", score: 0.02 },
      { name: "Day 3", score: 0.01 },
      { name: "Day 4", score: 0.01 },
      { name: "Day 5", score: 0.02 },
      { name: "Day 6", score: 0.015 },
      { name: "Day 7", score: 0.012 },
    ],
    provider: "IBM watsonx.ai",
    framework: "watsonx.governance",
  },
  {
    name: "fraud-detector-v3",
    version: "v3.1",
    status: "active",
    trafficSplit: 100,
    lastUpdated: "2026-06-24 09:12:44",
    signature: "sha256:p1L4g82... [cosign verified]",
    shaHash: "f2ca1bb6c7e907d06dafe4687e579fce76b3774e94b7ff4357eefb8bdf1542850",
    sbomUrl: "/compliance/sboms/fraud-detector-v3.1.json",
    accuracy: 89.5,
    driftTrend: [
      { name: "Day 1", score: 0.02 },
      { name: "Day 2", score: 0.03 },
      { name: "Day 3", score: 0.02 },
      { name: "Day 4", score: 0.04 },
      { name: "Day 5", score: 0.03 },
      { name: "Day 6", score: 0.02 },
      { name: "Day 7", score: 0.03 },
    ],
    provider: "Google Vertex AI",
    framework: "Scikit-Learn",
  }
];

export default function ModelRegistry() {
  const [models] = useState<ModelMetadata[]>(INITIAL_MODELS);
  const [selectedModel, setSelectedModel] = useState<ModelMetadata>(INITIAL_MODELS[0]);
  const [showSbom, setShowSbom] = useState(false);
  const [copiedHash, setCopiedHash] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredModels = models.filter((m) =>
    m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.provider?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.framework?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const generateSbomJson = (model: ModelMetadata) => {
    return {
      bomFormat: "CycloneDX",
      specVersion: "1.5",
      serialNumber: `urn:uuid:${model.name}-sbom-compliance-665azsr54yq`,
      version: 1,
      metadata: {
        timestamp: new Date().toISOString(),
        tools: [
          { vendor: "Phaelitus SDK", name: "sbom-generator-plugin", version: "1.4.0" }
        ],
        component: {
          group: "com.phaelitus.models",
          name: model.name,
          version: model.version,
          type: "machine-learning-model",
          description: `Cryptographically audited deployment bundle for ${model.name}.`
        }
      },
      components: [
        {
          name: `${model.name}-weights.bin`,
          type: "file",
          hashes: [
            { alg: "SHA-256", content: model.shaHash }
          ],
          signature: {
            algorithm: "ECDSA-SHA256",
            publicKey: "MFkwEwYHKoZIzj0CAQYIKoZIzj0DAQcDQgAE...",
            value: model.signature.split(" ")[0]
          }
        },
        {
          name: "training-data-manifest.json",
          type: "file",
          hashes: [
            { alg: "SHA-256", content: "8f4357eefb8bdf1542850d66d8007d620e4050b5715dc83f4a921d36ce9ce4cf" }
          ]
        },
        {
          name: "scikit-learn",
          type: "library",
          version: "1.3.2"
        },
        {
          name: "xgboost",
          type: "library",
          version: "2.0.1"
        }
      ]
    };
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 items-start">
      
      {/* Left Column: Registered Model Pipelines */}
      <div className="lg:col-span-1 flex flex-col gap-3">
        <div className="flex justify-between items-center pl-1">
          <span className="text-[10px] font-mono text-[#8891A8] uppercase tracking-widest font-bold">
            Registered Pipelines
          </span>
          <Badge variant="primary" glow={false}>
            COUNT: {filteredModels.length}
          </Badge>
        </div>

        {/* Filter input */}
        <div className="relative">
          <Search className="w-3.5 h-3.5 text-white/30 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Filter models, providers, frameworks..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-[#080C14] border border-white/5 hover:border-[#00D9E8]/30 focus:border-[#00D9E8] rounded pl-9 pr-12 py-2 text-xs text-white placeholder-white/30 outline-none transition-all"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[9px] font-mono text-white/50 hover:text-[#FF3B5C]"
            >
              CLEAR
            </button>
          )}
        </div>

        {/* Model Pipeline Buttons */}
        <div className="flex flex-col gap-2.5 max-h-[500px] overflow-y-auto no-scrollbar">
          <AnimatePresence>
            {filteredModels.length === 0 ? (
              <div className="bg-[#080C14] border border-white/5 p-8 rounded text-center flex flex-col items-center justify-center">
                <BrainCircuit className="w-8 h-8 text-[#FF3B5C] mb-2 animate-pulse" />
                <span className="text-xs text-white font-serif font-bold">No Match Found</span>
                <p className="text-[10px] font-mono text-[#8891A8] uppercase tracking-wider mt-1">
                  Try resetting filters.
                </p>
              </div>
            ) : (
              filteredModels.map((model) => {
                const isSelected = selectedModel.name === model.name;
                return (
                  <motion.button
                    key={model.name}
                    onClick={() => {
                      setSelectedModel(model);
                      setShowSbom(false);
                    }}
                    className={`text-left p-3.5 rounded border transition-all relative overflow-hidden group cursor-pointer ${
                      isSelected
                        ? "bg-[#00D9E8]/8 border-[#00D9E8]"
                        : "bg-[#080C14] border-white/5 hover:bg-[#0C1120] hover:border-white/10"
                    }`}
                    whileHover={{ x: 2 }}
                    layoutId={`model-card-${model.name}`}
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex flex-col gap-1.5 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-serif text-xs font-bold text-[#F0F2F8] truncate">{model.name}</span>
                          <span className="text-[8px] font-mono px-1 py-0.5 bg-[#050810] border border-white/5 text-white/40 rounded uppercase">
                            {model.version}
                          </span>
                        </div>
                        {model.provider && (
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span className="bg-[#050810] border border-white/5 text-[#8891A8] px-1.5 py-0.5 rounded text-[8px] font-mono uppercase font-bold">
                              {model.provider}
                            </span>
                            <span className="text-[8px] font-mono text-white/40 uppercase">
                              {model.framework}
                            </span>
                          </div>
                        )}
                      </div>
                      <span 
                        className={`w-1.5 h-1.5 rounded-full flex-shrink-0 mt-1 ${
                          model.status === "active" 
                            ? "bg-[#00C48C] shadow-[0_0_8px_#00C48C]" 
                            : "bg-[#FF3B5C] shadow-[0_0_8px_#FF3B5C] animate-pulse"
                        }`}
                      />
                    </div>

                    <div className="flex justify-between items-center mt-3 pt-2.5 border-t border-white/3 text-[9px] font-mono tracking-wider uppercase">
                      <span className="text-white/40">ACC: <span className="text-white font-bold">{model.accuracy}%</span></span>
                      <span className="text-white/40">TRAFFIC: <span className="text-white font-bold">{model.trafficSplit}%</span></span>
                    </div>

                    <div className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <ChevronRight className="w-3.5 h-3.5 text-[#00D9E8]" />
                    </div>
                  </motion.button>
                );
              })
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Right Column: Model Details and Charts */}
      <div className="lg:col-span-2 flex flex-col gap-5">
        <Card 
          title={`${selectedModel.name} pipeline specifications`}
          subtitle="Cryptographic verification and drift stats"
          statusColor={selectedModel.status === "active" ? "success" : "critical"}
          headerActions={
            <Button
              variant={showSbom ? "primary" : "ghost"}
              onClick={() => setShowSbom(!showSbom)}
              size="xs"
              icon={Download}
            >
              {showSbom ? "VIEW LIFECYCLE" : "GENERATE SBOM"}
            </Button>
          }
        >
          <AnimatePresence mode="wait">
            {showSbom ? (
              /* CycloneDX SBOM View */
              <motion.div 
                key="sbom"
                variants={ANIMATIONS.entrance}
                initial="initial"
                animate="animate"
                exit="exit"
                className="flex flex-col gap-3"
              >
                <div className="flex justify-between items-center bg-[#050810] px-3.5 py-2 rounded-t border border-white/5">
                  <span className="text-[9px] font-mono tracking-wider font-bold text-[#00D9E8] flex items-center gap-1.5 uppercase">
                    <Shield className="w-3.5 h-3.5 text-[#00D9E8]" />
                    CycloneDX SBOM &bull; Audited Artifact Spec
                  </span>
                  <span className="text-[8px] font-mono text-[#8891A8]">SPEC_V1.5 &bull; CRYPTOGRAPHIC</span>
                </div>
                <pre className="bg-[#050810] p-4 border-b border-l border-r border-white/5 rounded-b font-mono text-[10px] text-[#00C48C] overflow-x-auto max-h-72 select-all scrollbar-thin">
                  {JSON.stringify(generateSbomJson(selectedModel), null, 2)}
                </pre>
                <div className="flex justify-end gap-2">
                  <Button 
                    onClick={() => {
                      const blob = new Blob([JSON.stringify(generateSbomJson(selectedModel), null, 2)], { type: 'application/json' });
                      const url = URL.createObjectURL(blob);
                      const a = document.createElement('a');
                      a.href = url;
                      a.download = `${selectedModel.name}-CycloneDX-SBOM.json`;
                      a.click();
                    }}
                    variant="ghost"
                    size="xs"
                    icon={Download}
                  >
                    Download Artifact JSON
                  </Button>
                </div>
              </motion.div>
            ) : (
              /* Performance & Charts View */
              <motion.div 
                key="performance"
                variants={ANIMATIONS.entrance}
                initial="initial"
                animate="animate"
                exit="exit"
                className="flex flex-col gap-5"
              >
                {/* Stats Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="bg-[#050810] border border-white/5 rounded p-3">
                    <span className="text-[8px] font-mono uppercase tracking-wider text-[#8891A8] block font-bold">CRYPTOGRAPHIC SIGNATURE</span>
                    <span className="text-[9.5px] font-mono text-[#00D9E8] font-bold flex items-center gap-1 mt-1.5 truncate" title={selectedModel.signature}>
                      <Lock className="w-3 h-3 flex-shrink-0 text-[#00D9E8]" />
                      {selectedModel.signature}
                    </span>
                  </div>
                  <div className="bg-[#050810] border border-white/5 rounded p-3 flex flex-col justify-between min-w-0">
                    <div>
                      <span className="text-[8px] font-mono uppercase tracking-wider text-[#8891A8] block font-bold">MANIFEST HASH</span>
                      <div className="flex items-center justify-between gap-1.5 mt-1 bg-[#080C14] border border-white/4 px-2 py-0.5 rounded">
                        <span className="text-[9px] font-mono text-[#F0F2F8] truncate" title={selectedModel.shaHash}>
                          {selectedModel.shaHash}
                        </span>
                        <button 
                          onClick={() => {
                            navigator.clipboard.writeText(selectedModel.shaHash || "");
                            setCopiedHash(true);
                            setTimeout(() => setCopiedHash(false), 2000);
                          }}
                          className="text-[#8891A8] hover:text-[#00D9E8]"
                          title="Copy hash"
                        >
                          {copiedHash ? <CheckCircle className="w-3 h-3 text-[#00C48C]" /> : <FileText className="w-3 h-3" />}
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="bg-[#050810] border border-white/5 rounded p-3">
                    <span className="text-[8px] font-mono uppercase tracking-wider text-[#8891A8] block font-bold">PROMOTION GATE STATUS</span>
                    <span className="text-[9.5px] font-mono uppercase tracking-wider text-[#00C48C] font-bold flex items-center gap-1.5 mt-1.5">
                      <CheckCircle className="w-3 h-3 text-[#00C48C]" />
                      P99 &lt; 50ms (PASS)
                    </span>
                  </div>
                </div>

                {/* Trust Badge Row */}
                <div className="flex flex-wrap gap-2">
                  <Badge variant="success">
                    Secure Governance Portal
                  </Badge>
                  <Badge variant="secondary">
                    SOC 2 Compliant &bull; EU AI Act Ready
                  </Badge>
                </div>

                {/* Chart */}
                <div className="flex flex-col gap-2">
                  <div className="flex justify-between items-center">
                    <span className="text-[9.5px] font-mono text-[#8891A8] uppercase font-bold tracking-wider flex items-center gap-1.5">
                      <BarChart3 className="w-3.5 h-3.5 text-[#00D9E8]" />
                      Statistical Drift Time-Series (7-Day History)
                    </span>
                    <span className="text-[8px] font-mono text-[#FF3B5C] font-bold tracking-widest">
                      RETRAIN THRESHOLD: &gt;0.28
                    </span>
                  </div>
                  
                  <div className="h-44 w-full bg-[#050810] rounded border border-white/5 p-2">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={selectedModel.driftTrend}>
                        <defs>
                          <linearGradient id="colorDrift" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor={selectedModel.status === "active" ? "#00D9E8" : "#FF3B5C"} stopOpacity={0.25}/>
                            <stop offset="95%" stopColor={selectedModel.status === "active" ? "#00D9E8" : "#FF3B5C"} stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <XAxis dataKey="name" stroke="#202538" tick={{ fill: "#8891A8", fontSize: 9 }} tickLine={false} />
                        <YAxis stroke="#202538" tick={{ fill: "#8891A8", fontSize: 9 }} tickLine={false} domain={[0, 1.1]} />
                        <Tooltip 
                          contentStyle={{ backgroundColor: "#0C1120", borderColor: "rgba(255,255,255,0.05)", borderRadius: "4px" }}
                          labelStyle={{ color: "#F0F2F8", fontSize: "10px", fontFamily: "monospace" }}
                          itemStyle={{ color: "#00D9E8", fontSize: "10px", fontFamily: "monospace" }}
                        />
                        <ReferenceLine y={0.28} stroke="#FF3B5C" strokeDasharray="3 3" />
                        <Area 
                          type="monotone" 
                          dataKey="score" 
                          stroke={selectedModel.status === "active" ? "#00D9E8" : "#FF3B5C"} 
                          strokeWidth={1.5}
                          fillOpacity={1} 
                          fill="url(#colorDrift)" 
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </Card>
      </div>

    </div>
  );
}
