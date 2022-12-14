// Update with your config settings.

/**
 * @type { Object.<string, import("knex").Knex.Config> }
 */
module.exports = {
   development: {
      client: "pg",
      connection: {
         port: 4321,
         host: "localhost",
         user: "root",
         database: "root",
         password: "password",
      },
   },
};
