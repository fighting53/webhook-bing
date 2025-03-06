const express = require("express");

const app = express();
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello World!");
});
app.listen(3007, () => {
  console.log("Server is running on port 3000", "https://localhost:3007/");
});
