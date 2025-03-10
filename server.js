const express = require("express");
const dotenv = require("dotenv");
const { integrateIndexNow } = require("./src/utils/method3");
const webhookRouter = require("./src/routes/webhook"); // 引入 webhook 路由

// 加载环境变量
dotenv.config();

const app = express();
const port = process.env.PORT || 3000;
const shopifyApiKey = process.env.SHOPIFY_API_KEY;
const shopifyApiSecret = process.env.SHOPIFY_API_SECRET;
const indexNowUrl = process.env.indexNowUrl;

// 解析 JSON 请求体
app.use(express.json());
app.use(express.raw({ type: "*/*" }));

app.get("/", (req, res) => {
  res.send("Hello World!");
});

integrateIndexNow(shopifyApiKey, shopifyApiSecret, indexNowUrl)
  .then(() => {
    console.log("Webhook created successfully");
  })
  .catch((error) => {
    console.error("Failed to create webhook:", error);
    // console.log("error");
  });
// 使用 webhook 路由
app.use(webhookRouter);

// 启动服务器
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
