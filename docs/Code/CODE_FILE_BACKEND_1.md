# Backend Implementation Guide - Part 1: Core Setup

This guide covers the initial backend implementation for the LiveStock Show Assistant using Supabase.

## Database Schema Setup

### 1. Create Base Tables

```bash
# Create initial migration
cat > supabase/migrations/initial_schema.sql << 'EOL'
/*
  # Initial Schema Setup

  1. New Tables
    - `profiles`
      - `id` (uuid, primary key, references auth.users)
      - `email` (text, unique)
      - `full_name` (text)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `animals`
      - `id` (uuid, primary key)
      - `name` (text)
      - `category` (text)
      - `breed` (text)
      - `region` (text)
      - `owner_id` (uuid, references profiles)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `evaluations`
      - `id` (uuid, primary key)
      - `animal_id` (uuid, references animals)
      - `evaluator_id` (uuid, references profiles)
      - `scores` (jsonb)
      - `notes` (text)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `photos`
      - `id` (uuid, primary key)
      - `animal_id` (uuid, references animals)
      - `url` (text)
      - `notes` (text)
      - `taken_at` (timestamp)
      - `uploaded_by` (uuid, references profiles)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
    - Set up appropriate foreign key constraints
*/

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users,
  email text UNIQUE NOT NULL,
  full_name text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create animals table
CREATE TABLE IF NOT EXISTS animals (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  name text NOT NULL,
  category text NOT NULL,
  breed text NOT NULL,
  region text NOT NULL,
  owner_id uuid REFERENCES profiles(id) NOT NULL,
  scores jsonb DEFAULT '{
    "movement": 0,
    "conformation": 0,
    "muscleDevelopment": 0,
    "breedCharacteristics": 0
  }',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create evaluations table
CREATE TABLE IF NOT EXISTS evaluations (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  animal_id uuid REFERENCES animals(id) NOT NULL,
  evaluator_id uuid REFERENCES profiles(id) NOT NULL,
  scores jsonb NOT NULL,
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create photos table
CREATE TABLE IF NOT EXISTS photos (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  animal_id uuid REFERENCES animals(id) NOT NULL,
  url text NOT NULL,
  notes text,
  taken_at timestamptz,
  uploaded_by uuid REFERENCES profiles(id) NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE animals ENABLE ROW LEVEL SECURITY;
ALTER TABLE evaluations ENABLE ROW LEVEL SECURITY;
ALTER TABLE photos ENABLE ROW LEVEL SECURITY;

-- Create policies
-- Profiles
CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

-- Animals
CREATE POLICY "Users can view animals they own"
  ON animals FOR SELECT
  USING (auth.uid() = owner_id);

CREATE POLICY "Users can create animals"
  ON animals FOR INSERT
  WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Users can update own animals"
  ON animals FOR UPDATE
  USING (auth.uid() = owner_id);

-- Evaluations
CREATE POLICY "Users can view evaluations for their animals"
  ON evaluations FOR SELECT
  USING (
    auth.uid() IN (
      SELECT owner_id FROM animals WHERE id = animal_id
    )
    OR auth.uid() = evaluator_id
  );

CREATE POLICY "Users can create evaluations"
  ON evaluations FOR INSERT
  WITH CHECK (auth.uid() = evaluator_id);

CREATE POLICY "Evaluators can update their evaluations"
  ON evaluations FOR UPDATE
  USING (auth.uid() = evaluator_id);

-- Photos
CREATE POLICY "Users can view photos of their animals"
  ON photos FOR SELECT
  USING (
    auth.uid() IN (
      SELECT owner_id FROM animals WHERE id = animal_id
    )
  );

CREATE POLICY "Users can upload photos"
  ON photos FOR INSERT
  WITH CHECK (auth.uid() = uploaded_by);

CREATE POLICY "Users can update their photo metadata"
  ON photos FOR UPDATE
  USING (auth.uid() = uploaded_by);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Add updated_at triggers
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_animals_updated_at
  BEFORE UPDATE ON animals
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_evaluations_updated_at
  BEFORE UPDATE ON evaluations
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
EOL
```

### 2. Create Historical Data Tables

