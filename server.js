const express = require("express");
const https = require("https");
const fs = require("fs");

const app = express();

// 读取证书和私钥文件
const options = {
  key: fs.readFileSync("D://OpenSSL-Win64//bin//key.pem"),
  cert: fs.readFileSync("D://OpenSSL-Win64//bin//PEM//cert.pem"),
};

// 定义路由
app.get("/", (req, res) => {
  res.send("Hello, HTTPS!");
});

// 创建 HTTPS 服务器
const server = https.createServer(options, app);

// 启动服务器
const port = 3000;
server.listen(port, () => {
  console.log(`Server is running on https://localhost:${port}`);
});
