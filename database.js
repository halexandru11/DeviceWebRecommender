import mysql from 'mysql2';
import dotenv from 'dotenv';

dotenv.config();

const pool = mysql.createPool({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
    connectionLimit: 10
}).promise();


async function getNotes() {
    const [rows] = await pool.query('SELECT * FROM products');
    return rows;
}

async function getNote(id) {
    const [rows] = await pool.query('SELECT * FROM products WHERE id = ?', [id]);
    return rows[0];
}

const notes = await getNotes();
console.log(notes);

const note = await getNote(1);
console.log(note);
