--
-- PostgreSQL database dump
--

-- Dumped from database version 12.4
-- Dumped by pg_dump version 12.4

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

DROP DATABASE prelauncher;
--
-- Name: prelauncher; Type: DATABASE; Schema: -; Owner: postgres
--

CREATE DATABASE prelauncher WITH TEMPLATE = template0 ENCODING = 'UTF8' LC_COLLATE = 'English_United States.1252' LC_CTYPE = 'English_United States.1252';


ALTER DATABASE prelauncher OWNER TO postgres;

\connect prelauncher

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
-- Name: gen_random_bytes(integer); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.gen_random_bytes(integer) RETURNS bytea
    LANGUAGE c STRICT
    AS '$libdir/pgcrypto', 'pg_random_bytes';


ALTER FUNCTION public.gen_random_bytes(integer) OWNER TO postgres;

--
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
-- Name: campaign_settings; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.campaign_settings (
    campaign_id integer NOT NULL,
    shop_id character varying NOT NULL,    
    name character varying NOT NULL,
    product text NOT NULL,
    start_date timestamp with time zone NOT NULL,    
    end_date timestamp with time zone NOT NULL,
    collect_phone boolean,
    show_discord_link boolean,
    discord_link text,
    show_facebook_link boolean,
    facebook_link text,
    show_instagram_link boolean,
    instagram_link text,
    show_snapchat_link boolean,
    snapchat_link text,
    show_tiktok_link boolean,
    tiktok_link text,    
    show_twitter_link boolean,
    twitter_link text,
    share_discord_message text,
    share_discord_referral boolean,
    share_email_message text,
    share_email_referral boolean,
    share_facebook_message text,
    share_facebook_referral boolean,
    share_instagram_message text,
    share_instagram_referral boolean,
    share_snapchat_message text,
    share_snapchat_referral boolean,
    share_tiktok_message text,
    share_tiktok_referral boolean,
    share_twitter_message text,
    share_twitter_referral boolean,
    share_whatsapp_message text,
    share_whatsapp_referral boolean,
    discount_type character varying NOT NULL,
    reward_1_code text NOT NULL,
    reward_1_discount smallint NOT NULL,
    reward_1_tier smallint NOT NULL,
    reward_2_code text NOT NULL,
    reward_2_discount smallint NOT NULL,
    reward_2_tier smallint NOT NULL,
    reward_3_code text,
    reward_3_discount smallint,
    reward_3_tier smallint,
    reward_4_code text,
    reward_4_discount smallint,
    reward_4_tier smallint,
    double_opt_in boolean,
    double_opt_in_email text,    
    klaviyo_integration boolean,
    klaviyo_list_id text,
    referral_email text,    
    reward_email text,    
    welcome_email text,
    template_id integer NOT NULL    
);


ALTER TABLE public.campaign_settings OWNER TO postgres;

--
-- Name: campaign_settings_campaign_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.campaign_settings ALTER COLUMN campaign_id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.campaign_settings_campaign_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: global_settings; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.global_settings (
    id integer NOT NULL,
    shop_id character varying NOT NULL,
    facebook_link text,
    instagram_link text,
    discord_link text,
    snapchat_link text,
    tiktok_link text,
    twitter_link text,
    show_discord_link boolean,
    show_facebook_link boolean,
    show_instagram_link boolean,
    show_snapchat_link boolean,
    show_tiktok_link boolean,
    show_twitter_link boolean,
    collect_phone boolean,
    share_discord_message text,
    share_discord_referral boolean,
    share_email_message text,
    share_email_referral boolean,
    share_facebook_message text,
    share_facebook_referral boolean,
    share_instagram_message text,
    share_instagram_referral boolean,
    share_snapchat_message text,
    share_snapchat_referral boolean,
    share_tiktok_message text,
    share_tiktok_referral boolean,
    share_twitter_message text,
    share_twitter_referral boolean,
    share_whatsapp_message text,
    share_whatsapp_referral boolean,
    discount_type character varying NOT NULL,
    reward_1_code text NOT NULL,
    reward_1_discount smallint NOT NULL,
    reward_1_tier smallint NOT NULL,
    reward_2_code text NOT NULL,
    reward_2_discount smallint NOT NULL,
    reward_2_tier smallint NOT NULL,
    reward_3_code text,
    reward_3_discount smallint,
    reward_3_tier smallint,
    reward_4_code text,
    reward_4_discount smallint,
    reward_4_tier smallint,
    double_opt_in boolean,
    double_opt_in_email text,
    referral_email text,
    reward_email text,
    welcome_email text,
    klaviyo_integration boolean,
    klaviyo_api_key text,
    templates text
);


ALTER TABLE public.global_settings OWNER TO postgres;

