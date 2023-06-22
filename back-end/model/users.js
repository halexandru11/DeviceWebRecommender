import mysql from 'mysql2';
import dotenv from 'dotenv';
import { sendConfirmationEmail } from '../controller/emailService.js';
dotenv.config();

const pool = mysql
  .createPool({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
    connectionLimit: 10,
  })
  .promise();

export function insertUser(username, email, res) {
  return new Promise((resolve, reject) => {
    try {
      const connection = mysql.createConnection({
        host: 'localhost',
        user: 'user',
        password: 'password',
        database: 'gimme',
      });
      connection.connect();

      const query =
        'INSERT INTO users (id, username, email) VALUES (DEFAULT, ?, ?)';
      const values = [username, email];

      connection.query(query, values, (error, result) => {
        if (error) {
          console.error('Error inserting user:', error);
          if (error.code === 'ER_DUP_ENTRY') {
            reject(new Error('Username or email already exists.'));
          } else {
            reject(error);
          }
        } else {
          const insertedUserId = result.insertId;
          console.log('User inserted successfully. ID:', insertedUserId);
          sendConfirmationEmail(email, username);
          try {
            resolve(insertedUserId);
          } catch (confirmationError) {
            reject(confirmationError);
          }
        }

        connection.end(); // Close the connection after executing the query
      });
    } catch (error) {
      console.error('Error inserting user:', error);
      reject(error);
    }
  });
}

export const getUserDetailsByEmail = async (email) => {
  return new Promise((resolve, reject) => {
    const connection = mysql.createConnection({
      host: 'localhost',
      user: 'user',
      password: 'password',
      database: 'gimme',
    });

    connection.connect();

    const userSql = 'SELECT username, id FROM users WHERE email = ?';

    connection.query(userSql, [email], (error, results) => {
      if (error) {
        console.error('Error querying user:', error);
        reject(error);
      } else {
        resolve(results);
      }
      connection.end();
    });
  });
};

export function selectUserIdByUsername(username) {
  return new Promise((resolve, reject) => {
    const connection = mysql.createConnection({
      host: 'localhost',
      user: 'user',
      password: 'password',
      database: 'gimme',
    });

    connection.connect();

    const query = 'SELECT id FROM users WHERE username = ?';
    const values = [username];

    connection.query(query, values, (error, results) => {
      if (error) {
        console.error('Error selecting user ID:', error);
        reject(error);
      } else {
        if (results.length === 0) {
          resolve(null);
        } else {
          const userId = results[0].id;
          console.log('User ID selected successfully:', userId);
          resolve(userId);
        }
      }
      connection.end();
    });
  });
}

async function getUsers() {
  const [rows] = await pool.query('SELECT * FROM users');
  return rows;
}

async function getUserById(id) {
  const [rows] = await pool.query('SELECT * FROM users WHERE id = ?', [id]);
  return rows[0];
}

async function getUserByEmail(email) {
  const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [
    email,
  ]);
  return rows[0];
}

async function getUserEmail(id) {
  const [rows] = await pool.query('SELECT email FROM users WHERE id = ?', [id]);
  return rows[0];
}

async function getUserUsername(id) {
  const [rows] = await pool.query('SELECT username FROM users WHERE id = ?', [
    id,
  ]);
  return rows[0];
}

export async function testUsersTable() {
  try {
    const users = await getUsers();
    console.log('All users:\n', users);

    const user = await getUserById(1);
    console.log('\n\nUser with id 1:\n', user);

    const userEmail = await getUserEmail(1);
    console.log('\n\nUser email with id 1:\n', userEmail);

    const userUsername = await getUserUsername(1);
    console.log('\n\nUser username with id 1:\n', userUsername);

    const userByEmail = await getUserByEmail('spattison0@independent.co.uk');
    console.log(
      '\n\nUser with email spattison0@independent.co.uk',
      userByEmail
    );
  } catch (err) {
    console.log(err);
  } finally {
    pool.end();
  }
}
