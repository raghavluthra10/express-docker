const express = require("express");
const app = express();
const { db } = require("./db.js");
import { connectDb } from "./databaseConnection";
const multer = require("multer");

connectDb();

app.post("/upload");

app.get("/", async (req, res) => {
   const database = await db("users").where({ id: 1 });
   console.log("database ==> ", database);
   res.json({
      message: "hogya bhai",
      data: database,
   });
});

app.listen(8000, () => {
   console.log("Server runnisng on port", 8000);
});