--
-- Name: global_settings_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.global_settings ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.global_settings_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: ip_addresses; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.ip_addresses (
    address character varying(255) NOT NULL,
    count integer,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL,
    id integer NOT NULL,
    campaign_id integer NOT NULL
);


ALTER TABLE public.ip_addresses OWNER TO postgres;

--
-- Name: referrals; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.referrals (
    referral_code character(8) DEFAULT public.unique_random(8, 'referrals'::text, 'referral_code'::text) NOT NULL,
    email character varying(255) NOT NULL,
    referrer_id character(8),
    created_at timestamp without time zone,
    campaign_id integer,
    reward_tier integer,
    reward_code_1_used boolean,
    reward_code_1 text,
    reward_code_2_used boolean,
    reward_code_2 text,
    reward_code_3 text,
    reward_code_3_used boolean,
    reward_code_4_used boolean,
    reward_code_4 text,
    revenue numeric
);


ALTER TABLE public.referrals OWNER TO postgres;

--
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
-- Name: template_landing_page; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.template_landing_page (
    id integer NOT NULL,
    campaign_name character varying NOT NULL,
    product_link text NOT NULL,
    show_header_footer boolean NOT NULL,
    background_image text,
    background_opacity numeric(2,1)[],
    base_text_size smallint,
    header_text text,
    pre_header_text text,
    tag_line_text text,
    button_text text,
    email_placeholder_text text,
    second_page text,
    main_color character varying(9)[],
    accent_color character varying(9)[],
    text_position character varying(9)[],
    input_position character varying(9)[]
);


ALTER TABLE public.template_landing_page OWNER TO postgres;

--
-- Name: template_landing_page_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.template_landing_page ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.template_landing_page_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: template_rewards_page; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.template_rewards_page (
    id integer NOT NULL,
    main_color character varying(9)[],
    accent_color character varying(9)[],
    show_header_footer boolean,
    background_image text,
    background_opacity numeric(2,1)[],
    base_text_size smallint,
    pre_header_text text,
    header_text text,
    sub_header_text text,
    first_page text NOT NULL,
    rewards_image text NOT NULL,
    referral_section character varying(9)[] NOT NULL,
    rewards_section character varying(9)[] NOT NULL
);


ALTER TABLE public.template_rewards_page OWNER TO postgres;

--
-- Name: templates; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.templates (
    id integer NOT NULL,
    landing_template_id integer NOT NULL,
    rewards_template_id integer NOT NULL
);


ALTER TABLE public.templates OWNER TO postgres;

--
-- Name: templates_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.templates ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.templates_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Data for Name: campaign_settings; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.campaign_settings (campaign_id, collect_phone, discord_link, double_opt_in, double_opt_in_email, end_date, facebook_link, instagram_link, klaviyo_integration, klaviyo_list_id, name, product, referral_email, reward_1_code, reward_1_discount, reward_1_tier, reward_2_code, reward_2_discount, reward_2_tier, reward_3_code, reward_3_discount, reward_3_tier, reward_4_code, reward_4_discount, reward_4_tier, reward_email, share_discord_message, share_discord_referral, share_email_message, share_email_referral, share_facebook_message, share_facebook_referral, share_instagram_message, share_instagram_referral, share_snapchat_message, share_snapchat_referral, share_tiktok_message, share_tiktok_referral, share_twitter_message, share_twitter_referral, share_whatsapp_message, share_whatsapp_referral, shop_id, show_discord_link, show_facebook_link, show_instagram_link, show_snapchat_link, show_tiktok_link, show_twitter_link, snapchat_link, start_date, tiktok_link, twitter_link, welcome_email, template_id, discount_type) FROM stdin;
\.


--
-- Data for Name: global_settings; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.global_settings (id, shop_id, facebook_link, instagram_link, discord_link, snapchat_link, tiktok_link, twitter_link, show_discord_link, show_facebook_link, show_instagram_link, show_snapchat_link, show_tiktok_link, show_twitter_link, collect_phone, share_discord_message, share_discord_referral, share_email_message, share_email_referral, share_facebook_message, share_facebook_referral, share_instagram_message, share_instagram_referral, share_snapchat_message, share_snapchat_referral, share_tiktok_message, share_tiktok_referral, share_twitter_message, share_twitter_referral, share_whatsapp_message, share_whatsapp_referral, discount_type, reward_1_code, reward_1_discount, reward_1_tier, reward_2_code, reward_2_discount, reward_2_tier, reward_3_code, reward_3_discount, reward_3_tier, reward_4_code, reward_4_discount, reward_4_tier, double_opt_in, double_opt_in_email, referral_email, reward_email, welcome_email, klaviyo_integration, klaviyo_api_key, templates) FROM stdin;
\.


