const express = require('express');
const conectarDB = require('./config/db');
const cors = require('cors');

const app = express();

const PORT = process.env.PORT || 4000;

conectarDB();

app.use(cors());

app.use(express.json({ extenden: true }));

app.use('/api/usuarios', require('./routes/usuarios'));
app.use('/api/auth', require('./routes/auth'));
app.use('/api/proyectos', require('./routes/proyectos'));
app.use('/api/tareas', require('./routes/tareas'));

app.listen(PORT, () => {
    console.log('server is running...');
})