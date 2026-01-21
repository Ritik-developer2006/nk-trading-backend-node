const mysqlDB = require("../config/mysql");
// const sql = require("msnodesqlv8");
const { sql, sqlConfig } = require("../config/sqlserver");

exports.testMySQL = async (req, res) => {
  const [rows] = await mysqlDB.query("SELECT 1 AS mysql_test");
  res.json(rows);
};

exports.testMongo = async (req, res) => {
  res.json({ message: "MongoDB connected successfully" });
};

exports.testSQLServer = async (req, res) => {
  try {
    const pool = await sql.connect(sqlConfig);
    const result = await pool
      .request()
      .query("SELECT * FROM tbl_brands");

    res.json(result.recordset);
  } catch (err) {
    console.error("SQL Server Error:", err);
    res.status(500).json({ error: err.message });
  }
};
