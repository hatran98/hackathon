const mysql2 = require("mysql2");
let pool = mysql2
  .createPool({
    host: "localhost",
    user: "root",
    password: "",
    database: "hackathon",
  })
  .promise();

module.exports = pool
