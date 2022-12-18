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

      // add metadata which will consist of users id and name
      const name = "user1";
      const userId = 1;
      const id = 1;

      // see if file already exists

      minioClient.fPutObject(
         "random",
         req.file.originalname,
         req.file.path,
         { name, userId, id },
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

// download file api with image name
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

// download image with image id/userId
app.get("/image", async (req, res) => {
   try {
      const fileName = req.file.filename;
      const userId = 1;

      minioClient.fGetObject("random", fileName);
   } catch (error) {
      console.log(error);
      return res.status(500).send("internal server error!");
   }
});

// get all files
app.get("/images", async (req, res) => {
   try {
      let data = [];
      const images = minioClient.listObjects("random", "", true);

      images.on("data", function (obj) {
         data.push(obj);
      });
      console.log("dtaattatatata", data);
      images.on("end", function (obj) {
         console.log("obj", obj);
         console.log(data);
      });

      images.on("error", function (err) {
         console.log(err);
      });
      return res.status(200).json({
         message: "success",
         data: data,
      });
   } catch (error) {
      console.log(error);
      return res.status(500).send("internal server error!");
   }
});

// get single file url using PreSignedUrl
app.get("/presigned", (req, res) => {
   try {
      let link = "";
      minioClient.presignedGetObject(
         "random",
         "r.png",
         24 * 60 * 60,
         function (err, result) {
            if (err) return console.log("error =>", err);
            if (result) {
               link = result;
            }
         }
      );
      return res.status(200).json({
         message: "success",
         link,
      });
   } catch (error) {
      console.log(error);
      return res.status(500).send("internal server error!");
   }
});

app.get("/presignedAll", (req, res) => {
   try {
      let data = [];

      minioClient.presignedUrl(
         "GET",
         "random",
         "",
         1000,
         {},
         function (err, result) {
            if (err) return console.log(err);
            console.log("result ======>", result);
            data.push(result);
         }
      );
      return res.status(200).json({
         success: true,
         data,
      });
   } catch (error) {
      console.log(error);
      return res.status(500).send("internal server error!");
   }
});

// get all files of a single user

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
