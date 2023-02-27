interface resultType {
  status: number;
  header?: Record<string, string>;
  responder?: null | any;
}
interface fetchConfig {
  signal: AbortSignal;
  method: string;
  headers?: Record<string, string>;
  body?: string;
}
interface mixtureOptionsProps {
  domain?: string;
  method?: string;
  timeout?: number;
  headers?: Record<string, string>;
  body?: Record<string, string>;
  variable?: Record<string, string>;
  parameter?: Record<string, string>;
  before?: Record<string, (request_url: string, config: any) => void>;
  after?: Record<
    string,
    (successful: resultType, failure: null | string) => void
  >;
  retry?: number;
  shortenedCatalogue?: Boolean;
  replacementProtocol?: Boolean;
  woo?: {
    consumerKey: string;
    consumerSecret: string;
  };
}
/**
 *
 * @param url 接口地址
 * @param {
 *  domain = "", // 域名 string
 *  method = "get", // 请求方式 string
 *  timeout = 60000, // 超时时间 number
 *  headers = undefined, // 请求头 Record<string, string>;
 *  body = undefined, // 请求体 Record<string, string>;
 *  variable = {}, // url变量参数 Record<string, string>;
 *  parameter = undefined, // url拼接参数 Record<string, string>;
 *  before = undefined, // 请求前回调 Record<string, (request_url: string, config: any) => void>;
 *  after = undefined, // 请求后回调 Record<string, (successful: {status: number; header?: Record<string, string>; responder?: null | any; }, failure: null | string) => void>;
 *  retry = 1, // 重试次数 number
 *  shortenedCatalogue = false, // 请求失败后是否缩短url目录后重试 Boolean
 *  replacementProtocol = false, // 请求失败后是否替换协议后重试 Boolean
 *  woo = undefined, // 是否执行woo请求 { consumerKey: string; consumerSecret: string }
 *}
 * @returns Promise<{status: number; header?: Record<string, string>; responder?: null | any; }>
 */
declare function mixture(
  url: string,
  {
    domain, // 域名
    method, // 请求方式
    timeout, // 超时时间
    headers, // 请求头
    body, // 请求体
    variable, // url变量参数
    parameter, // url拼接参数
    before, // 请求前回调
    after, // 请求后回调
    retry, // 重试次数
    shortenedCatalogue, // 请求失败后是否缩短url目录后重试
    replacementProtocol, // 请求失败后是否替换协议后重试
    woo,
  }?: mixtureOptionsProps
): Promise<resultType | undefined>;

export { mixture as default, fetchConfig, mixtureOptionsProps, resultType };
