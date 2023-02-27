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
  domain?: string; // 域名
  method?: string; // 请求方式
  timeout?: number; // 超时时间
  headers?: Record<string, string>; // 请求头
  body?: Record<string, string>; // 请求体
  variable?: Record<string, string>; //
  parameter?: Record<string, string>; //
  before?: Record<string, (request_url: string, config: any) => void>; // 请求前回调
  after?: Record<
    string,
    (successful: resultType, failure: null | string) => void
  >; // 请求后回调
  retry?: number; // 重试次数
  shortenedCatalogue?: Boolean; // 缩短目录
  replacementProtocol?: Boolean; // 替换协议
  woo?: { consumerKey: string; consumerSecret: string }; // woo请求 域名 key secret
}
