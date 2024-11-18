USE proyecto1;

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
              w.word IN ('costa', 'rica', 'national')
          GROUP BY 
              w.page, p.url
      ),

      filteredwordstogether AS (
          SELECT 
              fp.page,
              fp.url,
              lwtpt.amount * 
              (CASE lwtpt.tag 
                  WHEN 'p' THEN 5
                  WHEN 'h1' THEN 50 
                  ELSE 25
              END) AS score
          FROM 
              wordstogetherpertag AS lwtpt
          INNER JOIN 
              filteredpages AS fp
          ON
              fp.page = lwtpt.page
          WHERE
              (word1 = 'costa' AND word2 = 'rica') OR (word1 = 'rica' AND word2 = 'national')
          GROUP BY 
              fp.page, fp.url
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
          page, url
      ORDER BY 
          searchscore DESC
      LIMIT 100;