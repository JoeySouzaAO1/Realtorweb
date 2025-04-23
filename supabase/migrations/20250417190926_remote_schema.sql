create type "public"."account_status" as enum ('active', 'inactive', 'pending');

drop policy "Only super admin can create realtor profiles" on "public"."realtor_profile";

drop policy "Only super admin can delete realtor profiles" on "public"."realtor_profile";

drop policy "Realtor profiles are viewable by everyone" on "public"."realtor_profile";

alter table "public"."realtor_profile" drop constraint "realtor_profile_account_status_check";

alter table "public"."realtor_profile" drop constraint "valid_email";

create table "public"."blog_posts" (
    "id" uuid not null default gen_random_uuid(),
    "realtor_profile_id" uuid,
    "title" text not null,
    "content" text not null,
    "featured_image_url" text,
    "published_date" timestamp with time zone,
    "status" text default 'draft'::text,
    "slug" text not null,
    "meta_description" text,
    "created_at" timestamp with time zone default CURRENT_TIMESTAMP,
    "updated_at" timestamp with time zone default CURRENT_TIMESTAMP
);


alter table "public"."blog_posts" enable row level security;

create table "public"."content_blocks" (
    "id" uuid not null default gen_random_uuid(),
    "realtor_profile_id" uuid,
    "identifier" text not null,
    "content" text not null,
    "type" text default 'text'::text,
    "active" boolean default true,
    "created_at" timestamp with time zone default CURRENT_TIMESTAMP,
    "last_updated" timestamp with time zone default CURRENT_TIMESTAMP
);


alter table "public"."content_blocks" enable row level security;

create table "public"."leads" (
    "id" uuid not null default gen_random_uuid(),
    "realtor_profile_id" uuid,
    "first_name" text not null,
    "last_name" text not null,
    "email" text not null,
    "phone" text,
    "message" text,
    "source" text,
    "status" text default 'new'::text,
    "created_at" timestamp with time zone default CURRENT_TIMESTAMP,
    "last_contacted_at" timestamp with time zone,
    "updated_at" timestamp with time zone default CURRENT_TIMESTAMP
);


alter table "public"."leads" enable row level security;

create table "public"."mls_integrations" (
    "id" uuid not null default gen_random_uuid(),
    "mls_id" text,
    "mls_listing_number" text,
    "property_photo" text,
    "property_address" text,
    "property_list_price" numeric,
    "property_days_on_market" integer,
    "property_price_per_square_foot" numeric,
    "realtor_profile_id" uuid
);


alter table "public"."mls_integrations" enable row level security;

create table "public"."properties" (
    "id" uuid not null default gen_random_uuid(),
    "realtor_profile_id" uuid,
    "title" text not null,
    "description" text,
    "price" numeric(12,2),
    "address" text not null,
    "city" text not null,
    "state" text not null,
    "zip_code" text not null,
    "bedrooms" integer,
    "bathrooms" numeric(3,1),
    "square_feet" integer,
    "images" jsonb default '[]'::jsonb,
    "status" text default 'active'::text,
    "featured" boolean default false,
    "created_at" timestamp with time zone default CURRENT_TIMESTAMP,
    "updated_at" timestamp with time zone default CURRENT_TIMESTAMP
);


alter table "public"."properties" enable row level security;

create table "public"."super_admin" (
    "id" uuid not null default gen_random_uuid(),
    "user_id" uuid not null,
    "email" text not null,
    "created_at" timestamp with time zone default now(),
    "first_name" text,
    "last_name" text
);


alter table "public"."super_admin" enable row level security;

create table "public"."testimonials" (
    "id" uuid not null default gen_random_uuid(),
    "realtor_profile_id" uuid,
    "client_name" text not null,
    "testimonial_text" text not null,
    "rating" smallint,
    "date_posted" timestamp with time zone default CURRENT_TIMESTAMP,
    "is_featured" boolean default false,
    "client_image_url" text,
    "created_at" timestamp with time zone default CURRENT_TIMESTAMP,
    "updated_at" timestamp with time zone default CURRENT_TIMESTAMP
);


alter table "public"."testimonials" enable row level security;

