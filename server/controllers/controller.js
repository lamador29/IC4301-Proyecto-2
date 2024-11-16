const mariadbClient = require('../db/mariadb');

async function search(req, res) {
  let conn;

  try {
    conn = await mariadbClient.getConnection();
    await conn.query('USE mysql');
    
    const pages = await conn.query(
      "SELECT url, title AS page FROM pages LIMIT 100"
    );

    res.json(pages);

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
    await conn.query('USE proyecto1');
    
    const obtainedPages = await conn.query(
      `SELECT
          w.page,
          p.url,
          p.wordTotal,
          w.amount *
          (CASE tag
              WHEN 'p' THEN 1
              WHEN 'h1' THEN 10
              ELSE 5
          END) AS score 
       FROM
          wordspertag AS w
       INNER JOIN
          pages as p
       ON
          w.page = p.title
       WHERE
          w.word IN (${searchTerm})
       ORDER BY
          score DESC
       LIMIT 100;`
    );

    const pages = obtainedPages.map(page => ({
      ...page,
      score: Number(page.score)
    }));

    res.json(pages);

  } catch (error) {
    console.error("Error en la conexión o consulta:", error);
    res.status(500).json({ error: "Error en la conexión o consulta" });

  } finally {
    if (conn) conn.release();
  }
}

async function getTogetherPages(req, res) {
  let conn;
  const { searchTerm, searchTogetherTerm } = req.body;

  console.log();

  try {
    conn = await mariadbClient.getConnection();
    await conn.query('USE proyecto1');
    
    const query =`
      WITH filteredpages AS (
          SELECT 
              w.page,
              p.url,
              w.amount * 
              (CASE tag 
                  WHEN 'p' THEN 1
                  WHEN 'h1' THEN 10 
                  ELSE 5
              END) AS score
          FROM 
              wordspertag AS w
          INNER JOIN
              pages as p
          ON
              w.page = p.title
          WHERE 
              w.word IN (${searchTerm})
      ),

      filteredwordstogether AS (
          SELECT 
              fp.page,
              fp.url,
              lwtpt.amount * 
              (CASE lwtpt.tag 
                  WHEN 'p' THEN 2
                  WHEN 'h1' THEN 20 
                  ELSE 10
              END) AS score
          FROM 
              lesswordstogetherpertag AS lwtpt
          INNER JOIN 
              filteredpages AS fp
          ON
              fp.page = lwtpt.page
          WHERE
              lwtpt.word2 IN (${searchTogetherTerm})
      ),

      result AS (
          SELECT * FROM filteredpages
          UNION ALL
          SELECT * FROM filteredwordstogether
      )

      SELECT 
          page,
          url,
          SUM(score) AS searchscore
      FROM 
          result
      GROUP BY 
          page
      ORDER BY 
          searchscore DESC
      LIMIT 100;
       `
    ;
    const obtainedPages = await conn.query(query);

    const pages = obtainedPages.map(page => ({
      ...page,
      score: Number(page.score)
    }));

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
    await conn.query('USE proyecto1');

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
  const { name } = req.body;

  try {
    conn = await mariadbClient.getConnection();
    await conn.query('USE proyecto1');
    
    const page = await conn.query(
      "SELECT url, title, wordTotal FROM pages WHERE title = ?",
      [name]
    );

    const words = await conn.query(
      "SELECT word, tag, amount FROM wordspertag WHERE page = ?",
      [page[0].title]
    );

    res.json({ page, words });

  } catch (error) {
    console.error("Error en la conexión o consulta:", error);
    res.status(500).json({ error: "Error en la conexión o consulta" });

  } finally {
    if (conn) conn.release();
  }
}

async function getWordInfo(req, res) {
  let conn;
  const { word } = req.body;

  try {
    conn = await mariadbClient.getConnection();
    await conn.query('USE proyecto1');
    
    const wordDetails = await conn.query(
      "SELECT page, tag, amount FROM wordspertag WHERE	word = ?  ORDER BY amount DESC",
      [word]
    );

    res.json({ wordDetails });

  } catch (error) {
    console.error("Error en la conexión o consulta:", error);
    res.status(500).json({ error: "Error en la conexión o consulta" });

  } finally {
    if (conn) conn.release();
  }
}

async function getWikipedia(req, res) {
  let conn;

  try {
    conn = await mariadbClient.getConnection();
    await conn.query('USE proyecto1');
    
    const wikipedia = await conn.query(
      "SELECT * FROM wikipedia",
    );

    res.json({ wikipedia });

  } catch (error) {
    console.error("Error en la conexión o consulta:", error);
    res.status(500).json({ error: "Error en la conexión o consulta" });

  } finally {
    if (conn) conn.release();
  }
}

module.exports = { search, getPages, getTogetherPages, getWords, getPageInfo, getWordInfo, getWikipedia };