--
-- Data for Name: ip_addresses; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.ip_addresses (address, count, created_at, updated_at, id, campaign_id) FROM stdin;
\.


--
-- Data for Name: referrals; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.referrals (referral_code, email, referrer_id, created_at, campaign_id, reward_tier, reward_code_1_used, reward_code_1, reward_code_2_used, reward_code_2, reward_code_3, reward_code_3_used, reward_code_4_used, reward_code_4, revenue) FROM stdin;
d5ItPXbX	sughra.mehdi@gmail.com	abcdef12	\N	1	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
9qjf4wjy	something@gmail.com	abcdef01	\N	1	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
aDpDVgXj	sughra@gmail.com	d5ItPXbX	\N	1	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
\.


--
-- Data for Name: shopify_sessions; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.shopify_sessions (id, shop, state, isonline, expires, scope, accesstoken, onlineaccessinfo) FROM stdin;
offline_munch-fit-uk.myshopify.com	munch-fit-uk.myshopify.com	offline_693306731481567	f	\N	write_products	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	\N
offline_musafirat.myshopify.com	musafirat.myshopify.com	offline_858101671521210	f	\N	read_orders,read_products,write_content,write_themes	shpua_43c8b5f8176d002fe654862ed2d0b5ee	\N
offline_leoaxychros.myshopify.com	leoaxychros.myshopify.com	offline_387141865025516	f	\N	read_orders,read_products,write_content,write_themes	shpua_8bfb4b963f3f3a918cf57e37cb01cac5	\N
\.


--
-- Data for Name: template_landing_page; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.template_landing_page (id, campaign_name, product_link, show_header_footer, background_image, background_opacity, base_text_size, header_text, pre_header_text, tag_line_text, button_text, email_placeholder_text, second_page, main_color, accent_color, text_position, input_position) FROM stdin;
\.


--
-- Data for Name: template_rewards_page; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.template_rewards_page (id, main_color, accent_color, show_header_footer, background_image, background_opacity, base_text_size, pre_header_text, header_text, sub_header_text, first_page, rewards_image, referral_section, rewards_section) FROM stdin;
\.


--
-- Data for Name: templates; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.templates (id, landing_template_id, rewards_template_id) FROM stdin;
\.


--
-- Name: campaign_settings_campaign_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.campaign_settings_campaign_id_seq', 1, false);


--
-- Name: global_settings_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.global_settings_id_seq', 1, false);


--
-- Name: template_landing_page_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.template_landing_page_id_seq', 1, false);


--
-- Name: templates_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.templates_id_seq', 1, false);


--
-- Name: campaign_settings campaign_settings_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.campaign_settings
    ADD CONSTRAINT campaign_settings_pkey PRIMARY KEY (campaign_id);


--
-- Name: global_settings global_settings_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.global_settings
    ADD CONSTRAINT global_settings_pkey PRIMARY KEY (id);


--
-- Name: ip_addresses ip_addresses_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.ip_addresses
    ADD CONSTRAINT ip_addresses_pkey PRIMARY KEY (id);


--
-- Name: referrals referrals_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.referrals
    ADD CONSTRAINT referrals_pkey PRIMARY KEY (referral_code);


--
-- Name: shopify_sessions shopify_sessions_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.shopify_sessions
    ADD CONSTRAINT shopify_sessions_pkey PRIMARY KEY (id);


--
-- Name: template_landing_page template_landing_page_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.template_landing_page
    ADD CONSTRAINT template_landing_page_pkey PRIMARY KEY (id);


--
-- Name: template_rewards_page template_rewards_page_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.template_rewards_page
    ADD CONSTRAINT template_rewards_page_pkey PRIMARY KEY (id);


--
-- Name: templates templates_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.templates
    ADD CONSTRAINT templates_pkey PRIMARY KEY (id);


--
-- Name: ip_addresses campaign_id; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.ip_addresses
    ADD CONSTRAINT campaign_id FOREIGN KEY (campaign_id) REFERENCES public.campaign_settings(campaign_id) NOT VALID;


--
-- Name: referrals campaignid; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.referrals
    ADD CONSTRAINT campaignid FOREIGN KEY (campaign_id) REFERENCES public.campaign_settings(campaign_id) NOT VALID;


--
-- Name: templates landing_template; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.templates
    ADD CONSTRAINT landing_template FOREIGN KEY (landing_template_id) REFERENCES public.template_landing_page(id) NOT VALID;


--
-- Name: templates rewards_template; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.templates
    ADD CONSTRAINT rewards_template FOREIGN KEY (rewards_template_id) REFERENCES public.template_rewards_page(id) NOT VALID;


--
-- PostgreSQL database dump complete
--

