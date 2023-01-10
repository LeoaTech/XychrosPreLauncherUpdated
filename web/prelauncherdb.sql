--
-- PostgreSQL database dump
--

-- Dumped from database version 12.4
-- Dumped by pg_dump version 12.4

-- Started on 2022-12-13 09:20:28

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
-- TOC entry 212 (class 1255 OID 51349)
-- Name: findreferrals(character varying, character, integer); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.findreferrals(a character varying, b character, c integer) RETURNS record
    LANGUAGE plpgsql
    AS $$
DECLARE
ret RECORD;
code TEXT;
cr INTEGER;
BEGIN
SELECT referral_code INTO code FROM referrals where email = a;
IF (code IS NOT NULL) THEN
SELECT referrer_id, count(*) INTO ret FROM referrals WHERE referrer_id = code GROUP BY referrer_id;
ELSE
INSERT INTO referrals (email, referrer_id, campaign_id) VALUES (a, b, c) RETURNING referral_code, 0 INTO ret;
END IF;
RETURN ret;
END;
$$;


ALTER FUNCTION public.findreferrals(a character varying, b character, c integer) OWNER TO postgres;

--
-- TOC entry 210 (class 1255 OID 51306)
-- Name: gen_random_bytes(integer); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.gen_random_bytes(integer) RETURNS bytea
    LANGUAGE c STRICT
    AS '$libdir/pgcrypto', 'pg_random_bytes';


ALTER FUNCTION public.gen_random_bytes(integer) OWNER TO postgres;

--
-- TOC entry 211 (class 1255 OID 51307)
-- Name: random_string(integer); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.random_string(len integer) RETURNS text
    LANGUAGE plpgsql
    AS $_$
declare
  chars text[] = '{0,1,2,3,4,5,6,7,8,9,A,B,C,D,E,F,G,H,I,J,K,L,M,N,O,P,Q,R,S,T,U,V,W,X,Y,Z,a,b,c,d,e,f,g,h,i,j,k,l,m,n,o,p,q,r,s,t,u,v,w,x,y,z}';
  result text = '';
  i int = 0;
  rand bytea;
begin
  -- generate secure random bytes and convert them to a string of chars.
  rand = gen_random_bytes($1);
  for i in 0..len-1 loop
    -- rand indexing is zero-based, chars is 1-based.
    result = result || chars[1 + (get_byte(rand, i) % array_length(chars, 1))];
  end loop;
  return result;
end;
$_$;


ALTER FUNCTION public.random_string(len integer) OWNER TO postgres;

--
-- TOC entry 209 (class 1255 OID 51305)
-- Name: unique_random(integer, text, text); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.unique_random(len integer, _table text, _col text) RETURNS text
    LANGUAGE plpgsql
    AS $$
declare
  result text;
  numrows int;
begin
  result = random_string(len);
  loop
    execute format('select 1 from %I where %I = %L', _table, _col, result);
    get diagnostics numrows = row_count;
    if numrows = 0 then
      return result; 
    end if;
    result = random_string(len);
  end loop;
end;
$$;


ALTER FUNCTION public.unique_random(len integer, _table text, _col text) OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 205 (class 1259 OID 43134)
-- Name: campaign_details; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.campaign_details (
    campaign_id integer NOT NULL,
    tier integer,
    count integer NOT NULL,
    prize_name character varying(255) NOT NULL,
    prize_link character varying(255) NOT NULL,
    image_link character varying(255) NOT NULL
);


ALTER TABLE public.campaign_details OWNER TO postgres;

--
-- TOC entry 207 (class 1259 OID 51293)
-- Name: campaign_shopify_details; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.campaign_shopify_details (
    campaign_id integer,
    first_page_link character varying(255),
    second_page_link character varying(255)
);


ALTER TABLE public.campaign_shopify_details OWNER TO postgres;

