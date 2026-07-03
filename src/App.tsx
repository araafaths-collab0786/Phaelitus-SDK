import React, { useState, useEffect } from "react";
import { 
  Grid3X3, 
  Activity, 
  BarChart3, 
  Settings, 
  LogOut, 
  Loader2, 
  Bell, 
  Search, 
  ChevronRight, 
  Database, 
  Command, 
  Layers, 
  Cpu, 
  ShieldAlert, 
  Compass, 
  Check, 
  Info, 
  HelpCircle,
  ExternalLink,
  Laptop,
  Terminal,
  ShieldCheck,
  FileText,
  BookOpen,
  WifiOff,
  UserCheck,
  RefreshCw,
  Play,
  Wrench,
  Sun,
  Moon,
  Server,
  History,
  Sliders,
  Menu,
  X
} from "lucide-react";
import PipelineDAG from "./components/PipelineDAG";
import IncidentFeed from "./components/IncidentFeed";
import ModelRegistry from "./components/ModelRegistry";
import DriftDashboard from "./components/DriftDashboard";
import GovernanceFinOps from "./components/GovernanceFinOps";
import DeveloperCLI from "./components/DeveloperCLI";
import ProposalHub from "./components/ProposalHub";
import DocumentationHub from "./components/DocumentationHub";
import SystemHealth from "./components/SystemHealth";
import AuditLogViewer from "./components/AuditLogViewer";
import SettingsIntegrations from "./components/SettingsIntegrations";
import AuthGate from "./components/AuthGate";
import { Incident } from "./types";
import { auth, db } from "./lib/firebase";
import { onAuthStateChanged, signOut, User as FirebaseUser } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { motion, AnimatePresence } from "motion/react";