create table "public"."website_analytics" (
    "id" uuid not null default gen_random_uuid(),
    "realtor_profile_id" uuid,
    "page_views" integer default 0,
    "unique_visitors" integer default 0,
    "lead_form_submissions" integer default 0,
    "date" date not null,
    "created_at" timestamp with time zone default CURRENT_TIMESTAMP,
    "updated_at" timestamp with time zone default CURRENT_TIMESTAMP
);


alter table "public"."website_analytics" enable row level security;

create table "public"."website_config" (
    "id" uuid not null default gen_random_uuid(),
    "realtor_profile_id" uuid,
    "domain_name" text,
    "theme_settings" jsonb default '{}'::jsonb,
    "color_scheme" jsonb default '{}'::jsonb,
    "logo_url" text,
    "header_image_url" text,
    "social_media_links" jsonb default '{}'::jsonb,
    "active_features" jsonb default '{}'::jsonb,
    "created_at" timestamp with time zone default CURRENT_TIMESTAMP,
    "updated_at" timestamp with time zone default CURRENT_TIMESTAMP
);


alter table "public"."website_config" enable row level security;

alter table "public"."realtor_profile" add column "user_id" uuid not null;

alter table "public"."realtor_profile" alter column "account_status" set default 'pending'::account_status;

alter table "public"."realtor_profile" alter column "account_status" set not null;

alter table "public"."realtor_profile" alter column "account_status" set data type account_status using "account_status"::account_status;

alter table "public"."realtor_profile" alter column "email" set data type text using "email"::text;

alter table "public"."realtor_profile" alter column "website_theme" drop default;

CREATE UNIQUE INDEX blog_posts_pkey ON public.blog_posts USING btree (id);

CREATE UNIQUE INDEX blog_posts_realtor_profile_id_slug_key ON public.blog_posts USING btree (realtor_profile_id, slug);

CREATE UNIQUE INDEX content_blocks_pkey ON public.content_blocks USING btree (id);

CREATE UNIQUE INDEX content_blocks_realtor_profile_id_identifier_key ON public.content_blocks USING btree (realtor_profile_id, identifier);

CREATE INDEX idx_analytics_date ON public.website_analytics USING btree (date);

CREATE INDEX idx_analytics_realtor ON public.website_analytics USING btree (realtor_profile_id);

CREATE INDEX idx_blog_posts_realtor ON public.blog_posts USING btree (realtor_profile_id);

CREATE INDEX idx_blog_posts_status ON public.blog_posts USING btree (status);

CREATE INDEX idx_content_blocks_realtor ON public.content_blocks USING btree (realtor_profile_id);

CREATE INDEX idx_leads_email ON public.leads USING btree (email);

CREATE INDEX idx_leads_realtor ON public.leads USING btree (realtor_profile_id);

CREATE INDEX idx_leads_status ON public.leads USING btree (status);

CREATE INDEX idx_properties_city ON public.properties USING btree (city);

CREATE INDEX idx_properties_realtor ON public.properties USING btree (realtor_profile_id);

CREATE INDEX idx_properties_status ON public.properties USING btree (status);

CREATE INDEX idx_realtor_profile_id ON public.mls_integrations USING btree (realtor_profile_id);

CREATE INDEX idx_testimonials_realtor ON public.testimonials USING btree (realtor_profile_id);

CREATE INDEX idx_website_config_realtor ON public.website_config USING btree (realtor_profile_id);

CREATE UNIQUE INDEX leads_pkey ON public.leads USING btree (id);

CREATE UNIQUE INDEX mls_integrations_pkey ON public.mls_integrations USING btree (id);

CREATE UNIQUE INDEX properties_pkey ON public.properties USING btree (id);

CREATE UNIQUE INDEX realtor_profile_user_id_key ON public.realtor_profile USING btree (user_id);

CREATE UNIQUE INDEX super_admin_email_key ON public.super_admin USING btree (email);

CREATE UNIQUE INDEX super_admin_pkey ON public.super_admin USING btree (id);

CREATE UNIQUE INDEX super_admin_user_id_key ON public.super_admin USING btree (user_id);

CREATE UNIQUE INDEX testimonials_pkey ON public.testimonials USING btree (id);

CREATE UNIQUE INDEX website_analytics_pkey ON public.website_analytics USING btree (id);

