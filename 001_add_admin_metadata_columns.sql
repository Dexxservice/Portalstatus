-- Supabase safe migration for admin console metadata
alter table cases add column if not exists digital_diplo_status text default 'not created';
alter table cases add column if not exists twofa_email_status  text default 'pending';
alter table cases add column if not exists health_insurance     text default 'pending';
alter table cases add column if not exists work_checks          int  default 0 check (work_checks between 0 and 6);
alter table cases add column if not exists internal_notes       text;
alter table cases add column if not exists quick_notes          jsonb default '[]'::jsonb; -- [{text, by, at}]
alter table cases add column if not exists deleted_at           timestamptz;

create index if not exists cases_deleted_at_idx on cases (deleted_at);
create index if not exists cases_diplo_idx on cases (digital_diplo_status);
create index if not exists cases_2fa_idx   on cases (twofa_email_status);
create index if not exists cases_health_idx on cases (health_insurance);
