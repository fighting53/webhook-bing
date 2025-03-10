const express = require("express");
const crypto = require("crypto");
const axios = require("axios");
const router = express.Router();

const shopifyUrl = process.env.SHOPIFY_URL;

// 验证 Webhook 签名
const verifyWebhookSignature = (req, res, buf) => {
  const hmac = crypto.createHmac("sha256", process.env.WEBHOOK_SECRET);
  const digest = Buffer.from(hmac.update(buf).digest("hex"), "utf8");
  const signature = Buffer.from(
    req.headers["x-shopify-hmac-sha256"] || "",
    "utf8"
  );
  console.log("digest", req, res, buf);

  if (
    digest.length !== signature.length ||
    !crypto.timingSafeEqual(digest, signature)
  ) {
    throw new Error("Invalid signature");
  }
};

// 处理 Webhook 请求
router.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  (req, res) => {
    console.log("Received a request at /webhook"); // 添加日志
    try {
      verifyWebhookSignature(req, res, req.body);
      const webhookData = JSON.parse(req.body.toString());
      console.log("Received Webhook Data:", webhookData);

      // 将数据发送到 Bing 的 IndexNow API
      axios
        .post(
          "https://www.bing.com/indexnow",
          {
            host: shopifyUrl,
            key: process.env.indexNowUrl,
            keyLocation: `https://${shopifyUrl}/indexnow-key.txt`,
            urlList: [webhookData.product.url],
          },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        )
        .then((response) => {
          console.log("IndexNow API response:", response.data);
          res.status(200).send("Webhook received and processed");
        })
        .catch((error) => {
          console.error("Error sending data to IndexNow API:", error);
          res.status(500).send("Error processing Webhook");
        });
    } catch (error) {
      console.error("Error processing Webhook:", error);
      res.status(400).send("Error processing Webhook");
    }
  }
);

module.exports = router;