CREATE UNIQUE INDEX website_analytics_realtor_profile_id_date_key ON public.website_analytics USING btree (realtor_profile_id, date);

CREATE UNIQUE INDEX website_config_domain_name_key ON public.website_config USING btree (domain_name);

CREATE UNIQUE INDEX website_config_pkey ON public.website_config USING btree (id);

alter table "public"."blog_posts" add constraint "blog_posts_pkey" PRIMARY KEY using index "blog_posts_pkey";

alter table "public"."content_blocks" add constraint "content_blocks_pkey" PRIMARY KEY using index "content_blocks_pkey";

alter table "public"."leads" add constraint "leads_pkey" PRIMARY KEY using index "leads_pkey";

alter table "public"."mls_integrations" add constraint "mls_integrations_pkey" PRIMARY KEY using index "mls_integrations_pkey";

alter table "public"."properties" add constraint "properties_pkey" PRIMARY KEY using index "properties_pkey";

alter table "public"."super_admin" add constraint "super_admin_pkey" PRIMARY KEY using index "super_admin_pkey";

alter table "public"."testimonials" add constraint "testimonials_pkey" PRIMARY KEY using index "testimonials_pkey";

alter table "public"."website_analytics" add constraint "website_analytics_pkey" PRIMARY KEY using index "website_analytics_pkey";

alter table "public"."website_config" add constraint "website_config_pkey" PRIMARY KEY using index "website_config_pkey";

alter table "public"."blog_posts" add constraint "blog_posts_realtor_profile_id_fkey" FOREIGN KEY (realtor_profile_id) REFERENCES realtor_profile(id) ON DELETE CASCADE not valid;

alter table "public"."blog_posts" validate constraint "blog_posts_realtor_profile_id_fkey";

alter table "public"."blog_posts" add constraint "blog_posts_realtor_profile_id_slug_key" UNIQUE using index "blog_posts_realtor_profile_id_slug_key";

alter table "public"."blog_posts" add constraint "blog_posts_status_check" CHECK ((status = ANY (ARRAY['draft'::text, 'published'::text]))) not valid;

alter table "public"."blog_posts" validate constraint "blog_posts_status_check";

alter table "public"."content_blocks" add constraint "content_blocks_realtor_profile_id_fkey" FOREIGN KEY (realtor_profile_id) REFERENCES realtor_profile(id) ON DELETE CASCADE not valid;

alter table "public"."content_blocks" validate constraint "content_blocks_realtor_profile_id_fkey";

alter table "public"."content_blocks" add constraint "content_blocks_realtor_profile_id_identifier_key" UNIQUE using index "content_blocks_realtor_profile_id_identifier_key";

alter table "public"."content_blocks" add constraint "content_blocks_type_check" CHECK ((type = ANY (ARRAY['text'::text, 'html'::text, 'markdown'::text]))) not valid;

alter table "public"."content_blocks" validate constraint "content_blocks_type_check";

alter table "public"."leads" add constraint "leads_realtor_profile_id_fkey" FOREIGN KEY (realtor_profile_id) REFERENCES realtor_profile(id) ON DELETE CASCADE not valid;

alter table "public"."leads" validate constraint "leads_realtor_profile_id_fkey";

alter table "public"."leads" add constraint "leads_status_check" CHECK ((status = ANY (ARRAY['new'::text, 'contacted'::text, 'qualified'::text, 'closed'::text]))) not valid;

alter table "public"."leads" validate constraint "leads_status_check";

alter table "public"."mls_integrations" add constraint "mls_integrations_realtor_profile_id_fkey" FOREIGN KEY (realtor_profile_id) REFERENCES realtor_profile(id) not valid;

alter table "public"."mls_integrations" validate constraint "mls_integrations_realtor_profile_id_fkey";

alter table "public"."properties" add constraint "properties_realtor_profile_id_fkey" FOREIGN KEY (realtor_profile_id) REFERENCES realtor_profile(id) ON DELETE CASCADE not valid;

alter table "public"."properties" validate constraint "properties_realtor_profile_id_fkey";

alter table "public"."properties" add constraint "properties_status_check" CHECK ((status = ANY (ARRAY['active'::text, 'pending'::text, 'sold'::text]))) not valid;

