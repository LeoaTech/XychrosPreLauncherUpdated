--
-- PostgreSQL database dump
--

-- Dumped from database version 12.4
-- Dumped by pg_dump version 12.4

set transaction read write;

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
-- Name: add_delete_global_settings(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.add_delete_global_settings() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
    BEGIN
        --
        -- Create a row in emp_audit to reflect the operation performed on emp,
        -- making use of the special variable TG_OP to work out the operation.
        --
        IF (TG_OP = 'DELETE') THEN
            DELETE FROM global_settings WHERE shop_id = OLD.shop;
        ELSIF (TG_OP = 'INSERT') THEN
			INSERT INTO global_settings (shop_id, facebook_link, instagram_link, discord_link, snapchat_link, tiktok_link, twitter_link, 
										 show_discord_link, show_facebook_link, show_instagram_link, show_snapchat_link, show_tiktok_link, show_twitter_link, collect_phone, 
										 share_discord_message, share_discord_referral, share_email_message, share_email_referral, share_facebook_message, share_facebook_referral, 
										 share_instagram_message, share_instagram_referral, share_snapchat_message, share_snapchat_referral, share_tiktok_message, share_tiktok_referral, 
										 share_twitter_message, share_twitter_referral, share_whatsapp_message, share_whatsapp_referral, 
										 discount_type, reward_1_code, reward_1_discount, reward_1_tier, reward_2_code, reward_2_discount, reward_2_tier,
										 double_opt_in, double_opt_in_email, referral_email, reward_email, welcome_email, klaviyo_integration)
			SELECT NEW.shop , facebook_link, instagram_link, discord_link, snapchat_link, tiktok_link, twitter_link, 
										 show_discord_link, show_facebook_link, show_instagram_link, show_snapchat_link, show_tiktok_link, show_twitter_link, collect_phone, 
										 share_discord_message, share_discord_referral, share_email_message, share_email_referral, share_facebook_message, share_facebook_referral, 
										 share_instagram_message, share_instagram_referral, share_snapchat_message, share_snapchat_referral, share_tiktok_message, share_tiktok_referral, 
										 share_twitter_message, share_twitter_referral, share_whatsapp_message, share_whatsapp_referral, 
										 discount_type, reward_1_code, reward_1_discount, reward_1_tier, reward_2_code, reward_2_discount, reward_2_tier,
										 double_opt_in, double_opt_in_email, referral_email, reward_email, welcome_email, klaviyo_integration From global_settings where id=1;
        END IF;
        RETURN NULL; -- result is ignored since this is an AFTER trigger
    END;
$$;


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
SELECT referral_code INTO code FROM referrals where email = a and campaign_id = c;
IF (code IS NOT NULL) THEN
SELECT code, COALESCE(count(*),0) FROM referrals WHERE referrer_id = code INTO ret;
END IF;
RETURN ret;
END;
$$;


--
-- Name: gen_random_bytes(integer); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.gen_random_bytes(integer) RETURNS bytea
    LANGUAGE sql
    SET search_path TO 'pg_catalog'
    AS $_$
    SELECT decode(string_agg(lpad(to_hex(width_bucket(random(), 0, 1, 256)-1),2,'0') ,''), 'hex')
    FROM generate_series(1, $1);
$_$;


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


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: campaign_settings; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.campaign_settings (
    campaign_id integer NOT NULL,
    collect_phone boolean,
    discord_link text,
    double_opt_in boolean,
    double_opt_in_email text,
    end_date timestamp with time zone NOT NULL,
    facebook_link text,
    instagram_link text,
    klaviyo_integration boolean,
    klaviyo_list_id text,
    name character varying NOT NULL,
    product text NOT NULL,
    referral_email text,
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
    reward_email text,
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
    shop_id character varying NOT NULL,
    show_discord_link boolean,
    show_facebook_link boolean,
    show_instagram_link boolean,
    show_snapchat_link boolean,
    show_tiktok_link boolean,
    show_twitter_link boolean,
    snapchat_link text,
    start_date timestamp with time zone NOT NULL,
    tiktok_link text,
    twitter_link text,
    welcome_email text,
    template_id integer NOT NULL,
    discount_type character varying NOT NULL,
    is_deleted boolean DEFAULT false NOT NULL
);


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
    count_ip integer,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone NOT NULL,
    id integer NOT NULL,
    campaign_id integer NOT NULL
);


