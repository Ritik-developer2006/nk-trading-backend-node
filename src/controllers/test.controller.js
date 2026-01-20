const mysqlDB = require("../config/mysql");
const sql = require("mssql");
const { sqlConfig } = require("../config/sqlserver");

exports.testMySQL = async (req, res) => {
  const [rows] = await mysqlDB.query("SELECT 1 AS mysql_test");
  res.json(rows);
};

exports.testMongo = async (req, res) => {
  res.json({ message: "MongoDB connected successfully" });
};

exports.testSQLServer = async (req, res) => {
  let pool;
  try {
    pool = new sql.ConnectionPool(sqlConfig);
    await pool.connect();
    const request = pool.request();
    const result = await request.query("SELECT 1 AS sqlserver_test");
    res.json(result.recordset);
  } catch (err) {
    console.error("SQL Server Error:", err);
    res.status(500).json({ error: err.message });
  } finally {
    if (pool) {
      await pool.close();
    }
  }
};
