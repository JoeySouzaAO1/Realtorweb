drop policy "insert_leads" on "public"."leads";

drop policy "select_own_leads" on "public"."leads";

drop policy "update_own_leads" on "public"."leads";

revoke delete on table "public"."leads" from "anon";

revoke insert on table "public"."leads" from "anon";

revoke references on table "public"."leads" from "anon";

revoke select on table "public"."leads" from "anon";

revoke trigger on table "public"."leads" from "anon";

revoke truncate on table "public"."leads" from "anon";

revoke update on table "public"."leads" from "anon";

revoke delete on table "public"."leads" from "authenticated";

revoke insert on table "public"."leads" from "authenticated";

revoke references on table "public"."leads" from "authenticated";

revoke select on table "public"."leads" from "authenticated";

revoke trigger on table "public"."leads" from "authenticated";

revoke truncate on table "public"."leads" from "authenticated";

revoke update on table "public"."leads" from "authenticated";

revoke delete on table "public"."leads" from "service_role";

revoke insert on table "public"."leads" from "service_role";

revoke references on table "public"."leads" from "service_role";

revoke select on table "public"."leads" from "service_role";

revoke trigger on table "public"."leads" from "service_role";

revoke truncate on table "public"."leads" from "service_role";

revoke update on table "public"."leads" from "service_role";

alter table "public"."blog_posts" drop constraint "blog_posts_realtor_profile_id_fkey";

alter table "public"."leads" drop constraint "leads_realtor_profile_id_fkey";

alter table "public"."leads" drop constraint "leads_status_check";

alter table "public"."properties" drop constraint "properties_realtor_profile_id_fkey";

alter table "public"."testimonials" drop constraint "testimonials_realtor_profile_id_fkey";

alter table "public"."leads" drop constraint "leads_pkey";

drop index if exists "public"."idx_leads_email";

drop index if exists "public"."idx_leads_realtor";

drop index if exists "public"."idx_leads_status";

drop index if exists "public"."leads_pkey";

drop table "public"."leads";

create table "public"."instagram_posts" (
    "id" text not null,
    "caption" text,
    "image_url" text,
    "permalink" text,
    "timestamp" timestamp with time zone,
    "created_at" timestamp with time zone default now(),
    "media_type" text,
    "realtor_profile_user_id" uuid,
    "storage_url" text,
    "original_image_url" text,
    "storage_url_status" text default 'pending'::text,
    "last_storage_attempt" timestamp with time zone
);


alter table "public"."instagram_posts" enable row level security;

create table "public"."instagram_tokens" (
    "id" uuid not null default uuid_generate_v4(),
    "access_token" text not null,
    "created_at" timestamp with time zone default now(),
    "updated_at" timestamp with time zone default now(),
    "realtor_profile_user_id" uuid
);


alter table "public"."instagram_tokens" enable row level security;

