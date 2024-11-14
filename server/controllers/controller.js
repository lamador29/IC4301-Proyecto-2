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
      "SELECT url, title, wordTotal FROM pages WHERE title LIKE ? LIMIT 100",
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
      "SELECT word FROM wordspertag WHERE word LIKE ? LIMIT 100",
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

async function getPageInfo(req, res) {
  let conn;
  const { url } = req.body;

  try {
    conn = await mariadbClient.getConnection();
    await conn.query('USE mysql');
    
    const page = await conn.query(
      "SELECT url, title, wordTotal FROM pages WHERE url = ?",
      [url]
    );

    /*
    const words = await conn.query(
      "SELECT word, tag, amount FROM wordspertag WHERE page = ?",
      [url]
    );*/

    const words = [
      { word: "home", tag: "h1", amount: 300 },
      { word: "about", tag: "p", amount: 600 },
      { word: "contact", tag: "h1", amount: 150 },
      { word: "home", tag: "h2", amount: 100 },
      { word: "xd", tag: "h3", amount: 50 }
    ];

    console.log(page);
    console.log(words);
    res.json({ page, words });

  } catch (error) {
    console.error("Error en la conexión o consulta:", error);
    res.status(500).json({ error: "Error en la conexión o consulta" });

  } finally {
    if (conn) conn.release();
  }
}

module.exports = { showTables, getPages, getWords, getPageInfo };