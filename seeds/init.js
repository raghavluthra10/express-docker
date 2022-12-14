/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function (knex) {
   // Deletes ALL existing entries
   await knex("users").insert([
      {
         id: 1,
         name: "raghav",
         email: "raghav@test.com",
         password: "raghav",
      },
      {
         id: 2,
         name: "muskaan",
         email: "muskaan@test.com",
         password: "muskaan",
      },
   ]);
};
