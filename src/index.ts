import CryptoJS from "crypto-js";
import OAuth from "oauth-1.0a";

import { mixtureOptionsProps, resultType, fetchConfig } from "./interface";

/**
 *
 * @param url
 * @param options
 * @returns
 */
async function mixture(url: string, options: mixtureOptionsProps) {
  const {
    method,
    timeout,
    headers,
    body,
    site,
    parameter,
    before,
    after,
    retry,
    woo,
  } = options;
  let result: resultType = {
    status: 700,
    header: {},
    responder: null,
  };

  // 请求url
  let new_url = url;
  // 请求方式
  const NEW_METHOD = method;
  // 超时时间
  const NEW_TIMEOUT = timeout || 60000;
  // 请求头
  let new_headers = headers;
  // 请求体
  const NEW_BODY = body;
  // url变量
  const NEW_SITE = site || {};
  // 请求前回调
  const NEW_BEFORE_FUNC_OBJ = before;
  // 请求后回调
  const NEW_AFTER_FUNC = after;
  // 重试次数
  let new_retry = retry || 1;
  // woo 请求参数
  const NEW_WOO = woo || { domain: "", consumerKey: "", consumerSecret: "" };
  // woo域名
  let new_domain = NEW_WOO.domain;
  // url 参数
  const NEW_PARAMETER = parameter;
  // 请求是否成功
  let request_status = false;

  if (woo && Object.keys(woo).length) {
    if (!NEW_WOO.domain) {
      throw new Error("domain is required");
    }

    if (!NEW_WOO.consumerKey) {
      throw new Error("consumerKey is required");
    }

    if (!NEW_WOO.consumerSecret) {
      throw new Error("consumerSecret is required");
    }
  }

  if (!new_url) {
    throw new Error("url is required");
  }

  if (!NEW_METHOD) {
    throw new Error("method is required");
  }

  // 是否发送woo请求
  if (woo && Object.keys(woo).length) {
    // 判断是否是https
    const IS_HTTPS = /^https/i.test(NEW_WOO.domain);

    if (NEW_WOO.domain?.slice(NEW_WOO.domain?.length - 1) === "/") {
      new_domain = NEW_WOO.domain?.substring(NEW_WOO.domain?.length - 1, 0);
    }

    if (IS_HTTPS) {
      // 是https请求直接拼合url
      new_url = `${new_domain}${new_url}?consumer_key=${NEW_WOO.consumerKey}&consumer_secret=${NEW_WOO.consumerSecret}`;
    } else {
      // 不是https请求 执行加密程序
      const data = {
        consumer: {
          key: NEW_WOO.consumerKey,
          secret: NEW_WOO.consumerSecret,
        },
        signature_method: "HMAC-SHA256",
        hash_function: (
          base: string | CryptoJS.lib.WordArray,
          key: string | CryptoJS.lib.WordArray
        ) => {
          const sha256 = CryptoJS.algo.HMAC.create(CryptoJS.algo.SHA256, key);
          const res = CryptoJS.enc.Base64.stringify(
            sha256.update(base).finalize()
          );
          return res;
        },
      };

      const ENCRYPTION_URL: Record<string, string> = new OAuth(data).authorize({
        url: `${new_domain}${new_url}`,
        method: NEW_METHOD,
      }) as any;

      if (ENCRYPTION_URL && Object.keys(ENCRYPTION_URL).length) {
        for (const item in ENCRYPTION_URL) {
          if (Object.hasOwnProperty.call(ENCRYPTION_URL, item)) {
            const INDEX = Object.keys(ENCRYPTION_URL).indexOf(item);
            if (!INDEX) {
              new_url += `?${item}=${ENCRYPTION_URL[item]}`;
            } else {
              new_url += `&${item}=${ENCRYPTION_URL[item]}`;
            }
          }
        }
      }
    }

    new_url = `${new_domain}${new_url}`;
  }

  // 执行请求前回调
  for (const item in NEW_BEFORE_FUNC_OBJ) {
    if (Object.hasOwnProperty.call(NEW_BEFORE_FUNC_OBJ, item)) {
      const element = NEW_BEFORE_FUNC_OBJ[item];
      // eslint-disable-next-line no-await-in-loop
      await element();
    }
  }

  // 请求体不是FormData 时添加Content-Type 为 json
  if (!(NEW_BODY instanceof FormData)) {
    new_headers = {
      "Content-Type": "application/json;charset=utf-8",
      ...new_headers,
    };
  }

  // 如果url变量 有数据就将数据拼接到url中
  if (NEW_SITE && Object.keys(NEW_SITE).length) {
    for (const item in NEW_SITE) {
      if (Object.hasOwnProperty.call(NEW_SITE, item)) {
        new_url = new_url.replace(`{${item}}`, NEW_SITE[item]);
      }
    }
  }

  // 将url参数添加到url中
  if (NEW_PARAMETER && Object.keys(NEW_PARAMETER).length) {
    for (const item in NEW_PARAMETER) {
      if (Object.hasOwnProperty.call(NEW_PARAMETER, item)) {
        if (new_url.includes("?")) {
          new_url += `&${item}=${NEW_PARAMETER[item]}`;
        } else {
          const INDEX = Object.keys(NEW_PARAMETER).indexOf(item);
          if (!INDEX) {
            new_url += `?${item}=${NEW_PARAMETER[item]}`;
          } else {
            new_url += `&${item}=${NEW_PARAMETER[item]}`;
          }
        }
      }
    }
  }

  const controller = new AbortController();
  const { signal } = controller;

  const timer = setTimeout(() => {
    controller.abort();
    clearTimeout(timer);
  }, NEW_TIMEOUT);

  let config: fetchConfig = {
    signal,
    method: NEW_METHOD,
    headers: new_headers,
  };

  if (!["get", "head"].includes(NEW_METHOD)) {
    config = {
      ...config,
      body: JSON.stringify(NEW_BODY),
    };
  }

  async function request() {
    let successful: resultType = result;
    let failure: null | string = null;
    return (
      fetch(new_url, config)
        .then(async (response) => {
          const HEADER_OBJ: Record<string, string> = {};
          response?.headers?.forEach((v, k) => {
            HEADER_OBJ[k] = v;
          });
          let responder = null;
          const CONTENT_TYPE = HEADER_OBJ["content-type"].split(";");
          if (
            CONTENT_TYPE.includes("text/html") ||
            CONTENT_TYPE.includes("application/javascript") ||
            CONTENT_TYPE.includes("text/javascript")
          ) {
            responder = await response.text();
          } else {
            responder = await response?.json();
          }
          result = {
            ...result,
            status: response.status,
            header: HEADER_OBJ,
            responder,
          };

          if (response.status <= 200 && response.status < 300) {
            // 请求成功
            request_status = true;
          }

          successful = result;

          return result;
        })
        // eslint-disable-next-line consistent-return
        .catch(async (error) => {
          failure = error;

          if (!retry) {
            result = {
              ...result,
              status: 600,
              responder: `browser error: ${error}`,
            };

            return result;
          }
        })
        .finally(async () => {
          clearTimeout(timer);
          // 执行请求后回调
          if (NEW_AFTER_FUNC) await NEW_AFTER_FUNC(successful, failure);

          if (!request_status && new_retry) {
            for (let index = 0; index < new_retry; index += 1) {
              new_retry -= 1;

              // eslint-disable-next-line no-await-in-loop
              await request();
            }
          }
        })
    );
  }

  return request();
}

export default mixture;
