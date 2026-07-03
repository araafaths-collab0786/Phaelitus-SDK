import React, { useState, useRef, useEffect } from "react";
import { Terminal, Shield, Play, HelpCircle, CornerDownLeft, Sparkles, AlertTriangle } from "lucide-react";

interface CommandResponse {
  input: string;
  output: string | React.ReactNode;
}

export default function DeveloperCLI() {
  const [history, setHistory] = useState<CommandResponse[]>([]);
  const [currentInput, setCurrentInput] = useState("");
  const terminalEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Seed initial welcome message
    setHistory([
      {
        input: "",
        output: (
          <div className="flex flex-col gap-2 font-mono text-[11px] leading-relaxed text-[#8891A8]">
            <pre className="text-[#00D9E8] font-bold text-xs font-mono leading-none">
{` _   _                      _ _____
| \\ | | ___ _   _ _ __ __ _| |  _  | _ __  ___
|  \\| |/ _ \\ | | | '__/ _\` | | | | || '_ \\/ __|
| |\\  |  __/ |_| | | | (_| | \\ \\_/ /| |_) \\__ \\
|_| \\_|\\___|\\__,_|_|  \\__,_|_|\\___/ | .__/|___/
                                    |_|`}
            </pre>
            <div className="mt-2 text-white font-bold">Phaelitus SDK Interactive Command Line Interface v1.4.0</div>
            <div>Synchronized with active cluster: <span className="text-[#00C48C]">us-east-prod-01</span> (PostgreSQL Cloud SQL backend)</div>
            <div>Type <span className="text-[#00D9E8] font-bold">"help"</span> or <span className="text-[#00D9E8] font-bold">"phaelitus help"</span> to discover the active control-plane schema.</div>
            <div className="h-[1px] bg-[#202538] my-1"></div>
          </div>
        )
      }
    ]);
  }, []);

  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [history]);

  const handleCommandSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanInput = currentInput.trim();
    if (!cleanInput) return;

    let output: React.ReactNode = "";
    const lowerInput = cleanInput.toLowerCase();

    if (lowerInput === "help" || lowerInput === "phaelitus help" || lowerInput === "phaelitus --help") {
      output = (
        <div className="flex flex-col gap-1.5 text-[11px] text-[#8891A8] font-mono leading-relaxed">
          <div className="text-white font-bold mb-1">Available Phaelitus SDK commands:</div>
          <div>&bull; <span className="text-[#00D9E8] font-bold">phaelitus init</span> - Bootstraps a fresh local ModelPipeline custom YAML spec.</div>
          <div>&bull; <span className="text-[#00D9E8] font-bold">phaelitus pipeline list</span> - List all registered model pipelines.</div>
          <div>&bull; <span className="text-[#00D9E8] font-bold">phaelitus drift status --model [name]</span> - Get statistical evaluation details &amp; drift status.</div>
          <div>&bull; <span className="text-[#00D9E8] font-bold">phaelitus rollback --model [name] --to [version]</span> - Roll back deployment canary to stable version.</div>
          <div>&bull; <span className="text-[#00D9E8] font-bold">phaelitus compliance report --framework nist-ai-rmf</span> - Generate a NIST AI RMF compliance dossier.</div>
          <div>&bull; <span className="text-[#00D9E8] font-bold">phaelitus cost attribution</span> - View monthly multi-cloud Spot/Preemptible GPU costs.</div>
          <div>&bull; <span className="text-[#00D9E8] font-bold">clear</span> - Clear terminal session.</div>
        </div>
      );
    } else if (lowerInput === "clear") {
      setHistory([]);
      setCurrentInput("");
      return;
    } else if (lowerInput === "phaelitus pipeline list") {
      output = (
        <div className="flex flex-col gap-1.5 text-[11px] text-[#8891A8] font-mono leading-relaxed">
          <div className="text-white font-bold mb-0.5">REGISTERED MODEL PIPELINES (CRDs):</div>
          <table className="w-full text-left border border-[#202538]">
            <thead>
              <tr className="bg-[#1C2030]/50 text-white font-bold border-b border-[#202538]">
                <th className="p-1.5">CRD NAME</th>
                <th className="p-1.5">VERSION</th>
                <th className="p-1.5">STATUS</th>
                <th className="p-1.5 text-right">ACCURACY</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#202538]/50">
              <tr>
                <td className="p-1.5 text-white font-bold">google-gemini-pro-1.5</td>
                <td className="p-1.5">v1.5-pro</td>
                <td className="p-1.5 text-[#00C48C] font-bold">ACTIVE</td>
                <td className="p-1.5 text-right text-white">99.1%</td>
              </tr>
              <tr>
                <td className="p-1.5 text-white font-bold">ibm-granite-3.0-instruct</td>
                <td className="p-1.5">v3.0</td>
                <td className="p-1.5 text-[#FF3B5C] font-bold">DRIFT_DETECTED</td>
                <td className="p-1.5 text-right text-white">94.2%</td>
              </tr>
              <tr>
                <td className="p-1.5 text-white font-bold">meta-llama-3.1-8b</td>
                <td className="p-1.5">v3.1-instruct</td>
                <td className="p-1.5 text-[#FF3B5C] font-bold">DRIFT_DETECTED</td>
                <td className="p-1.5 text-right text-white">98.7%</td>
              </tr>
              <tr>
                <td className="p-1.5 text-white font-bold">credit-scoring-model</td>
                <td className="p-1.5">v1.0</td>
                <td className="p-1.5 text-[#00C48C] font-bold">ACTIVE</td>
                <td className="p-1.5 text-right text-white">91.8%</td>
              </tr>
              <tr>
                <td className="p-1.5 text-white font-bold">fraud-detector-v3</td>
                <td className="p-1.5">v3.1</td>
                <td className="p-1.5 text-[#00C48C] font-bold">ACTIVE</td>
                <td className="p-1.5 text-right text-white">89.5%</td>
              </tr>
            </tbody>
          </table>
        </div>
      );
    } else if (lowerInput.startsWith("phaelitus drift status")) {
      const match = cleanInput.match(/--model\s+([a-zA-Z0-9.\-_]+)/i);
      const mName = match ? match[1] : "credit-scoring-model";
      
      output = (
        <div className="flex flex-col gap-1.5 text-[11px] text-[#8891A8] font-mono leading-relaxed">
          <div className="text-white font-bold uppercase">DRIFT AUDIT REPORT FOR {mName}</div>
          <div className="h-[1px] bg-[#202538] my-1"></div>
          <div>&bull; <span className="font-bold">Population Stability Index (PSI):</span> <span className="text-[#FF3B5C] font-bold">0.342</span> (THRESHOLD exceeded &gt; 0.20)</div>
          <div>&bull; <span className="font-bold">Kolmogorov-Smirnov (KS-Test):</span> <span className="text-[#FF3B5C] font-bold">0.052</span> (P-VALUE &lt; 0.05: SIGNIFICANT SHIFT)</div>
          <div>&bull; <span className="font-bold">LSTM Anomaly History:</span> <span className="text-[#00C48C]">0.021</span> (NORMAL HISTORIC HISTORY)</div>
          <div>&bull; <span className="font-bold">Demographic Parity Score:</span> <span className="text-[#FF3B5C] font-bold">0.74</span> (EXCEEDS compliance target &gt; 0.80)</div>
          <div className="p-2 bg-[#FF3B5C]/10 border border-[#FF3B5C]/30 rounded text-[#FF3B5C] mt-1">
            <span className="font-bold block uppercase text-[10px]">RECONCILIATION EXCEPTION</span>
            Model status degraded due to joint statistical covariate shift &amp; disparate impact violations. Autonomic retraining triggers sent to Kafka pipeline.
          </div>
        </div>
      );
    } else if (lowerInput.startsWith("phaelitus rollback")) {
      const match = cleanInput.match(/--model\s+([a-zA-Z0-9.\-_]+)/i);
      const mName = match ? match[1] : "credit-scoring-model";
      const toMatch = cleanInput.match(/--to\s+([a-zA-Z0-9.\-_]+)/i);
      const toVer = toMatch ? toMatch[1] : "v1.0";

      output = (
        <div className="flex flex-col gap-1 text-[11px] text-[#8891A8] font-mono leading-relaxed">
          <div className="text-[#00D9E8] font-bold uppercase">ROLLBACK LIFECYCLE INITIATED</div>
          <div>&bull; Model: <span className="text-white font-bold">{mName}</span></div>
          <div>&bull; Reverting deployment router to target bundle: <span className="text-[#00D9E8] font-bold">{toVer}</span></div>
          <div>&bull; Validating active Kubernetes secret authentication... <span className="text-[#00C48C] font-bold">PASSED</span></div>
          <div>&bull; Hot-reconciling Gateway API HTTPRoute weights to 100% on {toVer}... <span className="text-[#00C48C] font-bold">DONE</span></div>
          <div className="mt-2 text-[#00C48C] font-bold uppercase flex items-center gap-1.5">
            <Shield className="w-3.5 h-3.5" />
            Operator reconciled. Gateway restored to stable deployment branch successfully.
          </div>
        </div>
      );
    } else if (lowerInput === "phaelitus cost attribution") {
      output = (
        <div className="flex flex-col gap-1.5 text-[11px] text-[#8891A8] font-mono leading-relaxed">
          <div className="text-white font-bold">ACTIVE MULTI-CLOUD CHARGEBACKS (SPOT/PREEMPTIBLE):</div>
          <table className="w-full text-left border border-[#202538]">
            <thead>
              <tr className="bg-[#1C2030]/50 text-white font-bold border-b border-[#202538]">
                <th className="p-1.5">TEAM NAMESPACE</th>
                <th className="p-1.5">GPU HOURS</th>
                <th className="p-1.5 text-right">CHARGEBACK</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#202538]/50">
              <tr>
                <td className="p-1.5 text-white">ops-credit-risk-team</td>
                <td className="p-1.5">148.5 hrs</td>
                <td className="p-1.5 text-right text-[#00D9E8] font-bold">$175.23</td>
              </tr>
              <tr>
                <td className="p-1.5 text-white">core-nlp-embeddings</td>
                <td className="p-1.5">412.0 hrs</td>
                <td className="p-1.5 text-right text-[#00D9E8] font-bold">$486.16</td>
              </tr>
              <tr>
                <td className="p-1.5 text-white">retail-recommendations</td>
                <td className="p-1.5">28.1 hrs</td>
                <td className="p-1.5 text-right text-[#00D9E8] font-bold">$33.15</td>
              </tr>
              <tr>
                <td className="p-1.5 text-white">fraud-sec-operations</td>
                <td className="p-1.5">194.2 hrs</td>
                <td className="p-1.5 text-right text-[#00D9E8] font-bold">$229.15</td>
              </tr>
            </tbody>
          </table>
          <div className="text-[#00C48C] font-bold text-[10px] mt-1 uppercase">
            Total Multi-Cloud Spot Savings compiled via RL PPO scheduler: $1,402.10 (68% total discount vs on-demand)
          </div>
        </div>
      );
    } else if (lowerInput.startsWith("phaelitus compliance report")) {
      output = (
        <div className="flex flex-col gap-1.5 text-[11px] text-[#8891A8] font-mono leading-relaxed">
          <div className="text-[#00D9E8] font-bold uppercase">NIST RISK MANAGEMENT DOSSIER COMPILATION COMPLETE</div>
          <div className="h-[1px] bg-[#202538] my-1"></div>
          <div>&bull; <span className="font-bold text-white uppercase">[GOVERN]:</span> CoSign cryptographically validated model metadata. PostgreSQL ledger records audit ready.</div>
          <div>&bull; <span className="font-bold text-white uppercase">[MAP]:</span> Continuous statistical feedback comparison enabled for target features. Context: credit risks.</div>
          <div>&bull; <span className="font-bold text-white uppercase">[MEASURE]:</span> Active demographic parity audit active. Statistical KS-test validation tracking enabled.</div>
          <div>&bull; <span className="font-bold text-white uppercase">[MANAGE]:</span> Automatic GKE rollbacks triggered in &lt;15s upon promotional latency/error anomalies.</div>
          <div className="p-2 bg-[#00C48C]/10 border border-[#00C48C]/30 text-[#00C48C] mt-2 font-bold text-center uppercase text-[10px]">
            NIST AI RMF Report compiled. Download complete payload at /tmp/nist-ai-rmf-audit.json
          </div>
        </div>
      );
    } else if (lowerInput === "phaelitus init") {
      output = (
        <div className="flex flex-col gap-1.5 text-[11px] text-[#8891A8] font-mono leading-relaxed">
          <div className="text-[#00D9E8] font-bold uppercase">INITIATING PIPELINE SCAFFOLD WIZARD (`phaelitus init`)</div>
          <div className="h-[1px] bg-[#202538] my-1"></div>
          <div>[1/4] Detecting cloud parameters... <span className="text-[#00C48C] font-bold">FOUND</span> (Google Cloud BigQuery baseline)</div>
          <div>[2/4] Setting Population Stability Index (PSI) alert bounds... <span className="text-[#00D9E8] font-bold">0.20</span> (Default recommended)</div>
          <div>[3/4] Registering target inference service... <span className="text-[#00D9E8] font-bold">credit-scoring-model</span></div>
          <div>[4/4] Activating zero-touch automated canary split... <span className="text-[#00C48C] font-bold">90-10 Split Spec Enabled</span></div>
          <div className="mt-2 text-[#00C48C] font-bold uppercase flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-[#00C48C]" />
            Template successfully written to `/modelpipeline.yaml`!
          </div>
          <pre className="bg-[#1C2030] p-2 border border-[#202538] rounded mt-2 text-[9px] text-[#00C48C] select-all max-h-40 overflow-y-auto no-scrollbar">
{`apiVersion: governance.phaelitus.io/v1alpha1
kind: ModelPipeline
metadata:
  name: credit-scoring-pipeline
  namespace: prod-models
spec:
  baseline:
    dataset: gcp-prod-ml.phaelitus_features
    referenceTable: baseline_demographics_v1
    syncInterval: 12h
  inferenceTarget:
    modelType: LLM
    serviceName: credit-scoring-model
    port: 80
  driftEngine:
    statisticalTest: PopulationStabilityIndex
    alertThreshold: 0.20
  mitigationPolicy:
    autoMitigate: true
    remediationWorkflow: ArgoWorkflowDeployCanary`}
          </pre>
        </div>
      );
    } else {
      output = (
        <div className="text-[#FF3B5C] font-mono text-[11px] leading-relaxed">
          bash: command not found: {cleanInput}. Type <span className="text-[#00D9E8] font-bold">"help"</span> for a list of valid control-plane CLI operations.
        </div>
      );
    }

    setHistory((prev) => [...prev, { input: cleanInput, output }]);
    setCurrentInput("");
  };

  return (
    <div className="bg-[#13161E] border border-[#202538] p-5 rounded-lg flex flex-col gap-4 min-h-[480px]">
      
      {/* CLI Header bar */}
      <div className="flex justify-between items-center border-b border-[#202538] pb-3">
        <div className="flex items-center gap-2">
          <Terminal className="text-[#00D9E8] w-4.5 h-4.5" />
          <div>
            <h3 className="font-sans text-xs uppercase tracking-wider text-[#F0F2F8] font-semibold">Phaelitus SDK Control Plane CLI</h3>
            <p className="text-[9px] font-sans text-[#8891A8] leading-none mt-1">Simulate binary execution in standard workspaces</p>
          </div>
        </div>
        <span className="text-[8px] font-mono bg-[#1C2030] border border-[#202538] text-[#8891A8] px-2.5 py-1 rounded">
          PATH: /usr/local/bin/phaelitus
        </span>
      </div>

      {/* Interactive terminal output box */}
      <div 
        className="flex-1 bg-[#0D0F14] border border-[#202538] p-4.5 rounded-lg overflow-y-auto font-mono text-[11px] flex flex-col gap-3 min-h-[360px] max-h-[450px]"
        style={{ scrollbarWidth: "thin" }}
      >
        {history.map((item, idx) => (
          <div key={idx} className="flex flex-col gap-2">
            {item.input && (
              <div className="flex items-center gap-2 text-white">
                <span className="text-[#7B61FF] font-bold">phaelitus@operator-shell:~$</span>
                <span className="font-bold">{item.input}</span>
              </div>
            )}
            <div className="pl-3">{item.output}</div>
          </div>
        ))}
        <div ref={terminalEndRef} />
      </div>

      {/* Terminal input form */}
      <form onSubmit={handleCommandSubmit} className="flex gap-2 items-center bg-[#0D0F14] border border-[#202538] rounded-lg px-3.5 py-2.5">
        <span className="text-[#7B61FF] font-mono text-xs font-bold whitespace-nowrap">phaelitus@operator-shell:~$</span>
        <input 
          type="text" 
          value={currentInput}
          onChange={(e) => setCurrentInput(e.target.value)}
          placeholder="Type 'help' and press Enter to list commands..."
          className="flex-1 bg-transparent text-white font-mono text-xs outline-none border-none select-text caret-[#00D9E8]"
          autoFocus
        />
        <button 
          type="submit" 
          className="p-1 bg-[#1C2030] border border-[#202538] text-[#8891A8] hover:text-[#00D9E8] rounded hover:border-[#00D9E8]/40 transition-colors cursor-pointer"
          title="Run Command"
        >
          <CornerDownLeft className="w-3.5 h-3.5" />
        </button>
      </form>
    </div>
  );
}
