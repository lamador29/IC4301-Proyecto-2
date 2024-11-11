const mariadb = require('mariadb');

const config = {
  host: 'localhost',
  port: 3004,
  user: 'proyecto1',
  password: '12345',
  database: 'mysql'
};

const client = mariadb.createPool(config);

async function checkConnection() {
  let conn;
  try {
    conn = await client.getConnection();
    await conn.query("SHOW TABLES");
    console.log("Conexión exitosa a MariaDB");
  } catch (error) {
    console.error("Error en la conexión a MariaDB:", error);
  } finally {
    if (conn) conn.release();
  }
}

checkConnection();

module.exports = client;