export default function App() {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [view, setView] = useState<"grid" | "stream" | "metrics" | "config" | "governance" | "cli" | "proposal" | "docs" | "health" | "audit" | "settings">("stream");
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [scanningLine, setScanningLine] = useState<boolean>(true);
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string>("");

  // Multi-Tenancy & Tenant Switcher States
  const [activeTenant, setActiveTenant] = useState<string>("Global Retail Corp (Primary)");
  const [tenantDropdownOpen, setTenantDropdownOpen] = useState(false);
  const [activeRole, setActiveRole] = useState<string>("Cluster Admin");

  // Onboarding Wizard States
  const [showOnboarding, setShowOnboarding] = useState<boolean>(true);
  const [onboardingOpen, setOnboardingOpen] = useState<boolean>(false);
  const [onboardingStep, setOnboardingStep] = useState<number>(1);
  const [wizardModel, setWizardModel] = useState<string>("google-gemini-pro-1.5");
  const [wizardThreshold, setWizardThreshold] = useState<number>(0.20);
  const [wizardSlack, setWizardSlack] = useState<string>("#alerts-phaelitus");

  // Operational Simulation & Diagnostic Sandbox States
  const [simOffline, setSimOffline] = useState<boolean>(false);
  const [simKafkaLag, setSimKafkaLag] = useState<boolean>(false);
  const [diagnosticsOpen, setDiagnosticsOpen] = useState<boolean>(false);

  // Phaelitus SDK high-fidelity enterprise UI states
  const [activeCluster, setActiveCluster] = useState<string>("us-east-prod-01");
  const [clusterDropdownOpen, setClusterDropdownOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [dismissMobileWarning, setDismissMobileWarning] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [windowWidth, setWindowWidth] = useState(typeof window !== "undefined" ? window.innerWidth : 1280);

  const [policies, setPolicies] = useState({
    psiThreshold: 0.20,
    canaryLatency: 50,
    autoMitigate: true,
  });

  // Handle Firebase Auth State Changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setAuthLoading(false);
      if (!currentUser) {
        setLoading(false);
      }
    });
    return () => unsubscribe();
  }, []);

  // Secure Local Demo Bypass Handler
  const handleDemoAccess = (email?: string, name?: string) => {
    setUser({
      uid: "demo-operator-id",
      email: email || "demo-operator@phaelitus.io",
      displayName: name || "Demo Operator",
      photoURL: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80",
      getIdToken: async () => "demo-token-phaelitus",
    } as any);
  };

  // Helper to safely get ID token even if object prototype is stripped or in demo mode
  const getAuthToken = async (currentUser: any) => {
    if (!currentUser) return "";
    if (currentUser.uid === "demo-operator-id") {
      return "demo-token-phaelitus";
    }
    if (auth.currentUser && typeof auth.currentUser.getIdToken === "function") {
      return await auth.currentUser.getIdToken();
    }
    if (currentUser && typeof currentUser.getIdToken === "function") {
      return await currentUser.getIdToken();
    }
    return "";
  };

  // Fetch telemetry from Cloud SQL backend with transient retry logic
  const fetchCloudSQLTelemetry = async (currentUser: FirebaseUser, retries = 3, delayMs = 1500) => {
    try {
      setLoading(true);
      const token = await getAuthToken(currentUser);
      const headers = {
        "Authorization": `Bearer ${token}`,
      };

      // Fetch active incidents/telemetry events
      let incidentsRes: Response;
      try {
        incidentsRes = await fetch("/api/drift/incidents", { headers });
      } catch (fetchErr: any) {
        if (retries > 0) {
          console.warn(`Telemetry fetch failed (transient network error). Retrying in ${delayMs}ms... (Retries left: ${retries})`, fetchErr);
          await new Promise(resolve => setTimeout(resolve, delayMs));
          return fetchCloudSQLTelemetry(currentUser, retries - 1, delayMs * 1.5);
        }
        throw fetchErr;
      }

      const incidentsData = await incidentsRes.json();
      if (incidentsRes.ok && incidentsData.incidents) {
        setIncidents(incidentsData.incidents);
      } else {
        throw new Error(incidentsData.error || "Failed to fetch incidents");
      }

      // Fetch dynamic policies/safety thresholds
      let policiesRes: Response;
      try {
        policiesRes = await fetch("/api/drift/policies", { headers });
      } catch (fetchErr: any) {
        if (retries > 0) {
          console.warn(`Policies fetch failed. Retrying in ${delayMs}ms...`, fetchErr);
          await new Promise(resolve => setTimeout(resolve, delayMs));
          return fetchCloudSQLTelemetry(currentUser, retries - 1, delayMs * 1.5);
        }
        throw fetchErr;
      }

      const policiesData = await policiesRes.json();
      if (policiesRes.ok) {
        setPolicies({
          psiThreshold: policiesData.psiThreshold ?? 0.20,
          canaryLatency: policiesData.canaryLatency ?? 50,
          autoMitigate: policiesData.autoMitigate ?? true,
        });
      } else {
        throw new Error(policiesData.error || "Failed to fetch policies");
      }

      setErrorMessage("");
    } catch (err: any) {
      console.error("Cloud SQL Telemetry sync failed:", err);
      setErrorMessage(err.message || "Failed to synchronize with Cloud SQL PostgreSQL.");
    } finally {
      setLoading(false);
    }
  };

  const fetchUserProfile = async (currentUser: FirebaseUser) => {
    if (currentUser.uid === "demo-operator-id") return;
    try {
      const userRef = doc(db, "users", currentUser.uid);
      const userSnap = await getDoc(userRef);
      if (userSnap.exists()) {
        const data = userSnap.data();
        if (data.displayName) {
          setUser((prev: any) => prev ? { 
            ...prev, 
            displayName: data.displayName, 
            photoURL: data.photoURL || prev.photoURL 
          } : prev);
        }
        if (data.role) {
          setActiveRole(data.role);
        }
        if (data.tenant) {
          setActiveTenant(data.tenant);
        }
      } else {
        // Create default user document in Firestore
        const defaultProfile = {
          uid: currentUser.uid,
          email: currentUser.email || "",
          displayName: currentUser.displayName || currentUser.email?.split("@")[0] || "Operator",
          photoURL: currentUser.photoURL || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80",
          role: "Cluster Admin",
          tenant: "Global Retail Corp (Primary)",
          createdAt: new Date().toISOString()
        };
        await setDoc(userRef, defaultProfile);
      }
    } catch (err) {
      console.error("Failed to load/create user profile in Firestore:", err);
    }
  };

  const handleUpdateProfile = async (updates: {
    displayName?: string;
    photoURL?: string;
    role?: string;
    tenant?: string;
    cluster?: string;
  }) => {
    if (updates.displayName !== undefined) {
      setUser((prev: any) => prev ? { ...prev, displayName: updates.displayName } : prev);
      if (auth.currentUser) {
        try {
          const { updateProfile } = await import("firebase/auth");
          await updateProfile(auth.currentUser, { displayName: updates.displayName });
        } catch (err) {
          console.error("Auth profile displayName update failed:", err);
        }
      }
    }
    if (updates.photoURL !== undefined) {
      setUser((prev: any) => prev ? { ...prev, photoURL: updates.photoURL } : prev);
      if (auth.currentUser) {
        try {
          const { updateProfile } = await import("firebase/auth");
          await updateProfile(auth.currentUser, { photoURL: updates.photoURL });
        } catch (err) {
          console.error("Auth profile photoURL update failed:", err);
        }
      }
    }
    if (updates.role !== undefined) {
      setActiveRole(updates.role);
    }
    if (updates.tenant !== undefined) {
      setActiveTenant(updates.tenant);
    }
    if (updates.cluster !== undefined) {
      setActiveCluster(updates.cluster);
    }

    if (user && user.uid && user.uid !== "demo-operator-id") {
      try {
        const userRef = doc(db, "users", user.uid);
        await setDoc(userRef, {
          uid: user.uid,
          email: user.email || "",
          displayName: updates.displayName !== undefined ? updates.displayName : (user.displayName || ""),
          photoURL: updates.photoURL !== undefined ? updates.photoURL : (user.photoURL || ""),
          role: updates.role !== undefined ? updates.role : activeRole,
          tenant: updates.tenant !== undefined ? updates.tenant : activeTenant,
          createdAt: new Date().toISOString()
        }, { merge: true });
      } catch (err) {
        console.error("Firestore user profile save failed:", err);
      }
    }
  };

  // Sync data whenever user logs in or switches
  useEffect(() => {
    if (user) {
      fetchCloudSQLTelemetry(user);
      fetchUserProfile(user);
    } else {
      setIncidents([]);
      setLoading(false);
    }
  }, [user?.uid]);

  // Listen for window resize to handle breakpoints
  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Keyboard shortcut listeners for power user navigation and Command Palette
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Toggle search on Cmd+K or Ctrl+K
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setSearchOpen((prev) => !prev);
        return;
      }

      // Ignore shortcuts if the user is typing in inputs, textareas or any content-editable fields
      const target = e.target as HTMLElement;
      if (
        !target ||
        target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.isContentEditable
      ) {
        return;
      }

      const key = e.key.toUpperCase();
      if (key === "G") {
        setView("grid");
      } else if (key === "S") {
        setView("stream");
      } else if (key === "M") {
        setView("metrics");
      } else if (key === "C") {
        setView("config");
      } else if (key === "V") {
        setView("governance");
      } else if (key === "T") {
        setView("cli");
      } else if (key === "P") {
        setView("proposal");
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Unified Sign-Out and State Clearance
  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (e) {
      console.error("Sign-out error:", e);
    }
    setUser(null);
  };

  // Handle simulated model drift
  const handleSimulate = async (model: string, metric: string, severity: "critical" | "warning", feature?: string) => {
    if (!user) return;
    try {
      setLoading(true);
      const token = await getAuthToken(user);
      const res = await fetch("/api/drift/simulate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({ model, metric, severity, feature }),
      });
      const data = await res.json();
      if (res.ok && data.incidents) {
        setIncidents(data.incidents);
        setErrorMessage("");
      } else {
        throw new Error(data.error || "Failed to register simulation");
      }
    } catch (err: any) {
      console.error("Simulation registration failed:", err);
      setErrorMessage(err.message || "PostgreSQL simulation event registration failed.");
    } finally {
      setLoading(false);
    }
  };

  // Handle mitigation workflow trigger
  const handleMitigate = async (id: string) => {
    if (!user) return;
    try {
      setLoading(true);
      const token = await getAuthToken(user);
      const res = await fetch("/api/drift/mitigate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({ id }),
      });
      const data = await res.json();
      if (res.ok && data.incidents) {
        setIncidents(data.incidents);
        setErrorMessage("");
      } else {
        throw new Error(data.error || "Failed to trigger mitigation");
      }
    } catch (err: any) {
      console.error("Mitigation request failed:", err);
      setErrorMessage(err.message || "PostgreSQL mitigation update failed.");
    } finally {
      setLoading(false);
    }
  };

  // Handle policies/safety threshold updates
  const handleUpdatePolicies = async (updates: { psiThreshold?: number; canaryLatency?: number; autoMitigate?: boolean }) => {
    if (!user) return;
    try {
      const token = await getAuthToken(user);
      // Optimistic update
      const newPolicies = { ...policies, ...updates };
      setPolicies(newPolicies);

      const res = await fetch("/api/drift/policies", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(newPolicies),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to sync policies");
      }
      setErrorMessage("");
    } catch (err: any) {
      console.error("Failed to update policy settings in Cloud SQL:", err);
      setErrorMessage(err.message || "Failed to persist safety policy to PostgreSQL database.");
      // Rollback
      fetchCloudSQLTelemetry(user);
    }
  };

  // If Auth state is loading, display beautiful splash loader
  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#07080e] flex flex-col justify-center items-center font-mono text-xs text-[#00b0ff]">
        <Loader2 className="w-6 h-6 animate-spin mb-3 text-[#0f62fe]" />
        <span>SYNCHRONIZING SECURE ENTERPRISE CLOUD SYNC...</span>
      </div>
    );
  }

  // If user is not logged in, force authentication gate
  if (!user) {
    return <AuthGate onSignInError={(err) => setErrorMessage(err)} onDemoAccess={handleDemoAccess} />;
  }

  return (
    <div className={`min-h-screen bg-[#050810] text-[#F0F2F8] flex font-sans overflow-hidden ${theme === "light" ? "light-mode" : ""} ${scanningLine ? "scanning-line-active" : ""}`}>
      {theme === "light" && (
        <style>{`
          /* Force Light Mode variables & overrides */
          body {
            background-color: #FAFAFA !important;
            color: #0F172A !important;
          }
          
          /* Root container overrides */
          #root, .min-h-screen, .bg-\\[\\#0D0F14\\], .bg-\\[\\#13161E\\], .bg-\\[\\#1C2030\\], .bg-\\[\\#07080e\\] {
            background-color: #F8FAFC !important;
            color: #0F172A !important;
          }
          
          /* Nav aside bar */
          aside, header, footer {
            background-color: #FFFFFF !important;
            border-color: #E2E8F0 !important;
          }
          
          /* Border overrides */
          .border-\\[\\#202538\\], .border-\\[\\#2A2F45\\], .border-\\[\\#3D4460\\], .border-outline, hr {
            border-color: #E2E8F0 !important;
          }
          
          /* Cards and boxes */
          .bg-\\[\\#13161E\\], .bg-\\[\\#1C2030\\], .bg-black\\/75, .bg-\\[\\#0D0F14\\]\\/40, .bg-\\[\\#13161E\\]\\/40 {
            background-color: #FFFFFF !important;
            box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.05), 0 2px 4px -2px rgb(0 0 0 / 0.05) !important;
          }
          
          /* Hover and active button backgrounds */
          .hover\\:bg-\\[\\#1C2030\\], .hover\\:bg-\\[\\#00D9E8\\]\\/8, .bg-\\[\\#00D9E8\\]\\/8 {
            background-color: #F1F5F9 !important;
          }
          
          /* Input and textareas */
          input, select, textarea {
            background-color: #FFFFFF !important;
            color: #0F172A !important;
            border-color: #CBD5E1 !important;
          }
          
          /* Text color overrides */
          .text-white, .text-\\[\\#F0F2F8\\], .text-white\\/90 {
            color: #0F172A !important;
          }
          
          .text-\\[\\#8891A8\\], .text-\\[\\#3D4460\\] {
            color: #475569 !important;
          }
          
          /* Pre and monospace containers */
          pre, code, .bg-\\[\\#0D0F14\\] {
            background-color: #F8FAFC !important;
            border-color: #E2E8F0 !important;
            color: #0F172A !important;
          }
          
          /* Ensure display titles stay readable and elegant */
          h1, h2, h3, h4, h5, h6 {
            color: #0F172A !important;
          }
          
          /* Theme override for icons and custom accents */
          .text-\\[\\#00D9E8\\] {
            color: #0EA5E9 !important; /* Premium sky blue for contrast */
          }
          .text-\\[\\#7B61FF\\] {
            color: #6366F1 !important; /* Indigo accent */
          }
          .bg-\\[\\#7B61FF\\]\\/15, .bg-\\[\\#7B61FF\\]\\/10 {
            background-color: rgba(99, 102, 241, 0.1) !important;
          }
          .text-\\[\\#00C48C\\] {
            color: #10B981 !important;
          }
          .bg-\\[\\#00C48C\\]\\/10, .bg-\\[\\#00C48C\\]\\/15 {
            background-color: rgba(16, 185, 129, 0.1) !important;
          }
          .bg-\\[\\#FF3B5C\\]\\/15 {
            background-color: rgba(239, 68, 68, 0.1) !important;
          }
          .text-\\[\\#FF3B5C\\] {
            color: #EF4444 !important;
          }
        `}</style>
      )}
      
      {/* 1. Desktop-First Alert Banner overlay (Triggered under 1024px) */}
      <AnimatePresence>
        {windowWidth < 1024 && !dismissMobileWarning && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[999] bg-[#0D0F14]/95 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center"
          >
            <div className="max-w-md bg-[#13161E] border border-[#202538] p-8 rounded-lg shadow-2xl relative">
              <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-[#7B61FF] to-[#00D9E8]"></div>
              <Laptop className="w-12 h-12 text-[#00D9E8] mx-auto mb-4" />
              <h2 className="font-sans text-base font-bold text-[#F0F2F8] uppercase tracking-wider">
                Desktop-First Enterprise Console
              </h2>
              <div className="mt-4 space-y-3 text-left font-sans text-xs text-[#8891A8] leading-relaxed">
                <p>
                  Phaelitus SDK Autonomous Control Plane is built for multi-cluster data telemetry, graphs, and deep auditing. 
                </p>
                <div className="p-3 bg-[#1C2030] border border-[#202538] rounded text-yellow-400 font-mono text-[11px] leading-normal">
                  <span className="font-bold uppercase text-amber-400 block mb-1">💡 RECOMMENDED ACTION:</span>
                  Please tap your browser options and select <span className="underline font-bold text-[#F0F2F8]">"Request Desktop Site" / "Desktop Mode"</span> to avoid horizontal tab scrolling on smaller devices.
                </div>
                <p>
                  If you choose to enter now, we have integrated a sticky <span className="text-[#00D9E8] font-bold">"MENU ☰" Overview Tool</span> in the bottom bar so you can instantly switch views without having to scroll the horizontal navigation.
                </p>
              </div>
              <div className="mt-6 flex flex-col gap-2.5">
                <button
                  onClick={() => setDismissMobileWarning(true)}
                  className="w-full py-2.5 bg-[#7B61FF] hover:bg-[#7B61FF]/90 text-white text-xs font-mono font-bold uppercase tracking-wider rounded transition-all active:scale-[0.98] cursor-pointer"
                >
                  Enter Mobile Sandbox anyway
                </button>
                <span className="text-[9px] font-mono text-[#3D4460]">
                  V1.4.2 Autonomous Engine &bull; Co-Monitored Zone
                </span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 2. Interactive CMD+K Command Palette Modal */}
      <AnimatePresence>
        {searchOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/75 backdrop-blur-[8px] flex items-center justify-center p-4"
            onClick={() => setSearchOpen(false)}
          >
            <motion.div 
              initial={{ scale: 0.97, y: 10 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.97, y: 10 }}
              transition={{ duration: 0.2 }}
              className="w-full max-w-xl bg-[#1C2030] border border-[#2A2F45] rounded-lg shadow-2xl overflow-hidden flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center gap-3 px-4 py-3 border-b border-[#2A2F45] bg-[#13161E]">
                <Search className="w-4 h-4 text-[#8891A8]" />
                <input 
                  type="text"
                  placeholder="Type a command or jump to workspace..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-transparent text-sm text-[#F0F2F8] outline-none flex-1 font-sans placeholder-[#3D4460]"
                  autoFocus
                />
                <span className="text-[9px] font-mono text-[#3D4460] bg-[#0D0F14] px-1.5 py-0.5 rounded border border-[#2A2F45]">ESC</span>
              </div>

              <div className="max-h-72 overflow-y-auto p-2 flex flex-col gap-1 no-scrollbar">
                <span className="text-[9px] uppercase font-mono text-[#3D4460] tracking-wider font-bold px-2 py-1.5 block">
                  Workspace Actions
                </span>
                {[
                  { name: "Navigate to Grid Topology", shortcut: "G", action: () => setView("grid") },
                  { name: "Navigate to Incident Stream", shortcut: "S", action: () => setView("stream") },
                  { name: "Navigate to Metrics Registry", shortcut: "M", action: () => setView("metrics") },
                  { name: "Navigate to Safety Configuration", shortcut: "C", action: () => setView("config") },
                  { name: "Switch to Production Cluster (West)", shortcut: "Alt+1", action: () => setActiveCluster("us-east-prod-01") },
                  { name: "Switch to Staging Cluster (Main)", shortcut: "Alt+2", action: () => setActiveCluster("global-co-monitored") },
                  { name: "Switch to Local Node (Dev-Staging)", shortcut: "Alt+3", action: () => setActiveCluster("cluster-04-dev") },
                ]
                  .filter(cmd => cmd.name.toLowerCase().includes(searchQuery.toLowerCase()))
                  .map((cmd, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        cmd.action();
                        setSearchOpen(false);
                        setSearchQuery("");
                      }}
                      className="w-full text-left p-2 hover:bg-[#00D9E8]/8 rounded flex justify-between items-center group transition-colors cursor-pointer"
                    >
                      <span className="text-xs text-[#8891A8] group-hover:text-[#00D9E8] font-sans transition-colors">
                        {cmd.name}
                      </span>
                      <kbd className="text-[9px] font-mono text-[#3D4460] bg-[#0D0F14] px-1.5 py-0.5 rounded border border-[#2A2F45] group-hover:border-[#00D9E8]/20 group-hover:text-[#00D9E8] transition-colors">
                        {cmd.shortcut}
                      </kbd>
                    </button>
                  ))}
              </div>

              <div className="p-3 border-t border-[#2A2F45] bg-[#13161E] flex justify-between items-center text-[10px] font-mono text-[#3D4460]">
                <span>Phaelitus SDK Control Palette</span>
                <span>Use keyboard shortcuts G, S, M, C to navigate quickly</span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 3. Navigation Sidebar (Persistent, 64px collapsed, expands to 220px on hover) */}
      <aside className="hidden md:flex flex-col justify-between h-screen w-16 hover:w-[220px] transition-all duration-300 ease-in-out bg-[#13161E] border-r border-[#202538] fixed left-0 top-0 z-40 group select-none">
        
        {/* Top Logo and Identity */}
        <div>
          <div className="h-16 flex items-center px-4.5 gap-3 border-b border-[#202538] overflow-hidden">
            {/* Custom high-fidelity modern logo mark */}
            <div className="flex -space-x-1.5 flex-shrink-0">
              <span className="w-3.5 h-3.5 rounded bg-[#00D9E8] shadow-[0_0_8px_rgba(0,217,232,0.6)]"></span>
              <span className="w-3.5 h-3.5 rounded bg-[#7B61FF] shadow-[0_0_8px_rgba(123,97,255,0.6)]"></span>
            </div>
            <span className="font-serif text-sm text-[#F0F2F8] font-bold tracking-tight whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              Phaelitus<span className="font-sans text-xs text-[#00D9E8] font-medium ml-0.5"> SDK</span>
            </span>
          </div>

          {/* Navigation Links */}
          <nav className="mt-4 flex flex-col gap-1.5">
            {[
              { id: "grid", label: "Overview Node", icon: Grid3X3 },
              { id: "stream", label: "Incident Feed", icon: Activity },
              { id: "metrics", label: "Model Registry", icon: BarChart3 },
              { id: "config", label: "Drift Monitor", icon: Sliders },
              { id: "settings", label: "Settings & Integrations", icon: Settings },
              { id: "governance", label: "Trust & Gov", icon: ShieldCheck },
              { id: "cli", label: "Developer CLI", icon: Terminal },
              { id: "docs", label: "Resource Hub", icon: BookOpen },
              { id: "health", label: "System Health", icon: Server },
              { id: "audit", label: "Audit Log", icon: History },
              { id: "proposal", label: "Enterprise Pitch", icon: FileText },
            ].map((item) => {
              const IconComp = item.icon;
              const isActive = view === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setView(item.id as any)}
                  className={`w-full h-11 flex items-center relative transition-all duration-150 text-left group/btn border-r-0 cursor-pointer ${
                    isActive 
                      ? "bg-[#00D9E8]/8 text-[#00D9E8]" 
                      : "text-[#8891A8] hover:bg-[#1C2030] hover:text-[#F0F2F8]"
                  }`}
                >
                  {/* Active Indicators */}
                  {isActive && (
                    <span className="absolute left-0 top-0 bottom-0 w-[2px] bg-[#00D9E8]" />
                  )}

                  <div className="w-16 flex-shrink-0 flex items-center justify-center">
                    <IconComp className="w-[17px] h-[17px]" />
                  </div>

                  <span className="font-sans text-xs tracking-wide opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
                    {item.label}
                  </span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom Pinned User Section + Disconnect */}
        <div className="border-t border-[#202538] bg-[#0D0F14]/40">
          {/* User profile details */}
          <div className="p-3 flex items-center gap-3 overflow-hidden">
            <div className="relative flex-shrink-0">
              {user.photoURL ? (
                <img
                  src={user.photoURL}
                  alt={user.displayName || "Operator"}
                  referrerPolicy="no-referrer"
                  className="w-7 h-7 rounded-full border border-outline shadow-inner"
                />
              ) : (
                <div className="w-7 h-7 rounded-full bg-[#1C2030] border border-outline flex items-center justify-center text-[10px] font-mono text-[#00D9E8] font-bold">
                  {user.displayName ? user.displayName.substring(0, 2).toUpperCase() : "OP"}
                </div>
              )}
              {/* Green connection dot */}
              <span className="absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full bg-[#00C48C] border border-[#13161E] shadow-sm animate-pulse" />
            </div>

            <div className="flex flex-col text-left opacity-0 group-hover:opacity-100 transition-opacity duration-200 overflow-hidden whitespace-nowrap">
              <span className="text-[10px] font-sans font-semibold text-[#F0F2F8] truncate leading-none uppercase tracking-wide">
                {user.displayName || "Operator"}
              </span>
              <span className="text-[7.5px] font-mono text-[#00D9E8] truncate leading-none mt-1 uppercase">
                {activeRole}
              </span>
              <span className="text-[7px] font-mono text-[#8891A8] truncate leading-none mt-1 uppercase">
                {activeTenant.length > 20 ? activeTenant.substring(0, 18) + "..." : activeTenant}
              </span>
            </div>
          </div>

          {/* Quick Disconnect */}
          <button
            onClick={handleLogout}
            className="w-full h-10 border-t border-[#202538] hover:bg-[#FF3B5C]/5 text-[#FF3B5C] hover:text-white flex items-center transition-colors overflow-hidden cursor-pointer"
            title="Disconnect Active Session"
          >
            <div className="w-16 flex-shrink-0 flex items-center justify-center">
              <LogOut className="w-3.5 h-3.5" />
            </div>
            <span className="text-[9px] font-mono font-bold tracking-wider uppercase opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              DISCONNECT
            </span>
          </button>
        </div>
      </aside>

      {/* 4. Main Layout Frame (shifted left 64px on medium screens to allow sidebar overlay space) */}
      <div className="flex-1 flex flex-col min-h-screen md:pl-16 overflow-y-auto no-scrollbar relative z-10">
        
        {/* Top bar — 48px tall */}
        <header className="h-12 bg-[#13161E] border-b border-[#202538] flex items-center justify-between px-6 sticky top-0 z-30 shadow-md relative">
          
          {/* Breadcrumb path */}
          <div className="flex items-center gap-1.5 font-mono text-[10px] tracking-wider text-[#8891A8] uppercase">
            <button onClick={() => setView("stream")} className="hover:underline hover:text-[#F0F2F8] cursor-pointer">PHAELITUS SDK</button>
            <ChevronRight className="w-3 h-3 text-[#3D4460]" />
            <span className="hover:underline hover:text-[#F0F2F8] cursor-pointer">CLUSTERS</span>
            <ChevronRight className="w-3 h-3 text-[#3D4460]" />
            <button onClick={() => setClusterDropdownOpen(true)} className="hover:underline hover:text-[#F0F2F8] cursor-pointer">{activeCluster}</button>
            <ChevronRight className="w-3 h-3 text-[#3D4460]" />
            <span className="text-[#F0F2F8] font-bold">{view}</span>
          </div>

          {/* Centered Phaelitus SDK Title */}
          <div className="absolute left-[44%] -translate-x-1/2 hidden lg:flex items-center gap-2">
            <div className="flex -space-x-1 flex-shrink-0">
              <span className="w-2 h-2 rounded-full bg-[#00D9E8] shadow-[0_0_6px_rgba(0,217,232,0.6)] animate-pulse"></span>
              <span className="w-2 h-2 rounded-full bg-[#7B61FF] shadow-[0_0_6px_rgba(123,97,255,0.6)]"></span>
            </div>
            <span className="font-sans text-xs text-[#F0F2F8] font-bold tracking-widest uppercase">
              Phaelitus<span className="text-[#00D9E8]"> SDK</span>
            </span>
          </div>

          {/* Right Header controls */}
          <div className="flex items-center gap-3">
            
            {/* Global Search Trigger (Cmd+K) */}
            <button 
              onClick={() => setSearchOpen(true)}
              className="bg-[#0D0F14] border border-[#202538] hover:border-[#00D9E8]/30 px-3 py-1.5 rounded text-left text-[11px] font-sans text-[#3D4460] hover:text-[#8891A8] flex items-center gap-3 transition-colors cursor-pointer"
            >
              <Search className="w-3.5 h-3.5 text-[#3D4460]" />
              <span className="hidden sm:inline">Search commands...</span>
              <kbd className="text-[9px] font-mono text-[#3D4460] bg-[#1C2030] px-1 rounded border border-[#202538]">⌘K</kbd>
            </button>

            {/* Current cluster multi-tenant switcher */}
            <div className="relative">
              <button
                onClick={() => setClusterDropdownOpen(!clusterDropdownOpen)}
                className="bg-[#1C2030] hover:bg-[#1C2030]/80 border border-[#202538] hover:border-[#00D9E8]/30 px-2.5 py-1.5 rounded text-[10px] font-mono font-bold tracking-wide text-[#F0F2F8] flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Database className="w-3.5 h-3.5 text-[#00D9E8]" />
                <span className="uppercase">{activeCluster}</span>
              </button>
              
              <AnimatePresence>
                {clusterDropdownOpen && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setClusterDropdownOpen(false)} />
                    <motion.div
                      initial={{ opacity: 0, y: 5, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 5, scale: 0.98 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 mt-1.5 w-52 bg-[#1C2030] border border-[#2A2F45] rounded shadow-2xl z-50 py-1"
                    >
                      <span className="text-[9px] font-mono text-[#3D4460] uppercase px-3 py-1 block border-b border-[#2A2F45]">
                        Multi-Tenant Clusters
                      </span>
                      {[
                        { id: "us-east-prod-01", label: "Cluster_01 (Prod-West)" },
                        { id: "global-co-monitored", label: "Co-Monitor (Staging)" },
                        { id: "cluster-04-dev", label: "Cluster_04 (Local-Dev)" }
                      ].map((cluster) => (
                        <button
                          key={cluster.id}
                          onClick={() => {
                            setActiveCluster(cluster.id);
                            setClusterDropdownOpen(false);
                          }}
                          className="w-full text-left px-3 py-1.5 text-[11px] font-mono text-[#8891A8] hover:text-[#00D9E8] hover:bg-[#00D9E8]/8 flex items-center justify-between transition-colors cursor-pointer"
                        >
                          <span>{cluster.label}</span>
                          {activeCluster === cluster.id && <Check className="w-3.5 h-3.5 text-[#00D9E8]" />}
                        </button>
                      ))}
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>

            {/* Tenant Switcher Dropdown */}
            <div className="relative">
              <button
                onClick={() => setTenantDropdownOpen(!tenantDropdownOpen)}
                className="bg-[#1C2030] hover:bg-[#1C2030]/80 border border-[#202538] hover:border-[#00D9E8]/30 px-2.5 py-1.5 rounded text-[10px] font-mono font-bold tracking-wide text-[#F0F2F8] flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <UserCheck className="w-3.5 h-3.5 text-[#7B61FF]" />
                <span className="uppercase">{activeTenant.split(" ")[0]}</span>
              </button>
              
              <AnimatePresence>
                {tenantDropdownOpen && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setTenantDropdownOpen(false)} />
                    <motion.div
                      initial={{ opacity: 0, y: 5, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 5, scale: 0.98 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 mt-1.5 w-60 bg-[#1C2030] border border-[#2A2F45] rounded shadow-2xl z-50 py-1"
                    >
                      <span className="text-[9px] font-mono text-[#3D4460] uppercase px-3 py-1 block border-b border-[#2A2F45]">
                        Switch Active Tenant / Role
                      </span>
                      {[
                        { tenant: "Global Retail Corp (Primary)", role: "Cluster Admin" },
                        { tenant: "Risk Assessment Dept", role: "Security Auditor" },
                        { tenant: "Compliance Staging Node", role: "Compliance Officer" }
                      ].map((tenantObj, idx) => (
                        <button
                          key={idx}
                          onClick={() => {
                            setActiveTenant(tenantObj.tenant);
                            setActiveRole(tenantObj.role);
                            setTenantDropdownOpen(false);
                          }}
                          className="w-full text-left px-3 py-2 text-[11px] font-mono text-[#8891A8] hover:text-[#00D9E8] hover:bg-[#00D9E8]/8 flex flex-col gap-0.5 transition-colors cursor-pointer border-b border-[#202538]/50 last:border-b-0"
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-white font-bold">{tenantObj.tenant}</span>
                            {activeTenant === tenantObj.tenant && <Check className="w-3 h-3 text-[#00D9E8]" />}
                          </div>
                          <span className="text-[9px] text-[#8891A8] uppercase">{tenantObj.role}</span>
                        </button>
                      ))}
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>

            {/* Dark/Light Mode Theme Toggle */}
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="p-1.5 bg-[#1C2030] hover:bg-[#1C2030]/80 border border-[#202538] hover:border-[#00D9E8]/30 rounded text-[#8891A8] hover:text-[#F0F2F8] transition-colors cursor-pointer"
              title={`Switch to ${theme === "dark" ? "Light" : "Dark"} Mode`}
            >
              {theme === "dark" ? <Sun className="w-3.5 h-3.5 text-[#F5A623]" /> : <Moon className="w-3.5 h-3.5 text-[#7B61FF]" />}
            </button>

            {/* Sandbox Diagnostics Controls */}
            <div className="relative">
              <button
                onClick={() => setDiagnosticsOpen(!diagnosticsOpen)}
                className={`p-1.5 border rounded transition-colors relative cursor-pointer ${
                  simOffline || simKafkaLag
                    ? "bg-[#FF3B5C]/10 border-[#FF3B5C]/40 text-[#FF3B5C] hover:text-[#FF3B5C]/80"
                    : "bg-[#1C2030] border-[#202538] hover:border-[#00D9E8]/30 text-[#8891A8] hover:text-[#F0F2F8]"
                }`}
                title="Sandbox Diagnostics"
              >
                <Wrench className="w-3.5 h-3.5" />
                {(simOffline || simKafkaLag) && (
                  <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-[#FF3B5C] shadow-[0_0_4px_rgba(255,59,92,0.6)]" />
                )}
              </button>
              
              <AnimatePresence>
                {diagnosticsOpen && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setDiagnosticsOpen(false)} />
                    <motion.div
                      initial={{ opacity: 0, y: 5, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 5, scale: 0.98 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 mt-1.5 w-64 bg-[#1C2030] border border-[#2A2F45] rounded shadow-2xl z-50 p-3 flex flex-col gap-2.5"
                    >
                      <div className="pb-1.5 border-b border-[#2A2F45] flex justify-between items-center">
                        <span className="text-[9px] font-mono font-bold uppercase text-white">Diagnostics Controls</span>
                        <span className="text-[8px] font-mono text-[#00D9E8] uppercase font-bold">SIMULATOR ACTIVE</span>
                      </div>

                      {/* Connection drop toggle */}
                      <div className="flex items-center justify-between text-[10px] font-mono">
                        <span className="text-[#8891A8] uppercase">Connection Drop</span>
                        <button
                          onClick={() => setSimOffline(!simOffline)}
                          className={`px-2 py-1 rounded text-[8px] font-bold uppercase tracking-wider cursor-pointer ${
                            simOffline ? "bg-[#FF3B5C] text-white" : "bg-[#0D0F14] text-[#8891A8] border border-[#202538]"
                          }`}
                        >
                          {simOffline ? "Offline" : "Online"}
                        </button>
                      </div>

                      {/* Kafka lag toggle */}
                      <div className="flex items-center justify-between text-[10px] font-mono">
                        <span className="text-[#8891A8] uppercase">Kafka Lag Spike</span>
                        <button
                          onClick={() => setSimKafkaLag(!simKafkaLag)}
                          className={`px-2 py-1 rounded text-[8px] font-bold uppercase tracking-wider cursor-pointer ${
                            simKafkaLag ? "bg-[#FF3B5C] text-white" : "bg-[#0D0F14] text-[#8891A8] border border-[#202538]"
                          }`}
                        >
                          {simKafkaLag ? "Spiked" : "Normal"}
                        </button>
                      </div>

                      {/* Explicit loader trigger */}
                      <div className="flex flex-col gap-1 border-t border-[#202538] pt-2">
                        <button
                          onClick={() => {
                            setLoading(true);
                            setDiagnosticsOpen(false);
                            setTimeout(() => {
                              setLoading(false);
                            }, 1200);
                          }}
                          className="w-full py-1.5 bg-[#7B61FF]/10 hover:bg-[#7B61FF]/20 border border-[#7B61FF]/30 text-[#00D9E8] text-[9px] font-mono uppercase font-bold rounded transition-colors cursor-pointer"
                        >
                          Simulate Reload Skeleton
                        </button>
                      </div>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>

            {/* Notification system with dot */}
            <div className="relative">
              <button 
                onClick={() => setNotificationsOpen(!notificationsOpen)}
                className="p-1.5 bg-[#1C2030] border border-[#202538] hover:border-[#00D9E8]/30 rounded text-[#8891A8] hover:text-[#F0F2F8] transition-colors relative cursor-pointer"
              >
                <Bell className="w-3.5 h-3.5" />
                <span className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-[#FF3B5C] shadow-[0_0_4px_rgba(255,59,92,0.6)] animate-ping" />
              </button>

              <AnimatePresence>
                {notificationsOpen && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setNotificationsOpen(false)} />
                    <motion.div
                      initial={{ opacity: 0, y: 5, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 5, scale: 0.98 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 mt-1.5 w-80 bg-[#1C2030] border border-[#2A2F45] rounded shadow-2xl z-50 p-3 flex flex-col gap-2"
                    >
                      <div className="flex justify-between items-center pb-2 border-b border-[#2A2F45]">
                        <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#F0F2F8]">
                          Operational Alerts
                        </span>
                        <span className="text-[8px] font-mono text-[#FF3B5C] bg-[#FF3B5C]/10 px-1.5 py-0.5 rounded">
                          3 ACTIVE
                        </span>
                      </div>
                      <div className="flex flex-col gap-2">
                        {[
                          { type: "critical", text: "Model drift 'aether-prod-drift' exceeds bound 0.85.", time: "10m ago" },
                          { type: "warning", text: "P99 latency spike on 'churn-predictor-v2' (472ms).", time: "25m ago" },
                          { type: "success", text: "AIF360 scan completed successfully.", time: "1h ago" }
                        ].map((notif, idx) => (
                          <div key={idx} className="p-2 bg-[#0D0F14] border border-[#202538] rounded text-[10px] leading-relaxed font-sans">
                            <div className="flex justify-between items-center mb-1">
                              <span className={`uppercase font-mono font-bold text-[8px] ${
                                notif.type === "critical" ? "text-[#FF3B5C]" : notif.type === "warning" ? "text-[#F5A623]" : "text-[#00C48C]"
                              }`}>
                                {notif.type}
                              </span>
                              <span className="text-[#3D4460] font-mono text-[8px]">{notif.time}</span>
                            </div>
                            <p className="text-[#8891A8]">{notif.text}</p>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>

            {/* Quick Session Disconnect (Sign Out) */}
            <button
              id="header-logout-btn"
              onClick={handleLogout}
              className="p-1.5 md:px-2.5 md:py-1.5 bg-[#1C2030] hover:bg-[#FF3B5C]/10 border border-[#202538] hover:border-[#FF3B5C]/40 rounded text-[#FF3B5C] hover:text-white flex items-center gap-1.5 transition-all cursor-pointer font-mono text-[10px] font-bold uppercase tracking-wider"
              title="Disconnect Session / Logout"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Disconnect</span>
            </button>

          </div>
        </header>

        {/* 5. Main Center Canvas (cap content at 1440px max-width, 24px padding, with bottom spacing on mobile for navigation offset) */}
        <main className="flex-1 p-6 pb-24 md:pb-6 max-w-[1440px] w-full mx-auto flex flex-col gap-5">
          
          {/* Continuous Evaluation Compliance Bar */}
          <div className="bg-[#13161E] border border-[#202538] px-4 py-3 rounded-lg flex flex-wrap items-center justify-between gap-3 text-[10px] font-sans text-[#8891A8] shadow-sm">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#00C48C] animate-pulse"></span>
              <span className="font-bold uppercase tracking-wider text-[#F0F2F8]">Continuous Control &amp; AI Security Guardrails:</span>
              <span className="text-[#8891A8]">Vertex AI Pipelines &bull; IBM watsonx.governance &bull; Local Autonomous Policy Shield</span>
            </div>
            <div className="flex items-center gap-1.5 font-mono text-[9px] font-bold text-[#00C48C] bg-[#00C48C]/5 px-2.5 py-1 rounded-full border border-[#00C48C] tracking-widest shadow-[0_0_6px_rgba(0,196,140,0.15)]">
              <Check className="w-3.5 h-3.5 text-[#00C48C] stroke-[3]" />
              <span>NODE SECURE</span>
            </div>
          </div>

          {/* Simulated Offline / Connection Drop Banner */}
          {simOffline && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-[#FF3B5C]/15 border-2 border-[#FF3B5C] p-4 rounded-lg flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-white shadow-lg animate-pulse"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-[#FF3B5C]/20 rounded-full">
                  <WifiOff className="w-5 h-5 text-[#FF3B5C]" />
                </div>
                <div>
                  <span className="font-mono font-bold text-[#FF3B5C] uppercase block tracking-wider text-[9px]">Active Simulated Outage</span>
                  <span className="font-sans text-[#8891A8]">CONNECTION LOSS: Core Postgres database telemetry stream has timed out. Local cache serves fallback stale snapshot.</span>
                </div>
              </div>
              <button 
                onClick={() => setSimOffline(false)} 
                className="px-3 py-1.5 bg-[#FF3B5C] hover:bg-[#FF3B5C]/80 font-mono font-bold text-white text-[10px] uppercase tracking-wider rounded cursor-pointer transition-colors shrink-0"
              >
                Reconnect Services
              </button>
            </motion.div>
          )}

          {/* Simulated Kafka Ingestion Lag Warning Banner */}
          {simKafkaLag && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-[#F5A623]/10 border border-[#F5A623]/40 p-4 rounded-lg flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-white shadow"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-[#F5A623]/10 rounded-full">
                  <Activity className="w-5 h-5 text-[#F5A623]" />
                </div>
                <div>
                  <span className="font-mono font-bold text-[#F5A623] uppercase block tracking-wider text-[9px]">Ingestion Queue Congestion Warning</span>
                  <span className="font-sans text-[#8891A8]">Kafka cluster partitions are backlogged (+142,800 messages behind candidate telemetry). Stream latency has degraded to 42.1s.</span>
                </div>
              </div>
              <button 
                onClick={() => setSimKafkaLag(false)} 
                className="px-3 py-1.5 bg-[#F5A623]/25 hover:bg-[#F5A623]/35 text-[#F5A623] font-mono font-bold text-[10px] uppercase tracking-wider rounded cursor-pointer border border-[#F5A623]/40 transition-colors shrink-0"
              >
                Flush Queue
              </button>
            </motion.div>
          )}

          {/* Interactive Onboarding Wizard Banner */}
          {showOnboarding && !onboardingOpen && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gradient-to-r from-[#7B61FF]/10 to-[#00D9E8]/10 border border-[#7B61FF]/40 p-5 rounded-lg flex flex-col md:flex-row items-center justify-between gap-5 relative overflow-hidden shadow-lg"
            >
              <div className="absolute right-0 top-0 translate-x-12 -translate-y-12 w-48 h-48 bg-[#00D9E8]/5 rounded-full blur-3xl pointer-events-none" />
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="text-[8px] bg-[#00D9E8] text-[#13161E] font-bold px-1.5 py-0.5 rounded uppercase font-mono">NEW CLUSTER ACTIVE</span>
                  <span className="text-[10px] font-mono text-[#00D9E8] uppercase tracking-wider font-bold">First-Run Wizard Available</span>
                </div>
                <h4 className="text-white font-sans text-sm font-semibold tracking-tight">Setup Phaelitus SDK In 3 Steps</h4>
                <p className="text-[10.5px] font-sans text-[#8891A8] leading-relaxed mt-1 max-w-3xl">
                  Connect your first telemetry feed, configure real-time drift metrics, and specify automated operational notification channels. Take a 2-minute tour to see the system in action.
                </p>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <button
                  onClick={() => setShowOnboarding(false)}
                  className="px-3 py-1.5 hover:bg-white/5 text-[#8891A8] hover:text-white font-sans text-[10.5px] rounded transition-all cursor-pointer"
                >
                  Dismiss
                </button>
                <button
                  onClick={() => {
                    setOnboardingStep(1);
                    setOnboardingOpen(true);
                  }}
                  className="px-4 py-1.5 bg-[#00D9E8] hover:bg-[#00D9E8]/90 text-[#13161E] font-sans text-[10.5px] font-bold rounded shadow-md cursor-pointer transition-all flex items-center gap-1.5"
                >
                  <Play className="w-3 h-3 fill-current text-[#13161E]" />
                  <span>Start Tour Wizard</span>
                </button>
              </div>
            </motion.div>
          )}

          {/* Render error banner if any sync fails */}
          {errorMessage && (
            <div className="bg-[#FF3B5C]/10 border border-[#FF3B5C]/30 p-3.5 rounded-lg flex items-center gap-3 text-xs text-[#FF3B5C]">
              <ShieldAlert className="w-4 h-4 flex-shrink-0" />
              <div className="flex-1 font-mono">{errorMessage}</div>
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => {
                    if (user) {
                      fetchCloudSQLTelemetry(user);
                    }
                  }} 
                  className="text-white hover:text-white bg-[#FF3B5C]/20 hover:bg-[#FF3B5C]/30 text-[10px] uppercase font-mono tracking-widest border border-[#FF3B5C]/40 px-2.5 py-1 rounded transition-colors cursor-pointer"
                >
                  Retry Sync
                </button>
                <button 
                  onClick={() => setErrorMessage("")} 
                  className="text-[#8891A8] hover:text-[#F0F2F8] text-[10px] uppercase font-mono tracking-widest border border-[#2A2F45] hover:border-white px-2 py-1 rounded transition-colors cursor-pointer"
                >
                  Clear
                </button>
              </div>
            </div>
          )}

          {loading ? (
            <div className="flex-1 flex flex-col gap-5 py-4">
              <div className="flex items-center gap-2 font-mono text-[9px] text-[#00D9E8] uppercase tracking-widest animate-pulse">
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Synchronizing Secure Enterprise Telemetry Direct from PostgreSQL...</span>
              </div>
              
              {/* Complex skeleton layout representing active view */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                {/* Stat 1 skeleton */}
                <div className="bg-[#13161E]/40 border border-[#202538] p-5 rounded-lg flex flex-col gap-3 animate-pulse">
                  <div className="h-2.5 w-24 bg-[#202538] rounded" />
                  <div className="h-6 w-16 bg-[#202538]/60 rounded mt-1" />
                  <div className="h-2 w-36 bg-[#202538]/40 rounded" />
                </div>
                {/* Stat 2 skeleton */}
                <div className="bg-[#13161E]/40 border border-[#202538] p-5 rounded-lg flex flex-col gap-3 animate-pulse">
                  <div className="h-2.5 w-32 bg-[#202538] rounded" />
                  <div className="h-6 w-20 bg-[#202538]/60 rounded mt-1" />
                  <div className="h-2 w-28 bg-[#202538]/40 rounded" />
                </div>
                {/* Stat 3 skeleton */}
                <div className="bg-[#13161E]/40 border border-[#202538] p-5 rounded-lg flex flex-col gap-3 animate-pulse">
                  <div className="h-2.5 w-20 bg-[#202538] rounded" />
                  <div className="h-6 w-12 bg-[#202538]/60 rounded mt-1" />
                  <div className="h-2 w-44 bg-[#202538]/40 rounded" />
                </div>
              </div>
              
              {/* Main canvas body skeleton */}
              <div className="bg-[#13161E]/40 border border-[#202538] rounded-lg p-6 flex flex-col gap-4 animate-pulse h-[400px]">
                <div className="flex justify-between items-center pb-3 border-b border-[#202538]">
                  <div className="h-4 w-40 bg-[#202538] rounded" />
                  <div className="h-6 w-24 bg-[#202538] rounded" />
                </div>
                <div className="flex-1 flex flex-col gap-3 justify-center">
                  <div className="h-2 w-full bg-[#202538]/80 rounded" />
                  <div className="h-2 w-5/6 bg-[#202538]/60 rounded" />
                  <div className="h-2 w-4/6 bg-[#202538]/40 rounded" />
                  <div className="h-2 w-3/6 bg-[#202538]/30 rounded" />
                  <div className="h-2 w-2/6 bg-[#202538]/20 rounded" />
                </div>
              </div>
            </div>
          ) : (
            /* Render Active View with modern ease-out transition (fast start, cushioned end) */
            <AnimatePresence mode="wait">
              <motion.div
                key={view}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.15, ease: "easeOut" }}
                className="flex-1 flex flex-col min-w-0"
              >
                {view === "grid" && <PipelineDAG />}
                {view === "stream" && (
                  <IncidentFeed 
                    incidents={incidents} 
                    onMitigate={handleMitigate} 
                    onSimulate={handleSimulate} 
                    user={user}
                  />
                )}
                {view === "metrics" && <ModelRegistry />}
                {view === "config" && (
                  <DriftDashboard 
                    psiThreshold={policies.psiThreshold}
                    canaryLatency={policies.canaryLatency}
                    autoMitigate={policies.autoMitigate}
                    onUpdatePolicies={handleUpdatePolicies}
                  />
                )}
                {view === "settings" && (
                  <SettingsIntegrations
                    user={user}
                    onUpdateProfile={handleUpdateProfile}
                    activeRole={activeRole}
                    activeTenant={activeTenant}
                    activeCluster={activeCluster}
                    theme={theme}
                    setTheme={setTheme}
                    scanningLine={scanningLine}
                    setScanningLine={setScanningLine}
                  />
                )}
                {view === "governance" && <GovernanceFinOps />}
                {view === "cli" && <DeveloperCLI />}
                {view === "docs" && <DocumentationHub />}
                {view === "health" && <SystemHealth />}
                {view === "audit" && <AuditLogViewer />}
                {view === "proposal" && <ProposalHub />}
              </motion.div>
            </AnimatePresence>
          )}
        </main>

        {/* Mobile/Tablet Fallback Footer Bar (visible ONLY on viewport < 768px for responsive accessibility) */}
        <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 h-14 bg-[#13161E] border-t border-[#202538] flex items-center justify-between pl-3 pr-2 select-none">
          {/* Scrollable part container with left/right masking indicator */}
          <div className="flex-1 overflow-x-auto no-scrollbar scroll-smooth whitespace-nowrap flex items-center gap-4 h-full py-1 relative">
            {[
              { id: "grid", label: "GRID", icon: Grid3X3 },
              { id: "stream", label: "STREAM", icon: Activity },
              { id: "metrics", label: "METRICS", icon: BarChart3 },
              { id: "config", label: "CONFIG", icon: Sliders },
              { id: "settings", label: "SETTINGS", icon: Settings },
              { id: "governance", label: "TRUST", icon: ShieldCheck },
              { id: "cli", label: "CLI", icon: Terminal },
              { id: "docs", label: "RESOURCES", icon: BookOpen },
              { id: "proposal", label: "PITCH", icon: FileText },
            ].map((item) => {
              const IconComp = item.icon;
              const isActive = view === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setView(item.id as any)}
                  className={`flex flex-col items-center justify-center shrink-0 min-w-[50px] h-full relative cursor-pointer transition-colors ${
                    isActive ? "text-[#00D9E8]" : "text-[#8891A8] hover:text-[#F0F2F8]"
                  }`}
                >
                  <IconComp className="w-4 h-4" />
                  <span className="font-sans text-[7.5px] uppercase tracking-wider mt-1">{item.label}</span>
                </button>
              );
            })}
          </div>

          {/* Sticky Non-Scrollable MENU Drawer Trigger to make all 11 pages immediately discoverable */}
          <div className="shrink-0 pl-2.5 border-l border-[#202538]/80 h-[32px] flex items-center bg-[#13161E]">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="px-2 py-1.5 bg-[#7B61FF]/10 hover:bg-[#7B61FF]/20 border border-[#7B61FF]/40 rounded text-[#00D9E8] font-mono text-[9px] uppercase tracking-wider font-bold flex items-center gap-1 cursor-pointer transition-all active:scale-[0.98]"
              title="Show All Workspace Views"
            >
              <Menu className="w-3.5 h-3.5" />
              <span>MENU</span>
            </button>
          </div>
        </nav>

        {/* Mobile Menu Overlay Popup */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <div className="fixed inset-0 z-[1000] bg-[#0D0F14]/90 backdrop-blur-md flex flex-col justify-end md:hidden">
              <motion.div
                initial={{ opacity: 0, y: "100%" }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: "100%" }}
                transition={{ type: "spring", damping: 25, stiffness: 220 }}
                className="bg-[#13161E] border-t border-[#202538] rounded-t-xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden relative"
              >
                {/* Top Accent Bar */}
                <div className="h-[3px] bg-gradient-to-r from-[#7B61FF] to-[#00D9E8] w-full" />
                
                {/* Header */}
                <div className="p-4 border-b border-[#202538] flex justify-between items-center bg-[#0D0F14]/50">
                  <div>
                    <h3 className="text-xs font-mono font-bold text-[#00D9E8] uppercase tracking-widest">
                      SYSTEM WORKSPACE DIRECTORY
                    </h3>
                    <p className="text-[10px] font-sans text-[#8891A8] mt-0.5">
                      Select any model telemetry dashboard instantly
                    </p>
                  </div>
                  <button
                    onClick={() => setMobileMenuOpen(false)}
                    className="p-1.5 bg-[#1C2030] hover:bg-white/5 border border-[#202538] rounded text-[#8891A8] hover:text-white cursor-pointer transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Grid List of all 11 Views */}
                <div className="p-5 overflow-y-auto max-h-[60vh] grid grid-cols-2 gap-3.5 no-scrollbar">
                  {[
                    { id: "grid", label: "Pipeline DAG", desc: "Model architecture graph", icon: Grid3X3, color: "text-purple-400" },
                    { id: "stream", label: "Event Stream", desc: "Live signal ingestion logs", icon: Activity, color: "text-emerald-400" },
                    { id: "metrics", label: "Model Registry", desc: "Weight registry & signatures", icon: BarChart3, color: "text-blue-400" },
                    { id: "config", label: "Drift Dashboard", desc: "Population drift, PSI values", icon: Sliders, color: "text-[#00D9E8]" },
                    { id: "governance", label: "Trust & FinOps", desc: "Carbon footprint & gas costs", icon: ShieldCheck, color: "text-amber-400" },
                    { id: "cli", label: "Developer CLI", desc: "Simulated kubectl terminal", icon: Terminal, color: "text-indigo-400" },
                    { id: "health", label: "System Health", desc: "CPU, memory, & latency metrics", icon: Server, color: "text-rose-400" },
                    { id: "audit", label: "Audit Ledger", desc: "Cryptographic SHA256 audit log", icon: History, color: "text-[#00C48C]" },
                    { id: "proposal", label: "Value Deck", desc: "CTO procurement pitch material", icon: FileText, color: "text-pink-400" },
                    { id: "docs", label: "Resources Hub", desc: "IBM and Google integration specs", icon: BookOpen, color: "text-[#F5A623]" },
                    { id: "settings", label: "Settings", desc: "Simulate service degradation", icon: Settings, color: "text-gray-400" }
                  ].map((item) => {
                    const IconComp = item.icon;
                    const isActive = view === item.id;
                    return (
                      <button
                        key={item.id}
                        onClick={() => {
                          setView(item.id as any);
                          setMobileMenuOpen(false);
                        }}
                        className={`p-3 rounded-lg border text-left flex gap-2.5 transition-all cursor-pointer ${
                          isActive 
                            ? "bg-[#7B61FF]/10 border-[#7B61FF] shadow-lg shadow-[#7B61FF]/5" 
                            : "bg-[#0D0F14] border-[#202538] hover:border-gray-700"
                        }`}
                      >
                        <div className={`p-1.5 rounded bg-white/5 shrink-0 ${item.color}`}>
                          <IconComp className="w-4 h-4" />
                        </div>
                        <div className="min-w-0">
                          <span className={`block text-[11px] font-bold ${isActive ? "text-[#00D9E8]" : "text-[#F0F2F8]"}`}>
                            {item.label}
                          </span>
                          <span className="block text-[9px] text-[#8891A8] leading-tight mt-0.5 truncate">
                            {item.desc}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* Footer info banner */}
                <div className="p-3 bg-[#0D0F14] border-t border-[#202538] text-center text-[9px] font-mono text-[#3D4460]">
                  JOINT GOVERNANCE CORE v5.22 &bull; POWERED BY GOOGLE CLOUD
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>

      {/* Onboarding Wizard Modal Overlay */}
      <AnimatePresence>
        {onboardingOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0D0F14]/85 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-[#13161E] border border-[#202538] w-full max-w-lg rounded-lg shadow-2xl overflow-hidden flex flex-col"
            >
              {/* Header */}
              <div className="bg-[#0D0F14] px-5 py-4 border-b border-[#202538] flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#00D9E8] animate-pulse" />
                  <span className="text-[10px] font-mono text-[#00D9E8] font-bold uppercase tracking-widest">Phaelitus SDK Onboarding Wizard</span>
                </div>
                <button
                  onClick={() => setOnboardingOpen(false)}
                  className="text-[#8891A8] hover:text-white text-lg font-bold leading-none cursor-pointer"
                >
                  &times;
                </button>
              </div>

              {/* Progress Steps Indicator */}
              <div className="bg-[#1C2030]/50 px-5 py-3 border-b border-[#202538] flex justify-between items-center text-[9px] font-mono font-bold tracking-wider">
                <div className="flex items-center gap-1.5">
                  <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[8px] ${
                    onboardingStep >= 1 ? "bg-[#00D9E8] text-[#13161E]" : "bg-[#202538] text-[#8891A8]"
                  }`}>1</span>
                  <span className={onboardingStep >= 1 ? "text-white" : "text-[#8891A8]"}>INGEST</span>
                </div>
                <div className="w-8 h-[1px] bg-[#202538]" />
                <div className="flex items-center gap-1.5">
                  <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[8px] ${
                    onboardingStep >= 2 ? "bg-[#00D9E8] text-[#13161E]" : "bg-[#202538] text-[#8891A8]"
                  }`}>2</span>
                  <span className={onboardingStep >= 2 ? "text-white" : "text-[#8891A8]"}>THRESHOLDS</span>
                </div>
                <div className="w-8 h-[1px] bg-[#202538]" />
                <div className="flex items-center gap-1.5">
                  <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[8px] ${
                    onboardingStep >= 3 ? "bg-[#00D9E8] text-[#13161E]" : "bg-[#202538] text-[#8891A8]"
                  }`}>3</span>
                  <span className={onboardingStep >= 3 ? "text-white" : "text-[#8891A8]"}>WORKFLOWS</span>
                </div>
              </div>

              {/* Step Content */}
              <div className="p-6 flex-1 flex flex-col gap-4">
                {onboardingStep === 1 && (
                  <div className="flex flex-col gap-3.5">
                    <div className="flex flex-col gap-1">
                      <h5 className="text-white text-xs font-bold uppercase tracking-wider font-mono">Step 1: Connect Candidate Telemetry Stream</h5>
                      <p className="text-[10.5px] text-[#8891A8] font-sans leading-relaxed">
                        Phaelitus SDK evaluates model behavior by streaming live production predictions. Select the deployment instance you wish to hook up to continuous PSI evaluation.
                      </p>
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-[9px] font-mono font-bold uppercase text-white tracking-wider">Candidate Model ID</label>
                      <select
                        value={wizardModel}
                        onChange={(e) => setWizardModel(e.target.value)}
                        className="bg-[#0D0F14] border border-[#202538] text-xs font-mono text-white rounded px-3 py-2 outline-none focus:border-[#00D9E8] cursor-pointer"
                      >
                        <option value="google-gemini-pro-1.5">Google Gemini Pro 1.5 (LLM)</option>
                        <option value="credit-scoring-xgboost">Risk Assessment XGBoost (Tabular)</option>
                        <option value="llama-3-70b-instruct">Meta LLaMA-3-70B (LLM)</option>
                        <option value="watsonx-credit-v2">watsonx Credit Predictor (Classification)</option>
                      </select>
                    </div>

                    <div className="p-3 bg-[#0D0F14] border border-[#202538] rounded flex flex-col gap-1 text-[9px] font-mono text-[#8891A8]">
                      <span className="text-[#00D9E8] font-bold">KAFKA PIPELINE DISCOVERY AUTOMATED:</span>
                      <span>Ingestion Partition: <span className="text-white">partition-west-01</span></span>
                      <span>Schema Matcher: <span className="text-white">v3_AVRO_DECISIONS_PROCESSED</span></span>
                    </div>
                  </div>
                )}

                {onboardingStep === 2 && (
                  <div className="flex flex-col gap-3.5">
                    <div className="flex flex-col gap-1">
                      <h5 className="text-white text-xs font-bold uppercase tracking-wider font-mono">Step 2: Set Guardrail Drift Thresholds</h5>
                      <p className="text-[10.5px] text-[#8891A8] font-sans leading-relaxed">
                        Specify the mathematical Population Stability Index (PSI) alert bound. When drift exceeds this threshold, the autonomous engine triggers mitigation loops.
                      </p>
                    </div>

                    <div className="flex flex-col gap-2 p-3 bg-[#0D0F14] border border-[#202538] rounded">
                      <div className="flex justify-between items-center text-[10px] font-mono">
                        <span className="text-white">POPULATION STABILITY INDEX (PSI)</span>
                        <span className="text-[#00D9E8] font-bold">{wizardThreshold.toFixed(2)}</span>
                      </div>
                      <input
                        type="range"
                        min="0.05"
                        max="0.50"
                        step="0.05"
                        value={wizardThreshold}
                        onChange={(e) => setWizardThreshold(parseFloat(e.target.value))}
                        className="w-full accent-[#00D9E8] cursor-pointer"
                      />
                      <div className="flex justify-between text-[8px] font-mono text-[#3D4460]">
                        <span>0.05 (Aggressive Alerts)</span>
                        <span>0.20 (Recommended)</span>
                        <span>0.50 (Loose Alerts)</span>
                      </div>
                    </div>

                    <p className="text-[8.5px] font-mono text-[#8891A8] leading-tight">
                      *Note: Standard statistical significance dictates that PSI &gt; 0.20 represents a major change in population distribution, requiring candidate retraining.
                    </p>
                  </div>
                )}

                {onboardingStep === 3 && (
                  <div className="flex flex-col gap-3.5">
                    <div className="flex flex-col gap-1">
                      <h5 className="text-white text-xs font-bold uppercase tracking-wider font-mono">Step 3: Specify Slack Alert Workflows</h5>
                      <p className="text-[10.5px] text-[#8891A8] font-sans leading-relaxed">
                        Keep product teams and operators informed. Connect the telemetry event stream to post high-fidelity drift reports directly to Slack.
                      </p>
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-[9px] font-mono font-bold uppercase text-white tracking-wider">Slack Target Channel</label>
                      <input
                        type="text"
                        value={wizardSlack}
                        onChange={(e) => setWizardSlack(e.target.value)}
                        className="bg-[#0D0F14] border border-[#202538] text-xs font-mono text-white rounded px-3 py-2 outline-none focus:border-[#00D9E8]"
                        placeholder="#alerts-phaelitus"
                      />
                    </div>

                    <div className="p-3 bg-[#0D0F14] border border-[#202538] rounded flex items-center gap-2.5">
                      <div className="w-2 h-2 rounded-full bg-[#00C48C] animate-pulse" />
                      <span className="text-[9px] font-mono text-[#8891A8] leading-tight">
                        Automated Canary Mitigator enabled. Retraining loops trigger on failure.
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Footer Actions */}
              <div className="bg-[#0D0F14] px-5 py-4 border-t border-[#202538] flex justify-between items-center">
                <button
                  disabled={onboardingStep === 1}
                  onClick={() => setOnboardingStep((s) => s - 1)}
                  className={`px-3 py-1.5 text-[10px] font-mono uppercase font-bold rounded border transition-colors ${
                    onboardingStep === 1
                      ? "border-transparent text-[#3D4460] cursor-not-allowed"
                      : "border-[#202538] text-white hover:bg-white/5 cursor-pointer"
                  }`}
                >
                  Back
                </button>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setOnboardingOpen(false)}
                    className="px-3 py-1.5 text-[10px] font-mono uppercase text-[#8891A8] hover:text-white cursor-pointer"
                  >
                    Skip Tour
                  </button>

                  {onboardingStep < 3 ? (
                    <button
                      onClick={() => setOnboardingStep((s) => s + 1)}
                      className="px-4 py-1.5 bg-[#7B61FF] hover:bg-[#7B61FF]/90 text-white font-sans text-[10.5px] font-bold rounded cursor-pointer flex items-center gap-1"
                    >
                      <span>Continue</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        // Complete onboarding
                        setPolicies({
                          psiThreshold: wizardThreshold,
                          canaryLatency: 50,
                          autoMitigate: true,
                        });
                        setOnboardingOpen(false);
                        setShowOnboarding(false);
                        setView("config"); // Take them directly to the configured Drift Monitor tab!
                      }}
                      className="px-4 py-1.5 bg-[#00D9E8] hover:bg-[#00D9E8]/90 text-[#13161E] font-sans text-[10.5px] font-bold rounded cursor-pointer transition-all uppercase tracking-wide"
                    >
                      Bootstrap Monitor
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