--
-- Name: ip_addresses_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.ip_addresses ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.ip_addresses_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: pricing_plans; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.pricing_plans (
    id integer NOT NULL,
    plan_name text NOT NULL,
    price numeric(10,2) NOT NULL,
    features jsonb,
    billing_required boolean,
    currency_code text NOT NULL
);


--
-- Name: pricing_plans_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.pricing_plans_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;




--
-- Name: pricing_plans_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.pricing_plans_id_seq OWNED BY public.pricing_plans.id;


--
-- Name: referrals; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.referrals (
    referral_code character(8) DEFAULT public.unique_random(8, 'referrals'::text, 'referral_code'::text) NOT NULL,
    email character varying(255) NOT NULL,
    referrer_id character(8),
    created_at timestamp with time zone DEFAULT now(),
    campaign_id integer,
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




--
-- Name: subscriptions_list; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.subscriptions_list (
    id integer NOT NULL,
    plan_name text NOT NULL,
    price numeric(10,2) NOT NULL,
    subscription_id text NOT NULL,
    status text NOT NULL,
    created_at date NOT NULL,
    shop_id text NOT NULL,
    billing_required boolean
);



ALTER TABLE  public.subscriptions_list ADD COLUMN "collecting_phones" BOOLEAN NOT NULL DEFAULT FALSE;



--
-- Name: subscriptions_list_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.subscriptions_list_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;




--
-- Name: subscriptions_list_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.subscriptions_list_id_seq OWNED BY public.subscriptions_list.id;


--
-- Name: template_landing_page; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.template_landing_page (
    id integer NOT NULL,
    template_name character varying NOT NULL,
    show_header_footer boolean NOT NULL,
    background_image text,
    base_text_size smallint,
    header_text text,
    pre_header_text text,
    tag_line_text text,
    button_text text,
    email_placeholder_text text,
    second_page text,
    main_color character varying(9),
    accent_color character varying(9),
    text_position text,
    input_position text,
    divider character varying,
    background_overlay text,
    phone_placeholder_text text
);




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
    show_header_footer boolean,
    background_image text,
    base_text_size smallint,
    pre_header_text text,
    header_text text,
    sub_header_text text,
    first_page text NOT NULL,
    rewards_image text NOT NULL,
    main_color character varying(9),
    accent_color character varying(9),
    referral_position text,
    reward_position text,
    divider character varying,
    template_name character varying,
    background_overlay text
);




--
-- Name: template_rewards_page_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.template_rewards_page ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.template_rewards_page_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 2
);


--
-- Name: templates; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.templates (
    id integer NOT NULL,
    landing_template_id integer NOT NULL,
    rewards_template_id integer NOT NULL,
    campaign_image text,
    image_url text
);




--
-- Name: templates_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.templates ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.templates_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 2
);


--
-- Name: user_details; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.user_details (
    id integer NOT NULL,
    username text,
    email text,
    store_url text NOT NULL,
    billing_id integer NOT NULL
);




--
-- Name: user_details_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.user_details ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.user_details_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 2
);


--
-- Name: pricing_plans id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pricing_plans ALTER COLUMN id SET DEFAULT nextval('public.pricing_plans_id_seq'::regclass);


--
-- Name: subscriptions_list id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.subscriptions_list ALTER COLUMN id SET DEFAULT nextval('public.subscriptions_list_id_seq'::regclass);


--
-- Data for Name: campaign_settings; Type: TABLE DATA; Schema: public; Owner: postgres
--


