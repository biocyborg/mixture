export interface resultType {
  status: number;
  header?: Record<string, string>;
  responder?: null | any;
}

export interface fetchConfig {
  signal: AbortSignal;
  method: string;
  headers?: Record<string, string>;
  body?: string;
}

export interface mixtureOptionsProps {
  method: string;
  timeout?: number;
  headers?: Record<string, string>;
  body?: Record<string, string>;
  site?: Record<string, string>;
  parameter?: Record<string, string>;
  before?: Record<string, () => void>;
  after?: (successful: resultType, failure: null | string) => void;
  retry?: number;
  woo?: { domain: string; consumerKey: string; consumerSecret: string };
}