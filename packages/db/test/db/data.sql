--
-- PostgreSQL database dump
--

-- Dumped from database version 13.8 (Debian 13.8-1.pgdg110+1)
-- Dumped by pg_dump version 13.8 (Debian 13.8-1.pgdg110+1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: Role; Type: TYPE; Schema: public; Owner: prisma
--

CREATE TYPE public."Role" AS ENUM (
    'USER',
    'CONTENT_MANAGER',
    'ADMIN'
);


ALTER TYPE public."Role" OWNER TO prisma;

--
-- Name: TagCategory; Type: TYPE; Schema: public; Owner: prisma
--

CREATE TYPE public."TagCategory" AS ENUM (
    'PRIMARY',
    'SECONDARY'
);


ALTER TYPE public."TagCategory" OWNER TO prisma;

--
-- Name: TagType; Type: TYPE; Schema: public; Owner: prisma
--

CREATE TYPE public."TagType" AS ENUM (
    'STAGE',
    'TOPIC',
    'USER'
);


ALTER TYPE public."TagType" OWNER TO prisma;

--
-- Name: body_text(jsonb); Type: FUNCTION; Schema: public; Owner: prisma
--

CREATE FUNCTION public.body_text(content jsonb) RETURNS text
    LANGUAGE sql
    AS $$
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
$$;


ALTER FUNCTION public.body_text(content jsonb) OWNER TO prisma;

--
-- Name: body_vector(bigint); Type: FUNCTION; Schema: public; Owner: prisma
--

CREATE FUNCTION public.body_vector(page_id bigint) RETURNS tsvector
    LANGUAGE sql
    AS $$
    SELECT to_tsvector(body_text(p.content)) AS tsvec
    FROM "Page" p WHERE p.id = page_id;
$$;


ALTER FUNCTION public.body_vector(page_id bigint) OWNER TO prisma;

--
-- Name: create_page_search_index(bigint); Type: FUNCTION; Schema: public; Owner: prisma
--

CREATE FUNCTION public.create_page_search_index(page_id bigint) RETURNS void
    LANGUAGE plpgsql
    AS $$
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
$$;


ALTER FUNCTION public.create_page_search_index(page_id bigint) OWNER TO prisma;

--
-- Name: create_search_vector(bigint); Type: FUNCTION; Schema: public; Owner: prisma
--

CREATE FUNCTION public.create_search_vector(page_id bigint) RETURNS tsvector
    LANGUAGE sql
    AS $$
	SELECT 
		setweight(title_vector(page_id), 'A') ||
		setweight(tag_vector(page_id), 'B') ||
		setweight(body_vector(page_id), 'C')
$$;


ALTER FUNCTION public.create_search_vector(page_id bigint) OWNER TO prisma;

--
-- Name: page_title(bigint); Type: FUNCTION; Schema: public; Owner: prisma
--

CREATE FUNCTION public.page_title(page_id bigint) RETURNS text
    LANGUAGE sql
    AS $$
    SELECT
        case when max(cs.name) IS NOT NULL THEN max(cs.name) || ' - ' || max(p.title) ELSE max(p.title) END AS title
    FROM "Page" p
    LEFT JOIN "CaseStudy" cs ON cs."pageId" = id
    WHERE p.id = page_id;
$$;


ALTER FUNCTION public.page_title(page_id bigint) OWNER TO prisma;

--
-- Name: search_pages(text); Type: FUNCTION; Schema: public; Owner: prisma
--

CREATE FUNCTION public.search_pages(search_text text) RETURNS TABLE(id integer, highlights text, rank double precision)
    LANGUAGE sql
    AS $$
    SELECT 
        s."pageId" AS id,
        ts_headline(s.title, query) AS highlights,
        ts_rank_cd(s.vector, query) AS rank
    FROM "Search" s, websearch_to_tsquery(search_text) AS query
    WHERE s.vector @@ query
$$;


ALTER FUNCTION public.search_pages(search_text text) OWNER TO prisma;

--
-- Name: tag_highlights(text); Type: FUNCTION; Schema: public; Owner: prisma
--

CREATE FUNCTION public.tag_highlights(search_text text) RETURNS TABLE("tagId" integer, highlight text)
    LANGUAGE sql
    AS $$
    SELECT
        tag.id,
        ts_headline(tag.value, query)
    FROM "Tag" tag, websearch_to_tsquery(search_text) AS query
$$;


ALTER FUNCTION public.tag_highlights(search_text text) OWNER TO prisma;

--
-- Name: tag_vector(bigint); Type: FUNCTION; Schema: public; Owner: prisma
--

CREATE FUNCTION public.tag_vector(page_id bigint) RETURNS tsvector
    LANGUAGE sql
    AS $$
	SELECT to_tsvector(COALESCE(string_agg(tag.value, ' '), ''))
    FROM "Page" p
    LEFT JOIN "TagsOnPages" top ON top."pageId" = p.id
    LEFT JOIN "Tag" tag ON top."tagId"  = tag.id
    WHERE p.id = page_id
$$;


ALTER FUNCTION public.tag_vector(page_id bigint) OWNER TO prisma;

--
-- Name: title_vector(bigint); Type: FUNCTION; Schema: public; Owner: prisma
--

CREATE FUNCTION public.title_vector(page_id bigint) RETURNS tsvector
    LANGUAGE sql
    AS $$
    SELECT to_tsvector(page_title(page_id)) AS title
$$;


ALTER FUNCTION public.title_vector(page_id bigint) OWNER TO prisma;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: Author; Type: TABLE; Schema: public; Owner: prisma
--

CREATE TABLE public."Author" (
    id integer NOT NULL,
    name text NOT NULL,
    bio text,
    img text
);


ALTER TABLE public."Author" OWNER TO prisma;

--
-- Name: Author_id_seq; Type: SEQUENCE; Schema: public; Owner: prisma
--

CREATE SEQUENCE public."Author_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."Author_id_seq" OWNER TO prisma;

--
-- Name: Author_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: prisma
--

ALTER SEQUENCE public."Author_id_seq" OWNED BY public."Author".id;


--
-- Name: CaseStudy; Type: TABLE; Schema: public; Owner: prisma
--

CREATE TABLE public."CaseStudy" (
    name text NOT NULL,
    established integer,
    size double precision,
    governance text NOT NULL,
    staff text NOT NULL,
    budget text NOT NULL,
    "budgetLevel" text NOT NULL,
    lat double precision,
    long double precision,
    milestones jsonb NOT NULL,
    "pageId" integer NOT NULL,
    "keyLearnings" jsonb DEFAULT '[]'::jsonb NOT NULL
);


ALTER TABLE public."CaseStudy" OWNER TO prisma;

--
-- Name: Chapter; Type: TABLE; Schema: public; Owner: prisma
--

CREATE TABLE public."Chapter" (
    summary text NOT NULL,
    "pageId" integer NOT NULL,
    "keyTakeaways" text[]
);


ALTER TABLE public."Chapter" OWNER TO prisma;

--
-- Name: KeyValue; Type: TABLE; Schema: public; Owner: prisma
--

CREATE TABLE public."KeyValue" (
    key text NOT NULL,
    value jsonb NOT NULL
);


ALTER TABLE public."KeyValue" OWNER TO prisma;

--
-- Name: Page; Type: TABLE; Schema: public; Owner: prisma
--

CREATE TABLE public."Page" (
    id integer NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "editedAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    title text NOT NULL,
    img text NOT NULL,
    content jsonb NOT NULL,
    draft boolean DEFAULT true NOT NULL,
    slug text NOT NULL,
    "readTime" integer NOT NULL
);


ALTER TABLE public."Page" OWNER TO prisma;

--
-- Name: Page_id_seq; Type: SEQUENCE; Schema: public; Owner: prisma
--

CREATE SEQUENCE public."Page_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."Page_id_seq" OWNER TO prisma;

--
-- Name: Page_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: prisma
--

ALTER SEQUENCE public."Page_id_seq" OWNED BY public."Page".id;


--
-- Name: Search; Type: TABLE; Schema: public; Owner: prisma
--

CREATE TABLE public."Search" (
    "pageId" integer NOT NULL,
    title text NOT NULL,
    "fullText" text NOT NULL,
    vector tsvector NOT NULL
);


ALTER TABLE public."Search" OWNER TO prisma;

--
-- Name: Session; Type: TABLE; Schema: public; Owner: prisma
--

CREATE TABLE public."Session" (
    id text NOT NULL,
    "userId" integer NOT NULL,
    expires timestamp with time zone NOT NULL
);


ALTER TABLE public."Session" OWNER TO prisma;

--
-- Name: Tag; Type: TABLE; Schema: public; Owner: prisma
--

CREATE TABLE public."Tag" (
    id integer NOT NULL,
    value text NOT NULL,
    type public."TagType" NOT NULL
);


ALTER TABLE public."Tag" OWNER TO prisma;

--
-- Name: Tag_id_seq; Type: SEQUENCE; Schema: public; Owner: prisma
--

CREATE SEQUENCE public."Tag_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."Tag_id_seq" OWNER TO prisma;

--
-- Name: Tag_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: prisma
--

ALTER SEQUENCE public."Tag_id_seq" OWNED BY public."Tag".id;


--
-- Name: TagsOnPages; Type: TABLE; Schema: public; Owner: prisma
--

CREATE TABLE public."TagsOnPages" (
    category public."TagCategory" DEFAULT 'PRIMARY'::public."TagCategory" NOT NULL,
    "pageId" integer NOT NULL,
    "tagId" integer NOT NULL
);


ALTER TABLE public."TagsOnPages" OWNER TO prisma;

--
-- Name: User; Type: TABLE; Schema: public; Owner: prisma
--

CREATE TABLE public."User" (
    email text,
    name text,
    "googleId" text,
    id integer NOT NULL,
    role public."Role" DEFAULT 'USER'::public."Role" NOT NULL
);


ALTER TABLE public."User" OWNER TO prisma;

--
-- Name: User_id_seq; Type: SEQUENCE; Schema: public; Owner: prisma
--

CREATE SEQUENCE public."User_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."User_id_seq" OWNER TO prisma;

--
-- Name: User_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: prisma
--

ALTER SEQUENCE public."User_id_seq" OWNED BY public."User".id;


--
-- Name: _AuthorToChapter; Type: TABLE; Schema: public; Owner: prisma
--

CREATE TABLE public."_AuthorToChapter" (
    "A" integer NOT NULL,
    "B" integer NOT NULL
);


ALTER TABLE public."_AuthorToChapter" OWNER TO prisma;

--
-- Name: _prisma_migrations; Type: TABLE; Schema: public; Owner: prisma
--

CREATE TABLE public._prisma_migrations (
    id character varying(36) NOT NULL,
    checksum character varying(64) NOT NULL,
    finished_at timestamp with time zone,
    migration_name character varying(255) NOT NULL,
    logs text,
    rolled_back_at timestamp with time zone,
    started_at timestamp with time zone DEFAULT now() NOT NULL,
    applied_steps_count integer DEFAULT 0 NOT NULL
);


ALTER TABLE public._prisma_migrations OWNER TO prisma;

--
-- Name: Author id; Type: DEFAULT; Schema: public; Owner: prisma
--

ALTER TABLE ONLY public."Author" ALTER COLUMN id SET DEFAULT nextval('public."Author_id_seq"'::regclass);


--
-- Name: Page id; Type: DEFAULT; Schema: public; Owner: prisma
--

ALTER TABLE ONLY public."Page" ALTER COLUMN id SET DEFAULT nextval('public."Page_id_seq"'::regclass);


--
-- Name: Tag id; Type: DEFAULT; Schema: public; Owner: prisma
--

ALTER TABLE ONLY public."Tag" ALTER COLUMN id SET DEFAULT nextval('public."Tag_id_seq"'::regclass);


--
-- Name: User id; Type: DEFAULT; Schema: public; Owner: prisma
--

ALTER TABLE ONLY public."User" ALTER COLUMN id SET DEFAULT nextval('public."User_id_seq"'::regclass);


--
-- Data for Name: Author; Type: TABLE DATA; Schema: public; Owner: prisma
--

COPY public."Author" (id, name, bio, img) FROM stdin;
1	test author	\N	\N
\.


--
-- Data for Name: CaseStudy; Type: TABLE DATA; Schema: public; Owner: prisma
--

COPY public."CaseStudy" (name, established, size, governance, staff, budget, "budgetLevel", lat, long, milestones, "pageId", "keyLearnings") FROM stdin;
Test case study	\N	\N					-90	0	{}	4	[{"body": [""], "subject": ""}]
\.


--
-- Data for Name: Chapter; Type: TABLE DATA; Schema: public; Owner: prisma
--

COPY public."Chapter" (summary, "pageId", "keyTakeaways") FROM stdin;
some summary text	1	{}
	2	{}
A page to test the loading of all components	3	{}
\.


--
-- Data for Name: KeyValue; Type: TABLE DATA; Schema: public; Owner: prisma
--

COPY public."KeyValue" (key, value) FROM stdin;
\.


--
-- Data for Name: Page; Type: TABLE DATA; Schema: public; Owner: prisma
--

COPY public."Page" (id, "createdAt", "editedAt", title, img, content, draft, slug, "readTime") FROM stdin;
1	2022-12-22 18:55:38.621	2022-12-22 21:47:42.551	Chapter 1		{"type": "doc", "content": [{"type": "paragraph", "content": [{"text": "some body text", "type": "text"}]}]}	f	chapter-1	1
2	2022-12-22 21:48:04.635	2022-12-22 21:48:04.635	This is a draft chapter		{"type": "doc", "content": [{"type": "paragraph", "content": [{"text": "draft content", "type": "text"}]}]}	t	this-is-a-draft-chapter	1
3	2022-12-23 00:38:23.652	2022-12-23 00:53:47.512	Chapter with all components		{"type": "doc", "content": [{"type": "heading", "attrs": {"level": 1}, "content": [{"text": "Heading", "type": "text"}]}, {"type": "paragraph", "content": [{"text": "some text", "type": "text"}]}, {"type": "heading", "attrs": {"level": 2}, "content": [{"text": "Sub-heading", "type": "text"}]}, {"type": "paragraph", "content": [{"text": "some text", "type": "text"}]}, {"type": "heading", "attrs": {"level": 3}, "content": [{"text": "Sub-sub-heading", "type": "text"}]}, {"type": "paragraph", "content": [{"text": "some text", "type": "text"}]}, {"type": "cards", "attrs": {"cards": [{"body": "cards body 1", "heading": "Card heading 1"}, {"body": "card body 2", "heading": "Card heading 2"}], "style": "default"}}, {"type": "paragraph"}, {"type": "linkcards", "attrs": {"cards": [{"img": "images/74ea6ae9ba9daece.jpeg", "url": "https://disney.co.uk", "title": "Disney UK | The Official Home for All Things Disney"}, {"img": "images/b8c196f612a20fda.jpeg", "url": "https://www.theguardian.com", "title": "News, sport and opinion from the Guardian's US edition | The Guardian"}, {"img": "images/66b0467a36e590ad.jpeg", "url": "https://www.un.org", "title": "Welcome to the United Nations"}], "title": "Some links"}}, {"type": "paragraph"}, {"type": "diagram", "attrs": {"layers": [{"card": {"body": "This is the first layer", "heading": "Layer 1"}, "image": {"mobile": null, "desktop": null}}, {"card": {"body": "This is the second layer", "heading": "Layer 2"}, "image": {"mobile": null, "desktop": null}}], "caption": {"body": "Description", "title": "Caption"}, "baselayer": {"mobile": null, "desktop": null}, "resources": []}}, {"type": "paragraph"}, {"type": "paragraph"}, {"type": "image", "attrs": {"alt": "llama", "src": "images/a4e6657f1a3dbdb6.jpeg", "style": "regular", "credits": ""}}, {"type": "paragraph"}, {"type": "paragraph"}]}	f	chapter-with-all-components	1
4	2022-12-23 00:59:56.802	2022-12-23 01:00:44.879	Empty page for testing		{"type": "doc", "content": [{"type": "paragraph", "content": [{"text": "some body", "type": "text"}]}]}	f	test-case-study	1
\.


--
-- Data for Name: Search; Type: TABLE DATA; Schema: public; Owner: prisma
--

COPY public."Search" ("pageId", title, "fullText", vector) FROM stdin;
1	Chapter 1		'1':2A 'chapter':1A 'engag':9B 'identifi':3B 'meet':13B 'mpa':11B 'planner':12B 'problem':5B 'stakehold':10B 'system':8B 'tag':16B 'target':14B 'understand':6B
2	This is a draft chapter		'chapter':5A 'draft':4A
3	Chapter with all components		'chapter':1A 'communiti':17B 'compon':4A 'design':14B 'engag':8B 'goal':11B 'identifi':5B 'mpa':15B 'object':13B 'planner':16B 'practition':18B 'problem':7B 'set':10B 'stakehold':9B 'tag':20B
4	Test case study - Empty page for testing		'case':2A 'empti':4A 'page':5A 'studi':3A 'test':1A,7A
\.


--
-- Data for Name: Session; Type: TABLE DATA; Schema: public; Owner: prisma
--

COPY public."Session" (id, "userId", expires) FROM stdin;
admin-session	1	2050-01-01 00:00:00+00
cms-session	2	2050-01-01 00:00:00+00
user-session	3	2050-01-01 00:00:00+00
\.


--
-- Data for Name: Tag; Type: TABLE DATA; Schema: public; Owner: prisma
--

COPY public."Tag" (id, value, type) FROM stdin;
0	Identify the problem	STAGE
1	Understand your system	STAGE
2	Engage stakeholders	STAGE
3	Set goals and objectives	STAGE
4	Designing	STAGE
5	Implementation	STAGE
6	Future proofing and adaptation	STAGE
101	MPA planner	USER
102	MPA managers	USER
103	Community advocates	USER
104	Community practitioners	USER
105	Restoring areas	USER
106	Reducing user conflicts	USER
107	Meeting targets	USER
108	Promoting ecotourism	USER
109	I don't know	USER
110	Planning new MPAs	USER
111	Evaluating progress	USER
112	Enable decision-making	USER
113	Government	USER
114	Communities	USER
115	Private sector	USER
116	Civil society	USER
100	some tag	TOPIC
\.


--
-- Data for Name: TagsOnPages; Type: TABLE DATA; Schema: public; Owner: prisma
--

COPY public."TagsOnPages" (category, "pageId", "tagId") FROM stdin;
PRIMARY	1	0
PRIMARY	1	2
SECONDARY	1	1
PRIMARY	1	100
PRIMARY	1	101
PRIMARY	1	107
PRIMARY	3	0
PRIMARY	3	3
SECONDARY	3	2
SECONDARY	3	4
PRIMARY	3	100
PRIMARY	3	101
PRIMARY	3	104
\.


--
-- Data for Name: User; Type: TABLE DATA; Schema: public; Owner: prisma
--

COPY public."User" (email, name, "googleId", id, role) FROM stdin;
admin@example.com	Admin User	111111	1	ADMIN
cms@example.com	CMS User	222222	2	CONTENT_MANAGER
user@example.com	Regular User	333333	3	USER
\.


--
-- Data for Name: _AuthorToChapter; Type: TABLE DATA; Schema: public; Owner: prisma
--

COPY public."_AuthorToChapter" ("A", "B") FROM stdin;
1	1
1	3
\.


--
-- Data for Name: _prisma_migrations; Type: TABLE DATA; Schema: public; Owner: prisma
--

COPY public._prisma_migrations (id, checksum, finished_at, migration_name, logs, rolled_back_at, started_at, applied_steps_count) FROM stdin;
a01da5e1-d7ca-45b0-a6c0-b4a4e506b83f	1803795f01fcb64bbbaa79762c4610bf840596997311ee44c963ed00bcafbbd6	2022-12-22 18:43:33.047394+00	20220518231725_remove_casestudy_unique_name_constraint	\N	\N	2022-12-22 18:43:33.043155+00	1
c8190306-6ff8-4c86-9e4c-d1bd3391a3d0	2e3c26d0b712d1b68143d2db25119b9a1cf74159fff7ea7272978999a0f03f90	2022-12-22 18:43:32.926966+00	20220307122313_init	\N	\N	2022-12-22 18:43:32.917282+00	1
45f8bea3-9fcc-42b4-82fe-25213fdec24a	c3cc0df3e5d450f7c46aed14f713996ec4fc21467ba58b46978da8f050e6ee01	2022-12-22 18:43:32.938072+00	20220307122735_strid	\N	\N	2022-12-22 18:43:32.928876+00	1
11089ffb-035c-4101-81ea-a9c0fe117844	8fff344a3c733cfb891a2eed901e096c54251c09ee5cfa7ed75fd226053c7e66	2022-12-22 18:43:33.120599+00	20220820191642_keyvalues	\N	\N	2022-12-22 18:43:33.112685+00	1
4a0e0457-80e4-4ca8-a1d5-0d6b1bcc69c3	0e899ba3a3bb353c491083e36aac65e6086cbb6c47110f700780b94efe0a5d4f	2022-12-22 18:43:32.950267+00	20220307123150_googleid	\N	\N	2022-12-22 18:43:32.93986+00	1
7110a94e-8ef0-44a7-bbba-08adc8fb1582	ac2610aabd512730bd17f6222d4e5898ad2f15d6df0d9038c040b00a7d7e36e2	2022-12-22 18:43:33.053637+00	20220519152715_adding_read_time	\N	\N	2022-12-22 18:43:33.049079+00	1
6cbfdb87-2d2d-443c-b926-f550d58bab3c	6ab5d4ae79d92506cc3761ef7b3815bd82c6fb0f855db85aed45f2cb86e6fc22	2022-12-22 18:43:32.95831+00	20220307123215_googleidunique	\N	\N	2022-12-22 18:43:32.952046+00	1
1c190e34-1dfd-41b9-b4cf-826a825128e7	34e934e5356fe0e796ee8c5efb60ec944d1b93c1de7ad7a33751de35b036a3ed	2022-12-22 18:43:32.965076+00	20220307155218_roles	\N	\N	2022-12-22 18:43:32.960304+00	1
4d85069c-ab5c-49c9-b272-067bf0e82ac8	c46f14c602bc6956d8ff8184b45aa5f168c3c8d1c40ebbc0f2126f8245ed3324	2022-12-22 18:43:32.976935+00	20220308162825_pages	\N	\N	2022-12-22 18:43:32.966978+00	1
8aee4bd6-1a08-483e-84ab-831d522fbc9e	85c3529003bbe7629e852fe8776436d93f626e5fc1e169ad676670657d688349	2022-12-22 18:43:33.059823+00	20220603164300_tagautoincrement	\N	\N	2022-12-22 18:43:33.055396+00	1
815bc743-f498-4403-8d0b-b57a3e726849	5fdd04dfbf1a01a00d89759855a149332861da32d6198ff054d0c9fbb83fb8a1	2022-12-22 18:43:32.984383+00	20220308164310_pagedefaultimes	\N	\N	2022-12-22 18:43:32.97897+00	1
5e3f2af2-e959-4d69-bfed-5cce673f1426	7fbb386250c6ddb89753238e78e1a78b244e6e664c0bf2f5ce9f5d954019739e	2022-12-22 18:43:32.992382+00	20220309150126_slugs	\N	\N	2022-12-22 18:43:32.986426+00	1
a0b95e64-1790-4cdf-8a02-cdd643ce14b1	78138d20d09c3e934852519c06a76e5e8668929eb8d29718273fbda510ad62ff	2022-12-22 18:43:33.009127+00	20220408142508_casestudy_chapters	\N	\N	2022-12-22 18:43:32.993973+00	1
dfff0775-c774-4379-bacd-dd56c85f1e69	46bea1035b7bc4a3c718cf5ed13ac827584081f7478bcadecf6a6e340684d170	2022-12-22 18:43:33.069421+00	20220604100026_search	\N	\N	2022-12-22 18:43:33.061461+00	1
876f3783-cd68-444e-bac2-51e53b64cc7e	47c527956b1d17cd64c325cd53f1a6f57252ff2925605eb332e28b4ba99764f2	2022-12-22 18:43:33.015708+00	20220426171022_keytakeaways	\N	\N	2022-12-22 18:43:33.011103+00	1
02cf4f80-77f9-47fe-9adc-d411bd9da300	1c3f0502ca3162cc186371352f65887cccd15a934ac0fa80b60094ea5556f647	2022-12-22 18:43:33.028097+00	20220503185859_tags	\N	\N	2022-12-22 18:43:33.017128+00	1
8fe871be-9408-4315-aa8e-93fbbf183b0e	33486233601c5cf3646fb4c25873c847152e5b8b244d3e119604be406a037d76	2022-12-22 18:43:33.035307+00	20220506104254_userimg	\N	\N	2022-12-22 18:43:33.030358+00	1
184c7079-b5dd-483c-b73e-5ca92b2a06c1	46b390e232a26b5ce21cb3bed806eb44c5d43916fe0b4c81523625f892d8e92b	2022-12-22 18:43:33.077631+00	20220604111743_search_fns	\N	\N	2022-12-22 18:43:33.070961+00	1
26db58d2-3673-447b-bdc6-5fd45e3c3a9e	fb33cfca50f4f578b2e9ef6e0216d4f3dc704bb6d49452e48f7c321458f0e1a6	2022-12-22 18:43:33.041363+00	20220518230822_nullable_numbers	\N	\N	2022-12-22 18:43:33.036832+00	1
a4272a07-1051-4da7-93db-e067cb67de2d	804b8232c92814a70d5171c96e75ee968800252e1624ad86e325ee2ddaeb202d	2022-12-22 18:43:33.083654+00	20220705075933_email_nullable	\N	\N	2022-12-22 18:43:33.079347+00	1
9bcba7eb-3391-4d76-b3fa-e03a7095548c	067608d8c4eaee9f92df28215bf081706135238ceeee935c49bddbe4ae669c4a	2022-12-22 18:43:33.090023+00	20220706094509_key_learnings	\N	\N	2022-12-22 18:43:33.085341+00	1
04bacda4-0292-4ecb-baa6-61b35e226101	a416f054a34f479954966f696f11fdd7a6924c2c8333f67a01883b1b25bbf3a7	2022-12-22 18:43:33.102369+00	20220728152956_authors	\N	\N	2022-12-22 18:43:33.092135+00	1
fb7a8e9e-6bb1-40ee-8e52-8702bcfb394f	6d18f24d550c23ed5c8ef309c5fac2868d165ad4e4db58f27946c00538ca6d00	2022-12-22 18:43:33.110986+00	20220812152813_sessions	\N	\N	2022-12-22 18:43:33.103962+00	1
\.


--
-- Name: Author_id_seq; Type: SEQUENCE SET; Schema: public; Owner: prisma
--

SELECT pg_catalog.setval('public."Author_id_seq"', 1, true);


--
-- Name: Page_id_seq; Type: SEQUENCE SET; Schema: public; Owner: prisma
--

SELECT pg_catalog.setval('public."Page_id_seq"', 4, true);


--
-- Name: Tag_id_seq; Type: SEQUENCE SET; Schema: public; Owner: prisma
--

SELECT pg_catalog.setval('public."Tag_id_seq"', 116, true);


--
-- Name: User_id_seq; Type: SEQUENCE SET; Schema: public; Owner: prisma
--

SELECT pg_catalog.setval('public."User_id_seq"', 1, true);


--
-- Name: Author Author_pkey; Type: CONSTRAINT; Schema: public; Owner: prisma
--

ALTER TABLE ONLY public."Author"
    ADD CONSTRAINT "Author_pkey" PRIMARY KEY (id);


--
-- Name: CaseStudy CaseStudy_pkey; Type: CONSTRAINT; Schema: public; Owner: prisma
--

ALTER TABLE ONLY public."CaseStudy"
    ADD CONSTRAINT "CaseStudy_pkey" PRIMARY KEY ("pageId");


--
-- Name: Chapter Chapter_pkey; Type: CONSTRAINT; Schema: public; Owner: prisma
--

ALTER TABLE ONLY public."Chapter"
    ADD CONSTRAINT "Chapter_pkey" PRIMARY KEY ("pageId");


--
-- Name: KeyValue KeyValue_pkey; Type: CONSTRAINT; Schema: public; Owner: prisma
--

ALTER TABLE ONLY public."KeyValue"
    ADD CONSTRAINT "KeyValue_pkey" PRIMARY KEY (key);


--
-- Name: Page Page_pkey; Type: CONSTRAINT; Schema: public; Owner: prisma
--

ALTER TABLE ONLY public."Page"
    ADD CONSTRAINT "Page_pkey" PRIMARY KEY (id);


--
-- Name: Search Search_pkey; Type: CONSTRAINT; Schema: public; Owner: prisma
--

ALTER TABLE ONLY public."Search"
    ADD CONSTRAINT "Search_pkey" PRIMARY KEY ("pageId");


--
-- Name: Session Session_pkey; Type: CONSTRAINT; Schema: public; Owner: prisma
--

ALTER TABLE ONLY public."Session"
    ADD CONSTRAINT "Session_pkey" PRIMARY KEY (id);


--
-- Name: Tag Tag_pkey; Type: CONSTRAINT; Schema: public; Owner: prisma
--

ALTER TABLE ONLY public."Tag"
    ADD CONSTRAINT "Tag_pkey" PRIMARY KEY (id);


--
-- Name: TagsOnPages TagsOnPages_pkey; Type: CONSTRAINT; Schema: public; Owner: prisma
--

ALTER TABLE ONLY public."TagsOnPages"
    ADD CONSTRAINT "TagsOnPages_pkey" PRIMARY KEY ("tagId", "pageId");


--
-- Name: User User_pkey; Type: CONSTRAINT; Schema: public; Owner: prisma
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_pkey" PRIMARY KEY (id);


--
-- Name: _prisma_migrations _prisma_migrations_pkey; Type: CONSTRAINT; Schema: public; Owner: prisma
--

ALTER TABLE ONLY public._prisma_migrations
    ADD CONSTRAINT _prisma_migrations_pkey PRIMARY KEY (id);


--
-- Name: Author_name_key; Type: INDEX; Schema: public; Owner: prisma
--

CREATE UNIQUE INDEX "Author_name_key" ON public."Author" USING btree (name);


--
-- Name: Page_slug_key; Type: INDEX; Schema: public; Owner: prisma
--

CREATE UNIQUE INDEX "Page_slug_key" ON public."Page" USING btree (slug);


--
-- Name: Tag_value_type_key; Type: INDEX; Schema: public; Owner: prisma
--

CREATE UNIQUE INDEX "Tag_value_type_key" ON public."Tag" USING btree (value, type);


--
-- Name: User_email_key; Type: INDEX; Schema: public; Owner: prisma
--

CREATE UNIQUE INDEX "User_email_key" ON public."User" USING btree (email);


--
-- Name: User_googleId_key; Type: INDEX; Schema: public; Owner: prisma
--

CREATE UNIQUE INDEX "User_googleId_key" ON public."User" USING btree ("googleId");


--
-- Name: _AuthorToChapter_AB_unique; Type: INDEX; Schema: public; Owner: prisma
--

CREATE UNIQUE INDEX "_AuthorToChapter_AB_unique" ON public."_AuthorToChapter" USING btree ("A", "B");


--
-- Name: _AuthorToChapter_B_index; Type: INDEX; Schema: public; Owner: prisma
--

CREATE INDEX "_AuthorToChapter_B_index" ON public."_AuthorToChapter" USING btree ("B");


--
-- Name: CaseStudy CaseStudy_pageId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: prisma
--

ALTER TABLE ONLY public."CaseStudy"
    ADD CONSTRAINT "CaseStudy_pageId_fkey" FOREIGN KEY ("pageId") REFERENCES public."Page"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Chapter Chapter_pageId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: prisma
--

ALTER TABLE ONLY public."Chapter"
    ADD CONSTRAINT "Chapter_pageId_fkey" FOREIGN KEY ("pageId") REFERENCES public."Page"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Search Search_pageId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: prisma
--

ALTER TABLE ONLY public."Search"
    ADD CONSTRAINT "Search_pageId_fkey" FOREIGN KEY ("pageId") REFERENCES public."Page"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Session Session_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: prisma
--

ALTER TABLE ONLY public."Session"
    ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: TagsOnPages TagsOnPages_pageId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: prisma
--

ALTER TABLE ONLY public."TagsOnPages"
    ADD CONSTRAINT "TagsOnPages_pageId_fkey" FOREIGN KEY ("pageId") REFERENCES public."Page"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: TagsOnPages TagsOnPages_tagId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: prisma
--

ALTER TABLE ONLY public."TagsOnPages"
    ADD CONSTRAINT "TagsOnPages_tagId_fkey" FOREIGN KEY ("tagId") REFERENCES public."Tag"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: _AuthorToChapter _AuthorToChapter_A_fkey; Type: FK CONSTRAINT; Schema: public; Owner: prisma
--

ALTER TABLE ONLY public."_AuthorToChapter"
    ADD CONSTRAINT "_AuthorToChapter_A_fkey" FOREIGN KEY ("A") REFERENCES public."Author"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: _AuthorToChapter _AuthorToChapter_B_fkey; Type: FK CONSTRAINT; Schema: public; Owner: prisma
--

ALTER TABLE ONLY public."_AuthorToChapter"
    ADD CONSTRAINT "_AuthorToChapter_B_fkey" FOREIGN KEY ("B") REFERENCES public."Chapter"("pageId") ON UPDATE CASCADE ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

