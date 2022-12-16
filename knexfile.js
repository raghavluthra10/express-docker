// Update with your config settings.

/**
 * @type { Object.<string, import("knex").Knex.Config> }
 */
module.exports = {
   development: {
      client: "pg",
      connection: {
         port: 5432,
         host: "localhost",
         user: "raghav",
         database: "multer_minio",
         password: "",
      },
   },
};
