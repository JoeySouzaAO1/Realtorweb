

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


CREATE EXTENSION IF NOT EXISTS "pgsodium";






COMMENT ON SCHEMA "public" IS 'standard public schema';



CREATE EXTENSION IF NOT EXISTS "pg_graphql" WITH SCHEMA "graphql";






CREATE EXTENSION IF NOT EXISTS "pg_stat_statements" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "pgcrypto" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "pgjwt" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "supabase_vault" WITH SCHEMA "vault";






CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA "extensions";






CREATE TYPE "public"."subscription_status" AS ENUM (
    'trial',
    'active',
    'suspended',
    'cancelled'
);


ALTER TYPE "public"."subscription_status" OWNER TO "postgres";


CREATE TYPE "public"."website_theme" AS ENUM (
    'modern',
    'classic',
    'minimal',
    'luxury',
    'bold'
);


ALTER TYPE "public"."website_theme" OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."update_updated_at_column"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."update_updated_at_column"() OWNER TO "postgres";

SET default_tablespace = '';

SET default_table_access_method = "heap";


CREATE TABLE IF NOT EXISTS "public"."realtor_profile" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"(),
    "email" character varying(255) NOT NULL,
    "email_confirmed_at" timestamp with time zone,
    "last_sign_in_at" timestamp with time zone,
    "account_status" character varying(50) DEFAULT 'pending'::character varying,
    "first_name" character varying(255) NOT NULL,
    "last_name" character varying(255) NOT NULL,
    "phone" character varying(20),
    "profile_image_url" "text",
    "company_name" character varying(255) NOT NULL,
    "license_number" character varying(100),
    "years_of_experience" integer,
    "specialties" "text"[],
    "service_areas" "text"[],
    "bio" "text",
    "website_domain" character varying(255),
    "company_logo_url" "text",
    "brand_colors" "jsonb" DEFAULT '{"accent": null, "primary": null, "secondary": null}'::"jsonb",
    "social_media_links" "jsonb" DEFAULT '{}'::"jsonb",
    "contact_phone" character varying(20),
    "office_address" "jsonb" DEFAULT '{"zip": null, "city": null, "state": null, "street": null, "country": null}'::"jsonb",
    "featured_listings_limit" integer DEFAULT 10,
    "subscription_status" "public"."subscription_status" DEFAULT 'trial'::"public"."subscription_status",
    "website_theme" "public"."website_theme" DEFAULT 'modern'::"public"."website_theme",
    "website_settings" "jsonb" DEFAULT '{"show_listings": true, "show_social_media": true, "show_testimonials": true, "contact_form_enabled": true}'::"jsonb",
    CONSTRAINT "realtor_profile_account_status_check" CHECK ((("account_status")::"text" = ANY ((ARRAY['pending'::character varying, 'active'::character varying, 'suspended'::character varying])::"text"[]))),
    CONSTRAINT "valid_email" CHECK ((("email")::"text" ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'::"text")),
    CONSTRAINT "valid_phone" CHECK ((("contact_phone")::"text" ~ '^\+?[0-9\-\(\)\s]+$'::"text"))
);


ALTER TABLE "public"."realtor_profile" OWNER TO "postgres";


COMMENT ON TABLE "public"."realtor_profile" IS 'Stores professional information and website settings for realtors';



COMMENT ON COLUMN "public"."realtor_profile"."company_name" IS 'Name of the realtor''s company or business';



COMMENT ON COLUMN "public"."realtor_profile"."brand_colors" IS 'JSON object containing primary, secondary, and accent color codes';



COMMENT ON COLUMN "public"."realtor_profile"."social_media_links" IS 'JSON object containing social media platform links';



COMMENT ON COLUMN "public"."realtor_profile"."office_address" IS 'JSON object containing detailed address information';



ALTER TABLE ONLY "public"."realtor_profile"
    ADD CONSTRAINT "realtor_profile_email_key" UNIQUE ("email");



ALTER TABLE ONLY "public"."realtor_profile"
    ADD CONSTRAINT "realtor_profile_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."realtor_profile"
    ADD CONSTRAINT "realtor_profile_website_domain_key" UNIQUE ("website_domain");



CREATE INDEX "idx_realtor_profile_company_name" ON "public"."realtor_profile" USING "btree" ("company_name");



CREATE INDEX "idx_realtor_profile_website_domain" ON "public"."realtor_profile" USING "btree" ("website_domain");



CREATE OR REPLACE TRIGGER "update_realtor_profile_updated_at" BEFORE UPDATE ON "public"."realtor_profile" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE POLICY "Only super admin can create realtor profiles" ON "public"."realtor_profile" FOR INSERT WITH CHECK ((("auth"."jwt"() ->> 'email'::"text") = 'souzajoey@gmail.com'::"text"));



CREATE POLICY "Only super admin can delete realtor profiles" ON "public"."realtor_profile" FOR DELETE USING ((("auth"."jwt"() ->> 'email'::"text") = 'souzajoey@gmail.com'::"text"));



CREATE POLICY "Realtor profiles are viewable by everyone" ON "public"."realtor_profile" FOR SELECT USING (true);



ALTER TABLE "public"."realtor_profile" ENABLE ROW LEVEL SECURITY;




ALTER PUBLICATION "supabase_realtime" OWNER TO "postgres";


GRANT USAGE ON SCHEMA "public" TO "postgres";
GRANT USAGE ON SCHEMA "public" TO "anon";
GRANT USAGE ON SCHEMA "public" TO "authenticated";
GRANT USAGE ON SCHEMA "public" TO "service_role";




















































































































































































GRANT ALL ON FUNCTION "public"."update_updated_at_column"() TO "anon";
GRANT ALL ON FUNCTION "public"."update_updated_at_column"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."update_updated_at_column"() TO "service_role";


















GRANT ALL ON TABLE "public"."realtor_profile" TO "anon";
GRANT ALL ON TABLE "public"."realtor_profile" TO "authenticated";
GRANT ALL ON TABLE "public"."realtor_profile" TO "service_role";



ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "service_role";






























RESET ALL;