import CryptoJS from "crypto-js";
import OAuth from "oauth-1.0a";

import { mixtureOptionsProps, resultType, fetchConfig } from "./interface";
import { domain_regular } from "./utils";

/**
 *
 * @param url
 * @param options
 * @returns
 */
async function mixture(url: string, options: mixtureOptionsProps) {
  const {
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
    woo, // 是否执行woo请求
  } = options;

  // 最终返回数据格式
  let result: resultType = {
    status: 700,
    header: {},
    responder: null,
  };

  // 域名
  let new_domain = domain;
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
  const NEW_VARIABLE = variable || {};
  // url 参数
  const NEW_PARAMETER = parameter;
  // 请求前回调
  const NEW_BEFORE_FUNC_OBJ = before;
  // 请求后回调
  const NEW_AFTER_FUNC_OBJ = after;
  // 重试次数
  let new_retry = retry || 1;
  // woo 请求参数
  const NEW_WOO = woo || { consumerKey: "", consumerSecret: "" };

  // 请求是否成功
  let request_status = false;

  // 是否缩短过目录
  let is_shortened_catalogue = false;
  // 是否已经替换协议
  let is_replacement_protocol = false;

  // 最终请求url
  let request_url = "";
  // 备份最终请求url
  let backups_request_url = "";
  // url
  let static_request_url = "";

  // 没有url报错
  if (!new_url) {
    throw new Error("url is required");
  }

  // 没有请求方式报错
  if (!NEW_METHOD) {
    throw new Error("method is required");
  }

  // 发送woo请求时 没有域名 key 或 secret 报错
  if (woo && Object.keys(woo).length) {
    if (!domain) {
      throw new Error("domain is required");
    }

    if (!NEW_WOO.consumerKey) {
      throw new Error("consumerKey is required");
    }

    if (!NEW_WOO.consumerSecret) {
      throw new Error("consumerSecret is required");
    }
  }

  // 处理请求地址
  if (new_domain) {
    if (new_domain?.slice(new_domain?.length - 1) === "/") {
      new_domain = new_domain?.substring(new_domain?.length - 1, 0);
    }
    if (domain_regular.test(new_url)) {
      request_url = new_url;
    } else {
      if (new_url.charAt(0) !== "/") {
        new_url = `/${new_url}`;
      }
      request_url = `${new_domain}${new_url}`;
    }
  } else {
    request_url = new_url;
  }

  // 如果url变量 有数据就将数据拼接到url中
  if (NEW_VARIABLE && Object.keys(NEW_VARIABLE).length) {
    for (const item in NEW_VARIABLE) {
      if (Object.hasOwnProperty.call(NEW_VARIABLE, item)) {
        request_url = request_url.replace(`{${item}}`, NEW_VARIABLE[item]);
      }
    }
  }

  // 将url参数添加到url中
  if (NEW_PARAMETER && Object.keys(NEW_PARAMETER).length) {
    for (const item in NEW_PARAMETER) {
      if (Object.hasOwnProperty.call(NEW_PARAMETER, item)) {
        if (request_url.includes("?")) {
          request_url += `&${item}=${NEW_PARAMETER[item]}`;
        } else {
          const INDEX = Object.keys(NEW_PARAMETER).indexOf(item);
          if (!INDEX) {
            request_url += `?${item}=${NEW_PARAMETER[item]}`;
          } else {
            request_url += `&${item}=${NEW_PARAMETER[item]}`;
          }
        }
      }
    }
  }

  // 请求体不是FormData 时添加Content-Type 为 json
  if (!(NEW_BODY instanceof FormData)) {
    new_headers = {
      "Content-Type": "application/json;charset=utf-8",
      ...new_headers,
    };
  }

  backups_request_url = request_url;
  static_request_url = request_url;

  async function request() {
    // 判断是否是https
    const IS_HTTPS = /^https/i.test(request_url);
    // 是否发送woo请求
    if (woo && Object.keys(woo).length) {
      // 不是https请求 执行加密程序
      if (!IS_HTTPS) {
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

        const ENCRYPTION_URL: Record<string, string> = new OAuth(
          data
        ).authorize({
          url: request_url,
          method: NEW_METHOD,
        }) as any;

        if (ENCRYPTION_URL && Object.keys(ENCRYPTION_URL).length) {
          for (const item in ENCRYPTION_URL) {
            if (Object.hasOwnProperty.call(ENCRYPTION_URL, item)) {
              if (request_url.includes("?")) {
                request_url += `&${item}=${ENCRYPTION_URL[item]}`;
              } else {
                const INDEX = Object.keys(ENCRYPTION_URL).indexOf(item);
                if (!INDEX) {
                  request_url += `?${item}=${ENCRYPTION_URL[item]}`;
                } else {
                  request_url += `&${item}=${ENCRYPTION_URL[item]}`;
                }
              }
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

    // 执行请求前回调
    for (const item in NEW_BEFORE_FUNC_OBJ) {
      if (Object.hasOwnProperty.call(NEW_BEFORE_FUNC_OBJ, item)) {
        const element = NEW_BEFORE_FUNC_OBJ[item];
        // eslint-disable-next-line no-await-in-loop
        await element(request_url, config);
      }
    }

    let successful: resultType = result;
    let failure: null | string = null;
    return (
      fetch(request_url, config)
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
          for (const item in NEW_AFTER_FUNC_OBJ) {
            if (Object.hasOwnProperty.call(NEW_AFTER_FUNC_OBJ, item)) {
              const element = NEW_AFTER_FUNC_OBJ[item];
              // eslint-disable-next-line no-await-in-loop
              await element(successful, failure);
            }
          }

          // 缩短目录
          if (shortenedCatalogue && !is_shortened_catalogue) {
            // 拆分参数
            const cutting_parameter =
              backups_request_url?.split(/(?=\/wp-json)/g);

            // 拆分目录
            const cutting_catalogue = cutting_parameter[0]?.split("/");

            if (cutting_catalogue.length > 3) {
              // 删除目录数组最后一个元素
              cutting_catalogue.pop();

              // 拼合目录
              const joint_atalogue = cutting_catalogue.join("/");

              // 替换 "拆分参数" 数组第一个元素
              cutting_parameter.splice(0, 1, joint_atalogue);

              backups_request_url = cutting_parameter.join("");
              request_url = backups_request_url;
              await request();
              return;
            } else {
              is_shortened_catalogue = true;
              request_url = static_request_url;
            }
          }

          // 替换协议
          if (replacementProtocol && !is_replacement_protocol) {
            is_replacement_protocol = true;
            if (IS_HTTPS) {
              request_url = backups_request_url?.replace("https://", "http://");
            } else {
              request_url = backups_request_url?.replace("https://", "http://");
            }
            await request();
            return;
          }

          if (is_replacement_protocol) {
            request_url = static_request_url;
          }

          if (!request_status && new_retry) {
            // 重试
            for (let index = 0; index < new_retry; index += 1) {
              new_retry -= 1;

              backups_request_url = static_request_url;

              // 是否缩短过目录
              is_shortened_catalogue = false;
              // 是否已经替换协议
              is_replacement_protocol = false;

              // eslint-disable-next-line no-await-in-loop
              await request();
              return;
            }
          }
        })
    );
  }

  return request();
}

export default mixture;
