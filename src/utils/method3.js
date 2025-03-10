const axios = require("axios");
const { HttpsProxyAgent } = require("https-proxy-agent");

function integrateIndexNow(shopifyApiKey, shopifyApiSecret, indexNowUrl) {
  return new Promise((resolve, reject) => {
    // 创建 Shopify webhook 来触发索引过程
    const shopifyWebhook = {
      webhook: {
        topic: "products/create",
        address: indexNowUrl,
        format: "json",
      },
    };

    // 对 API 密钥和机密进行编码
    const credentials = Buffer.from(
      `${shopifyApiKey}:${shopifyApiSecret}`
    ).toString("base64");

    // 配置代理服务器
    const proxyUrl = "http://127.0.0.1:33210";
    const agent = new HttpsProxyAgent(proxyUrl);
    const shopifyUrl = process.env.SHOPIFY_URL;

    // 向 Shopify API 发出 POST 请求以创建 webhook
    axios
      .post(
        `https://${shopifyUrl}/admin/api/2025-01/webhooks.json`,
        shopifyWebhook,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Basic ${credentials}`,
          },
          timeout: 60000, // 增加超时时间为60秒
          httpsAgent: agent, // 使用代理
        }
      )
      .then((response) => {
        if (response.status === 200) {
          resolve();
        } else {
          reject(new Error("Failed to create webhook"));
        }
      })
      .catch((error) => {
        reject(error);
      });
  });
}

module.exports = { integrateIndexNow };
