--
-- PostgreSQL database dump
--

SET statement_timeout = 0;
SET lock_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SET check_function_bodies = false;
SET client_min_messages = warning;

--
-- Name: plpgsql; Type: EXTENSION; Schema: -; Owner: 
--

CREATE EXTENSION IF NOT EXISTS plpgsql WITH SCHEMA pg_catalog;


--
-- Name: EXTENSION plpgsql; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION plpgsql IS 'PL/pgSQL procedural language';


SET search_path = public, pg_catalog;

SET default_tablespace = '';

SET default_with_oids = false;

--
-- Name: characters; Type: TABLE; Schema: public; Owner: sage; Tablespace: 
--

CREATE TABLE characters (
    id integer NOT NULL,
    name character varying(64) NOT NULL,
    school character varying(32) NOT NULL,
    x_coord integer NOT NULL,
    y_coord integer NOT NULL,
    user_id integer NOT NULL,
    world_id integer NOT NULL,
    account_name character varying(64)
);


ALTER TABLE public.characters OWNER TO sage;

--
-- Name: characters_id_seq; Type: SEQUENCE; Schema: public; Owner: sage
--

CREATE SEQUENCE characters_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.characters_id_seq OWNER TO sage;

--
-- Name: characters_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: sage
--

ALTER SEQUENCE characters_id_seq OWNED BY characters.id;


--
-- Name: chunks; Type: TABLE; Schema: public; Owner: sage; Tablespace: 
--

CREATE TABLE chunks (
    id integer NOT NULL,
    world_id integer NOT NULL,
    chunk integer[] NOT NULL,
    coords character varying(64) NOT NULL
);


ALTER TABLE public.chunks OWNER TO sage;

--
-- Name: maps_id_seq; Type: SEQUENCE; Schema: public; Owner: sage
--

CREATE SEQUENCE maps_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.maps_id_seq OWNER TO sage;

--
-- Name: maps_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: sage
--

ALTER SEQUENCE maps_id_seq OWNED BY chunks.id;


--
-- Name: users; Type: TABLE; Schema: public; Owner: sage; Tablespace: 
--

CREATE TABLE users (
    id integer NOT NULL,
    email character varying(64) NOT NULL,
    password character varying(64) NOT NULL,
    world_id integer,
    current_chunk character varying(32),
    apples integer
);


ALTER TABLE public.users OWNER TO sage;

--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: sage
--

CREATE SEQUENCE users_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.users_id_seq OWNER TO sage;

--
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: sage
--

ALTER SEQUENCE users_id_seq OWNED BY users.id;


--
-- Name: worlds; Type: TABLE; Schema: public; Owner: sage; Tablespace: 
--

CREATE TABLE worlds (
    id integer NOT NULL
);


ALTER TABLE public.worlds OWNER TO sage;

--
-- Name: worlds_id_seq; Type: SEQUENCE; Schema: public; Owner: sage
--

CREATE SEQUENCE worlds_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.worlds_id_seq OWNER TO sage;

--
-- Name: worlds_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: sage
--

ALTER SEQUENCE worlds_id_seq OWNED BY worlds.id;


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: sage
--

ALTER TABLE ONLY characters ALTER COLUMN id SET DEFAULT nextval('characters_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: sage
--

ALTER TABLE ONLY chunks ALTER COLUMN id SET DEFAULT nextval('maps_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: sage
--

ALTER TABLE ONLY users ALTER COLUMN id SET DEFAULT nextval('users_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: sage
--

ALTER TABLE ONLY worlds ALTER COLUMN id SET DEFAULT nextval('worlds_id_seq'::regclass);


--
-- Name: characters_pkey; Type: CONSTRAINT; Schema: public; Owner: sage; Tablespace: 
--

ALTER TABLE ONLY characters
    ADD CONSTRAINT characters_pkey PRIMARY KEY (id);


--
-- Name: maps_pkey; Type: CONSTRAINT; Schema: public; Owner: sage; Tablespace: 
--

ALTER TABLE ONLY chunks
    ADD CONSTRAINT maps_pkey PRIMARY KEY (id);


--
-- Name: users_pkey; Type: CONSTRAINT; Schema: public; Owner: sage; Tablespace: 
--

ALTER TABLE ONLY users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: worlds_pkey; Type: CONSTRAINT; Schema: public; Owner: sage; Tablespace: 
--

ALTER TABLE ONLY worlds
    ADD CONSTRAINT worlds_pkey PRIMARY KEY (id);


--
-- Name: public; Type: ACL; Schema: -; Owner: postgres
--

REVOKE ALL ON SCHEMA public FROM PUBLIC;
REVOKE ALL ON SCHEMA public FROM postgres;
GRANT ALL ON SCHEMA public TO postgres;
GRANT ALL ON SCHEMA public TO PUBLIC;


--
-- PostgreSQL database dump complete
--

