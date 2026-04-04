const BASE_URL = 'https://api.enrow.io';

export interface VerifyCatchAllParams {
  apiKey: string;
  email: string;
  custom?: string;
  webhook?: string;
}

export interface VerifyCatchAllBulkParams {
  apiKey: string;
  emails: string[];
  custom?: string;
  webhook?: string;
}

export interface VerificationResult {
  email?: string;
  qualification?: string;
  custom?: string;
  message?: string;
}

export interface BulkVerificationResult {
  batchId: string;
  total: number;
  status: string;
  creditsUsed?: number;
}

export interface BulkVerificationResults {
  batchId: string;
  status: string;
  total: number;
  completed?: number;
  creditsUsed?: number;
  results?: VerificationResult[];
}

async function request(apiKey: string, method: string, path: string, body?: unknown) {
  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers: { 'x-api-key': apiKey, 'Content-Type': 'application/json' },
    body: body ? JSON.stringify(body) : undefined,
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.message || `API error ${res.status}`);
  return data;
}

export async function verifyCatchAll(params: VerifyCatchAllParams): Promise<VerificationResult> {
  const body: Record<string, unknown> = { email: params.email };
  if (params.custom) body.custom = params.custom;
  if (params.webhook) {
    body.settings = { webhook: params.webhook };
  }
  return request(params.apiKey, 'POST', '/email/verify/single', body);
}

export async function getVerificationResult(apiKey: string, id: string): Promise<VerificationResult> {
  return request(apiKey, 'GET', `/email/verify/single?id=${id}`);
}

export async function verifyCatchAllBulk(params: VerifyCatchAllBulkParams): Promise<BulkVerificationResult> {
  const body: Record<string, unknown> = {
    emails: params.emails,
  };
  if (params.custom) body.custom = params.custom;
  if (params.webhook) {
    body.settings = { webhook: params.webhook };
  }
  return request(params.apiKey, 'POST', '/email/verify/bulk', body);
}

export async function getVerificationResults(apiKey: string, id: string): Promise<BulkVerificationResults> {
  return request(apiKey, 'GET', `/email/verify/bulk?id=${id}`);
}
