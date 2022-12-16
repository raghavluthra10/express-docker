const express = require("express");
const app = express();
const { db } = require("./db.js");
const { connectDb } = require("./databaseConnection");
const multer = require("multer");
connectDb();

const Minio = require("minio");

const minioClient = new Minio.Client({
   endPoint: "localhost",
   port: 9000,
   useSSL: false,
   accessKey: "user",
   secretKey: "password",
});

const storage = multer.diskStorage({
   destination: function (req, file, cb) {
      cb(null, __dirname + "/uploads");
   },
   filename: function (req, file, cb) {
      cb(null, file.originalname);
   },
});

const upload = multer({ storage: storage });

app.post("/upload", upload.single("image"), async (req, res) => {
   try {
      console.log("req.file =>", req.file);
      console.log("req.body ->", req.body);

      // file name
      // file path

      minioClient.fPutObject(
         "random",
         req.file.originalname,
         req.file.path,
         {},
         function (err, etag) {
            if (err) return console.log(err);
            console.log("File uploaded successfully.");
         }
      );

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
