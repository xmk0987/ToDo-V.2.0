const pool = require('../util/database');

const Class = require('./class');

module.exports = class Classroom {
  constructor(username, classroom_name, shared_class_id) {
    this.username = username;
    this.classroom_name = classroom_name;
    this.shared_id = shared_class_id;

    // Set the date_created to the current date
    const currentDate = new Date();
    const dd = String(currentDate.getDate()).padStart(2, '0');
    const mm = String(currentDate.getMonth() + 1).padStart(2, '0'); // January is 0!
    const yy = String(currentDate.getFullYear()).slice(-2);
    this.date_created = `${dd}.${mm}.${yy}`;
  }

  static async add(username, classroom_name) {
    const client = await pool.connect();

    try {
        await client.query('BEGIN');

        await client.query(
            'UPDATE classrooms SET is_active = false WHERE username = $1',
            [username]
        );

        await client.query(
            'INSERT INTO classrooms (username, classroom_name, is_active) VALUES ($1, $2, true)',
            [username, classroom_name]
        );

        await client.query('COMMIT');
    } catch (error) {
        await client.query('ROLLBACK');
        throw error;
    } finally {
        client.release();
    }
  } 

  static async deleteByClassroomName(classroom_name) {
    const client = await pool.connect();

    try {
      await client.query('BEGIN');

      const result = await Class.findByClassroomName(classroom_name);

      for (let i = 0; i < result.rows.length; i++) {
        let classId = result.rows[i].class_id;
        await Class.deleteByClassId(classId);
      }

      await client.query('DELETE FROM students WHERE classroom_name = $1', [classroom_name]);
      await client.query('DELETE FROM classrooms WHERE classroom_name = $1', [classroom_name]);

      await client.query('COMMIT');
    } catch (error) {
        await client.query('ROLLBACK');
        console.error('Error deleting classroom:', error);
        throw error;
    } finally {
        client.release();
    }
  }


  static findByClassroomName(classroom_name) {
    return pool.query(
      'SELECT * FROM classrooms WHERE classroom_name = $1',
      [classroom_name]
    );
  }

  static findByUserName(username) {
    return pool.query(
      'SELECT * FROM classrooms WHERE username = $1',
      [username]
    );
  }

  static findActive(username) {
    return pool.query(
      'SELECT * FROM classrooms WHERE username = $1 AND is_active = true',
      [username]
  );
  }

  static async setActive(username, classroom_name) {
    const deactivateAllQuery = 'UPDATE classrooms SET is_active = false WHERE username = $1';
    const activateQuery = 'UPDATE classrooms SET is_active = true WHERE username = $1 AND classroom_name = $2';

    const client = await pool.connect();

    try {
        await client.query('BEGIN');

        await client.query(deactivateAllQuery, [username]);

        await client.query(activateQuery, [username, classroom_name]);

        await client.query('COMMIT');
    } catch (error) {
        await client.query('ROLLBACK');
        throw error;
    } finally {
        client.release();
    }
  }

  static async setOnShare(classroom_name, class_id ) {
    return pool.query(
      'UPDATE classrooms SET shared_id = $1 WHERE classroom_name = $2',
      [class_id, classroom_name]
    );
  }


  static async getSharedClass(classroom_name) {
    return pool.query(
      'SELECT shared_id FROM classrooms WHERE classroom_name = $1',
      [classroom_name]
    );
  }



}