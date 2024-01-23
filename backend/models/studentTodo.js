const pool = require('../util/database');

module.exports = class StudentTodo {
  constructor( student_username, todo_id, content, completed) {
    this.student_username = student_username
    this.todo_id = todo_id;
    this.content = content;
    this.completed = completed;
  }

  static async findStudentTodos(class_id, username) {
    try {
        const sql = 'SELECT * FROM todos WHERE class_id = $1 ORDER BY position';
        const { rows } = await pool.query(sql, [class_id]);

        for (let i = 0; i < rows.length; i++) {
            let todo = rows[i];
            const checkTodoUser = 'SELECT * FROM student_todos WHERE student_username = $1 AND todo_id = $2';
            const { rows: checkRows } = await pool.query(checkTodoUser, [username, todo.todo_id]);
            if ( checkRows.length === 0 ) {
                const sql2 = `
                INSERT INTO student_todos (class_id, student_username, todo_id, content, flagged, position)
                VALUES ($1, $2, $3, $4, $5, $6)`;
            
                await pool.query(sql2, [class_id, username, todo.todo_id, todo.content, todo.flagged, todo.position]);
            }

            if(checkRows.length !== 0 && checkRows[0].content !== todo.content) {
              const sql3 = 'UPDATE student_todos SET content = $1 WHERE todo_id = $2';
              await pool.query(sql3, [todo.content, todo.todo_id]);
            }

            if(checkRows.length !== 0 && checkRows[0].flagged !== todo.flagged) {
              const sql3 = 'UPDATE student_todos SET flagged = $1 WHERE todo_id = $2';
              await pool.query(sql3, [todo.flagged, todo.todo_id]);
            }
        }

        const sql4 = 'SELECT * FROM student_todos WHERE class_id = $1 AND student_username = $2';
        const { rows: newRows } = await pool.query(sql4, [class_id, username]);

        return newRows;
    } catch (error) {
        console.error('Error retrieving student todos:', error);
        throw error;
    }
    }  

  static updateCompleted(student_todo_id, updates) {
    const setClause = Object.keys(updates).map((key, index) => `${key} = $${index + 1}`).join(', ');
    const sql = `UPDATE student_todos SET ${setClause} WHERE student_todo_id = $${Object.keys(updates).length + 1}`;
    const values = [...Object.values(updates), student_todo_id];
    return pool.query(sql, values);
}

};