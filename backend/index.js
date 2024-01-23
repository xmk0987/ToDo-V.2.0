const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();

require('dotenv').config();
const PORT = process.env.PORT || 8888;

const allowedMethods = ['PUT', 'DELETE', 'GET', 'POST', 'OPTIONS'];

const corsOptions = {
  origin:'*',
  methods: allowedMethods.join(','),
};

//process.env.ORIGIN || "https://todo-ekwu.onrender.com"

app.use(cors(corsOptions));
app.use(bodyParser.json());

const authRouter = require('./routes/auth');
const classroomRouter = require('./routes/classroom');
const classRouter = require('./routes/class');
const todoRouter = require('./routes/todo');
const studentRouter = require('./routes/student');
const studentTodoRouter = require('./routes/studentTodo');
const answersRouter = require('./routes/answers');
const studentAnswersRouter = require('./routes/studentanswers');

app.use(authRouter);
app.use(classroomRouter);
app.use(classRouter);
app.use(todoRouter);
app.use(studentRouter);
app.use(studentTodoRouter);
app.use(answersRouter);
app.use(studentAnswersRouter);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});