alter table "public"."properties" validate constraint "properties_status_check";

alter table "public"."realtor_profile" add constraint "realtor_profile_user_id_fkey" FOREIGN KEY (user_id) REFERENCES auth.users(id) not valid;

alter table "public"."realtor_profile" validate constraint "realtor_profile_user_id_fkey";

alter table "public"."realtor_profile" add constraint "realtor_profile_user_id_key" UNIQUE using index "realtor_profile_user_id_key";

alter table "public"."super_admin" add constraint "fk_user" FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE not valid;

alter table "public"."super_admin" validate constraint "fk_user";

alter table "public"."super_admin" add constraint "super_admin_email_key" UNIQUE using index "super_admin_email_key";

alter table "public"."super_admin" add constraint "super_admin_user_id_key" UNIQUE using index "super_admin_user_id_key";

alter table "public"."testimonials" add constraint "testimonials_rating_check" CHECK (((rating >= 1) AND (rating <= 5))) not valid;

alter table "public"."testimonials" validate constraint "testimonials_rating_check";

alter table "public"."testimonials" add constraint "testimonials_realtor_profile_id_fkey" FOREIGN KEY (realtor_profile_id) REFERENCES realtor_profile(id) ON DELETE CASCADE not valid;

alter table "public"."testimonials" validate constraint "testimonials_realtor_profile_id_fkey";

alter table "public"."website_analytics" add constraint "website_analytics_realtor_profile_id_date_key" UNIQUE using index "website_analytics_realtor_profile_id_date_key";

alter table "public"."website_analytics" add constraint "website_analytics_realtor_profile_id_fkey" FOREIGN KEY (realtor_profile_id) REFERENCES realtor_profile(id) ON DELETE CASCADE not valid;

alter table "public"."website_analytics" validate constraint "website_analytics_realtor_profile_id_fkey";

alter table "public"."website_config" add constraint "website_config_domain_name_key" UNIQUE using index "website_config_domain_name_key";

alter table "public"."website_config" add constraint "website_config_realtor_profile_id_fkey" FOREIGN KEY (realtor_profile_id) REFERENCES realtor_profile(id) ON DELETE CASCADE not valid;

alter table "public"."website_config" validate constraint "website_config_realtor_profile_id_fkey";

