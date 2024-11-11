/*
const mariadbClient = require('../db/mariadb');





async function getTables() {
  let conn;
  try {
    conn = await mariadbClient.getConnection();
    console.log("Conexión exitosa a MariaDB");


    const tables = await conn.query("SHOW TABLES");
    return tables.map(row => Object.values(row)[0]);



  } catch (error) {
    console.error("Error en la conexión o consulta:", error);
    return [];


  } finally {
    if (conn) conn.release();
  }
}

module.exports = getTables;*/