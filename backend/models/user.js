const pool = require('../util/database');
const Classroom = require('./classroom');

module.exports = class User {
  constructor(username, email, password) {
    this.username = username;
    this.email = email;
    this.password = password;
  }

  static findEmail(email) {
    return pool.query('SELECT * FROM users WHERE email = $1', [email]);
  }

  static findUsername(username) {
    return pool.query('SELECT * FROM users WHERE username = $1', [username]);
  }

  static findUser(user_id){
    return pool.query('SELECT * FROM users WHERE user_id = $1', [user_id]);
  }

  static save(user) {
    return pool.query(
      'INSERT INTO users (username, email, password) VALUES ($1, $2, $3)',
      [user.username, user.email, user.password]
    );
  }

  static async deleteUser(username) {
    const client = await pool.connect();

    try {
      await client.query('BEGIN');

      const result = await Classroom.findByUserName(username);

      for (let i = 0; i < result.rows.length; i++) {
        let toDeleteClassroom = result.rows[i].classroom_name;
        await Classroom.deleteByClassroomName(toDeleteClassroom);
      }

      await client.query('DELETE FROM users WHERE username = $1', [username]);

      await client.query('COMMIT');
    } catch (error) {
        await client.query('ROLLBACK');
        console.error('Error deleting user:', error);
        throw error;
    } finally {
        client.release();
    }
  }
};



