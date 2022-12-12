const express = require("express");
const app = express();

app.get("/", (req, res) => {
   res.send("Docker World updated");
});

app.listen(8000, () => {
   console.log("Server runnisng on port", 8000);
});