--
-- TOC entry 204 (class 1259 OID 43120)
-- Name: campaigns; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.campaigns (
    campaign_id integer NOT NULL,
    shop_id character varying(255) NOT NULL,
    campaign_name character varying(255) NOT NULL,
    product_name character varying(255) NOT NULL,
    product_link character varying(255) NOT NULL,
    created_at timestamp without time zone NOT NULL,
    start_date timestamp without time zone NOT NULL,
    end_date timestamp without time zone NOT NULL
);


ALTER TABLE public.campaigns OWNER TO postgres;

--
-- TOC entry 203 (class 1259 OID 43118)
-- Name: campaigns_campaign_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.campaigns_campaign_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.campaigns_campaign_id_seq OWNER TO postgres;

--
-- TOC entry 2858 (class 0 OID 0)
-- Dependencies: 203
-- Name: campaigns_campaign_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.campaigns_campaign_id_seq OWNED BY public.campaigns.campaign_id;


--
-- TOC entry 206 (class 1259 OID 43153)
-- Name: ip_addresses; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.ip_addresses (
    address character varying(255),
    count integer NOT NULL,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL
);


ALTER TABLE public.ip_addresses OWNER TO postgres;

--
-- TOC entry 208 (class 1259 OID 51335)
-- Name: referrals; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.referrals (
    referral_code character(8) DEFAULT public.unique_random(8, 'referrals'::text, 'referral_code'::text) NOT NULL,
    email character varying(255) NOT NULL,
    referrer_id character(8),
    created_at timestamp without time zone,
    campaign_id integer
);


ALTER TABLE public.referrals OWNER TO postgres;

--
-- TOC entry 202 (class 1259 OID 34922)
-- Name: shopify_sessions; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.shopify_sessions (
    id character varying(255) NOT NULL,
    shop character varying(255) NOT NULL,
    state character varying(255) NOT NULL,
    isonline boolean NOT NULL,
    expires integer,
    scope character varying(255),
    accesstoken character varying(255),
    onlineaccessinfo character varying(255)
);


ALTER TABLE public.shopify_sessions OWNER TO postgres;

--
-- TOC entry 2715 (class 2604 OID 43123)
-- Name: campaigns campaign_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.campaigns ALTER COLUMN campaign_id SET DEFAULT nextval('public.campaigns_campaign_id_seq'::regclass);


--
-- TOC entry 2720 (class 2606 OID 43128)
-- Name: campaigns campaigns_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.campaigns
    ADD CONSTRAINT campaigns_pkey PRIMARY KEY (campaign_id);


--
-- TOC entry 2722 (class 2606 OID 51340)
-- Name: referrals referrals_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.referrals
    ADD CONSTRAINT referrals_pkey PRIMARY KEY (referral_code);


--
-- TOC entry 2718 (class 2606 OID 34929)
-- Name: shopify_sessions shopify_sessions_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.shopify_sessions
    ADD CONSTRAINT shopify_sessions_pkey PRIMARY KEY (id);


--
-- TOC entry 2724 (class 2606 OID 43140)
-- Name: campaign_details campaign_details_campaign_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.campaign_details
    ADD CONSTRAINT campaign_details_campaign_id_fkey FOREIGN KEY (campaign_id) REFERENCES public.campaigns(campaign_id);


--
-- TOC entry 2725 (class 2606 OID 51299)
-- Name: campaign_shopify_details campaign_id_shopify; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.campaign_shopify_details
    ADD CONSTRAINT campaign_id_shopify FOREIGN KEY (campaign_id) REFERENCES public.campaigns(campaign_id);


--
-- TOC entry 2723 (class 2606 OID 43129)
-- Name: campaigns campaigns_shop_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.campaigns
    ADD CONSTRAINT campaigns_shop_id_fkey FOREIGN KEY (shop_id) REFERENCES public.shopify_sessions(id);


--
-- TOC entry 2726 (class 2606 OID 51341)
-- Name: referrals referrals_campaign_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.referrals
    ADD CONSTRAINT referrals_campaign_id_fkey FOREIGN KEY (campaign_id) REFERENCES public.campaigns(campaign_id);


-- Completed on 2022-12-13 09:20:28

--
-- PostgreSQL database dump complete
--

