import React, { useState, useEffect } from "react";
import { Cpu, Activity, HardDrive, RefreshCw, CheckCircle2, Clock, Server, AlertTriangle, ArrowUpRight, ArrowDown } from "lucide-react";
import { motion } from "motion/react";

export default function SystemHealth() {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastRefreshed, setLastRefreshed] = useState<string>(new Date().toLocaleTimeString());
  
  // Simulated changing state metrics
  const [kafkaLag, setKafkaLag] = useState(1420);
  const [reconciliationQueue, setReconciliationQueue] = useState(3);
  const [apiLatency, setApiLatency] = useState(14.8);
  const [successRate, setSuccessRate] = useState(99.98);

  const triggerRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setKafkaLag(Math.floor(1000 + Math.random() * 800));
      setReconciliationQueue(Math.floor(1 + Math.random() * 4));
      setApiLatency(parseFloat((12 + Math.random() * 5).toFixed(1)));
      setSuccessRate(parseFloat((99.9 + Math.random() * 0.09).toFixed(2)));
      setLastRefreshed(new Date().toLocaleTimeString());
      setIsRefreshing(false);
    }, 800);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      // Small real-time variance
      setKafkaLag((prev) => Math.max(0, prev + Math.floor(Math.random() * 40 - 20)));
      setApiLatency((prev) => parseFloat(Math.max(8, prev + (Math.random() * 2 - 1)).toFixed(1)));
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col gap-6" id="system-health-root">
      
      {/* Title Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between border-b border-[#202538] pb-4 gap-4">
        <div>
          <h2 className="font-serif text-lg font-bold text-white tracking-wide flex items-center gap-2">
            <Server className="w-5 h-5 text-[#00D9E8]" />
            Self-Observability &amp; Platform Health
          </h2>
          <p className="text-[10px] font-sans text-[#8891A8] mt-1">
            Real-time diagnostics of the Phaelitus SDK control plane itself: monitoring our internal ingestion brokers, workers, and API layers.
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <span className="text-[9px] font-mono text-[#8891A8]">
            LAST CHECKED: <span className="text-white font-bold">{lastRefreshed}</span>
          </span>
          <button
            onClick={triggerRefresh}
            disabled={isRefreshing}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-[#1C2030] border border-[#202538] hover:border-[#00D9E8]/30 text-[10px] font-mono uppercase tracking-wider font-bold transition-all cursor-pointer text-white"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? "animate-spin text-[#00D9E8]" : "text-[#8891A8]"}`} />
            <span>Force Diagnostics Run</span>
          </button>
        </div>
      </div>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
        
        {/* Kafka Ingestion Lag */}
        <div className="bg-[#13161E] border border-[#202538] p-5 rounded-lg flex flex-col gap-2 relative overflow-hidden group">
          <div className="flex justify-between items-start">
            <span className="text-[9px] font-mono text-[#8891A8] uppercase tracking-wider">KAFKA CONSUMER LAG</span>
            <Activity className="w-4 h-4 text-[#00D9E8]" />
          </div>
          <div className="flex items-baseline gap-1.5 mt-2">
            <span className="text-xl font-mono font-bold text-white">{kafkaLag.toLocaleString()}</span>
            <span className="text-[9px] font-mono text-[#8891A8]">msgs</span>
          </div>
          <div className="flex items-center gap-1 mt-1">
            <span className="text-[8px] font-mono bg-[#00C48C]/10 text-[#00C48C] px-1.5 py-0.5 rounded font-bold">NOMINAL</span>
            <span className="text-[8.5px] text-[#8891A8] font-sans">Below warning limit (10k)</span>
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#00D9E8]/20 group-hover:bg-[#00D9E8] transition-colors" />
        </div>

        {/* Reconciliation Depth */}
        <div className="bg-[#13161E] border border-[#202538] p-5 rounded-lg flex flex-col gap-2 relative overflow-hidden group">
          <div className="flex justify-between items-start">
            <span className="text-[9px] font-mono text-[#8891A8] uppercase tracking-wider">RECONCILIATION QUEUE</span>
            <Cpu className="w-4 h-4 text-[#7B61FF]" />
          </div>
          <div className="flex items-baseline gap-1.5 mt-2">
            <span className="text-xl font-mono font-bold text-white">{reconciliationQueue}</span>
            <span className="text-[9px] font-mono text-[#8891A8]">active threads</span>
          </div>
          <div className="flex items-center gap-1 mt-1">
            <span className="text-[8px] font-mono bg-[#00C48C]/10 text-[#00C48C] px-1.5 py-0.5 rounded font-bold">STABLE</span>
            <span className="text-[8.5px] text-[#8891A8] font-sans">0 backlogged triggers</span>
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#7B61FF]/20 group-hover:bg-[#7B61FF] transition-colors" />
        </div>

        {/* Control API Latency */}
        <div className="bg-[#13161E] border border-[#202538] p-5 rounded-lg flex flex-col gap-2 relative overflow-hidden group">
          <div className="flex justify-between items-start">
            <span className="text-[9px] font-mono text-[#8891A8] uppercase tracking-wider">CONTROL API LATENCY</span>
            <Clock className="w-4 h-4 text-[#00C48C]" />
          </div>
          <div className="flex items-baseline gap-1.5 mt-2">
            <span className="text-xl font-mono font-bold text-white">{apiLatency}</span>
            <span className="text-[9px] font-mono text-[#8891A8]">ms</span>
          </div>
          <div className="flex items-center gap-1 mt-1">
            <span className="text-[8px] font-mono bg-[#00C48C]/10 text-[#00C48C] px-1.5 py-0.5 rounded font-bold">HEALTHY</span>
            <span className="text-[8.5px] text-[#8891A8] font-sans">P99 response bounds</span>
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#00C48C]/20 group-hover:bg-[#00C48C] transition-colors" />
        </div>

        {/* API Success Rate */}
        <div className="bg-[#13161E] border border-[#202538] p-5 rounded-lg flex flex-col gap-2 relative overflow-hidden group">
          <div className="flex justify-between items-start">
            <span className="text-[9px] font-mono text-[#8891A8] uppercase tracking-wider">INTERNAL API SUCCESS</span>
            <CheckCircle2 className="w-4 h-4 text-[#F5A623]" />
          </div>
          <div className="flex items-baseline gap-1.5 mt-2">
            <span className="text-xl font-mono font-bold text-white">{successRate}%</span>
            <span className="text-[9px] font-mono text-[#8891A8]">HTTP 2xx</span>
          </div>
          <div className="flex items-center gap-1 mt-1">
            <span className="text-[8px] font-mono bg-[#00C48C]/10 text-[#00C48C] px-1.5 py-0.5 rounded font-bold">EXCELLENT</span>
            <span className="text-[8.5px] text-[#8891A8] font-sans">Goal is &gt;99.9%</span>
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#F5A623]/20 group-hover:bg-[#F5A623] transition-colors" />
        </div>

      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Core microservices log monitoring status */}
        <div className="lg:col-span-8 bg-[#13161E] border border-[#202538] p-5 rounded-lg flex flex-col gap-4">
          <span className="text-[10px] font-mono text-white uppercase tracking-wider font-bold block border-b border-[#202538] pb-2">
            Active Microservices &amp; Pod Health Matrices
          </span>

          <div className="flex flex-col gap-3">
            {[
              {
                name: "phaelitus-operator-controller-manager",
                role: "Core Kubernetes Custom Resource controller",
                status: "Running",
                uptime: "34d 12h",
                replicas: "2/2",
                cpu: "0.12 Cores",
                memory: "156MB"
              },
              {
                name: "phaelitus-kafka-ingestion-adapter",
                role: "High-throughput stream Consumer Partition parser",
                status: "Running",
                uptime: "12d 4h",
                replicas: "3/3",
                cpu: "0.45 Cores",
                memory: "512MB"
              },
              {
                name: "phaelitus-psi-calculator-engine",
                role: "Continuous statistical variance analyzer",
                status: "Running",
                uptime: "12d 4h",
                replicas: "4/4",
                cpu: "0.88 Cores",
                memory: "1024MB"
              },
              {
                name: "phaelitus-postgres-sync-broker",
                role: "Durable Cloud SQL persistent connector",
                status: "Running",
                uptime: "8d 19h",
                replicas: "2/2",
                cpu: "0.08 Cores",
                memory: "128MB"
              }
            ].map((micro, idx) => (
              <div key={idx} className="bg-[#0D0F14] border border-[#202538] p-3.5 rounded flex items-center justify-between gap-4 flex-wrap md:flex-nowrap">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-[#00C48C]/10 rounded-full shrink-0">
                    <Server className="w-4 h-4 text-[#00C48C]" />
                  </div>
                  <div>
                    <h4 className="text-[11px] font-mono font-bold text-white leading-none">{micro.name}</h4>
                    <p className="text-[9.5px] font-sans text-[#8891A8] mt-1">{micro.role}</p>
                  </div>
                </div>

                <div className="flex items-center gap-6 text-[10px] font-mono text-[#8891A8]">
                  <div className="flex flex-col">
                    <span className="text-[8px] uppercase font-bold text-[#3D4460]">Uptime</span>
                    <span className="text-[#F0F2F8]">{micro.uptime}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[8px] uppercase font-bold text-[#3D4460]">Pods</span>
                    <span className="text-[#00C48C] font-bold">{micro.replicas}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[8px] uppercase font-bold text-[#3D4460]">Limits</span>
                    <span className="text-white">{micro.cpu} | {micro.memory}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Sidebar explaining security / SLA stats */}
        <div className="lg:col-span-4 flex flex-col gap-5">
          <div className="bg-[#13161E] border border-[#202538] p-5 rounded-lg flex flex-col gap-4">
            <span className="text-[10px] font-mono text-white uppercase tracking-wider font-bold">Self-Repairing Systems</span>
            <p className="text-[10.5px] font-sans text-[#8891A8] leading-relaxed">
              Phaelitus SDK includes autonomous self-healing watchdogs that monitor all cluster adapters. If communication with PostgreSQL is interrupted, the proxy automatically falls back to an in-memory secure SQLite database until the downstream sync establishes reconnectivity.
            </p>

            <div className="p-3.5 bg-[#0D0F14] border border-[#202538] rounded-lg flex flex-col gap-2">
              <span className="text-[8px] font-mono text-[#00D9E8] font-bold uppercase tracking-widest">Self-Recovery Logs</span>
              <div className="flex flex-col gap-1 font-mono text-[9px] text-[#8891A8]">
                <div className="flex justify-between">
                  <span>SQLite Telemetry Snapshot</span>
                  <span className="text-[#00C48C] font-bold">STABLE</span>
                </div>
                <div className="flex justify-between">
                  <span>Recon Worker Thread #3</span>
                  <span className="text-[#00C48C] font-bold">NOMINAL</span>
                </div>
                <div className="flex justify-between">
                  <span>Heartbeat Beacon Broker</span>
                  <span className="text-[#00C48C] font-bold">99.999% SLA</span>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
