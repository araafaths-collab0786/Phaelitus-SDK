export interface Incident {
  id: string;
  severity: "critical" | "warning" | "resolved";
  statusText: string;
  timestamp: string;
  title: string;
  subtext: string;
  description: string;
  model: string;
  metric: string;
  score: number;
  feature?: string;
  logs: string;
}

export interface ModelMetadata {
  name: string;
  version: string;
  status: "active" | "retraining" | "drift_detected" | "pending";
  trafficSplit: number; // percentage, e.g. 90%
  lastUpdated: string;
  signature: string; // cosign ecdsa
  shaHash: string;
  sbomUrl: string;
  accuracy: number;
  driftTrend: { name: string; score: number }[];
  provider?: "IBM watsonx.ai" | "Meta AI" | "Google Vertex AI";
  framework?: "PyTorch" | "watsonx.governance" | "Vertex AI / JAX" | "Scikit-Learn";
}
