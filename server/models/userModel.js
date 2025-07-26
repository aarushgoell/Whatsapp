const db = require("./db");

async function createUser(name, email, hashedPassword) {
  const sql = "INSERT INTO users(name,email,password) VALUES (?,?,?)";
  const values = [name, email, hashedPassword];

  try {
    const [result] = await db.query(sql, values);
    return {
      message: "User created successfully",
      insertId: result.insertId,
    };
  } catch (err) {
    console.error("Error inserting user:", err);
    return { error: "User creation failed" };
  }
}

async function getUserByEmail(email) {
  const sql = "SELECT * FROM users WHERE email = ?";
  const values = [email];

  try {
    const [results] = await db.query(sql, values);
    if (results.length === 0) {
      return null;
    }
    return results[0];
  } catch (err) {
    console.error("Error fetching user:", err);
    return { error: "User fetch failed" };
  }
}

async function getAllOtherUsers(currentUserId) {
  const sql = "SELECT id,name,email FROM users WHERE id != ?";

  try {
    const [results] = await db.query(sql, [currentUserId]);

    return results;
  } catch (err) {
    console.error("Error fetching users: ", err);
    return {
      error: "could not fetch users",
    };
  }
}

module.exports = {
  createUser,
  getUserByEmail,
  getAllOtherUsers,
};