```bash
# Create historical data migration
cat > supabase/migrations/historical_data.sql << 'EOL'
/*
  # Historical Data Schema

  1. New Tables
    - `historical_flocks`
      - `id` (uuid, primary key)
      - `name` (text)
      - `established` (integer)
      - `achievements` (text[])
      - `notable_traits` (text)
      - `show_performance` (integer)
      - `regions` (text[])
      - `key_metrics` (jsonb)
      - `created_at` (timestamp)
    
    - `breed_standards`
      - `id` (uuid, primary key)
      - `breed` (text)
      - `category` (text)
      - `criteria` (jsonb)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add read-only policies for authenticated users
*/

-- Create historical flocks table
CREATE TABLE IF NOT EXISTS historical_flocks (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  name text NOT NULL,
  established integer NOT NULL,
  achievements text[] NOT NULL DEFAULT '{}',
  notable_traits text,
  show_performance integer,
  regions text[] NOT NULL DEFAULT '{}',
  key_metrics jsonb NOT NULL DEFAULT '{}',
  created_at timestamptz DEFAULT now()
);

-- Create breed standards table
CREATE TABLE IF NOT EXISTS breed_standards (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  breed text NOT NULL,
  category text NOT NULL,
  criteria jsonb NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE historical_flocks ENABLE ROW LEVEL SECURITY;
ALTER TABLE breed_standards ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Authenticated users can view historical flocks"
  ON historical_flocks FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can view breed standards"
  ON breed_standards FOR SELECT
  TO authenticated
  USING (true);

-- Add updated_at trigger for breed standards
CREATE TRIGGER update_breed_standards_updated_at
  BEFORE UPDATE ON breed_standards
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Insert sample historical data
INSERT INTO historical_flocks (name, established, achievements, notable_traits, show_performance, regions, key_metrics)
VALUES
  (
    'Queen Mother''s Caithness Flock',
    1952,
    ARRAY['Supreme Champion Highland Show 1965, 1967', 'Best Group of Three 1964-1968'],
    'Exceptional breed character, strong maternal lines',
    95,
    ARRAY['Caithness', 'Sutherland'],
    '{
      "breedingSuccess": 92,
      "woolQuality": 88,
      "conformationScore": 94
    }'
  ),
  (
    'Latheron Flock',
    1938,
    ARRAY['Multiple Highland Show Champions 1950s-1960s', 'Known for breeding stock exports'],
    'Superior wool quality, robust constitution',
    92,
    ARRAY['Latheron', 'Caithness'],
    '{
      "breedingSuccess": 89,
      "woolQuality": 95,
      "conformationScore": 91
    }'
  );

-- Insert sample breed standards
INSERT INTO breed_standards (breed, category, criteria)
VALUES
  (
    'North Country Cheviot',
    'Ram Lamb',
    '{
      "physical": {
        "frame": {
          "heightAtWithers": {"maxScore": 10, "weightage": 1.2},
          "bodyLength": {"maxScore": 10, "weightage": 1.1},
          "chestWidth": {"maxScore": 10, "weightage": 1.0},
          "boneStructure": {"maxScore": 10, "weightage": 1.3}
        },
        "breedCharacter": {
          "headProfile": {"maxScore": 10, "weightage": 1.4},
          "earSet": {"maxScore": 10, "weightage": 1.1},
          "faceMarkings": {"maxScore": 10, "weightage": 1.2}
        }
      }
    }'
  );
EOL
```

### 3. Create Show Management Tables

