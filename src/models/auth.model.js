const mysqlDB = require("../config/mysql");

const Auth = {

  // For create user
  create: async (userData, userDetailData) => {
    const connection = await mysqlDB.getConnection();

    try {
      await connection.beginTransaction();

      // Check existing user
      const [exist] = await connection.query(
        "SELECT COUNT(*) AS count FROM users_detail WHERE mobile = ?",
        [userDetailData.number]
      );

      if (exist[0].count > 0) {
        await connection.rollback();
        return { status: false, msg: "User already exists" };
      }

      // Insert user details
      const [userDetailResult] = await connection.query(
        `INSERT INTO users_detail
        (first_name, last_name, email_id, mobile, country, state, address1, address2, pincode)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          userDetailData.firstName,
          userDetailData.lastName,
          userData.email,
          userDetailData.number,
          userDetailData.country,
          userDetailData.state,
          userDetailData.address1,
          userDetailData.address2,
          userDetailData.pincode
        ]
      );

      const uid = userDetailResult.insertId;

      // Insert auth data
      await connection.query(
        `INSERT INTO users
        (uid, email_id, mobile, password)
        VALUES (?, ?, ?, ?)`,
        [uid, userData.email, userDetailData.number, userData.password]
      );

      await connection.commit();

      return {
        status: true,
        msg: "User registered successfully",
        uid
      };

    } catch (error) {
      await connection.rollback();
      console.error("MYSQL ERROR", error);
      return {
        status: false,
        msg: error.sqlMessage || "Database error"
      };
    } finally {
      connection.release();
    }
  },

  // For login user
  findByEmail: async (userData) => {
    const [rows] = await mysqlDB.query(
      `SELECT u.id, u.password, u.email_id
       FROM users u
       WHERE u.email_id = ? or u.mobile = ?`,
      [userData.email, userData.number]
    );

    if (rows.length === 0) {
      return { status: false, msg: "User not found!" };
    } else {
      return { status: true, msg: "User found!", data: rows[0] };
    }
  },

  // For forgot password
  findByEmailOrNumber: async (email_mobile) => {

    const connection = await mysqlDB.getConnection();

    try {
      await connection.beginTransaction();

      // Check existing user
      const [exist] = await connection.query(
        "SELECT COUNT(*) AS count, id FROM users_detail WHERE email_id = ? or mobile = ?",
        [email_mobile, email_mobile]
      );

      if (exist[0].count = 0) {
        await connection.rollback();
        return { status: false, msg: "User not found" };
      }

      const user_id = exist[0].id;
      const otp = Math.floor(1000 + Math.random() * 9000);

      // Insert otp in users table
      const [userDetailResult] = await connection.query(
        `UPDATE users SET otp = ? WHERE uid = ?`,
        [otp, user_id]
      );

      if (!userDetailResult) {
        await connection.rollback();
        return { status: false, msg: "Something was wrong, try again!" };
      }

      await connection.commit();

      return {
        status: true,
        msg: "Otp send successfully",
        otp
      };

    } catch (error) {
      await connection.rollback();
      console.error("MYSQL ERROR", error);
      return {
        status: false,
        msg: error.sqlMessage || "Database error"
      };
    } finally {
      connection.release();
    }
  }
};

module.exports = Auth;
