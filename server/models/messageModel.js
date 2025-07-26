const db = require("./db");

async function saveMessage(senderId, receiverId, message) {
  const sql =
    "INSERT INTO messages (senderId,receiverId,message) VALUES (?,?,?)";

  const values = [senderId, receiverId, message];

  try {
    const [result] = await db.query(sql, values);
    
    // Get the saved message with timestamp
    const [savedMessage] = await db.query(
      "SELECT * FROM messages WHERE id = ?",
      [result.insertId]
    );
    
    return savedMessage[0];
  } catch (err) {
    console.error("Error saving message:", err);
    return { error: "Failed to save message" };
  }
}

async function getMessagesBetweenUsers(user1, user2) {
  const sql =
    "SELECT * FROM messages WHERE (senderId = ? AND receiverId = ?) OR (senderId = ? AND receiverId = ?) ORDER BY timestamp ASC";

  const values = [user1, user2, user2, user1];

  try {
    const [results] = await db.query(sql, values);

    return results;
  } catch (err) {
    console.error("Error fetching messages:", err);
    return {
      error: "Failed to load chat",
    };
  }
}

module.exports = {
  saveMessage,
  getMessagesBetweenUsers,
};
