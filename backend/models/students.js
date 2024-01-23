const pool = require('../util/database');



module.exports = class Student {
    constructor(classroom_name, username, name) {
        this.classroom_name = classroom_name;
        this.username = username;
        this.name = name;
    }

    static async addStudent(classroom_name, username) {
        return pool.query(
            'INSERT INTO students (classroom_name, username) VALUES ($1, $2)',
            [classroom_name, username]
        );
    }

    static async getClassroomStudents(classroom_name) {
        return pool.query(
            'SELECT * FROM students WHERE classroom_name = $1',
            [classroom_name]
        );
    }

    static async getStudent(username) {
        return pool.query(
            'SELECT * FROM students WHERE username = $1', 
            [username]
        );
    }

    static async removeStudent(username) {
        const client = await pool.connect();
        try {
            await client.query('BEGIN');
    
            await client.query('DELETE FROM student_todos WHERE student_username = $1', [username]);
            const result = await client.query('DELETE FROM students WHERE username = $1', [username]);
    
            await client.query('COMMIT');
            return result;
        } catch (error) {
            await client.query('ROLLBACK');
            throw error;
        } finally {
            client.release();
        }
    }
    
    static async setName(username, name) {
        return pool.query(
            'UPDATE students SET name = $1 WHERE username = $2',
            [name, username]
        );
    }
}