CREATE FUNCTION body_text(content JSONB) RETURNS TEXT AS $$
	WITH RECURSIVE jsondata AS (
	    SELECT
	        content -> 'content' AS blocks,
	        '' AS text_data
	    UNION
	    SELECT
	        d -> 'content',
	        d ->> 'TEXT'
	    FROM jsondata, jsonb_array_elements(blocks) AS d
	)
	SELECT 
		string_agg(text_data, ' ') AS body
	FROM jsondata
$$ LANGUAGE SQL;

CREATE FUNCTION body_vector(page_id BIGINT) RETURNS TSVECTOR AS $$
    SELECT to_tsvector(body_text(p.content)) AS tsvec
    FROM "Page" p WHERE p.id = page_id;
$$ LANGUAGE SQL;

CREATE FUNCTION page_title(page_id BIGINT) RETURNS TEXT AS $$
    SELECT
        case when max(cs.name) IS NOT NULL THEN max(cs.name) || ' - ' || max(p.title) ELSE max(p.title) END AS title
    FROM "Page" p
    LEFT JOIN "CaseStudy" cs ON cs."pageId" = id
    WHERE p.id = page_id;
$$ LANGUAGE SQL;

CREATE FUNCTION title_vector(page_id BIGINT) RETURNS TSVECTOR AS $$
    SELECT to_tsvector(page_title(page_id)) AS title
$$ LANGUAGE SQL;

CREATE FUNCTION tag_vector(page_id BIGINT) RETURNS TSVECTOR AS $$
	SELECT to_tsvector(COALESCE(string_agg(tag.value, ' '), ''))
    FROM "Page" p
    LEFT JOIN "TagsOnPages" top ON top."pageId" = p.id
    LEFT JOIN "Tag" tag ON top."tagId"  = tag.id
    WHERE p.id = page_id
$$ LANGUAGE SQL;

CREATE FUNCTION create_search_vector(page_id BIGINT) RETURNS TSVECTOR AS $$
	SELECT 
		setweight(title_vector(page_id), 'A') ||
		setweight(tag_vector(page_id), 'B') ||
		setweight(body_vector(page_id), 'C')
$$ LANGUAGE SQL;

CREATE FUNCTION create_page_search_index(page_id BIGINT) RETURNS VOID AS $$
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
END;
$$ LANGUAGE plpgsql;

CREATE FUNCTION search_pages(search_text TEXT) RETURNS TABLE (id INT, highlights TEXT, rank FLOAT) AS $$
    SELECT 
        s."pageId" AS id,
        ts_headline(s.title, query) AS highlights,
        ts_rank_cd(s.vector, query) AS rank
    FROM "Search" s, websearch_to_tsquery(search_text) AS query
    WHERE s.vector @@ query
$$ LANGUAGE SQL;

CREATE FUNCTION tag_highlights(search_text TEXT) RETURNS TABLE ("tagId" INT, highlight TEXT) AS $$
    SELECT
        tag.id,
        ts_headline(tag.value, query)
    FROM "Tag" tag, websearch_to_tsquery(search_text) AS query
$$ LANGUAGE SQL;
