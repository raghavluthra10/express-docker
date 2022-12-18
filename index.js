const express = require("express");
const app = express();
const { db } = require("./db.js");
const { connectDb } = require("./databaseConnection");
const fs = require("fs");
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

      // see if file already exists

      minioClient.fPutObject(
         "random",
         req.file.originalname,
         req.file.path,
         {},
         function (err, etag) {
            if (err) return console.log(err);
            console.log("File uploaded successfully.");
            // once uploaded, delete the file from server file system
            fs.unlink(req.file.path, () => {
               console.log("removed the file");
            });
         }
      );

      return res.status(200).json({
         file: req.file,
         body: req.body,
         message: "aagyi file",
      });
   } catch (error) {
      console.log(error);
      return res.status(500).send("internal server error!");
   }
});

// download file api
app.get("/image/:name", async (req, res) => {
   try {
      const fileName = req.params["name"];
      console.log("file name =>", fileName);
      // console.log("req.file =>", req.file);
      console.log("req.body ->", req.body);

      minioClient.fGetObject(
         "random",
         fileName,
         `./downloads/${fileName}`,
         function (err, dataStream) {
            if (err) {
               return console.log(err);
            }

            console.log("result =>", dataStream);
         }
      );
      return res.status(200).json({
         // filename: req.,
         message: "aagyi file",
      });
   } catch (error) {
      console.log(error);
      return res.status(500).send("internal server error!");
   }
});

// delete file api

app.post("/files", upload.array("file"), (req, res) => {
   try {
      console.log("req.files =>", req.files);

      return res.status(200).json({
         files: req.files,
         body: req.body,
      });
   } catch (error) {
      console.log(error);
      return res.status(500).send("internal server error!");
   }
});

app.get("/", async (req, res) => {
   const database = await db("users").where({ id: 1 });
   console.log("database ==> ", database);
   return res.json({
      message: "hogya bhai",
      data: database,
   });
});

app.listen(8000, () => {
   console.log("Server runnisng on port", 8000);
});
