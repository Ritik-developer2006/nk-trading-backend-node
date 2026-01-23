const mysqlDB = require("../config/mysql");

exports.getCountry = async (req, res) => {
  try {
    const query = `SELECT id, shortname, name, phonecode as code FROM countries ORDER BY name ASC`;

    const [rows] = await mysqlDB.query(query);

    res.status(200).json({
        status: true,
        data: rows
    });
  } catch (error) {
    console.error("Get Country Error:", error);
    res.status(500).json({
      status: false,
      message: "Failed to fetch countries"
    });
  }
};

exports.getCountryStates = async (req, res) => {
  try {

    const { cid } = req.params;
    const query = `SELECT id, name FROM states where country_id=${cid} ORDER BY name ASC`;

    const [rows] = await mysqlDB.query(query);

    res.status(200).json({
        status: true,
        data: rows
    });
  } catch (error) {
    console.error("Get Country Error:", error);
    res.status(500).json({
      status: false,
      message: "Failed to fetch countries"
    });
  }
};
