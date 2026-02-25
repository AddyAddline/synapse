-- ============================================
-- Learner Profiles — Adaptive tutor memory
-- ============================================

create table if not exists learner_profiles (
  user_id uuid references profiles(id) on delete cascade primary key,
  summary text default '',
  comfort_level text default 'beginner'
    check (comfort_level in ('beginner', 'growing', 'comfortable')),
  exercises_attempted int default 0,
  exercises_passed int default 0,
  updated_at timestamptz default now()
);

-- RLS policies
alter table learner_profiles enable row level security;

create policy "Users can read own learner profile"
  on learner_profiles for select
  using (auth.uid() = user_id);

create policy "Users can insert own learner profile"
  on learner_profiles for insert
  with check (auth.uid() = user_id);

create policy "Users can update own learner profile"
  on learner_profiles for update
  using (auth.uid() = user_id);
