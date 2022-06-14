const mysql = require('mysql2/promise')

async function getConnection() {
  const connection = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Ming-90743',
    database: 'short_url',
  })

  return connection
}

module.exports = { getConnection }
