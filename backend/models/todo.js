const pool = require('../util/database');

module.exports = class Todo {
  constructor(class_id, content, completed, flagged, isQuestion) {
    this.class_id = class_id;
    this.content = content;
    this.completed = completed;
    this.flagged = flagged;
    this.isquestion = isquestion;
    this.position = position;
  }

  static findClassTodos(class_id) {
    const sql = 'SELECT * FROM todos WHERE class_id = $1';
    return pool.query(sql, [class_id]);
  }

  static async add(class_id, content) {
    const positionQuery = 'SELECT COALESCE(MAX(position), 0) + 1 as max_position FROM todos WHERE class_id = $1';
    const positionResult = await pool.query(positionQuery, [class_id]);
    const position = positionResult.rows[0].max_position;

    const insertQuery = 'INSERT INTO todos (class_id, content, position) VALUES ($1, $2, $3)';
    const values = [class_id, content, position];
    
    return pool.query(insertQuery, values);
  }

  static update(todo_id, updates) {
    const setClause = Object.keys(updates).map((key, index) => `${key} = $${index + 1}`).join(', ');
    const sql = `UPDATE todos SET ${setClause} WHERE todo_id = $${Object.keys(updates).length + 1}`;
    const values = [...Object.values(updates), todo_id];
    return pool.query(sql, values);
  }

  static async delete(todo_id) {
    try {
        const getClassIdAndPositionQuery = 'SELECT class_id, position FROM todos WHERE todo_id = $1';
        const classIdAndPositionResult = await pool.query(getClassIdAndPositionQuery, [todo_id]);
        
        if (classIdAndPositionResult.rows.length > 0) {
            const { class_id, position } = classIdAndPositionResult.rows[0];

            const deleteStudentTodosQuery = 'DELETE FROM student_todos WHERE todo_id = $1';
            const deleteStudentAnswersQuery = 'DELETE FROM student_answers WHERE todo_id = $1';
            const deleteAnswersQuery = 'DELETE FROM answers WHERE todo_id = $1';

            await pool.query(deleteStudentTodosQuery, [todo_id]);
            await pool.query(deleteStudentAnswersQuery, [todo_id]);
            await pool.query(deleteAnswersQuery, [todo_id]);

            const deleteQuery = 'DELETE FROM todos WHERE todo_id = $1';
            await pool.query(deleteQuery, [todo_id]);

            const updatePositionsQuery = `
                UPDATE todos
                SET position = position - 1
                WHERE class_id = $1 AND position > $2`;
            await pool.query(updatePositionsQuery, [class_id, position]);

            const updateStudentTodosQuery = `
                UPDATE student_todos
                SET position = position - 1
                WHERE class_id = $1 AND position > $2`;
            await pool.query(updateStudentTodosQuery, [class_id, position]);

            return true;
        } else {
            return false;
        }
    } catch (error) {
        console.error('Error deleting and updating positions:', error);
        throw error;
    }
  } 

  static async swapPosition(todo, todo2) {
    try {
      await pool.query(
          'UPDATE todos SET position = $1 WHERE todo_id = $2',
          [todo2.position, todo.todo_id]
      );
      await pool.query(
        'UPDATE todos SET position = $1 WHERE todo_id = $2',
        [todo.position, todo2.todo_id]
      );

      await pool.query(
        'UPDATE student_todos SET position = $1 WHERE todo_id = $2',
        [todo2.position, todo.todo_id]
      );
      await pool.query(
        'UPDATE student_todos SET position = $1 WHERE todo_id = $2',
        [todo.position, todo2.todo_id]
      );

      return;

    } catch (error) {
        console.error('Error swapping positions:', error);
        throw error;
    }
  }

  static setQuestion(todo_id) {
    return pool.query(
      'UPDATE todos SET isQuestion = NOT isQuestion WHERE todo_id = $1',
      [todo_id]
    );
  }
};