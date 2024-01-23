

const pool = require('../util/database');

module.exports = class StudentAnswer { 
    constructor(todo_id, student_answer, student_username) {
        this.todo_id = todo_id;
        this.student_answer = student_answer;
        this.student_username = student_username;
    }

    static getAnswer(todo_id, username) {
        return pool.query(
            'SELECT student_answer FROM student_answers WHERE todo_id = $1 AND student_username = $2', [todo_id, username]
        );
    }

    static addAnswer(todo_id, answer, username) {
        return pool.query(
            'INSERT INTO student_answers (todo_id, student_answer, student_username) VALUES ($1, $2, $3)', [todo_id, answer, username]
        );
    }

    static updateAnswer(todo_id, answer, username) {
        return pool.query(
            'UPDATE student_answers SET student_answer = $1 WHERE todo_id = $2 AND student_username = $3', [answer, todo_id, username]
        );
    }

    static deleteAnswer(todo_id, username) {
        return pool.query(
            'DELETE FROM student_answers WHERE todo_id = $1 AND student_username = $2', [todo_id, username]
        );
    }
}