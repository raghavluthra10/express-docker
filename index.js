const express = require("express");
const app = express();
const { db } = require("./db.js");

const connectDb = async () => {
   try {
      const response = await db("users");
      if (response.length > 0) {
         console.log("Database connected successfully!");
      }
   } catch (error) {
      console.log("Error while connecting to db");
      console.log(error);
   }
};

connectDb();

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
