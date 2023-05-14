import mysql from 'mysql2';
import dotenv from 'dotenv';
dotenv.config();

const pool = mysql.createPool({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE
}).promise();

// The code below should be removed
// It was just a test to see if the connection works
// And it is an example on how to write the functions

async function getNotes() {
    const [rows] = await pool.query('SELECT * FROM notes');
    return rows;
}

async function getNote(id) {
    const [rows] = await pool.query('SELECT * FROM notes WHERE id = ?', [id]);
    return rows[0];
}

const notes = await getNotes();
console.log(notes);

const note = await getNote(1);
console.log(note);
