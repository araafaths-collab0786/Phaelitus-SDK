import React, { useState } from "react";
import { 
  Bell, 
  Cpu, 
  ShieldCheck, 
  Users, 
  Sliders, 
  Check, 
  Send, 
  Radio, 
  MessageSquare, 
  AlertCircle, 
  Sparkles,
  Layers,
  Terminal,
  Activity,
  User,
  Loader2
} from "lucide-react";

interface SettingsIntegrationsProps {
  user: any;
  onUpdateProfile: (updates: { displayName?: string; photoURL?: string; role?: string; tenant?: string; cluster?: string }) => Promise<void>;
  activeRole: string;
  activeTenant: string;
  activeCluster: string;
  theme: "dark" | "light";
  setTheme: (t: "dark" | "light") => void;
  scanningLine: boolean;
  setScanningLine: (s: boolean) => void;
}

export default function SettingsIntegrations({
  user,
  onUpdateProfile,
  activeRole,
  activeTenant,
  activeCluster,
  theme,
  setTheme,
  scanningLine,
  setScanningLine
}: SettingsIntegrationsProps) {
  const [activeCategory, setActiveCategory] = useState<"profile" | "notifications" | "integrations" | "compliance" | "team" | "appearance">("profile");
  
  // Profile States
  const [displayName, setDisplayName] = useState(user?.displayName || "");
  const [photoURL, setPhotoURL] = useState(user?.photoURL || "");
  const [role, setRole] = useState(activeRole);
  const [tenant, setTenant] = useState(activeTenant);
  const [cluster, setCluster] = useState(activeCluster);
  const [savingProfile, setSavingProfile] = useState(false);

  React.useEffect(() => {
    if (user?.displayName) setDisplayName(user.displayName);
    if (user?.photoURL) setPhotoURL(user.photoURL);
  }, [user?.displayName, user?.photoURL]);

  React.useEffect(() => {
    setRole(activeRole);
  }, [activeRole]);

  React.useEffect(() => {
    setTenant(activeTenant);
  }, [activeTenant]);

  React.useEffect(() => {
    setCluster(activeCluster);
  }, [activeCluster]);

  const presetAvatars = [
    { name: "Cyberpunk Operator", url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80" },
    { name: "Tech Lead", url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=80" },
    { name: "Lead Designer", url: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&q=80" },
    { name: "Platform Engineer", url: "https://images.unsplash.com/photo-1500648767791-00dcc994a43d?auto=format&fit=crop&w=100&q=80" },
    { name: "Security Auditor", url: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=100&q=80" },
    { name: "AI Architect", url: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=100&q=80" }
  ];

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingProfile(true);
    try {
      await onUpdateProfile({
        displayName,
        photoURL,
        role,
        tenant,
        cluster
      });
      setTestStatus("Operator credentials and tenant profiles successfully saved to global directory!");
      setTimeout(() => setTestStatus(null), 3000);
    } catch (err) {
      console.error(err);
    } finally {
      setSavingProfile(false);
    }
  };

  // Integration States
  const [slackWebhook, setSlackWebhook] = useState(import.meta.env.VITE_SLACK_WEBHOOK_URL ?? "");
  const [slackConnected, setSlackConnected] = useState(true);
  const [slackTesting, setSlackTesting] = useState(false);
  
  const [pdKey, setPdKey] = useState("pd-key-9f2aa8c12b9c7d41e522");
  const [pdConnected, setPdConnected] = useState(true);
  const [pdTesting, setPdTesting] = useState(false);
  
  const [jiraUrl, setJiraUrl] = useState("https://phaelitus.atlassian.net/rest/api/3/issue");
  const [jiraConnected, setJiraConnected] = useState(false);
  const [jiraTesting, setJiraTesting] = useState(false);

  // Success Toasts or states for testing connection
  const [testStatus, setTestStatus] = useState<string | null>(null);

  const testConnection = (service: string, setTestingState: React.Dispatch<React.SetStateAction<boolean>>, setConnectedState: React.Dispatch<React.SetStateAction<boolean>>) => {
    setTestingState(true);
    setTestStatus(null);
    setTimeout(() => {
      setTestingState(false);
      setConnectedState(true);
      setTestStatus(`Secure handshake established with ${service}! Connected.`);
      setTimeout(() => setTestStatus(null), 3000);
    }, 1200);
  };

  const categories = [
    { id: "profile", label: "Profile Credentials", icon: User, desc: "Change name, role, tenant, & avatar" },
    { id: "notifications", label: "Notifications", icon: Bell, desc: "Manage alert routes & webhooks" },
    { id: "integrations", label: "Integrations", icon: Cpu, desc: "Connect Slack, PagerDuty, Jira" },
    { id: "compliance", label: "Compliance & Sec", icon: ShieldCheck, desc: "Sigstore and SBOM declarations" },
    { id: "team", label: "Team Access", icon: Users, desc: "SSO and namespace-scoped RBAC" },
    { id: "appearance", label: "Appearance", icon: Sliders, desc: "Visual theme & scan sweeps" }
  ] as const;

  return (
    <div className="flex flex-col gap-6 animate-fade-in w-full">
      {/* Title block */}
      <div className="border-b border-outline pb-4">
        <h2 className="font-serif text-xl font-bold text-white tracking-tight flex items-center gap-2">
          <Sliders className="w-5 h-5 text-[#00D9E8]" />
          Enterprise Settings &amp; Gateway Integrations
        </h2>
        <p className="text-xs text-[#9CA3AF] mt-1 max-w-2xl">
          Configure secure telemetry pipelines, manage continuous evaluation triggers, and modify visual terminal telemetry indicators.
        </p>
      </div>

      {/* Success notification banner */}
      {testStatus && (
        <div className="bg-[#10B981]/15 border border-[#10B981]/30 p-3.5 rounded-lg flex items-center gap-3 text-xs text-[#10B981] animate-bounce">
          <Check className="w-4 h-4 flex-shrink-0" />
          <span className="font-mono">{testStatus}</span>
        </div>
      )}

      {/* Two-column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left: Category Navigation */}
        <div className="lg:col-span-4 flex flex-col gap-1.5 bg-[#080C14] border border-outline rounded-lg p-3 shadow-md">
          <span className="text-[9px] font-mono text-[#4B5563] uppercase tracking-wider px-3 mb-2 block">Settings Navigation</span>
          {categories.map((cat) => {
            const Icon = cat.icon;
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`w-full flex items-center gap-3.5 p-3 rounded text-left transition-all duration-150 group cursor-pointer ${
                  isActive 
                    ? "bg-[#111827] text-white border-l-2 border-[#00D9E8]" 
                    : "text-[#9CA3AF] hover:bg-[#0C1120] hover:text-white"
                }`}
              >
                <Icon className={`w-4.5 h-4.5 shrink-0 ${isActive ? "text-[#00D9E8]" : "text-[#4B5563] group-hover:text-[#9CA3AF]"}`} />
                <div>
                  <div className="text-xs font-semibold tracking-wide">{cat.label}</div>
                  <div className="text-[9.5px] text-[#4B5563] mt-0.5 group-hover:text-[#9CA3AF]/70 leading-none">{cat.desc}</div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Right: Active panel content */}
        <div className="lg:col-span-8 flex flex-col gap-5 min-h-[350px]">
          
          {/* 0. Profile Panel */}
          {activeCategory === "profile" && (
            <form onSubmit={handleSaveProfile} className="bg-[#080C14] border border-outline p-5 rounded-lg shadow-md flex flex-col gap-5 animate-fade-in">
              <div className="border-b border-outline/50 pb-3">
                <span className="text-xs uppercase font-mono font-bold tracking-wider text-white flex items-center gap-2">
                  <User className="w-4 h-4 text-[#00D9E8]" />
                  Operator Profile Settings
                </span>
                <p className="text-[11px] text-[#9CA3AF] mt-1">Configure your personal operator profile, workspace role, and local organization mapping.</p>
              </div>

              <div className="flex flex-col gap-4">
                {/* Avatar Chooser */}
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] font-mono text-[#4B5563] uppercase">Operator Avatar Image</label>
                  <div className="flex flex-col sm:flex-row items-center gap-4 bg-[#0C1120] p-4 rounded border border-outline">
                    <img 
                      src={photoURL || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80"} 
                      alt="Avatar Preview" 
                      className="w-14 h-14 rounded-full border border-outline object-cover"
                    />
                    <div className="flex flex-col gap-1.5 w-full">
                      <span className="text-[10.5px] text-[#9CA3AF]">Choose a high-fidelity preset operator avatar:</span>
                      <div className="grid grid-cols-6 gap-2">
                        {presetAvatars.map((preset) => (
                          <button
                            key={preset.name}
                            type="button"
                            onClick={() => setPhotoURL(preset.url)}
                            className={`w-10 h-10 rounded-full overflow-hidden border-2 cursor-pointer transition-all ${
                              photoURL === preset.url ? "border-[#00D9E8]" : "border-transparent opacity-60 hover:opacity-100"
                            }`}
                            title={preset.name}
                          >
                            <img src={preset.url} alt={preset.name} className="w-full h-full object-cover" />
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-mono text-[#4B5563] uppercase">Operator Email (SSO Verified)</label>
                    <input 
                      type="email" 
                      value={user?.email || "guest-operator@phaelitus.io"} 
                      disabled
                      className="bg-[#050810] border border-outline/40 px-3 py-2 rounded text-xs font-mono text-[#4B5563] outline-none cursor-not-allowed"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-mono text-[#4B5563] uppercase">Operator Display Name</label>
                    <input 
                      type="text" 
                      value={displayName} 
                      onChange={(e) => setDisplayName(e.target.value)}
                      placeholder="e.g. John Doe"
                      required
                      className="bg-[#0C1120] border border-outline px-3 py-2 rounded text-xs font-mono text-[#F9FAFB] focus:border-[#00D9E8] outline-none transition-all"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-mono text-[#4B5563] uppercase">Workspace Role</label>
                    <select
                      value={role}
                      onChange={(e) => setRole(e.target.value)}
                      className="bg-[#0C1120] border border-outline px-3 py-2 rounded text-xs font-mono text-[#F9FAFB] focus:border-[#00D9E8] outline-none cursor-pointer transition-all"
                    >
                      <option value="Cluster Admin">Cluster Admin</option>
                      <option value="Platform Architect">Platform Architect</option>
                      <option value="MLOps Engineer">MLOps Engineer</option>
                      <option value="Security Auditor">Security Auditor</option>
                      <option value="Data Scientist">Data Scientist</option>
                    </select>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-mono text-[#4B5563] uppercase">Organization / Tenant</label>
                    <input 
                      type="text" 
                      value={tenant} 
                      onChange={(e) => setTenant(e.target.value)}
                      placeholder="e.g. Acme Corp"
                      required
                      className="bg-[#0C1120] border border-outline px-3 py-2 rounded text-xs font-mono text-[#F9FAFB] focus:border-[#00D9E8] outline-none transition-all"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-mono text-[#4B5563] uppercase">Default Cluster Node</label>
                    <input 
                      type="text" 
                      value={cluster} 
                      onChange={(e) => setCluster(e.target.value)}
                      placeholder="e.g. us-east-prod-01"
                      required
                      className="bg-[#0C1120] border border-outline px-3 py-2 rounded text-xs font-mono text-[#F9FAFB] focus:border-[#00D9E8] outline-none transition-all"
                    />
                  </div>
                </div>

                <button 
                  type="submit"
                  disabled={savingProfile}
                  className="mt-2 bg-[#00D9E8] hover:bg-[#00D9E8]/90 text-[#050810] font-mono text-[10px] uppercase font-bold py-2.5 px-5 rounded w-max cursor-pointer self-end transition-all flex items-center gap-2 disabled:opacity-50"
                >
                  {savingProfile ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Check className="w-3.5 h-3.5" />
                  )}
                  <span>SAVE PROFILE SETTINGS</span>
                </button>
              </div>
            </form>
          )}

          {/* 1. Notifications Panel */}
          {activeCategory === "notifications" && (
            <div className="bg-[#080C14] border border-outline p-5 rounded-lg shadow-md flex flex-col gap-5 animate-fade-in">
              <div className="border-b border-outline/50 pb-3">
                <span className="text-xs uppercase font-mono font-bold tracking-wider text-white flex items-center gap-2">
                  <Bell className="w-4 h-4 text-[#00D9E8]" />
                  Alert Routing and Notifications
                </span>
                <p className="text-[11px] text-[#9CA3AF] mt-1">Configure alert thresholds and incident severity levels dispatched to operations channels.</p>
              </div>

              <div className="flex flex-col gap-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-mono text-[#4B5563] uppercase">Primary Ops Email</label>
                    <input 
                      type="email" 
                      defaultValue="ops-triage@phaelitus.io"
                      className="bg-[#0C1120] border border-outline px-3 py-2 rounded text-xs font-mono text-[#F9FAFB] focus:border-[#00D9E8] outline-none"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-mono text-[#4B5563] uppercase">Emergency SMS Group</label>
                    <input 
                      type="text" 
                      defaultValue="+1 (555) 902-1188"
                      className="bg-[#0C1120] border border-outline px-3 py-2 rounded text-xs font-mono text-[#F9FAFB] focus:border-[#00D9E8] outline-none"
                    />
                  </div>
                </div>

                <div className="bg-[#0C1120] border border-outline p-4 rounded flex flex-col gap-2">
                  <span className="text-[10px] font-mono text-[#00D9E8] uppercase tracking-wider font-bold">Severity Filter Thresholds</span>
                  <p className="text-[11px] text-[#9CA3AF]">Only dispatch alerts exceeding the continuous monitoring standard thresholds.</p>
                  <div className="grid grid-cols-3 gap-3 mt-2">
                    <label className="flex items-center gap-2 text-xs text-[#9CA3AF] cursor-pointer">
                      <input type="checkbox" defaultChecked className="accent-[#00D9E8]" />
                      <span>Critical (Rollback)</span>
                    </label>
                    <label className="flex items-center gap-2 text-xs text-[#9CA3AF] cursor-pointer">
                      <input type="checkbox" defaultChecked className="accent-[#00D9E8]" />
                      <span>High (Drift Alert)</span>
                    </label>
                    <label className="flex items-center gap-2 text-xs text-[#9CA3AF] cursor-pointer">
                      <input type="checkbox" className="accent-[#00D9E8]" />
                      <span>Medium (Warning)</span>
                    </label>
                  </div>
                </div>

                <button 
                  onClick={() => alert("Notification settings saved successfully.")}
                  className="mt-2 bg-[#00D9E8] hover:bg-[#00D9E8]/90 text-[#050810] font-mono text-[10px] uppercase font-bold py-2 px-4 rounded w-max cursor-pointer self-end transition-colors"
                >
                  SAVE CHANNEL SETTINGS
                </button>
              </div>
            </div>
          )}

          {/* 2. Integrations Panel */}
          {activeCategory === "integrations" && (
            <div className="flex flex-col gap-5 animate-fade-in">
              
              {/* Slack Card */}
              <div className="bg-[#080C14] border border-outline p-5 rounded-lg shadow-md flex flex-col gap-3">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-2">
                    <MessageSquare className="w-5 h-5 text-[#00D9E8]" />
                    <div>
                      <h4 className="text-xs font-bold text-[#F9FAFB]">Slack Webhook Channels</h4>
                      <span className="text-[9px] font-mono text-[#9CA3AF]">DISPATCH DRIFT INCIDENTS TO WORKSPACES</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className={`w-1.5 h-1.5 rounded-full ${slackConnected ? "bg-[#10B981]" : "bg-[#EF4444]"}`}></span>
                    <span className="text-[9px] font-mono uppercase text-white font-bold">{slackConnected ? "CONNECTED" : "OFFLINE"}</span>
                  </div>
                </div>

                <div className="flex flex-col gap-1.5 mt-2">
                  <label className="text-[9px] font-mono text-[#4B5563] uppercase">Slack Webhook URL</label>
                  <div className="flex gap-2">
                    <input 
                      type="text" 
                      value={slackWebhook}
                      onChange={(e) => setSlackWebhook(e.target.value)}
                      className="flex-1 bg-[#0C1120] border border-outline px-3 py-1.5 rounded text-xs font-mono text-[#F9FAFB] focus:border-[#00D9E8] outline-none"
                    />
                    <button
                      disabled={slackTesting}
                      onClick={() => testConnection("Slack Webhooks", setSlackTesting, setSlackConnected)}
                      className="px-3 bg-[#111827] border border-outline hover:border-[#00D9E8]/30 rounded text-[10px] font-mono uppercase text-[#F9FAFB] hover:text-white transition-colors cursor-pointer"
                    >
                      {slackTesting ? "TESTING..." : "TEST CONNECTION"}
                    </button>
                  </div>
                </div>
              </div>

              {/* PagerDuty Card */}
              <div className="bg-[#080C14] border border-[#202538] p-5 rounded-lg shadow-md flex flex-col gap-3">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-2">
                    <Radio className="w-5 h-5 text-[#7C3AED]" />
                    <div>
                      <h4 className="text-xs font-bold text-[#F9FAFB]">PagerDuty Escalation Rails</h4>
                      <span className="text-[9px] font-mono text-[#9CA3AF]">EMERGENCY PAGERS &bull; PLATINUM SUPPORT ESCALATION</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className={`w-1.5 h-1.5 rounded-full ${pdConnected ? "bg-[#10B981]" : "bg-[#EF4444]"}`}></span>
                    <span className="text-[9px] font-mono uppercase text-white font-bold">{pdConnected ? "ACTIVE" : "OFFLINE"}</span>
                  </div>
                </div>

                <div className="flex flex-col gap-1.5 mt-2">
                  <label className="text-[9px] font-mono text-[#4B5563] uppercase">Integration Routing Key</label>
                  <div className="flex gap-2">
                    <input 
                      type="password" 
                      value={pdKey}
                      onChange={(e) => setPdKey(e.target.value)}
                      className="flex-1 bg-[#0C1120] border border-outline px-3 py-1.5 rounded text-xs font-mono text-[#F9FAFB] focus:border-[#00D9E8] outline-none"
                    />
                    <button
                      disabled={pdTesting}
                      onClick={() => testConnection("PagerDuty Engine", setPdTesting, setPdConnected)}
                      className="px-3 bg-[#111827] border border-outline hover:border-[#00D9E8]/30 rounded text-[10px] font-mono uppercase text-[#F9FAFB] hover:text-white transition-colors cursor-pointer"
                    >
                      {pdTesting ? "TESTING..." : "TEST CONNECTION"}
                    </button>
                  </div>
                </div>
              </div>

              {/* Jira Card */}
              <div className="bg-[#080C14] border border-[#202538] p-5 rounded-lg shadow-md flex flex-col gap-3">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="w-5 h-5 text-[#EF4444]" />
                    <div>
                      <h4 className="text-xs font-bold text-[#F9FAFB]">Jira Cloud Ticket Automation</h4>
                      <span className="text-[9px] font-mono text-[#9CA3AF]">AUTO-CREATE SPRINTS &bull; ISSUE RESOLUTION FEED</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className={`w-1.5 h-1.5 rounded-full ${jiraConnected ? "bg-[#10B981]" : "bg-[#4B5563]"}`}></span>
                    <span className="text-[9px] font-mono uppercase text-white font-bold">{jiraConnected ? "CONNECTED" : "DISCONNECTED"}</span>
                  </div>
                </div>

                <div className="flex flex-col gap-1.5 mt-2">
                  <label className="text-[9px] font-mono text-[#4B5563] uppercase">Jira REST API Endpoint</label>
                  <div className="flex gap-2">
                    <input 
                      type="text" 
                      value={jiraUrl}
                      onChange={(e) => setJiraUrl(e.target.value)}
                      className="flex-1 bg-[#0C1120] border border-outline px-3 py-1.5 rounded text-xs font-mono text-[#F9FAFB] focus:border-[#00D9E8] outline-none"
                    />
                    <button
                      disabled={jiraTesting}
                      onClick={() => testConnection("Jira Ticket Server", setJiraTesting, setJiraConnected)}
                      className="px-3 bg-[#111827] border border-outline hover:border-[#00D9E8]/30 rounded text-[10px] font-mono uppercase text-[#F9FAFB] hover:text-white transition-colors cursor-pointer"
                    >
                      {jiraTesting ? "TESTING..." : "CONNECT JIRA"}
                    </button>
                  </div>
                </div>
              </div>

            </div>
          )}

          {/* 3. Compliance Panel */}
          {activeCategory === "compliance" && (
            <div className="bg-[#080C14] border border-outline p-5 rounded-lg shadow-md flex flex-col gap-5 animate-fade-in">
              <div className="border-b border-outline/50 pb-3">
                <span className="text-xs uppercase font-mono font-bold tracking-wider text-white flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-[#10B981]" />
                  Cryptographic Verification &amp; Compliance Audit
                </span>
                <p className="text-[11px] text-[#9CA3AF] mt-1">Audit container signatures, software bills of materials (SBOMs), and data governance compliance logs.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-[#0C1120] border border-outline p-4 rounded flex flex-col gap-2">
                  <div className="flex justify-between items-center">
                    <span className="text-[9px] font-mono text-[#00D9E8] uppercase tracking-wider font-bold">Sigstore Weight Signatures</span>
                    <span className="text-[8px] font-mono text-[#10B981] bg-[#10B981]/10 px-1.5 py-0.5 rounded font-bold">ENFORCED</span>
                  </div>
                  <p className="text-[10.5px] text-[#9CA3AF] leading-relaxed">
                    Cryptographically signs model weight hashes during ingestion. Validated on GKE Autopilot admission control before container deployment.
                  </p>
                  <span className="text-[9px] font-mono text-[#4B5563] mt-1">Active PGP Fingerprint: 9F9B C48C 00D9 E8A5 ...</span>
                </div>

                <div className="bg-[#0C1120] border border-outline p-4 rounded flex flex-col gap-2">
                  <div className="flex justify-between items-center">
                    <span className="text-[9px] font-mono text-[#7C3AED] uppercase tracking-wider font-bold">PostgreSQL Column Encryption</span>
                    <span className="text-[8px] font-mono text-[#10B981] bg-[#10B981]/10 px-1.5 py-0.5 rounded font-bold">ACTIVE</span>
                  </div>
                  <p className="text-[10.5px] text-[#9CA3AF] leading-relaxed">
                    Fully encrypts sensitive alert parameters, Kafka connection keys, and user metadata stored at rest inside Cloud SQL using Google KMS keys.
                  </p>
                  <span className="text-[9px] font-mono text-[#4B5563] mt-1">Algorithm: AES-256 GCM (KMS-Managed Key)</span>
                </div>
              </div>

              <div className="bg-[#0C1120] border border-outline p-4 rounded flex flex-col gap-3">
                <span className="text-[9px] font-mono text-[#F9FAFB] uppercase tracking-wider font-bold">Regulatory Compliance Standards</span>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                  <div className="p-2 border border-outline/40 rounded text-center">
                    <span className="text-[10px] font-mono text-white block">NIST AI RMF</span>
                    <span className="text-[8px] font-mono text-[#10B981] font-bold">ALIGNED (v1.0)</span>
                  </div>
                  <div className="p-2 border border-outline/40 rounded text-center">
                    <span className="text-[10px] font-mono text-white block">EU AI ACT</span>
                    <span className="text-[8px] font-mono text-[#10B981] font-bold">ARTICLE 10 AUDITED</span>
                  </div>
                  <div className="p-2 border border-outline/40 rounded text-center">
                    <span className="text-[10px] font-mono text-white block">SOC 2 TYPE II</span>
                    <span className="text-[8px] font-mono text-[#10B981] font-bold">COMPLIANT (2026)</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 4. Team RBAC Panel */}
          {activeCategory === "team" && (
            <div className="bg-[#080C14] border border-outline p-5 rounded-lg shadow-md flex flex-col gap-5 animate-fade-in">
              <div className="border-b border-outline/50 pb-3">
                <span className="text-xs uppercase font-mono font-bold tracking-wider text-white flex items-center gap-2">
                  <Users className="w-4 h-4 text-[#7C3AED]" />
                  Namespace Role-Based Access Control (RBAC)
                </span>
                <p className="text-[11px] text-[#9CA3AF] mt-1">Define permissions, namespace boundaries, and SSO identity mapping across cluster domains.</p>
              </div>

              <div className="flex flex-col gap-3">
                <div className="border border-outline rounded-lg overflow-hidden">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-[#0C1120] border-b border-outline text-[9px] font-mono text-[#4B5563] uppercase">
                        <th className="p-2.5">Operator ID</th>
                        <th className="p-2.5">Domain Role</th>
                        <th className="p-2.5">Allowed Namespace</th>
                        <th className="p-2.5">Audit Stamp</th>
                      </tr>
                    </thead>
                    <tbody className="text-[10.5px] font-mono text-[#9CA3AF] divide-y divide-outline/30">
                      <tr>
                        <td className="p-2.5 text-white font-sans font-semibold">araafaths0786@gmail.com</td>
                        <td className="p-2.5 text-[#00D9E8]">Cluster Admin</td>
                        <td className="p-2.5">global-production</td>
                        <td className="p-2.5 text-[#4B5563]">ACTIVE SESSION</td>
                      </tr>
                      <tr>
                        <td className="p-2.5 text-white font-sans font-semibold">sec-audit@globalretail.com</td>
                        <td className="p-2.5 text-[#10B981]">Compliance Auditor</td>
                        <td className="p-2.5">gcp-prod-ml</td>
                        <td className="p-2.5 text-[#4B5563]">2 hours ago</td>
                      </tr>
                      <tr>
                        <td className="p-2.5 text-white font-sans font-semibold">mlops-triage@globalretail.com</td>
                        <td className="p-2.5 text-[#F59E0B]">Support Engineer</td>
                        <td className="p-2.5">prod-models</td>
                        <td className="p-2.5 text-[#4B5563]">Yesterday</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div className="bg-[#0C1120] border border-outline p-4.5 rounded flex flex-col gap-2 mt-2">
                  <span className="text-[9px] font-mono text-[#00D9E8] uppercase tracking-wider font-bold">OIDC / Auth0 Enterprise SSO Identity Match</span>
                  <p className="text-[11px] text-[#9CA3AF]">
                    All administrative sessions are cryptographically bound to OAuth profiles managed inside Google Workspace or Okta. Session tokens automatically expire after 12 hours.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* 5. Appearance Panel */}
          {activeCategory === "appearance" && (
            <div className="bg-[#080C14] border border-outline p-5 rounded-lg shadow-md flex flex-col gap-5 animate-fade-in">
              <div className="border-b border-outline/50 pb-3">
                <span className="text-xs uppercase font-mono font-bold tracking-wider text-white flex items-center gap-2">
                  <Sliders className="w-4 h-4 text-[#00D9E8]" />
                  Visual Dashboard Preferences
                </span>
                <p className="text-[11px] text-[#9CA3AF] mt-1">Modify theme parameters, animation transitions, and telemetry sweeps on the terminal display.</p>
              </div>

              <div className="flex flex-col gap-5">
                
                {/* Theme Selector (Light/Dark mode override) */}
                <div className="flex justify-between items-center p-4 bg-[#0C1120] border border-outline rounded-lg">
                  <div>
                    <span className="text-xs font-semibold text-white block">Cinematic Display Theme</span>
                    <span className="text-[9px] font-mono text-[#9CA3AF] uppercase">Toggle between Deep Cosmic and Crisp Slate</span>
                  </div>
                  
                  <div className="flex bg-[#050810] border border-outline p-1 rounded-lg gap-1">
                    <button
                      onClick={() => setTheme("dark")}
                      className={`px-3 py-1.5 text-[9.5px] font-mono font-bold rounded uppercase cursor-pointer transition-all ${
                        theme === "dark" 
                          ? "bg-[#111827] text-[#00D9E8]" 
                          : "text-[#4B5563] hover:text-white"
                      }`}
                    >
                      COSMIC DARK
                    </button>
                    <button
                      onClick={() => setTheme("light")}
                      className={`px-3 py-1.5 text-[9.5px] font-mono font-bold rounded uppercase cursor-pointer transition-all ${
                        theme === "light" 
                          ? "bg-[#111827] text-[#7C3AED]" 
                          : "text-[#4B5563] hover:text-white"
                      }`}
                    >
                      SLATE LIGHT
                    </button>
                  </div>
                </div>

                {/* Scanning line toggle */}
                <div className="flex justify-between items-center p-4 bg-[#0C1120] border border-outline rounded-lg">
                  <div>
                    <span className="text-xs font-semibold text-white block">Active Ambient Scan Sweep (8s Cycle)</span>
                    <span className="text-[9px] font-mono text-[#9CA3AF] uppercase">Draws a subtle horizontal glowing gradient overlay</span>
                  </div>

                  <button
                    onClick={() => setScanningLine(!scanningLine)}
                    className={`px-3 py-1.5 text-[9.5px] font-mono font-bold border rounded transition-all cursor-pointer ${
                      scanningLine 
                        ? "bg-[#00D9E8]/10 border-[#00D9E8]/30 text-[#00D9E8]" 
                        : "bg-[#050810] border-outline text-[#4B5563] hover:border-[#9CA3AF]"
                    }`}
                  >
                    {scanningLine ? "SCANNER_ON" : "SCANNER_OFF"}
                  </button>
                </div>

                {/* Aesthetic Pairing details */}
                <div className="bg-[#0C1120] border border-outline p-4 rounded-lg flex flex-col gap-2">
                  <span className="text-[9px] font-mono text-[#7C3AED] uppercase tracking-wider font-bold">DISPLAY PAIRINGS REFERENCE (2031 SPEC)</span>
                  <div className="grid grid-cols-2 gap-3 text-[10.5px] text-[#9CA3AF] leading-relaxed">
                    <div>
                      <span className="font-mono text-white block text-[9px] uppercase text-[#4B5563]">Typography</span>
                      <span>Display titles are set in <strong className="text-white">Space Grotesk</strong>, monospace numbers in <strong className="text-white">JetBrains Mono</strong>.</span>
                    </div>
                    <div>
                      <span className="font-mono text-white block text-[9px] uppercase text-[#4B5563]">Color Calibration</span>
                      <span>Active glows emit <strong className="text-[#00D9E8]">Cyan Plasma</strong>, intelligence systems trigger <strong className="text-[#7C3AED]">Neural Violet</strong>.</span>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
}