alter table "public"."realtor_profile" add constraint "valid_email" CHECK ((email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'::text)) not valid;

alter table "public"."realtor_profile" validate constraint "valid_email";

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.is_super_admin()
 RETURNS boolean
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
BEGIN
  RETURN EXISTS (
    SELECT 1 
    FROM super_admin 
    WHERE email = auth.jwt() ->> 'email'
  );
END;
$function$
;

grant delete on table "public"."blog_posts" to "anon";

grant insert on table "public"."blog_posts" to "anon";

grant references on table "public"."blog_posts" to "anon";

grant select on table "public"."blog_posts" to "anon";

grant trigger on table "public"."blog_posts" to "anon";

grant truncate on table "public"."blog_posts" to "anon";

grant update on table "public"."blog_posts" to "anon";

grant delete on table "public"."blog_posts" to "authenticated";

grant insert on table "public"."blog_posts" to "authenticated";

grant references on table "public"."blog_posts" to "authenticated";

grant select on table "public"."blog_posts" to "authenticated";

grant trigger on table "public"."blog_posts" to "authenticated";

grant truncate on table "public"."blog_posts" to "authenticated";

grant update on table "public"."blog_posts" to "authenticated";

grant delete on table "public"."blog_posts" to "service_role";

grant insert on table "public"."blog_posts" to "service_role";

grant references on table "public"."blog_posts" to "service_role";

grant select on table "public"."blog_posts" to "service_role";

grant trigger on table "public"."blog_posts" to "service_role";

grant truncate on table "public"."blog_posts" to "service_role";

grant update on table "public"."blog_posts" to "service_role";

grant delete on table "public"."content_blocks" to "anon";

grant insert on table "public"."content_blocks" to "anon";

grant references on table "public"."content_blocks" to "anon";

grant select on table "public"."content_blocks" to "anon";

grant trigger on table "public"."content_blocks" to "anon";

grant truncate on table "public"."content_blocks" to "anon";

grant update on table "public"."content_blocks" to "anon";

grant delete on table "public"."content_blocks" to "authenticated";

grant insert on table "public"."content_blocks" to "authenticated";

grant references on table "public"."content_blocks" to "authenticated";

grant select on table "public"."content_blocks" to "authenticated";

grant trigger on table "public"."content_blocks" to "authenticated";

grant truncate on table "public"."content_blocks" to "authenticated";

grant update on table "public"."content_blocks" to "authenticated";

grant delete on table "public"."content_blocks" to "service_role";

grant insert on table "public"."content_blocks" to "service_role";

grant references on table "public"."content_blocks" to "service_role";

grant select on table "public"."content_blocks" to "service_role";

grant trigger on table "public"."content_blocks" to "service_role";

grant truncate on table "public"."content_blocks" to "service_role";

grant update on table "public"."content_blocks" to "service_role";

grant delete on table "public"."leads" to "anon";

grant insert on table "public"."leads" to "anon";

grant references on table "public"."leads" to "anon";

grant select on table "public"."leads" to "anon";

grant trigger on table "public"."leads" to "anon";

grant truncate on table "public"."leads" to "anon";

grant update on table "public"."leads" to "anon";

grant delete on table "public"."leads" to "authenticated";

grant insert on table "public"."leads" to "authenticated";

grant references on table "public"."leads" to "authenticated";

grant select on table "public"."leads" to "authenticated";

grant trigger on table "public"."leads" to "authenticated";

grant truncate on table "public"."leads" to "authenticated";

grant update on table "public"."leads" to "authenticated";

grant delete on table "public"."leads" to "service_role";

grant insert on table "public"."leads" to "service_role";

grant references on table "public"."leads" to "service_role";

grant select on table "public"."leads" to "service_role";

grant trigger on table "public"."leads" to "service_role";

grant truncate on table "public"."leads" to "service_role";

grant update on table "public"."leads" to "service_role";

grant delete on table "public"."mls_integrations" to "anon";

grant insert on table "public"."mls_integrations" to "anon";

grant references on table "public"."mls_integrations" to "anon";

grant select on table "public"."mls_integrations" to "anon";

grant trigger on table "public"."mls_integrations" to "anon";

grant truncate on table "public"."mls_integrations" to "anon";

grant update on table "public"."mls_integrations" to "anon";

grant delete on table "public"."mls_integrations" to "authenticated";

grant insert on table "public"."mls_integrations" to "authenticated";

grant references on table "public"."mls_integrations" to "authenticated";

grant select on table "public"."mls_integrations" to "authenticated";

grant trigger on table "public"."mls_integrations" to "authenticated";

grant truncate on table "public"."mls_integrations" to "authenticated";

grant update on table "public"."mls_integrations" to "authenticated";

grant delete on table "public"."mls_integrations" to "service_role";

grant insert on table "public"."mls_integrations" to "service_role";

grant references on table "public"."mls_integrations" to "service_role";

grant select on table "public"."mls_integrations" to "service_role";

grant trigger on table "public"."mls_integrations" to "service_role";

grant truncate on table "public"."mls_integrations" to "service_role";

grant update on table "public"."mls_integrations" to "service_role";

grant delete on table "public"."properties" to "anon";

grant insert on table "public"."properties" to "anon";

grant references on table "public"."properties" to "anon";

grant select on table "public"."properties" to "anon";

grant trigger on table "public"."properties" to "anon";

grant truncate on table "public"."properties" to "anon";

grant update on table "public"."properties" to "anon";

grant delete on table "public"."properties" to "authenticated";

grant insert on table "public"."properties" to "authenticated";

grant references on table "public"."properties" to "authenticated";

grant select on table "public"."properties" to "authenticated";

grant trigger on table "public"."properties" to "authenticated";

grant truncate on table "public"."properties" to "authenticated";

grant update on table "public"."properties" to "authenticated";

grant delete on table "public"."properties" to "service_role";

grant insert on table "public"."properties" to "service_role";

grant references on table "public"."properties" to "service_role";

grant select on table "public"."properties" to "service_role";

grant trigger on table "public"."properties" to "service_role";

grant truncate on table "public"."properties" to "service_role";

grant update on table "public"."properties" to "service_role";

grant delete on table "public"."super_admin" to "anon";

grant insert on table "public"."super_admin" to "anon";

grant references on table "public"."super_admin" to "anon";

grant select on table "public"."super_admin" to "anon";

grant trigger on table "public"."super_admin" to "anon";

grant truncate on table "public"."super_admin" to "anon";

grant update on table "public"."super_admin" to "anon";

grant delete on table "public"."super_admin" to "authenticated";

grant insert on table "public"."super_admin" to "authenticated";

grant references on table "public"."super_admin" to "authenticated";

grant select on table "public"."super_admin" to "authenticated";

grant trigger on table "public"."super_admin" to "authenticated";

grant truncate on table "public"."super_admin" to "authenticated";

grant update on table "public"."super_admin" to "authenticated";

grant delete on table "public"."super_admin" to "service_role";

grant insert on table "public"."super_admin" to "service_role";

grant references on table "public"."super_admin" to "service_role";

grant select on table "public"."super_admin" to "service_role";

grant trigger on table "public"."super_admin" to "service_role";

grant truncate on table "public"."super_admin" to "service_role";

grant update on table "public"."super_admin" to "service_role";

grant delete on table "public"."testimonials" to "anon";

grant insert on table "public"."testimonials" to "anon";

grant references on table "public"."testimonials" to "anon";

grant select on table "public"."testimonials" to "anon";

grant trigger on table "public"."testimonials" to "anon";

grant truncate on table "public"."testimonials" to "anon";

grant update on table "public"."testimonials" to "anon";

grant delete on table "public"."testimonials" to "authenticated";

grant insert on table "public"."testimonials" to "authenticated";

grant references on table "public"."testimonials" to "authenticated";

grant select on table "public"."testimonials" to "authenticated";

grant trigger on table "public"."testimonials" to "authenticated";

grant truncate on table "public"."testimonials" to "authenticated";

grant update on table "public"."testimonials" to "authenticated";

grant delete on table "public"."testimonials" to "service_role";

grant insert on table "public"."testimonials" to "service_role";

grant references on table "public"."testimonials" to "service_role";

grant select on table "public"."testimonials" to "service_role";

grant trigger on table "public"."testimonials" to "service_role";

grant truncate on table "public"."testimonials" to "service_role";

grant update on table "public"."testimonials" to "service_role";

grant delete on table "public"."website_analytics" to "anon";

grant insert on table "public"."website_analytics" to "anon";

grant references on table "public"."website_analytics" to "anon";

grant select on table "public"."website_analytics" to "anon";

grant trigger on table "public"."website_analytics" to "anon";

grant truncate on table "public"."website_analytics" to "anon";

grant update on table "public"."website_analytics" to "anon";

grant delete on table "public"."website_analytics" to "authenticated";

grant insert on table "public"."website_analytics" to "authenticated";

grant references on table "public"."website_analytics" to "authenticated";

grant select on table "public"."website_analytics" to "authenticated";

grant trigger on table "public"."website_analytics" to "authenticated";

grant truncate on table "public"."website_analytics" to "authenticated";

grant update on table "public"."website_analytics" to "authenticated";

grant delete on table "public"."website_analytics" to "service_role";

grant insert on table "public"."website_analytics" to "service_role";

grant references on table "public"."website_analytics" to "service_role";

grant select on table "public"."website_analytics" to "service_role";

grant trigger on table "public"."website_analytics" to "service_role";

grant truncate on table "public"."website_analytics" to "service_role";

grant update on table "public"."website_analytics" to "service_role";

grant delete on table "public"."website_config" to "anon";

grant insert on table "public"."website_config" to "anon";

grant references on table "public"."website_config" to "anon";

grant select on table "public"."website_config" to "anon";

grant trigger on table "public"."website_config" to "anon";

grant truncate on table "public"."website_config" to "anon";

grant update on table "public"."website_config" to "anon";

grant delete on table "public"."website_config" to "authenticated";

grant insert on table "public"."website_config" to "authenticated";

grant references on table "public"."website_config" to "authenticated";

grant select on table "public"."website_config" to "authenticated";

grant trigger on table "public"."website_config" to "authenticated";

grant truncate on table "public"."website_config" to "authenticated";

grant update on table "public"."website_config" to "authenticated";

grant delete on table "public"."website_config" to "service_role";

grant insert on table "public"."website_config" to "service_role";

grant references on table "public"."website_config" to "service_role";

grant select on table "public"."website_config" to "service_role";

grant trigger on table "public"."website_config" to "service_role";

grant truncate on table "public"."website_config" to "service_role";

grant update on table "public"."website_config" to "service_role";

create policy "delete_own_blog_posts"
on "public"."blog_posts"
as permissive
for delete
to public
using ((realtor_profile_id = auth.uid()));


create policy "insert_own_blog_posts"
on "public"."blog_posts"
as permissive
for insert
to public
with check ((realtor_profile_id = auth.uid()));


create policy "select_all_blog_posts"
on "public"."blog_posts"
as permissive
for select
to public
using (true);


create policy "update_own_blog_posts"
on "public"."blog_posts"
as permissive
for update
to public
using ((realtor_profile_id = auth.uid()));


create policy "select_all_content_blocks"
on "public"."content_blocks"
as permissive
for select
to public
using (true);


create policy "insert_leads"
on "public"."leads"
as permissive
for insert
to public
with check (true);


create policy "select_own_leads"
on "public"."leads"
as permissive
for select
to public
using ((realtor_profile_id = auth.uid()));


create policy "update_own_leads"
on "public"."leads"
as permissive
for update
to public
using ((realtor_profile_id = auth.uid()));


create policy "Public can view mls_integrations"
on "public"."mls_integrations"
as permissive
for select
to authenticated, anon
using (true);


create policy "Super admin full access to mls_integrations"
on "public"."mls_integrations"
as permissive
for all
to authenticated
using (is_super_admin())
with check (is_super_admin());


create policy "delete_own_properties"
on "public"."properties"
as permissive
for delete
to public
using ((realtor_profile_id = auth.uid()));


create policy "insert_own_properties"
on "public"."properties"
as permissive
for insert
to public
with check ((realtor_profile_id = auth.uid()));


create policy "select_all_properties"
on "public"."properties"
as permissive
for select
to public
using (true);


create policy "update_own_properties"
on "public"."properties"
as permissive
for update
to public
using ((realtor_profile_id = auth.uid()));


create policy "Allow public to view active profiles"
on "public"."realtor_profile"
as permissive
for select
to public
using ((account_status = 'active'::account_status));


create policy "Enable delete for own profile"
on "public"."realtor_profile"
as permissive
for delete
to authenticated
using ((auth.uid() = user_id));


create policy "Enable profile creation during signup"
on "public"."realtor_profile"
as permissive
for insert
to authenticated
with check ((auth.uid() = user_id));


create policy "Enable read access for own profile"
on "public"."realtor_profile"
as permissive
for select
to authenticated
using ((auth.uid() = user_id));


create policy "Enable update for own profile"
on "public"."realtor_profile"
as permissive
for update
to authenticated
using ((auth.uid() = user_id))
with check ((auth.uid() = user_id));


create policy "Super admin full access"
on "public"."realtor_profile"
as permissive
for all
to authenticated
using (is_super_admin())
with check (is_super_admin());


create policy "Super admin access"
on "public"."super_admin"
as permissive
for all
to authenticated
using (is_super_admin())
with check (is_super_admin());


create policy "delete_own_testimonials"
on "public"."testimonials"
as permissive
for delete
to public
using ((realtor_profile_id = auth.uid()));


create policy "insert_own_testimonials"
on "public"."testimonials"
as permissive
for insert
to public
with check ((realtor_profile_id = auth.uid()));


create policy "select_all_testimonials"
on "public"."testimonials"
as permissive
for select
to public
using (true);


create policy "update_own_testimonials"
on "public"."testimonials"
as permissive
for update
to public
using ((realtor_profile_id = auth.uid()));


create policy "select_own_analytics"
on "public"."website_analytics"
as permissive
for select
to public
using ((realtor_profile_id = auth.uid()));


create policy "super_admin_access_analytics"
on "public"."website_analytics"
as permissive
for all
to public
using ((auth.role() = 'super_admin'::text));


create policy "super_admin_access_website_config"
on "public"."website_config"
as permissive
for all
to public
using ((auth.role() = 'super_admin'::text));



