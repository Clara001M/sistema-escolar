const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Configurando o banco de dados MySQL
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root', // seu usuário do MySQL
    password: '', // sua senha do MySQL
    database: 'sistema_escolar'
});

db.connect((err) => {
    if (err) {
        throw err;
    }
    console.log('Conectado ao MySQL');
});

// Servindo o arquivo HTML estático
app.use(express.static(path.join(__dirname, 'public')));

// Autenticação do professor
app.post('/login', (req, res) => {
    const { email, password } = req.body;
    const query = 'SELECT * FROM professores WHERE email = ? AND senha = ?';
    db.query(query, [email, password], (err, results) => {
        if (err) throw err;
        if (results.length > 0) {
            res.json({ success: true, professor: results[0] });
        } else {
            res.json({ success: false, message: 'E-mail ou senha incorretos!' });
        }
    });
});

// Listar turmas do professor
app.get('/turmas', (req, res) => {
    const professorId = req.query.professorId;
    const query = 'SELECT * FROM turmas WHERE professor_id = ?';
    db.query(query, [professorId], (err, results) => {
        if (err) throw err;
        res.json(results);
    });
});

// Cadastrar turma
app.post('/cadastrar_turma', (req, res) => {
    const { nome, professorId } = req.body;
    const query = 'INSERT INTO turmas (nome, professor_id) VALUES (?, ?)';
    db.query(query, [nome, professorId], (err, result) => {
        if (err) throw err;
        res.json({ success: true });
    });
});

// Excluir turma
app.delete('/excluir_turma/:id', (req, res) => {
    const turmaId = req.params.id;
    const query = 'DELETE FROM turmas WHERE id = ?';
    db.query(query, [turmaId], (err, result) => {
        if (err) throw err;
        res.json({ success: true });
    });
});

// Iniciar o servidor
app.listen(3000, () => {
    console.log('Servidor rodando na porta 3000');
});
