// const knex = require("knex");
const dbConfig = require("./knexfile");

const db = require("knex")(dbConfig.development);

module.exports = { db };
