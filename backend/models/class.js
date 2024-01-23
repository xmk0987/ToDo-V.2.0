const pool = require('../util/database');

const Todo = require('./todo');

module.exports = class Class {
    constructor(classroom_name, name) {
        this.classroom_name = classroom_name;
        this.name = name;
    }

    static add(classObject) {
        return pool.query(
            'INSERT INTO classes (classroom_name, name) VALUES ($1, $2)',
            [classObject.classroom_name, classObject.name]
        );   
    }

    static async deleteByClassId(class_id) {
        try {
            await pool.query('DELETE FROM student_todos WHERE class_id = $1', [class_id]);
            const {rows} = await pool.query('SELECT * FROM todos WHERE class_id = $1', [class_id]);
            for (let i = 0; i < rows.length; i++) {
                await Todo.delete(rows[i].todo_id);
            }
            return await pool.query('DELETE FROM classes WHERE class_id = $1', [class_id]);
        } catch (error) {
            console.error('Error deleting records:', error);
            throw error;
        }
    }

    static findByClassroomName(classroom_name) {
        return pool.query(
            'SELECT * FROM classes WHERE classroom_name = $1',
            [classroom_name]
        );
    }

    static findByClassId(class_id) {
        return pool.query(
            'SELECT * FROM classes WHERE class_id = $1',
            [class_id]
        );
    }


};