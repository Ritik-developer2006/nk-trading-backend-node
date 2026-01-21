const sql = require("mssql");

const sqlConfig = {
  server: "127.0.0.1",
  database: "nk_groups_inventory",
  user: "nk_user",
  password: "ritik@135",
  port: 1433,
  options: {
    encrypt: false,
    trustServerCertificate: true,
    enableArithAbort: true,
  },
};

module.exports = { sql, sqlConfig };
