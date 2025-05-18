-- Create the posts table
create table if not exists posts (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users on delete cascade,
  content_url text not null,
  category text,
  rating_score integer default 0,
  created_at timestamp with time zone default now()
);

-- Create the votes table
create table if not exists votes (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users on delete cascade,
  post_id uuid references posts on delete cascade,
  emoji text not null,
  created_at timestamp with time zone default now()
);

-- Create RLS policies for security
-- Enable RLS on tables
alter table posts enable row level security;
alter table votes enable row level security;

-- Posts policies
create policy "Allow users to select their own posts"
  on posts for select
  using (auth.uid() = user_id);

create policy "Allow users to insert their own posts"
  on posts for insert
  with check (auth.uid() = user_id);

-- Votes policies
create policy "Allow users to select any votes"
  on votes for select
  to authenticated
  using (true);

create policy "Allow users to insert their own votes"
  on votes for insert
  with check (auth.uid() = user_id);

-- Create a storage bucket for content
insert into storage.buckets (id, name, public) values ('content', 'content', true)
on conflict (id) do nothing;

-- Allow authenticated users to upload files to the 'content' bucket
create policy "Allow authenticated users to upload files"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'content' and (storage.foldername(name))[1] = auth.uid()::text);

-- Allow anyone to view files in the 'content' bucket
create policy "Allow public to view content"
  on storage.objects for select
  using (bucket_id = 'content');