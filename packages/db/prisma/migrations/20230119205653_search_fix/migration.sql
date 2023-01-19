CREATE OR REPLACE FUNCTION body_text(content JSONB) RETURNS TEXT AS $$
	WITH RECURSIVE jsondata AS (
	    SELECT
	        content -> 'content' AS blocks,
	        '' AS text_data
	    UNION
	    SELECT
	        d -> 'content',
	        d ->> 'text'
	    FROM jsondata, jsonb_array_elements(blocks) AS d
	)
	SELECT 
		string_agg(text_data, ' ') AS body
	FROM jsondata
$$ LANGUAGE SQL;

DROP FUNCTION create_page_search_index(page_id BIGINT);

CREATE FUNCTION create_page_search_index(page_id BIGINT) RETURNS INT AS $$
BEGIN
    DELETE FROM "Search" s WHERE s."pageId" = page_id;
    INSERT INTO "Search" ("pageId", "fullText", title, vector)
        SELECT
            p.id,
            body_text(p.content),
            page_title(p.id),
            create_search_vector(p.id)
        FROM "Page" p
        LEFT JOIN "CaseStudy" cs ON cs."pageId" = p.id
        LEFT JOIN "TagsOnPages" top ON top."pageId" = p.id
        LEFT JOIN "Tag" tag ON top."tagId"  = tag.id
        WHERE p.id = page_id
        GROUP BY p.id;
    RETURN page_id;
END;
$$ LANGUAGE plpgsql;

SELECT count(create_page_search_index(p.id)) from "Page" p;
