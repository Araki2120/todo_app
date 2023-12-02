const express = require('express');
const mysql = require('mysql');

//接続するSQLの情報
const connection = mysql.createConnection({
    host: '127.0.0.1',
    user: 'root',
    password: 'testAPP2120',
    database: 'listapp'
});

//エラー確認用
connection.connect((err) => {
    if (err) {
        console.log('error connecting: ' + err.stack);
        return;
    }
    console.log('success');
});

const app = express();
app.use(express.static('public'));
app.use(express.urlencoded({ extended: false }));


//TOPページ
app.get('/', (req, res) => {
    res.render('top.ejs');
});

//一覧表示
app.get('/index', (req, res) => {
    connection.query(
        'SELECT * FROM todos',
        (error, results) => {
            console.log(results);
            res.render('index.ejs', { todos: results });
        }
    );
});

//新規作成機能
app.get('/new', (req, res) => {
    res.render('new.ejs');
});

app.post('/create', (req, res) => {
    console.log(req.body.todoName);
    connection.query(
        'INSERT INTO todos (name) VALUES(?)',
        [req.body.todoName],
        (error, results) => {
            res.redirect('/index');
        });
});

//削除機能
app.post('/delete/:id', (req, res) => {
    connection.query(
        'DELETE FROM todos WHERE id = ?',
        [req.params.id],
        (error, results) => {
            res.redirect('/index');
        }
    );
});

//編集機能
app.get('/edit/:id', (req, res) => {
    connection.query(
        'SELECT * FROM todos WHERE id = ?',
        [req.params.id],
        (error, results) => {
            res.render('edit.ejs', { todo: results[0] });
        });
});

//更新機能
app.post('/update/:id', (req, res) => {
    connection.query(
        'UPDATE todos SET name = ? WHERE id = ?',
        [req.body.todoName, req.params.id],
        (error, results) => {
            res.redirect('/index');
        }
    );
});

app.listen(3000);

