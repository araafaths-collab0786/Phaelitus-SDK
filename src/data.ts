import { Incident } from "./types";

export const DEFAULT_INCIDENTS: Incident[] = [
  {
    id: "inc-1",
    severity: "resolved",
    statusText: "PROTOCOL_READY",
    timestamp: "14:15:33",
    title: "watsonx.ai Provider Handshake",
    subtext: "SSL_V1.3",
    description: "Provider identity verified on IBM-RHOCP-01. Inference pool alpha session keys rotated.",
    model: "watsonx-gateway",
    metric: "handshake",
    score: 0.0,
    logs: "2026-06-26 14:15:30 [INFO] Initiating TLS handshake with watsonx.ai provider...\n2026-06-26 14:15:31 [INFO] Client certificate presented, verified signature.\n2026-06-26 14:15:32 [INFO] Session key exchange successful. Protocol SSL v1.3 established.\n2026-06-26 14:15:33 [INFO] Provider handshake COMPLETE. Inference pool session rotated."
  },
  {
    id: "inc-2",
    severity: "critical",
    statusText: "DRIFT_HIGH",
    timestamp: "14:02:11",
    title: "aether-prod-drift",
    subtext: "FEAT_0x42",
    description: "Feature 'user_intent_embedding' KL-divergence > 0.85 detected in Cluster_04.",
    model: "aether-prod",
    metric: "KL-Divergence",
    score: 0.88,
    feature: "user_intent_embedding",
    logs: "2026-06-26 14:00:05 [WARN] Feature user_intent_embedding statistical window discrepancy observed.\n2026-06-26 14:01:10 [WARN] KL-Divergence exceeds threshold (0.50): current value = 0.88\n2026-06-26 14:02:00 [ERROR] Automated alert triggered for aether-prod. Population drift is HIGH.\n2026-06-26 14:02:11 [CRITICAL] drift.alerts: event emitted to Kafka topic. Operator state transitioned to DriftDetected."
  },
  {
    id: "inc-3",
    severity: "resolved",
    statusText: "EXPLAIN_SYNC",
    timestamp: "13:58:20",
    title: "SHAP Explainer Generated",
    subtext: "KERNEL_SHAP",
    description: "Attribution map ready for request_ID: 7e91. Feature 'price_history' weight: 0.64.",
    model: "price-predictor",
    metric: "SHAP Attribution",
    score: 0.12,
    logs: "2026-06-26 13:58:10 [INFO] Request for local explainability received for ID 7e91.\n2026-06-26 13:58:15 [INFO] Running background KernelSHAP process with 500 samples...\n2026-06-26 13:58:20 [INFO] SHAP Explainer run finished. Output attribution map synchronized with audit log database."
  },
  {
    id: "inc-4",
    severity: "warning",
    statusText: "RETRAINING",
    timestamp: "13:45:02",
    title: "latency-spike-p99",
    subtext: "GPU_UTIL:92%",
    description: "Inference latency exceeding 450ms. Triggering autoscaling nodes in EU-WEST-1.",
    model: "churn-predictor-v2",
    metric: "P99 Latency",
    score: 472,
    logs: "2026-06-26 13:44:30 [WARN] P99 Latency rising: 310ms\n2026-06-26 13:44:45 [WARN] P99 Latency exceeds warning threshold (400ms): 455ms\n2026-06-26 13:45:00 [INFO] GPU Utilization on active serving node at 92%\n2026-06-26 13:45:02 [INFO] Triggering horizontal pod autoscaler to spin up additional replica in EU-WEST-1."
  },
  {
    id: "inc-5",
    severity: "resolved",
    statusText: "TRUST_VERIFIED",
    timestamp: "13:30:11",
    title: "AIF360 Fairness Scan: PASS",
    subtext: "METRIC:SPD",
    description: "Statistical Parity Difference within threshold (0.02) for all protected attributes.",
    model: "credit-scoring-model",
    metric: "Fairness Index",
    score: 0.012,
    logs: "2026-06-26 13:29:00 [INFO] Daily fairness compliance scheduled check started.\n2026-06-26 13:29:45 [INFO] Calculating Demographic Parity and Equalized Odds across gender, age, and race arrays...\n2026-06-26 13:30:11 [INFO] Fairness Scan COMPLETE. Statistical Parity Difference (0.012) is well within compliance bound (0.05)."
  },
  {
    id: "inc-6",
    severity: "critical",
    statusText: "DRIFT_HIGH",
    timestamp: "13:12:44",
    title: "schema-mismatch-v2",
    subtext: "PIPE_09",
    description: "Upstream data pipeline modified type for 'tx_id'. Validation layer rejecting batches.",
    model: "fraud-detector-v3",
    metric: "Schema Integrity",
    score: 1.0,
    logs: "2026-06-26 13:11:00 [INFO] Parsing batch transaction ingest...\n2026-06-26 13:12:00 [ERROR] Field 'tx_id' expected type String, received Float.\n2026-06-26 13:12:30 [WARN] Feature engineering pipeline threw ValidationException for batch size 10000.\n2026-06-26 13:12:44 [CRITICAL] Validation layer rejects transaction batch. Reject pipeline alarm triggered."
  }
];

export const DEFAULT_POLICIES = {
  psiThreshold: 0.20,
  canaryLatency: 50,
  autoMitigate: true
};
