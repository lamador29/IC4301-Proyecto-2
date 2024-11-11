const mariadbClient = require('../db/mariadb');





async function showTables(req, res) {
  let conn;
  try {
    conn = await mariadbClient.getConnection();
    //console.log("Conexión exitosa a MariaDB");

    await conn.query('USE mysql');
    const tables = await conn.query("SHOW TABLES");
    return tables.map(row => Object.values(row)[0]);

    res.json(tableNames);

  } catch (error) {
    console.error("Error en la conexión o consulta:", error);
    res.status(500).json({ error: "Error en la conexión o consulta" });

  } finally {
    if (conn) conn.release();
  }
}

module.exports = { showTables };