--
-- Data for Name: global_settings; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.global_settings OVERRIDING SYSTEM VALUE VALUES (1, 'default', 'https://www.facebook.com/', 'https://www.instgram.com/', 'https://www.discord.com/server', 'https://www.snapchat.com/', 'https://www.tiktok.com/', 'https://www.twitter.com/', true, true, true, true, true, true, false, 'Use my Referral', true, 'Use my Referral', true, 'Use my Referral', true, 'Use my Referral', true, 'Use my Referral', true, 'Use my Referral', true, 'Use my Referral', true, 'Use my Referral', true, 'percent', '05OFF', 5, 5, '10OFF', 10, 10, NULL, NULL, NULL, NULL, NULL, NULL, false, '', 'Hi,

Congratulations!! A new referral has signed up at {campaign_name}. You can now invite more friends and family to join you in collecting more rewards and points by using {referral_link}.

So far, {referral_count} friends have joined using your referral link. 

We are excited to have you on board!

{shop_name}', 'Hi there,

Congratulations!! You have unlocked a Reward Tier at {campaign_name}. You can invite more friends and family to join you in collecting more rewards and points by using {referral_link}.

So far, {referral_count} friends have joined using your referral link. You can redeem your points by using the discount code {discount_code} at checkout. 

We are super excited to see you winning!!

{shop_name}', 'Hi,

Thank you for subscribing to {campaign_name}. You can now invite your friends and family to join you in collecting more rewards and points by using {referral_link}.

We are excited to have you on board!

{shop_name}', false, NULL, NULL);

--
-- Data for Name: ip_addresses; Type: TABLE DATA; Schema: public; Owner: postgres
--
--
-- Data for Name: pricing_plans; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.pricing_plans VALUES (1, 'Free', 0.00, '{"feature1": "1 Active Campaign Created", "feature2": "50 Emails Collected", "feature3": "Anti Fraud"}', false, 'USD');
INSERT INTO public.pricing_plans VALUES (2, 'Tier 1', 4.99, '{"feature1": "2 Active Campaign Created", "feature2": "150 Emails Collected", "feature3": "Anti Fraud", "feature4": "Double Opt In", "feature5": "Klaviyo Integration", "feature6": "Custom Landing Pages"}', false, 'USD');
INSERT INTO public.pricing_plans VALUES (3, 'Tier 2', 8.99, '{"feature1": "Unlimited Active Campaigns Created", "feature2": "450 Emails Collected", "feature3": "Anti Fraud", "feature4": "Double Opt In", "feature5": "Klaviyo Integration", "feature6": "Custom Landing Pages"}', false, 'USD');
INSERT INTO public.pricing_plans VALUES (4, 'Tier 3', 19.99, '{"feature1": "Unlimited Active Campaigns Created", "feature2": "975 Emails Collected", "feature3": "Anti Fraud", "feature4": "Double Opt In", "feature5": "Klaviyo Integration", "feature6": "Custom Landing Pages"}', false, 'USD');
INSERT INTO public.pricing_plans VALUES (5, 'Tier 4', 34.99, '{"feature1": "Unlimited Active Campaigns Created", "feature2": "1500 Emails Collected", "feature3": "Anti Fraud", "feature4": "Double Opt In", "feature5": "Klaviyo Integration", "feature6": "Custom Landing Pages"}', false, 'USD');
INSERT INTO public.pricing_plans VALUES (6, 'Tier 5', 59.99, '{"feature1": "Unlimited Active Campaigns Created", "feature2": "2000 Emails Collected", "feature3": "Anti Fraud", "feature4": "Double Opt In", "feature5": "Klaviyo Integration", "feature6": "Custom Landing Pages"}', false, 'USD');
INSERT INTO public.pricing_plans VALUES (7, 'Tier 6', 111.99, '{"feature1": "Unlimited Active Campaigns Created", "feature2": "3500 Emails Collected", "feature3": "Anti Fraud", "feature4": "Double Opt In", "feature5": "Klaviyo Integration", "feature6": "Custom Landing Pages"}', false, 'USD');
INSERT INTO public.pricing_plans VALUES (8, 'Tier 7', 159.99, '{"feature1": "Unlimited Active Campaigns Created", "feature2": "5000 Emails Collected", "feature3": "Anti Fraud", "feature4": "Double Opt In", "feature5": "Klaviyo Integration", "feature6": "Custom Landing Pages"}', false, 'USD');
INSERT INTO public.pricing_plans VALUES (9, 'Tier 8', 255.99, '{"feature1": "Unlimited Active Campaigns Created", "feature2": "6500+ Emails Collected", "feature3": "Anti Fraud", "feature4": "Double Opt In", "feature5": "Klaviyo Integration", "feature6": "Custom Landing Pages"}', false, 'USD');
INSERT INTO public.pricing_plans VALUES (10, 'Free', 0.00, '{"feature1": "1 Active Campaign Created", "feature2": "50 Emails Collected", "feature3": "Anti Fraud"}', false, 'USD');
INSERT INTO public.pricing_plans VALUES (11, 'Tier 1', 4.99, '{"feature1": "2 Active Campaign Created", "feature2": "150 Emails Collected", "feature3": "Anti Fraud", "feature4": "Double Opt In", "feature5": "Klaviyo Integration", "feature6": "Custom Landing Pages"}', false, 'USD');
INSERT INTO public.pricing_plans VALUES (12, 'Tier 2', 8.99, '{"feature1": "Unlimited Active Campaigns Created", "feature2": "450 Emails Collected", "feature3": "Anti Fraud", "feature4": "Double Opt In", "feature5": "Klaviyo Integration", "feature6": "Custom Landing Pages"}', false, 'USD');
INSERT INTO public.pricing_plans VALUES (13, 'Tier 3', 19.99, '{"feature1": "Unlimited Active Campaigns Created", "feature2": "975 Emails Collected", "feature3": "Anti Fraud", "feature4": "Double Opt In", "feature5": "Klaviyo Integration", "feature6": "Custom Landing Pages"}', false, 'USD');
INSERT INTO public.pricing_plans VALUES (14, 'Tier 4', 34.99, '{"feature1": "Unlimited Active Campaigns Created", "feature2": "1500 Emails Collected", "feature3": "Anti Fraud", "feature4": "Double Opt In", "feature5": "Klaviyo Integration", "feature6": "Custom Landing Pages"}', false, 'USD');
INSERT INTO public.pricing_plans VALUES (15, 'Tier 5', 59.99, '{"feature1": "Unlimited Active Campaigns Created", "feature2": "2000 Emails Collected", "feature3": "Anti Fraud", "feature4": "Double Opt In", "feature5": "Klaviyo Integration", "feature6": "Custom Landing Pages"}', false, 'USD');
INSERT INTO public.pricing_plans VALUES (16, 'Tier 6', 111.99, '{"feature1": "Unlimited Active Campaigns Created", "feature2": "3500 Emails Collected", "feature3": "Anti Fraud", "feature4": "Double Opt In", "feature5": "Klaviyo Integration", "feature6": "Custom Landing Pages"}', false, 'USD');
INSERT INTO public.pricing_plans VALUES (17, 'Tier 7', 159.99, '{"feature1": "Unlimited Active Campaigns Created", "feature2": "5000 Emails Collected", "feature3": "Anti Fraud", "feature4": "Double Opt In", "feature5": "Klaviyo Integration", "feature6": "Custom Landing Pages"}', false, 'USD');
INSERT INTO public.pricing_plans VALUES (18, 'Tier 8', 255.99, '{"feature1": "Unlimited Active Campaigns Created", "feature2": "6500+ Emails Collected", "feature3": "Anti Fraud", "feature4": "Double Opt In", "feature5": "Klaviyo Integration", "feature6": "Custom Landing Pages"}', false, 'USD');


--
-- Data for Name: referrals; Type: TABLE DATA; Schema: public; Owner: postgres
--
--
-- Data for Name: shopify_sessions; Type: TABLE DATA; Schema: public; Owner: postgres
--


--
-- Data for Name: subscriptions_list; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: template_landing_page; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.template_landing_page OVERRIDING SYSTEM VALUE VALUES (6, 'Jewelry', false, 'jewelry2', 64, 'Get Classy With Us', NULL, NULL, 'Let me in First!', 'Email', 'second-page', '000000', 'ffffff', NULL, NULL, 'none-vertical', 'linear-gradient(rgba(0, 0, 0, 0), rgba(0,0,0, 0) )', 'Phone Number');
INSERT INTO public.template_landing_page OVERRIDING SYSTEM VALUE VALUES (7, 'Basic2', false, NULL, 14, 'This is header', 'This is preheader', 'This is tagline', 'Enter', 'Enter Email', 'second-page', '000000', 'ffffff', NULL, NULL, 'horizontal', 'linear-gradient(rgba(0, 0, 0, 0), rgba(0,0,0, 0) )', NULL);
INSERT INTO public.template_landing_page OVERRIDING SYSTEM VALUE VALUES (8, 'Basic3', false, NULL, 14, 'This is header', 'This is preheader', 'This is tagline', 'Enter', 'Enter Email', 'second-page', '000000', 'ffffff', NULL, NULL, 'vertical', 'linear-gradient(rgba(0, 0, 0, 0), rgba(0,0,0, 0) )', NULL);
INSERT INTO public.template_landing_page OVERRIDING SYSTEM VALUE VALUES (1, 'Basic', false, NULL, 14, 'Enter Header Text', 'Enter PreHeader Text', 'Enter Your Business TagLine', 'Enter', 'Enter Email', 'second-page', '000000', 'FFFFFF', NULL, NULL, 'none-horizontal', 'linear-gradient(rgba(0, 0, 0, 0), rgba(0,0,0, 0) )', NULL);
INSERT INTO public.template_landing_page OVERRIDING SYSTEM VALUE VALUES (2, 'Food', false, 'food', 64, 'Your Health Regime Starts Soon', 'The Wait is About to End', NULL, 'Tell Me First', 'Email', 'second-page', '000000', 'ffffff', NULL, NULL, 'none-horizontal', 'linear-gradient(rgba(0, 0, 0, 0.3), rgba(0,0,0, 0.3) )', 'Number');
INSERT INTO public.template_landing_page OVERRIDING SYSTEM VALUE VALUES (3, 'Food2', false, 'food', 64, 'Your Health Regime Starts Soon', 'The Wait is About to End', NULL, 'Tell Me First', 'Email', 'second-page', '127636', 'ffffff', NULL, NULL, 'none-horizontal', 'linear-gradient(rgba(0, 0, 0, 0.3), rgba(0,0,0, 0.3) )', 'Number');
INSERT INTO public.template_landing_page OVERRIDING SYSTEM VALUE VALUES (4, 'Nature', false, 'nature2', 64, 'Designing the Future', NULL, NULL, 'Take me too!', 'Email', 'second-page', 'ffffff', '000000', NULL, NULL, 'none-horizontal', 'linear-gradient(rgba(0, 0, 0, 0), rgba(0,0,0, 0) )', 'Phone Number');
INSERT INTO public.template_landing_page OVERRIDING SYSTEM VALUE VALUES (5, 'Clothing', false, 'clothing', 64, 'Sign Up to Rediscover Yourself', NULL, NULL, 'I am in!', 'Your Email', 'second-page', '000000', 'ffffff', NULL, NULL, 'diagonal', 'linear-gradient(rgba(0, 0, 0, 0), rgba(0,0,0, 0) )', NULL);


--
-- Data for Name: template_rewards_page; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.template_rewards_page OVERRIDING SYSTEM VALUE VALUES (5, false, 'clothing', 64, NULL, 'Rediscover Yourself', 'Share your unique link via email, Facebook or Twitter and earn goodies for each friend who signs up!', 'first-page', 'icon-6', '000000', 'ffffff', NULL, NULL, 'horizontal', 'Clothing', 'linear-gradient(rgba(0, 0, 0, 0), rgba(0,0,0, 0) )');
INSERT INTO public.template_rewards_page OVERRIDING SYSTEM VALUE VALUES (6, false, 'jewelry2', 64, NULL, 'Your Store', 'Share your unique link via email, Facebook or Twitter and earn goodies for each friend who signs up!', 'first-page', 'image-6', '000000', 'ffffff', NULL, NULL, 'none-vertical', 'Jewelry', 'linear-gradient(rgba(0, 0, 0, 0), rgba(0,0,0, 0) )');
INSERT INTO public.template_rewards_page OVERRIDING SYSTEM VALUE VALUES (7, false, NULL, 14, 'This is Preheader Text', 'This is Header Text', 'This is Sub Header Text', 'first-page', 'icon-3', '000000', 'ffffff', NULL, NULL, 'horizontal', 'Basic2', 'linear-gradient(rgba(0, 0, 0, 0), rgba(0,0,0, 0) )');
INSERT INTO public.template_rewards_page OVERRIDING SYSTEM VALUE VALUES (8, false, NULL, 14, 'This is Preheader Text', 'This is Header Text', 'This is Sub Header Text', 'first-page', 'icon-3', '000000', 'ffffff', NULL, NULL, 'vertical', 'Basic3', 'linear-gradient(rgba(0, 0, 0, 0), rgba(0,0,0, 0) )');
INSERT INTO public.template_rewards_page OVERRIDING SYSTEM VALUE VALUES (1, false, NULL, 12, NULL, NULL, NULL, 'first-page', 'image-1', '000000', 'ffffff', NULL, NULL, 'none-horizontal', 'Basic', 'linear-gradient(rgba(0, 0, 0, 0), rgba(0,0,0, 0) )');
INSERT INTO public.template_rewards_page OVERRIDING SYSTEM VALUE VALUES (2, false, 'food', 64, NULL, 'Your Product', 'Share your unique link via email, Facebook or Twitter and earn goodies for each friend who signs up!', 'first-page', 'icon-7', '000000', 'ffffff', NULL, NULL, 'none-horizontal', 'Food', 'linear-gradient(rgba(0, 0, 0, .3), rgba(0,0,0, .3) )');
INSERT INTO public.template_rewards_page OVERRIDING SYSTEM VALUE VALUES (3, false, 'food', 64, NULL, 'Your Product', 'Share your unique link via email, Facebook or Twitter and earn goodies for each friend who signs up!', 'first-page', 'icon-7', '127636', 'ffffff', NULL, NULL, 'none-horizontal', 'Food2', 'linear-gradient(rgba(0, 0, 0, .3), rgba(0,0,0, .3) )');
INSERT INTO public.template_rewards_page OVERRIDING SYSTEM VALUE VALUES (4, false, 'nature2', 64, NULL, 'Your Product', 'Share your unique link via email, Facebook or Twitter and earn goodies for each friend who signs up!', 'first-page', 'image-7', 'ffffff', '000000', NULL, NULL, 'none-horizontal', 'Nature', 'linear-gradient(rgba(0, 0, 0, 0), rgba(0,0,0, 0) )');


--
-- Data for Name: templates; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.templates OVERRIDING SYSTEM VALUE VALUES (1, 1, 1, NULL, NULL);
INSERT INTO public.templates OVERRIDING SYSTEM VALUE VALUES (7, 7, 7, NULL, NULL);
INSERT INTO public.templates OVERRIDING SYSTEM VALUE VALUES (8, 8, 8, NULL, NULL);
INSERT INTO public.templates OVERRIDING SYSTEM VALUE VALUES (2, 2, 2, 'WelcomeFood.png', 'https://res.cloudinary.com/djcitu2qx/image/upload/v1682573884/food_c7n8f4.jpg');
INSERT INTO public.templates OVERRIDING SYSTEM VALUE VALUES (3, 3, 3, 'WelcomeFood2.png', 'https://res.cloudinary.com/djcitu2qx/image/upload/v1682573884/food_c7n8f4.jpg');
INSERT INTO public.templates OVERRIDING SYSTEM VALUE VALUES (4, 4, 4, 'WelcomeNature.png', 'https://res.cloudinary.com/djcitu2qx/image/upload/v1682573882/nature2_pg8wxv.png');
INSERT INTO public.templates OVERRIDING SYSTEM VALUE VALUES (5, 5, 5, 'WelcomeClothing.png', 'https://res.cloudinary.com/djcitu2qx/image/upload/v1682573964/clothing_ai8jiv.jpg');
INSERT INTO public.templates OVERRIDING SYSTEM VALUE VALUES (6, 6, 6, 'WelcomeJewelry.png', 'https://res.cloudinary.com/djcitu2qx/image/upload/v1682573882/jewelry2_jfpdp7.png');


--
-- Data for Name: user_details; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Name: campaign_settings_campaign_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.campaign_settings_campaign_id_seq', 1, true);


--
-- Name: global_settings_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.global_settings_id_seq', 2, true);


--
-- Name: ip_addresses_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.ip_addresses_id_seq', 1, true);


--
-- Name: pricing_plans_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.pricing_plans_id_seq', 18, true);


--
-- Name: subscriptions_list_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.subscriptions_list_id_seq', 1, false);


--
-- Name: template_landing_page_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.template_landing_page_id_seq', 8, true);


--
-- Name: template_rewards_page_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.template_rewards_page_id_seq', 9, true);


--
-- Name: templates_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.templates_id_seq', 9, true);


--
-- Name: user_details_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.user_details_id_seq', 1, false);


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
-- Name: pricing_plans pricing_plans_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pricing_plans
    ADD CONSTRAINT pricing_plans_pkey PRIMARY KEY (id);


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
-- Name: subscriptions_list subscriptions_list_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.subscriptions_list
    ADD CONSTRAINT subscriptions_list_pkey PRIMARY KEY (id);


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
-- Name: shopify_sessions a_d_global_settings; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER a_d_global_settings AFTER INSERT OR DELETE ON public.shopify_sessions FOR EACH ROW EXECUTE FUNCTION public.add_delete_global_settings();


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

