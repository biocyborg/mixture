/**
 * // 域名
 */
const domain_regular =
  /^(http(s)?:\/\/)+([åäöÅÄÖàâèéêëîïôœùûüÿçÀÂÈÉÊËÎÏÔŒÙÛÜŸÇáßíóŠšŽžA-Za-z0-9\-]+\.)*([åäöÅÄÖàâèéêëîïôœùûüÿçÀÂÈÉÊËÎÏÔŒÙÛÜŸÇáßíóŠšŽžA-Za-z0-9\u4e00-\u9fa5\-]+)\.([åäöÅÄÖàâèéêëîïôœùûüÿçÀÂÈÉÊËÎÏÔŒÙÛÜŸÇáßíóŠšŽžA-Za-z\.]+)(\/)*([åäöÅÄÖàâèéêëîïôœùûüÿçÀÂÈÉÊËÎÏÔŒÙÛÜŸÇáßíóŠšŽž0-9A-Za-z\u4e00-\u9fa5\-](\/)*)*$/;

export { domain_regular };
