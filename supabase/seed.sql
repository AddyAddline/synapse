-- ============================================
-- Seed: Phase 1 Lessons (first 3 for initial development)
-- ============================================

-- Lesson 1: Hello MATLAB
INSERT INTO lessons (phase, order_num, title, description, difficulty, estimated_minutes, content_md)
VALUES (1, 1, 'Hello MATLAB',
  'Your very first MATLAB commands — displaying text, basic arithmetic, and understanding the command window.',
  'beginner', 20,
  '# Hello MATLAB!

Welcome to your MATLAB journey! MATLAB (short for **MAT**rix **LAB**oratory) is a powerful tool used by scientists all over the world to analyze data — including brain signals from EEG experiments.

Don''t worry if you''ve never written code before. We''ll start from the very basics.

## Your First Command

The simplest thing you can do in MATLAB is display text on the screen. Try this:

```matlab
disp(''Hello, Neuroscience!'')
```

`disp` is short for **display**. It shows whatever you put inside the parentheses.

## Basic Math

MATLAB is like a powerful calculator. Try these:

```matlab
2 + 3
10 - 4
5 * 3
20 / 4
2 ^ 3
```

The `^` symbol means "to the power of" — so `2^3` means 2 × 2 × 2 = 8.

## Semicolons: To Show or Not to Show

```matlab
5 + 3      % This shows the result: 8
5 + 3;     % This runs silently (no output shown)
```

The `%` symbol starts a **comment** — text that MATLAB ignores.

## The `disp` Function

```matlab
disp(42)
disp(3.14159)
```

## Why This Matters for Neuroscience

Every analysis you''ll do — loading EEG data, filtering brain signals, calculating frequencies — starts with these basic commands.');

-- Lesson 1 Exercises
INSERT INTO exercises (lesson_id, order_num, title, prompt, starter_code, solution, hints, test_cases, requires_plot)
VALUES
(1, 1, 'Display a greeting',
  'Use the `disp` function to display the text: Hello, World!',
  '% Display ''Hello, World!'' below
',
  'disp(''Hello, World!'')',
  '["The disp function takes something inside parentheses and shows it on screen.", "Text needs to be wrapped in single quotes: ''like this''", "The answer looks like: disp(''...'')"]',
  '[{"expected_output": "Hello, World!\n"}]',
  false),

(1, 2, 'Brain math',
  'The human brain has approximately 86 billion neurons. Each neuron can have up to 10,000 connections. Calculate the total number of possible synapses and display it. Hint: 86 billion = 86e9',
  'neurons = 86e9;
connections_per_neuron = 10000;

% Calculate and display the total
',
  'neurons = 86e9;
connections_per_neuron = 10000;
total_synapses = neurons * connections_per_neuron;
disp(total_synapses)',
  '["Multiply the number of neurons by the connections per neuron.", "Store the result: total_synapses = neurons * connections_per_neuron", "Then display it: disp(total_synapses)"]',
  '[{"expected_output": "860000000000000\n"}]',
  false),

(1, 3, 'Silent calculation',
  'Calculate 2 to the power of 10 and store it in a variable called `result`, but do NOT show the intermediate calculation. Only display the final answer using `disp`. Remember: adding a semicolon `;` suppresses output.',
  '% Calculate 2^10 silently, then display it
',
  'result = 2^10;
disp(result)',
  '["Use the ^ operator for exponents: 2^10", "Add a semicolon after the assignment: result = 2^10;", "Then use disp(result) to show just the final answer"]',
  '[{"expected_output": "1024\n"}]',
  false);


-- Lesson 2: Variables & Types
INSERT INTO lessons (phase, order_num, title, description, difficulty, estimated_minutes, content_md)
VALUES (1, 2, 'Variables & Types',
  'Learn to store data in variables — numbers, text, and logical values. The building blocks of every program.',
  'beginner', 25,
  '# Variables & Types

Imagine you''re running a meditation experiment. You need to keep track of things like the participant''s name, their heart rate, and whether they completed the session. In MATLAB, we use **variables** to store these pieces of information.

## Creating Variables

```matlab
age = 25
name = ''Priya''
heartRate = 72.5
```

The `=` sign means "store this value." It does NOT mean "equals" in the math sense.

## Types of Data

### Numbers (doubles)
```matlab
sampling_rate = 256;      % Hz
temperature = 36.6;
```

### Text (character arrays)
```matlab
participant = ''Subject_01'';
condition = ''meditation'';
```

### Logical (true/false)
```matlab
is_meditating = true;
completed_session = false;
```

## Checking Variables

```matlab
whos          % See all variables
class(x)     % Check type
```

## Overwriting Variables

```matlab
count = 1;
count = count + 1;   % Now count is 2
```');

-- Lesson 2 Exercises
INSERT INTO exercises (lesson_id, order_num, title, prompt, starter_code, solution, hints, test_cases, requires_plot)
VALUES
(2, 1, 'Store experiment data',
  'Create three variables: subject_name = ''Participant_01'', sampling_rate = 256, duration_minutes = 30. Display each.',
  '% Create your experiment variables


% Display each variable
',
  'subject_name = ''Participant_01'';
sampling_rate = 256;
duration_minutes = 30;
disp(subject_name)
disp(sampling_rate)
disp(duration_minutes)',
  '["Text values go in single quotes", "Numbers don''t need quotes: sampling_rate = 256;", "Use disp(variable_name) for each one"]',
  '[{"expected_output": "Participant_01\n256\n30\n"}]',
  false),

(2, 2, 'Calculate total samples',
  'total_samples = sampling_rate × duration_in_seconds. Given: sampling_rate = 256, duration_minutes = 10. Convert to seconds first, then calculate.',
  'sampling_rate = 256;
duration_minutes = 10;

% Convert to seconds


% Calculate total samples


% Display the result
',
  'sampling_rate = 256;
duration_minutes = 10;
duration_seconds = duration_minutes * 60;
total_samples = sampling_rate * duration_seconds;
disp(total_samples)',
  '["Multiply minutes by 60 to get seconds", "duration_seconds = duration_minutes * 60", "Then: total_samples = sampling_rate * duration_seconds"]',
  '[{"expected_output": "153600\n"}]',
  false),

(2, 3, 'Update a counter',
  'Start with sessions = 0. Increment it by 1 three times. Display the final count.',
  'sessions = 0;

% Increment sessions three times


% Display the final count
',
  'sessions = 0;
sessions = sessions + 1;
sessions = sessions + 1;
sessions = sessions + 1;
disp(sessions)',
  '["To add 1: sessions = sessions + 1", "Do this three times on separate lines", "The final value should be 3"]',
  '[{"expected_output": "3\n"}]',
  false);


-- Lesson 3: Arrays & Matrices
INSERT INTO lessons (phase, order_num, title, description, difficulty, estimated_minutes, content_md)
VALUES (1, 3, 'Arrays & Matrices',
  'The heart of MATLAB — creating and working with arrays and matrices. Essential for handling EEG channel data.',
  'beginner', 35,
  '# Arrays & Matrices

MATLAB was built for matrices. An **array** is a list of numbers, and a **matrix** is a grid. EEG data is a matrix: channels × time points.

## Creating Arrays

```matlab
eeg_channel = [1.2, 3.4, 2.1, 5.6, 4.3]   % row vector
electrodes = [1; 2; 3; 4; 5]                % column vector
```

## Quick Creation

```matlab
x = 1:5              % [1 2 3 4 5]
x = 0:0.5:2          % [0 0.5 1.0 1.5 2.0]
t = linspace(0, 1, 5) % 5 points from 0 to 1
z = zeros(1, 5)       % [0 0 0 0 0]
```

## Indexing

```matlab
data = [10 20 30 40 50];
data(1)      % 10
data(3)      % 30
data(end)    % 50
data(2:4)    % [20 30 40]
```

## Array Math

```matlab
raw = [1.2 3.4 2.1 5.6 4.3];
scaled = raw * 1000;               % multiply all
shifted = raw - mean(raw);         % subtract average
```

## Useful Functions

```matlab
length(data)   mean(data)   max(data)   min(data)   sort(data)
```

## Matrices

```matlab
eeg = [1.2 3.4 2.1; 0.8 2.9 1.7; 1.5 3.8 2.4];
eeg(2, 3)      % row 2, col 3
eeg(1, :)      % entire first row
eeg(:, 2)      % entire second column
```');

-- Lesson 3 Exercises
INSERT INTO exercises (lesson_id, order_num, title, prompt, starter_code, solution, hints, test_cases, requires_plot)
VALUES
(3, 1, 'Create a time vector',
  'Create a time vector `t` from 0 to 1 second with step 0.1 using the colon operator. Display it.',
  '% Create time vector from 0 to 1 with step 0.1


% Display it
',
  't = 0:0.1:1;
disp(t)',
  '["Colon operator syntax: start:step:end", "For 0 to 1 with step 0.1: t = 0:0.1:1", "Then use disp(t)"]',
  '[]',
  false),

(3, 2, 'EEG channel statistics',
  'Given: signal = [2.3, -1.5, 4.2, 0.8, -3.1, 5.7, 1.2, -0.4]. Calculate and display the mean, max, and min.',
  'signal = [2.3, -1.5, 4.2, 0.8, -3.1, 5.7, 1.2, -0.4];

% Calculate and display the mean


% Calculate and display the maximum


% Calculate and display the minimum
',
  'signal = [2.3, -1.5, 4.2, 0.8, -3.1, 5.7, 1.2, -0.4];
disp(mean(signal))
disp(max(signal))
disp(min(signal))',
  '["Use mean(), max(), min()", "Put the function inside disp: disp(mean(signal))", "Mean should be about 1.15"]',
  '[]',
  false),

(3, 3, 'Extract brain wave data',
  'Given: eeg = [1.2 3.4 2.1 5.6; 0.8 2.9 1.7 4.2; 1.5 3.8 2.4 6.1]. Extract and display: 1) entire second row, 2) value at row 3 col 4, 3) all of column 1.',
  'eeg = [1.2 3.4 2.1 5.6; 0.8 2.9 1.7 4.2; 1.5 3.8 2.4 6.1];

% Display entire second row


% Display value at row 3, column 4


% Display all values in column 1
',
  'eeg = [1.2 3.4 2.1 5.6; 0.8 2.9 1.7 4.2; 1.5 3.8 2.4 6.1];
disp(eeg(2, :))
disp(eeg(3, 4))
disp(eeg(:, 1))',
  '["Use (row, column) to index. : means all.", "Row 2: eeg(2, :)", "Single value: eeg(3, 4). Column 1: eeg(:, 1)"]',
  '[]',
  false);
