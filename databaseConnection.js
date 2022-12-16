export const connectDb = async () => {
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
