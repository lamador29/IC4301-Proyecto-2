USE proyecto1;
/* 3 words = 00:01:20 */


        SELECT
          sub.page,
          sub.url,
          MAX(sub.score) AS score
        FROM (
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
        ) AS sub
        GROUP BY
           sub.page, sub.url
        ORDER BY 
           score DESC
        LIMIT 100;