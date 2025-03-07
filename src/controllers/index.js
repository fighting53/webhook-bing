class WebhookController {
  handleEvent(req, res) {
    // 处理传入的 webhook 请求
    const event = req.body;

    // 在这里添加事件处理逻辑

    res.status(200).send("Event received");
  }
}

module.exports = WebhookController;