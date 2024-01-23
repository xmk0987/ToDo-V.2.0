const pool = require('../util/database');

const StudentAnswer = require('./studentAnswers');


module.exports = class Answer { 
    constructor(todo_id, answer) {
        this.todo_id = todo_id;
        this.answer = answer;
    }

    static getAnswer(todo_id) {
        return pool.query(
            'SELECT answer FROM answers WHERE todo_id = $1', [todo_id]
        );
    }

    static addAnswer(todo_id, answer) {
        return pool.query(
            'INSERT INTO answers (todo_id, answer) VALUES ($1, $2)', [todo_id, answer]
        );
    }

    static updateAnswer(todo_id, answer) {
        return pool.query(
            'UPDATE answers SET answer = $1 WHERE todo_id = $2', [answer, todo_id]
        );
    }

    static async deleteAnswer(todo_id) {
        await pool.query('DELETE FROM student_answers WHERE todo_id = $1' ,[todo_id]);
        return pool.query(
            'DELETE FROM answers WHERE todo_id = $1', [todo_id]
        );
    }
}