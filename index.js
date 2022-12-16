const express = require("express");
const app = express();
const { db } = require("./db.js");
const { connectDb } = require("./databaseConnection");
const multer = require("multer");
const upload = multer({ dest: "uploads/" });

connectDb();

app.post("/upload", upload.single("image"), (req, res) => {
   try {
      console.log("req.file =>", req.file);
      console.log("req.body ->", req.body);

      res.status(200).json({
         file: req.file,
         body: req.body,
         message: "aagyi file",
      });
   } catch (error) {
      console.log(error);
      res.status(500).send("internal server error!");
   }
});

app.post("/files", upload.array("file"), (req, res) => {
   try {
      console.log("req.files =>", req.files);

      res.status(200).json({
         files: req.files,
         body: req.body,
      });
   } catch (error) {
      console.log(error);
      res.status(500).send("internal server error!");
   }
});

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
