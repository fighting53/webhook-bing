const express = require("express");
const WebhookController = require("../controllers/index").WebhookController;

const setRoutes = (app) => {
  const webhookController = new WebhookController();

  app.post("/webhook", (req, res) => {
    webhookController.handleEvent(req, res);
  });
};

module.exports = setRoutes;
