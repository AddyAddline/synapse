-- ============================================
-- Synapse — Database Schema
-- ============================================

-- User profile (extends Supabase auth.users)
create table if not exists profiles (
  id uuid references auth.users on delete cascade primary key,
  display_name text,
  avatar_url text,
  current_phase int default 1,
  current_lesson int default 1,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Auto-create profile when a new user signs up
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, display_name, avatar_url)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'display_name', split_part(new.email, '@', 1)),
    new.raw_user_meta_data->>'avatar_url'
  );
  return new;
end;
$$ language plpgsql security definer;

create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Curriculum
create table if not exists lessons (
  id serial primary key,
  phase int not null,
  order_num int not null,
  title text not null,
  description text,
  content_md text not null default '',
  difficulty text not null default 'beginner',
  estimated_minutes int default 30,
  created_at timestamptz default now()
);

create table if not exists exercises (
  id serial primary key,
  lesson_id int references lessons(id) on delete cascade,
  order_num int not null,
  title text not null,
  prompt text not null,
  starter_code text default '',
  solution text default '',
  hints jsonb default '[]'::jsonb,
  test_cases jsonb default '[]'::jsonb,
  requires_plot boolean default false,
  created_at timestamptz default now()
);

-- User tracking
create table if not exists user_progress (
  user_id uuid references profiles(id) on delete cascade,
  lesson_id int references lessons(id) on delete cascade,
  completed boolean default false,
  score int default 0,
  time_spent_seconds int default 0,
  completed_at timestamptz,
  primary key (user_id, lesson_id)
);

create table if not exists user_attempts (
  id serial primary key,
  user_id uuid references profiles(id) on delete cascade,
  exercise_id int references exercises(id) on delete cascade,
  code text not null,
  output text,
  correct boolean default false,
  attempted_at timestamptz default now()
);

create table if not exists chat_sessions (
  id serial primary key,
  user_id uuid references profiles(id) on delete cascade,
  lesson_id int references lessons(id) on delete set null,
  messages jsonb default '[]'::jsonb,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ============================================
-- Row Level Security
-- ============================================

alter table profiles enable row level security;
alter table user_progress enable row level security;
alter table user_attempts enable row level security;
alter table chat_sessions enable row level security;

-- Profiles: users can read/update own profile
create policy "Users can view own profile"
  on profiles for select
  using (auth.uid() = id);

create policy "Users can update own profile"
  on profiles for update
  using (auth.uid() = id);

-- Lessons & exercises: readable by everyone (public curriculum)
-- No RLS needed — these are public read-only

-- User progress: users can only access own data
create policy "Users can view own progress"
  on user_progress for select
  using (auth.uid() = user_id);

create policy "Users can insert own progress"
  on user_progress for insert
  with check (auth.uid() = user_id);

create policy "Users can update own progress"
  on user_progress for update
  using (auth.uid() = user_id);

-- User attempts: users can only access own data
create policy "Users can view own attempts"
  on user_attempts for select
  using (auth.uid() = user_id);

create policy "Users can insert own attempts"
  on user_attempts for insert
  with check (auth.uid() = user_id);

-- Chat sessions: users can only access own sessions
create policy "Users can view own chat sessions"
  on chat_sessions for select
  using (auth.uid() = user_id);

create policy "Users can insert own chat sessions"
  on chat_sessions for insert
  with check (auth.uid() = user_id);

create policy "Users can update own chat sessions"
  on chat_sessions for update
  using (auth.uid() = user_id);

-- Indexes
create index if not exists idx_exercises_lesson_id on exercises(lesson_id);
create index if not exists idx_user_progress_user_id on user_progress(user_id);
create index if not exists idx_user_attempts_user_id on user_attempts(user_id);
create index if not exists idx_user_attempts_exercise_id on user_attempts(exercise_id);
create index if not exists idx_chat_sessions_user_id on chat_sessions(user_id);