create table "public"."interest_form" (
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


alter table "public"."interest_form" enable row level security;

CREATE INDEX idx_instagram_posts_timestamp ON public.instagram_posts USING btree ("timestamp" DESC);

CREATE UNIQUE INDEX instagram_posts_pkey ON public.instagram_posts USING btree (id);

CREATE UNIQUE INDEX instagram_tokens_pkey ON public.instagram_tokens USING btree (id);

CREATE INDEX idx_leads_email ON public.interest_form USING btree (email);

CREATE INDEX idx_leads_realtor ON public.interest_form USING btree (realtor_profile_id);

CREATE INDEX idx_leads_status ON public.interest_form USING btree (status);

CREATE UNIQUE INDEX leads_pkey ON public.interest_form USING btree (id);

alter table "public"."instagram_posts" add constraint "instagram_posts_pkey" PRIMARY KEY using index "instagram_posts_pkey";

alter table "public"."instagram_tokens" add constraint "instagram_tokens_pkey" PRIMARY KEY using index "instagram_tokens_pkey";

alter table "public"."interest_form" add constraint "leads_pkey" PRIMARY KEY using index "leads_pkey";

alter table "public"."blog_posts" add constraint "blog_posts_realtor_profile_id_fkey1" FOREIGN KEY (realtor_profile_id) REFERENCES realtor_profile(user_id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."blog_posts" validate constraint "blog_posts_realtor_profile_id_fkey1";

alter table "public"."instagram_posts" add constraint "instagram_posts_realtor_profile_user_id_fkey" FOREIGN KEY (realtor_profile_user_id) REFERENCES realtor_profile(user_id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."instagram_posts" validate constraint "instagram_posts_realtor_profile_user_id_fkey";

alter table "public"."instagram_posts" add constraint "instagram_posts_storage_url_status_check" CHECK ((storage_url_status = ANY (ARRAY['pending'::text, 'success'::text, 'failed'::text]))) not valid;

alter table "public"."instagram_posts" validate constraint "instagram_posts_storage_url_status_check";

alter table "public"."instagram_tokens" add constraint "instagram_tokens_realtor_profile_user_id_fkey" FOREIGN KEY (realtor_profile_user_id) REFERENCES realtor_profile(user_id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."instagram_tokens" validate constraint "instagram_tokens_realtor_profile_user_id_fkey";

alter table "public"."interest_form" add constraint "interest_form_realtor_profile_id_fkey" FOREIGN KEY (realtor_profile_id) REFERENCES realtor_profile(user_id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."interest_form" validate constraint "interest_form_realtor_profile_id_fkey";

alter table "public"."interest_form" add constraint "leads_status_check" CHECK ((status = ANY (ARRAY['new'::text, 'contacted'::text, 'qualified'::text, 'closed'::text]))) not valid;

alter table "public"."interest_form" validate constraint "leads_status_check";

alter table "public"."properties" add constraint "properties_realtor_profile_id_fkey1" FOREIGN KEY (realtor_profile_id) REFERENCES realtor_profile(user_id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."properties" validate constraint "properties_realtor_profile_id_fkey1";

alter table "public"."testimonials" add constraint "testimonials_realtor_profile_id_fkey1" FOREIGN KEY (realtor_profile_id) REFERENCES realtor_profile(user_id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."testimonials" validate constraint "testimonials_realtor_profile_id_fkey1";

grant delete on table "public"."instagram_posts" to "anon";

grant insert on table "public"."instagram_posts" to "anon";

grant references on table "public"."instagram_posts" to "anon";

grant select on table "public"."instagram_posts" to "anon";

grant trigger on table "public"."instagram_posts" to "anon";

grant truncate on table "public"."instagram_posts" to "anon";

grant update on table "public"."instagram_posts" to "anon";

grant delete on table "public"."instagram_posts" to "authenticated";

grant insert on table "public"."instagram_posts" to "authenticated";

grant references on table "public"."instagram_posts" to "authenticated";

grant select on table "public"."instagram_posts" to "authenticated";

grant trigger on table "public"."instagram_posts" to "authenticated";

grant truncate on table "public"."instagram_posts" to "authenticated";

grant update on table "public"."instagram_posts" to "authenticated";

grant delete on table "public"."instagram_posts" to "service_role";

grant insert on table "public"."instagram_posts" to "service_role";

grant references on table "public"."instagram_posts" to "service_role";

grant select on table "public"."instagram_posts" to "service_role";

grant trigger on table "public"."instagram_posts" to "service_role";

grant truncate on table "public"."instagram_posts" to "service_role";

grant update on table "public"."instagram_posts" to "service_role";

grant delete on table "public"."instagram_tokens" to "anon";

grant insert on table "public"."instagram_tokens" to "anon";

grant references on table "public"."instagram_tokens" to "anon";

grant select on table "public"."instagram_tokens" to "anon";

grant trigger on table "public"."instagram_tokens" to "anon";

grant truncate on table "public"."instagram_tokens" to "anon";

grant update on table "public"."instagram_tokens" to "anon";

grant delete on table "public"."instagram_tokens" to "authenticated";

grant insert on table "public"."instagram_tokens" to "authenticated";

grant references on table "public"."instagram_tokens" to "authenticated";

grant select on table "public"."instagram_tokens" to "authenticated";

grant trigger on table "public"."instagram_tokens" to "authenticated";

grant truncate on table "public"."instagram_tokens" to "authenticated";

grant update on table "public"."instagram_tokens" to "authenticated";

grant delete on table "public"."instagram_tokens" to "service_role";

grant insert on table "public"."instagram_tokens" to "service_role";

grant references on table "public"."instagram_tokens" to "service_role";

grant select on table "public"."instagram_tokens" to "service_role";

grant trigger on table "public"."instagram_tokens" to "service_role";

grant truncate on table "public"."instagram_tokens" to "service_role";

grant update on table "public"."instagram_tokens" to "service_role";

grant delete on table "public"."interest_form" to "anon";

grant insert on table "public"."interest_form" to "anon";

grant references on table "public"."interest_form" to "anon";

grant select on table "public"."interest_form" to "anon";

grant trigger on table "public"."interest_form" to "anon";

grant truncate on table "public"."interest_form" to "anon";

grant update on table "public"."interest_form" to "anon";

grant delete on table "public"."interest_form" to "authenticated";

grant insert on table "public"."interest_form" to "authenticated";

grant references on table "public"."interest_form" to "authenticated";

grant select on table "public"."interest_form" to "authenticated";

grant trigger on table "public"."interest_form" to "authenticated";

grant truncate on table "public"."interest_form" to "authenticated";

grant update on table "public"."interest_form" to "authenticated";

grant delete on table "public"."interest_form" to "service_role";

grant insert on table "public"."interest_form" to "service_role";

grant references on table "public"."interest_form" to "service_role";

grant select on table "public"."interest_form" to "service_role";

grant trigger on table "public"."interest_form" to "service_role";

grant truncate on table "public"."interest_form" to "service_role";

grant update on table "public"."interest_form" to "service_role";

create policy "Public can read posts"
on "public"."instagram_posts"
as permissive
for select
to public
using (true);


create policy "Realtor can delete own posts"
on "public"."instagram_posts"
as permissive
for delete
to authenticated
using ((realtor_profile_user_id = auth.uid()));


create policy "Realtor can insert own posts"
on "public"."instagram_posts"
as permissive
for insert
to authenticated
with check ((realtor_profile_user_id = auth.uid()));


create policy "Realtor can update own posts"
on "public"."instagram_posts"
as permissive
for update
to authenticated
using ((realtor_profile_user_id = auth.uid()));


create policy "No access by default"
on "public"."instagram_tokens"
as permissive
for all
to public
using (false);


create policy "Super admin access"
on "public"."instagram_tokens"
as permissive
for all
to public
using ((EXISTS ( SELECT 1
   FROM super_admin
  WHERE (super_admin.user_id = auth.uid()))))
with check ((EXISTS ( SELECT 1
   FROM super_admin
  WHERE (super_admin.user_id = auth.uid()))));


create policy "Allow super admins to delete"
on "public"."interest_form"
as permissive
for delete
to service_role
using (true);


create policy "Allow super admins to insert"
on "public"."interest_form"
as permissive
for insert
to service_role
with check (true);


create policy "Allow super admins to select"
on "public"."interest_form"
as permissive
for select
to service_role
using (true);


create policy "Allow super admins to update"
on "public"."interest_form"
as permissive
for update
to service_role
using (true);


create policy "Enable delete for realtor based on realtor_profile_id"
on "public"."interest_form"
as permissive
for delete
to authenticated
using ((realtor_profile_id = auth.uid()));


create policy "Enable insert for everyone"
on "public"."interest_form"
as permissive
for insert
to public
with check (true);


create policy "Enable select for realtor based on realtor_profile_id"
on "public"."interest_form"
as permissive
for select
to authenticated
using ((realtor_profile_id = auth.uid()));


create policy "Enable update for realtor based on realtor_profile_id"
on "public"."interest_form"
as permissive
for update
to authenticated
using ((realtor_profile_id = auth.uid()));