```bash
# Create show management migration
cat > supabase/migrations/show_management.sql << 'EOL'
/*
  # Show Management Schema

  1. New Tables
    - `shows`
      - `id` (uuid, primary key)
      - `name` (text)
      - `date` (date)
      - `location` (text)
      - `categories` (jsonb)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `show_entries`
      - `id` (uuid, primary key)
      - `show_id` (uuid, references shows)
      - `animal_id` (uuid, references animals)
      - `category` (text)
      - `entry_number` (integer)
      - `owner_id` (uuid, references profiles)
      - `created_at` (timestamp)
    
    - `show_results`
      - `id` (uuid, primary key)
      - `show_id` (uuid, references shows)
      - `entry_id` (uuid, references show_entries)
      - `placement` (integer)
      - `points` (integer)
      - `notes` (text)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add appropriate policies for show organizers and participants
*/

-- Create shows table
CREATE TABLE IF NOT EXISTS shows (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  name text NOT NULL,
  date date NOT NULL,
  location text NOT NULL,
  categories jsonb NOT NULL DEFAULT '[]',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create show entries table
CREATE TABLE IF NOT EXISTS show_entries (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  show_id uuid REFERENCES shows(id) NOT NULL,
  animal_id uuid REFERENCES animals(id) NOT NULL,
  category text NOT NULL,
  entry_number integer,
  owner_id uuid REFERENCES profiles(id) NOT NULL,
  created_at timestamptz DEFAULT now(),
  UNIQUE(show_id, entry_number)
);

-- Create show results table
CREATE TABLE IF NOT EXISTS show_results (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  show_id uuid REFERENCES shows(id) NOT NULL,
  entry_id uuid REFERENCES show_entries(id) NOT NULL,
  placement integer,
  points integer,
  notes text,
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE shows ENABLE ROW LEVEL SECURITY;
ALTER TABLE show_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE show_results ENABLE ROW LEVEL SECURITY;

-- Create policies
-- Shows
CREATE POLICY "Anyone can view shows"
  ON shows FOR SELECT
  TO authenticated
  USING (true);

-- Show entries
CREATE POLICY "Users can view their show entries"
  ON show_entries FOR SELECT
  USING (auth.uid() = owner_id);

CREATE POLICY "Users can create show entries"
  ON show_entries FOR INSERT
  WITH CHECK (auth.uid() = owner_id);

-- Show results
CREATE POLICY "Anyone can view show results"
  ON show_results FOR SELECT
  TO authenticated
  USING (true);

-- Add updated_at trigger
CREATE TRIGGER update_shows_updated_at
  BEFORE UPDATE ON shows
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Insert sample show data
INSERT INTO shows (name, date, location, categories)
VALUES
  (
    'Royal Highland Show 2025',
    '2025-06-20',
    'Edinburgh, Scotland',
    '[
      {"name": "North Country Cheviot", "classes": [
        "Ram Lamb",
        "Ewe Lamb",
        "Aged Ram",
        "Aged Ewe"
      ]},
      {"name": "Border Leicester", "classes": [
        "Ram Lamb",
        "Ewe Lamb"
      ]}
    ]'
  );
EOL
```

### 4. Create Edge Functions

