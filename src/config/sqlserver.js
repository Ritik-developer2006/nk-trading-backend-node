const sql = require("mssql");

const sqlConfig = {
  server: process.env.SQLSERVER_HOST || "DESKTOP-UJESFGR",
  database: process.env.SQLSERVER_DATABASE,
  options: {
    encrypt: true,
    trustServerCertificate: true,
    enableArithAbort: true,
    integratedSecurity: true,
  },
  connectionTimeout: 15000,
  requestTimeout: 30000,
};

console.log("SQL Server Config:", {
  server: sqlConfig.server,
  database: sqlConfig.database,
  authentication: "Windows Authentication",
  port: sqlConfig.port,
});

module.exports = { sql, sqlConfig };
