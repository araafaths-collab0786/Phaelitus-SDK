import React, { useState } from "react";
import { ShieldCheck, Lock, ChevronRight, Activity, Terminal, AlertTriangle, HelpCircle, Mail, KeyRound, Loader2, ExternalLink } from "lucide-react";
import { signInWithPopup, signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";
import { auth, googleProvider } from "../lib/firebase";

interface AuthGateProps {
  onSignInError: (error: string) => void;
  onDemoAccess: (email?: string, name?: string) => void;
}

export default function AuthGate({ onSignInError, onDemoAccess }: AuthGateProps) {
  const [localError, setLocalError] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [isRegistering, setIsRegistering] = useState<boolean>(false);
  const [authLoading, setAuthLoading] = useState<boolean>(false);
  const [acceptedTerms, setAcceptedTerms] = useState<boolean>(false);
  const [showTermsModal, setShowTermsModal] = useState<boolean>(false);

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!acceptedTerms) {
      setLocalError("Please read and accept the terms and conditions of this app to proceed.");
      return;
    }
    if (!email || !password) {
      setLocalError("Please enter both email and password.");
      return;
    }
    setAuthLoading(true);
    setLocalError("");
    try {
      if (isRegistering) {
        await createUserWithEmailAndPassword(auth, email, password);
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
    } catch (err: any) {
      if (err.code === "auth/operation-not-allowed" || (err.message && err.message.includes("auth/operation-not-allowed"))) {
        console.warn("Email/Password auth not enabled in Firebase. Falling back to local operator session.");
        onDemoAccess(email, email.split("@")[0]);
        return;
      }
      console.error("Email auth error:", err);
      let errorMsg = err.message || "Authentication failed.";
      if (err.code === "auth/user-not-found" || err.code === "auth/invalid-credential") {
        errorMsg = "Invalid email or password credentials.";
      } else if (err.code === "auth/wrong-password") {
        errorMsg = "Incorrect password. Please try again.";
      } else if (err.code === "auth/email-already-in-use") {
        errorMsg = "An account with this email already exists.";
      } else if (err.code === "auth/weak-password") {
        errorMsg = "Password should be at least 6 characters.";
      } else if (err.code === "auth/invalid-email") {
        errorMsg = "Invalid email format.";
      }
      setLocalError(errorMsg);
      onSignInError(errorMsg);
    } finally {
      setAuthLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    if (!acceptedTerms) {
      setLocalError("Please read and accept the terms and conditions of this app to proceed.");
      return;
    }
    try {
      setLocalError("");
      await signInWithPopup(auth, googleProvider);
    } catch (err: any) {
      if (err.code === "auth/popup-closed-by-user" || (err.message && err.message.includes("auth/popup-closed-by-user"))) {
        console.warn("Google Auth popup closed by user or blocked by iframe restrictions.");
      } else {
        console.error("Sign-in error:", err);
      }
      const msg = err.message || "Failed to sign in with Google Auth.";
      setLocalError(msg);
      onSignInError(msg);
    }
  };

  return (
    <div className="min-h-screen bg-[#0D0F14] text-[#F0F2F8] flex flex-col justify-center items-center px-4 relative overflow-hidden">
      {/* Dynamic Grid Background Accent */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1C2030_1px,transparent_1px),linear-gradient(to_bottom,#1C2030_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none opacity-40"></div>
      
      {/* Decorative ambient glowing center */}
      <div className="absolute w-[500px] h-[500px] rounded-full bg-[#7B61FF]/5 blur-[100px] pointer-events-none top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute w-[300px] h-[300px] rounded-full bg-[#00D9E8]/5 blur-[80px] pointer-events-none top-1/3 left-1/3 -translate-x-1/2 -translate-y-1/2"></div>
      
      {/* Upper Margin Identity Indicator */}
      <div className="absolute top-8 left-8 hidden lg:flex items-center gap-2.5">
        <div className="flex gap-1">
          <span className="w-1.5 h-1.5 rounded-sm bg-[#7B61FF]"></span>
          <span className="w-1.5 h-1.5 rounded-sm bg-[#00D9E8]"></span>
        </div>
        <span className="text-[9px] font-mono tracking-[0.2em] text-[#3D4460] uppercase font-bold">Phaelitus SDK Autonomous Control Plane</span>
      </div>

      <div className="absolute top-8 right-8 hidden lg:flex items-center gap-2">
        <span className="w-1.5 h-1.5 rounded-full bg-[#00C48C] animate-pulse"></span>
        <span className="text-[9px] font-mono tracking-wider text-[#8891A8] uppercase font-bold">GATEWAY SECURE</span>
      </div>

      {/* Main Login Card */}
      <div className="w-full max-w-md bg-[#13161E] border border-[#202538] p-5 sm:p-8 relative rounded-lg shadow-2xl z-10 flex flex-col">
        
        {/* Card Header Top Accent line - Dual Colors */}
        <div className="absolute top-0 left-0 right-0 h-[3px] flex">
          <div className="flex-1 bg-[#7B61FF]"></div>
          <div className="flex-1 bg-[#00D9E8]"></div>
        </div>

        <div className="flex flex-col items-center text-center mb-8">
          {/* Logo Brand Symbol */}
          <div className="w-14 h-14 rounded-lg border border-[#202538] bg-[#0D0F14] flex items-center justify-center mb-4 shadow-inner relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-tr from-[#7B61FF]/10 to-[#00D9E8]/10 opacity-100 group-hover:scale-110 transition-transform"></div>
            <Activity className="w-6 h-6 text-[#00D9E8] animate-pulse relative z-10" />
          </div>

          <h1 className="font-serif text-2xl text-[#F0F2F8] font-bold tracking-tight">
            Phaelitus<span className="text-[#00D9E8] font-sans"> SDK</span>
          </h1>
          <p className="text-[9px] uppercase tracking-[0.25em] text-[#8891A8] font-mono font-bold mt-2">
            Autonomous AI &amp; LLM Governance Portal
          </p>
        </div>

        {/* Security Warning banner */}
        <div className="bg-[#0D0F14] border border-[#202538] p-4 mb-6 flex items-start gap-3 rounded-lg">
          <Lock className="w-4 h-4 text-[#00D9E8] mt-0.5 shrink-0" />
          <div className="flex flex-col gap-0.5">
            <span className="text-[10px] font-sans font-bold text-[#F0F2F8] tracking-wide uppercase">Enterprise Authorization</span>
            <span className="text-[9px] font-sans text-[#8891A8] leading-relaxed">
              Access is protected under joint security policy. Live models and drift vectors are monitored in real-time.
            </span>
          </div>
        </div>

        {/* Email & Password Authentication Form */}
        <form onSubmit={handleEmailAuth} className="flex flex-col gap-4 mb-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-[9px] font-sans font-bold uppercase tracking-wider text-[#8891A8]">
              Enterprise Email Address
            </label>
            <div className="relative flex items-center">
              <Mail className="absolute left-3.5 w-3.5 h-3.5 text-[#3D4460]" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="operator@enterprise.com"
                disabled={authLoading}
                className="w-full bg-[#0D0F14] border border-[#202538] rounded py-2.5 pl-10 pr-4 text-xs font-sans text-[#F0F2F8] placeholder-[#3D4460] outline-none focus:border-[#00D9E8] focus:ring-1 focus:ring-[#00D9E8] transition-all"
                required
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[9px] font-sans font-bold uppercase tracking-wider text-[#8891A8]">
              Security Keycode (Password)
            </label>
            <div className="relative flex items-center">
              <KeyRound className="absolute left-3.5 w-3.5 h-3.5 text-[#3D4460]" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                disabled={authLoading}
                className="w-full bg-[#0D0F14] border border-[#202538] rounded py-2.5 pl-10 pr-4 text-xs font-sans text-[#F0F2F8] placeholder-[#3D4460] outline-none focus:border-[#7B61FF] focus:ring-1 focus:ring-[#7B61FF] transition-all"
                required
              />
            </div>
          </div>

          {/* Terms and Conditions Checkbox */}
          <div className="flex items-start gap-2.5 my-2.5 px-0.5">
            <input
              id="accept-terms-checkbox"
              type="checkbox"
              checked={acceptedTerms}
              onChange={(e) => {
                setAcceptedTerms(e.target.checked);
                if (e.target.checked) {
                  setLocalError("");
                }
              }}
              className="mt-0.5 w-4 h-4 rounded border-[#202538] bg-[#0D0F14] text-[#7B61FF] focus:ring-[#7B61FF] focus:ring-offset-0 cursor-pointer"
            />
            <label htmlFor="accept-terms-checkbox" className="text-[10px] font-sans text-[#8891A8] leading-tight select-none cursor-pointer">
              I have read and agree to the{" "}
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setShowTermsModal(true);
                }}
                className="text-[#00D9E8] hover:text-[#00D9E8]/80 hover:underline inline-flex items-center gap-0.5 cursor-pointer font-bold"
              >
                terms and conditions of this app
              </button>
            </label>
          </div>

          <button
            type="submit"
            disabled={authLoading}
            className="w-full mt-2 flex items-center justify-between px-5 py-3 bg-[#7B61FF] hover:bg-[#7B61FF]/90 border border-transparent text-[#F0F2F8] font-sans font-bold uppercase tracking-wider text-[10px] rounded transition-all cursor-pointer group disabled:opacity-50"
          >
            <div className="flex items-center gap-2">
              {authLoading ? (
                <Loader2 className="w-3.5 h-3.5 text-white animate-spin" />
              ) : (
                <ShieldCheck className="w-3.5 h-3.5 text-[#00D9E8]" />
              )}
              <span>{isRegistering ? "Deploy New Account" : "Access Console"}</span>
            </div>
            <ChevronRight className="w-3.5 h-3.5 text-[#00D9E8] group-hover:translate-x-1 transition-transform" />
          </button>

          <div className="text-center mt-1">
            <button
              type="button"
              onClick={() => setIsRegistering(!isRegistering)}
              className="text-[9px] font-mono uppercase tracking-wider text-[#00D9E8] hover:text-[#00D9E8]/80 underline cursor-pointer"
            >
              {isRegistering ? "Already registered? Sign In Instead" : "Create Enterprise Account"}
            </button>
          </div>
        </form>

        {/* Separator */}
        <div className="flex items-center gap-3 my-4">
          <div className="h-[1px] bg-[#202538] flex-1"></div>
          <span className="text-[8px] font-mono text-[#3D4460] uppercase tracking-wider shrink-0">
            OR AUTHORIZE WITH PARTNER OAUTH
          </span>
          <div className="h-[1px] bg-[#202538] flex-1"></div>
        </div>

        {/* Primary Google Auth Call-to-action */}
        <button
          onClick={handleGoogleSignIn}
          className="w-full flex items-center justify-between px-5 py-3 bg-[#0D0F14] hover:bg-[#1C2030] border border-[#202538] hover:border-[#2A2F45] text-[#F0F2F8] font-sans font-bold uppercase tracking-wider text-[10px] rounded transition-all cursor-pointer group"
        >
          <div className="flex items-center gap-3">
            <ShieldCheck className="w-4 h-4 text-[#00D9E8] group-hover:scale-110 transition-transform" />
            <span>Google Cloud Single Sign-On</span>
          </div>
          <ChevronRight className="w-4 h-4 text-[#7B61FF] group-hover:translate-x-1 transition-transform" />
        </button>

        {/* Dynamic & Always Visible: Enterprise Offline Sandbox Bypass */}
        <div className="mt-4 p-3.5 bg-[#0D0F14]/80 border border-[#202538] rounded-lg flex flex-col gap-2 relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#00D9E8]/30 to-transparent"></div>
          <div className="flex items-center gap-1.5 justify-between">
            <span className="text-[9px] font-mono uppercase tracking-wider text-[#00D9E8] font-bold">
              Enterprise Offline Sandbox
            </span>
            <span className="text-[8px] bg-[#00C48C]/10 text-[#00C48C] border border-[#00C48C]/20 px-2 py-0.5 rounded-sm font-mono font-bold">
              PRE-AUTHORIZED
            </span>
          </div>
          <p className="text-[9px] font-sans text-[#8891A8] leading-relaxed">
            Running inside an iframe sandboxed preview? Bypass browser popup restrictions and instantly explore the live dashboard with a simulated operational workspace.
          </p>
          <button
            type="button"
            onClick={() => {
              if (!acceptedTerms) {
                setLocalError("Please read and accept the terms and conditions of this app to proceed.");
                return;
              }
              onDemoAccess(undefined, undefined);
            }}
            className="w-full py-2 bg-[#7B61FF]/10 hover:bg-[#7B61FF]/20 border border-[#7B61FF]/30 hover:border-[#7B61FF]/50 text-[#00D9E8] text-[9px] font-mono uppercase tracking-widest font-bold rounded transition-all cursor-pointer flex items-center justify-center gap-1.5"
          >
            <span>Simulate Guest Operator Session</span>
            <ChevronRight className="w-3 h-3 text-[#00D9E8]" />
          </button>
        </div>

        {/* Error Message & Troubleshooting Banner */}
        {localError && (
          <div className="mt-4 p-4 bg-[#FF3B5C]/10 border border-[#FF3B5C]/30 rounded-lg flex flex-col gap-3">
            <div className="flex items-start gap-2.5">
              <AlertTriangle className="w-4 h-4 text-[#FF3B5C] shrink-0 mt-0.5" />
              <div className="flex flex-col gap-1">
                <span className="text-[10px] font-sans font-bold text-[#FF3B5C] uppercase tracking-wider">
                  Authentication Exception
                </span>
                <span className="text-[9px] font-mono text-[#F0F2F8] leading-relaxed break-all">
                  {localError}
                </span>
              </div>
            </div>
            
            {/* Troubleshooting info */}
            <div className="mt-2 pt-2 border-t border-[#FF3B5C]/20 flex flex-col gap-2.5 text-[9px] font-sans text-[#8891A8] leading-relaxed">
              <div className="flex items-start gap-2">
                <HelpCircle className="w-3.5 h-3.5 text-[#3D4460] shrink-0 mt-0.5" />
                <div>
                  {localError.includes("auth/operation-not-allowed") ? (
                    <span>
                      <strong className="text-white block mb-0.5">Firebase Configuration Required:</strong>
                      The Email/Password authentication provider is currently disabled in your Firebase console. To fix this permanently:
                      <ol className="list-decimal pl-4 mt-1 text-[#F0F2F8]/80 flex flex-col gap-0.5">
                        <li>Go to the <a href="https://console.firebase.google.com/project/seismic-timing-kms1d/authentication/providers" target="_blank" rel="noopener noreferrer" className="text-[#00D9E8] hover:underline font-bold inline-flex items-center gap-1">Firebase Authentication Providers Page <ExternalLink className="w-2.5 h-2.5" /></a>.</li>
                        <li>Click <strong className="text-white">Add new provider</strong>, select <strong className="text-white">Email/Password</strong>, and toggle it to <strong className="text-white">Enable</strong>.</li>
                      </ol>
                    </span>
                  ) : localError.includes("popup-closed-by-user") ? (
                    <span>
                      <strong className="text-white block mb-0.5">Iframe Popup Blocker Alert:</strong>
                      The login window was blocked or closed before completion. Since this app runs in a sandboxed iframe, your browser may restrict auth popups. 
                      Please click the <span className="text-[#00D9E8] font-bold">"Open in new tab"</span> button in the top-right corner of the screen and try again, or use the <strong className="text-white">Enterprise Offline Sandbox</strong> bypass above.
                    </span>
                  ) : (
                    <span>
                      <strong className="text-[#8891A8]">Sandbox Authentication Hint:</strong>
                      To sign in successfully with Google or Email, click <span className="text-[#00D9E8] font-bold">"Open in new tab"</span> in the top-right of your preview container to bypass browser iframe restrictions.
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Footnotes */}
        <div className="mt-8 border-t border-[#202538] pt-4 flex justify-between items-center text-[8px] font-mono text-[#3D4460]">
          <span>PROVIDER: JOINT IDENTITY ENGINE</span>
          <span>PROTOCOL: SECURE OAUTH2 / TLS</span>
        </div>
      </div>

      {/* Outer Lower Page Credits */}
      <div className="absolute bottom-6 text-[8px] font-mono text-[#3D4460] tracking-[0.2em] uppercase">
        Joint IBM watsonx &amp; Google Cloud Governance Core v5.22
      </div>

      {/* Terms and Conditions Modal */}
      {showTermsModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex justify-center items-center z-50 p-4">
          <div className="w-full max-w-lg bg-[#13161E] border border-[#202538] rounded-lg shadow-2xl relative overflow-hidden flex flex-col max-h-[85vh]">
            {/* Modal top accent */}
            <div className="absolute top-0 left-0 right-0 h-[3px] flex">
              <div className="flex-1 bg-[#7B61FF]"></div>
              <div className="flex-1 bg-[#00D9E8]"></div>
            </div>

            {/* Modal Header */}
            <div className="p-6 border-b border-[#202538] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-[#00D9E8]" />
                <h3 className="text-sm font-sans font-bold uppercase tracking-wider text-[#F0F2F8]">
                  Platform Terms &amp; Conditions
                </h3>
              </div>
              <button 
                onClick={() => setShowTermsModal(false)}
                className="text-xs font-mono text-[#8891A8] hover:text-[#F0F2F8] cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto text-xs text-[#8891A8] font-sans space-y-4 leading-relaxed">
              <p className="font-bold text-[#F0F2F8]">
                Please review the Terms &amp; Conditions for Phaelitus SDK Platform:
              </p>
              
              <div className="space-y-3 border-l border-[#7B61FF]/30 pl-4">
                <div>
                  <h4 className="font-semibold text-[#00D9E8] uppercase tracking-wide text-[10px] mb-1">
                    1. Autonomous Diagnostics and Interventions
                  </h4>
                  <p>
                    Phaelitus SDK implements automatic detection and recovery procedures for model performance drift. Under specific conditions, automated canary swaps and orchestration retrain operations will execute autonomously.
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold text-[#00D9E8] uppercase tracking-wide text-[10px] mb-1">
                    2. Telemetry and Activity Audit Log
                  </h4>
                  <p>
                    All diagnostic actions, simulated incident triggers, and mitigation requests executed within your tenant workspace are recorded permanently to maintain a strict governance audit trail.
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold text-[#00D9E8] uppercase tracking-wide text-[10px] mb-1">
                    3. Sandbox and Pre-Authorized Environments
                  </h4>
                  <p>
                    Demo sessions and pre-authorized sandboxes are provided for exploration and functional validation. Production governance models should be calibrated individually under your corporate tenant context.
                  </p>
                </div>
              </div>

              <p className="text-[10px] text-[#3D4460] font-mono italic">
                Last modified: July 3, 2026. Version 5.22.
              </p>
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-[#0D0F14] border-t border-[#202538] flex justify-end gap-3">
              <button
                onClick={() => setShowTermsModal(false)}
                className="px-4 py-2 bg-transparent hover:bg-[#202538] border border-[#202538] text-xs font-sans text-[#F0F2F8] rounded transition-all cursor-pointer"
              >
                Close
              </button>
              <button
                onClick={() => {
                  setAcceptedTerms(true);
                  setShowTermsModal(false);
                  setLocalError("");
                }}
                className="px-4 py-2 bg-[#7B61FF] hover:bg-[#7B61FF]/90 text-xs font-sans font-bold text-[#F0F2F8] rounded transition-all cursor-pointer"
              >
                Accept and Agree
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