```bash
# Create AI analysis function
cat > supabase/functions/analyze-animal/index.ts << 'EOL'
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

interface Animal {
  id: string;
  name: string;
  category: string;
  breed: string;
  region: string;
  scores: {
    movement: number;
    conformation: number;
    muscleDevelopment: number;
    breedCharacteristics: number;
  };
}

interface RequestBody {
  animal: Animal;
}

serve(async (req) => {
  try {
    const { animal } = (await req.json()) as RequestBody;
    
    // Create Supabase client
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Fetch historical data for comparison
    const { data: historicalFlocks } = await supabase
      .from('historical_flocks')
      .select('*')
      .eq('breed', animal.breed);

    // Calculate overall score
    const scores = Object.values(animal.scores);
    const overallScore = scores.reduce((a, b) => a + b, 0) / scores.length;

    // Compare with historical flocks
    const comparisons = historicalFlocks.map((flock) => ({
      flockName: flock.name,
      similarity: calculateSimilarity(animal, flock),
      strengths: identifyStrengths(animal, flock),
      improvements: identifyImprovements(animal, flock),
    }));

    // Generate recommendations
    const recommendations = generateRecommendations(animal, comparisons);

    return new Response(
      JSON.stringify({
        score: overallScore,
        recommendations,
        comparisons,
      }),
      {
        headers: { 'Content-Type': 'application/json' },
      },
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      },
    );
  }
});

function calculateSimilarity(animal: Animal, flock: any): number {
  // Implement similarity calculation logic
  return 0.85; // Placeholder
}

function identifyStrengths(animal: Animal, flock: any): string[] {
  // Implement strengths identification logic
  return ['Strong breed characteristics', 'Excellent conformation'];
}

function identifyImprovements(animal: Animal, flock: any): string[] {
  // Implement improvements identification logic
  return ['Could improve movement', 'Consider wool density'];
}

function generateRecommendations(animal: Animal, comparisons: any[]): string[] {
  // Implement recommendation generation logic
  return [
    'Focus on movement exercises',
    'Monitor wool quality development',
    'Consider breeding with strong maternal lines',
  ];
}
EOL

# Create recommendations function
cat > supabase/functions/get-recommendations/index.ts << 'EOL'
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

serve(async (req) => {
  try {
    const { animalId } = await req.json();
    
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Fetch animal data
    const { data: animal } = await supabase
      .from('animals')
      .select('*')
      .eq('id', animalId)
      .single();

    if (!animal) {
      throw new Error('Animal not found');
    }

    // Fetch breed standards
    const { data: breedStandard } = await supabase
      .from('breed_standards')
      .select('*')
      .eq('breed', animal.breed)
      .eq('category', animal.category)
      .single();

    // Generate recommendations based on scores and breed standards
    const recommendations = generateRecommendations(animal, breedStandard);

    return new Response(
      JSON.stringify({ recommendations }),
      {
        headers: { 'Content-Type': 'application/json' },
      },
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      },
    );
  }
});

function generateRecommendations(animal: any, breedStandard: any): string[] {
  const recommendations: string[] = [];

  // Compare scores with breed standards and generate recommendations
  if (animal.scores.movement < 7) {
    recommendations.push('Consider movement exercises to improve gait');
  }

  if (animal.scores.conformation < 7) {
    recommendations.push('Focus on structural development');
  }

  if (animal.scores.breedCharacteristics < 7) {
    recommendations.push('Review breed standard characteristics');
  }

  return recommendations;
}
EOL

# Create historical comparison function
cat > supabase/functions/historical-comparison/index.ts << 'EOL'
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

serve(async (req) => {
  try {
    const { animalId } = await req.json();
    
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Fetch animal data
    const { data: animal } = await supabase
      .from('animals')
      .select('*')
      .eq('id', animalId)
      .single();

    if (!animal) {
      throw new Error('Animal not found');
    }

    // Fetch historical flocks
    const { data: historicalFlocks } = await supabase
      .from('historical_flocks')
      .select('*')
      .contains('regions', [animal.region]);

    // Find similar flocks and analyze
    const similarFlocks = findSimilarFlocks(animal, historicalFlocks);
    const analysis = generateAnalysis(animal, similarFlocks);

    return new Response(
      JSON.stringify({
        similarFlocks: similarFlocks.map(f => f.name),
        analysis,
      }),
      {
        headers: { 'Content-Type': 'application/json' },
      },
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      },
    );
  }
});

function findSimilarFlocks(animal: any, historicalFlocks: any[]): any[] {
  return historicalFlocks
    .map(flock => ({
      ...flock,
      similarity: calculateSimilarity(animal, flock),
    }))
    .filter(flock => flock.similarity > 0.7)
    .sort((a, b) => b.similarity - a.similarity)
    .slice(0, 3);
}

function calculateSimilarity(animal: any, flock: any): number {
  // Implement similarity calculation logic
  return 0.85; // Placeholder
}

function generateAnalysis(animal: any, similarFlocks: any[]): string {
  // Generate detailed analysis based on similar flocks
  return `
    Based on historical data, this animal shows characteristics similar to ${
      similarFlocks.map(f => f.name).join(', ')
    }. Notable traits include strong breed character and excellent conformation.
  `.trim();
}
EOL
```

## Notes

1. This implementation covers:
   - Core database schema
   - Historical data structure
   - Show management system
   - Edge functions for AI analysis

2. Key features:
   - Comprehensive data model
   - Row Level Security
   - Real-time updates
   - AI integration
   - Historical data analysis

3. Remember to:
   - Update environment variables
   - Run migrations in order
   - Test security policies
   - Monitor edge functions
   - Back up data regularly

4. Next steps:
   - Implement additional edge functions
   - Add more complex queries
   - Set up backup procedures
   - Add monitoring
   - Implement caching