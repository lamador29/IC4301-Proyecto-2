const mariadbClient = require('../db/mariadb');

async function showTables(req, res) {
  let conn;

  try {
    conn = await mariadbClient.getConnection();

    await conn.query('USE mysql');
    const tables = await conn.query("SHOW TABLES");
    const tableNames = tables.map(row => Object.values(row)[0]);
 
    res.json(tableNames);

  } catch (error) {
    console.error("Error en la conexión o consulta:", error);
    res.status(500).json({ error: "Error en la conexión o consulta" });

  } finally {
    if (conn) conn.release();
  }
}

async function getPages(req, res) {
  let conn;
  const { searchTerm } = req.body;

  try {
    conn = await mariadbClient.getConnection();
    await conn.query('USE mysql');
    
    const pages = await conn.query(
      "SELECT url, title, wordTotal FROM pages WHERE title LIKE ?",
      [`%${searchTerm}%`]
    );

    res.json(pages);

  } catch (error) {
    console.error("Error en la conexión o consulta:", error);
    res.status(500).json({ error: "Error en la conexión o consulta" });

  } finally {
    if (conn) conn.release();
  }
}

async function getWords(req, res) {
  let conn;
  const { searchTerm } = req.body;

  try {
    conn = await mariadbClient.getConnection();
    await conn.query('USE mysql');

    const pages = await conn.query(
      "SELECT word FROM words WHERE word LIKE ?",
      [`%${searchTerm}%`]
    );

    res.json(pages);

  } catch (error) {
    console.error("Error en la conexión o consulta:", error);
    res.status(500).json({ error: "Error en la conexión o consulta" });
    
  } finally {
    if (conn) conn.release();
  }
}

module.exports = { showTables, getPages, getWords };