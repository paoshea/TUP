# LiveStock Show Assistant Database Schema

## Overview

This document outlines the complete database schema for the LiveStock Show Assistant, with a primary focus on the Ram Lamb category as a template for other livestock types. The schema is designed to be extensible and adaptable for various livestock categories while maintaining consistent evaluation patterns.

## Core Tables

### 1. Animals

Primary table for livestock records.

```sql
CREATE TABLE animals (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  name text NOT NULL,
  category text NOT NULL, -- e.g., 'Ram Lamb'
  breed text NOT NULL,    -- e.g., 'North Country Cheviot'
  region text NOT NULL,   -- e.g., 'Caithness'
  owner_id uuid REFERENCES profiles(id) NOT NULL,
  birth_date date,
  registration_number text,
  sire_id uuid REFERENCES animals(id),
  dam_id uuid REFERENCES animals(id),
  status text CHECK (status IN ('active', 'archived', 'sold', 'deceased')),
  metadata jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Ram Lamb specific metadata structure
{
  "physical": {
    "birth_weight": number,      -- in kg
    "current_weight": number,    -- in kg
    "height_at_withers": number, -- in cm
    "scrotal_circumference": number, -- in cm
    "fleece_stats": {
      "density": number,
      "staple_length": number,
      "micron_count": number
    }
  },
  "genetic": {
    "index_values": {
      "maternal_ability": number,
      "growth_rate": number,
      "muscle_depth": number
    },
    "inbreeding_coefficient": number
  },
  "certifications": [
    {
      "type": string,
      "number": string,
      "issued_date": timestamp,
      "expiry_date": timestamp
    }
  ]
}
```

### 2. Evaluations

Comprehensive evaluation records.

```sql
CREATE TABLE evaluations (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  animal_id uuid REFERENCES animals(id) NOT NULL,
  evaluator_id uuid REFERENCES profiles(id) NOT NULL,
  event_id uuid REFERENCES shows(id),
  scores jsonb NOT NULL,
  notes text,
  weather_conditions jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Ram Lamb evaluation scores structure
{
  "physical": {
    "frame": {
      "height_at_withers": {
        "score": number,         -- 1-10
        "weight": 1.2,
        "notes": string
      },
      "body_length": {
        "score": number,
        "weight": 1.1,
        "notes": string
      },
      "chest_width": {
        "score": number,
        "weight": 1.0,
        "notes": string
      },
      "bone_structure": {
        "score": number,
        "weight": 1.3,
        "notes": string
      }
    },
    "breed_character": {
      "head_profile": {
        "score": number,
        "weight": 1.4,
        "notes": string
      },
      "ear_set": {
        "score": number,
        "weight": 1.1,
        "notes": string
      },
      "face_markings": {
        "score": number,
        "weight": 1.2,
        "notes": string
      }
    },
    "wool": {
      "density": {
        "score": number,
        "weight": 1.2,
        "notes": string
      },
      "quality": {
        "score": number,
        "weight": 1.3,
        "notes": string
      },
      "length": {
        "score": number,
        "weight": 1.1,
        "notes": string
      }
    },
    "movement": {
      "gait": {
        "score": number,
        "weight": 1.3,
        "notes": string
      },
      "tracking": {
        "score": number,
        "weight": 1.2,
        "notes": string
      },
      "mobility": {
        "score": number,
        "weight": 1.1,
        "notes": string
      }
    }
  },
  "market": {
    "muscle_development": {
      "loin": {
        "score": number,
        "weight": 1.4,
        "notes": string
      },
      "gigot": {
        "score": number,
        "weight": 1.3,
        "notes": string
      },
      "shoulder": {
        "score": number,
        "weight": 1.2,
        "notes": string
      }
    },
    "finish": {
      "fat_cover": {
        "score": number,
        "weight": 1.2,
        "notes": string
      },
      "distribution": {
        "score": number,
        "weight": 1.1,
        "notes": string
      }
    }
  }
}
```

### 3. Breed Standards

Reference data for breed-specific evaluation criteria.

```sql
CREATE TABLE breed_standards (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  breed text NOT NULL,
  category text NOT NULL,
  criteria jsonb NOT NULL,
  source text,
  version integer,
  effective_date date,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Ram Lamb breed standards structure
{
  "physical_ideal": {
    "frame": {
      "height_range": {
        "min": number,  -- in cm
        "max": number,
        "optimal": number
      },
      "body_length": {
        "proportion_to_height": number,
        "description": string
      },
      "bone_quality": {
        "characteristics": string[],
        "disqualifying_faults": string[]
      }
    },
    "head": {
      "profile": string,
      "ear_position": string,
      "face_color": string[],
      "disqualifying_features": string[]
    },
    "wool": {
      "density": {
        "description": string,
        "minimum_rating": number
      },
      "staple_length": {
        "range": {
          "min": number,
          "max": number
        },
        "optimal": number
      },
      "micron_count": {
        "range": {
          "min": number,
          "max": number
        },
        "optimal": number
      }
    }
  },
  "scoring_guide": {
    "frame": {
      "10": "Exceptional - Perfect height, length, and proportions",
      "8-9": "Excellent - Minor deviations from ideal",
      "6-7": "Good - Notable but acceptable deviations",
      "4-5": "Fair - Significant deviations",
      "1-3": "Poor - Major conformational issues"
    },
    "breed_character": {
      "10": "Exemplary breed type",
      "8-9": "Strong breed character",
      "6-7": "Acceptable breed character",
      "4-5": "Weak breed character",
      "1-3": "Poor breed character"
    }
  },
  "disqualifications": [
    "Incorrect color markings",
    "Serious jaw defects",
    "Evidence of horns",
    "Inverted eyelids"
  ]
}
```

### 4. Historical Data

Reference data for historical flock performance.

```sql
CREATE TABLE historical_flocks (
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

-- Historical metrics structure
{
  "breeding": {
    "lambing_percentage": number,
    "lamb_survival_rate": number,
    "average_birth_weight": number,
    "average_weaning_weight": number
  },
  "show_performance": {
    "championships_won": number,
    "first_place_wins": number,
    "average_placing": number
  },
  "genetic_influence": {
    "breed_impact_score": number,
    "notable_bloodlines": string[],
    "trait_improvements": {
      "conformation": number,
      "wool_quality": number,
      "growth_rate": number
    }
  }
}
```

### 5. Show Management

Track show entries and results.

```sql
CREATE TABLE shows (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  name text NOT NULL,
  date date NOT NULL,
  location text NOT NULL,
  categories jsonb NOT NULL DEFAULT '[]',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE show_entries (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  show_id uuid REFERENCES shows(id) NOT NULL,
  animal_id uuid REFERENCES animals(id) NOT NULL,
  category text NOT NULL,
  entry_number integer,
  owner_id uuid REFERENCES profiles(id) NOT NULL,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE show_results (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  show_id uuid REFERENCES shows(id) NOT NULL,
  entry_id uuid REFERENCES show_entries(id) NOT NULL,
  placement integer,
  points integer,
  judge_comments text,
  created_at timestamptz DEFAULT now()
);

-- Show categories structure
[
  {
    "name": "North Country Cheviot",
    "classes": [
      {
        "name": "Ram Lamb",
        "requirements": {
          "age_range": {
            "min": 0,
            "max": 12,
            "unit": "months"
          },
          "registration": "required",
          "minimum_entries": 3
        }
      }
    ]
  }
]
```

## Supporting Tables

### 1. Measurements

Track growth and development metrics.

```sql
CREATE TABLE measurements (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  animal_id uuid REFERENCES animals(id) NOT NULL,
  recorded_by uuid REFERENCES profiles(id) NOT NULL,
  date date NOT NULL,
  data jsonb NOT NULL,
  notes text,
  created_at timestamptz DEFAULT now()
);

-- Ram Lamb measurements structure
{
  "weight": {
    "value": number,
    "unit": "kg"
  },
  "height": {
    "withers": number,
    "back": number,
    "unit": "cm"
  },
  "circumference": {
    "heart_girth": number,
    "scrotal": number,
    "unit": "cm"
  },
  "muscle_scanning": {
    "eye_muscle_depth": number,
    "eye_muscle_width": number,
    "fat_depth": number,
    "unit": "mm"
  }
}
```

### 2. Health Records

Track medical history and treatments.

```sql
CREATE TABLE health_records (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  animal_id uuid REFERENCES animals(id) NOT NULL,
  recorded_by uuid REFERENCES profiles(id) NOT NULL,
  record_type text NOT NULL,
  date date NOT NULL,
  details jsonb NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Health record structure
{
  "type": "vaccination" | "treatment" | "examination" | "procedure",
  "category": "routine" | "emergency" | "preventive",
  "details": {
    "condition": string,
    "treatment": string,
    "medication": {
      "name": string,
      "dosage": string,
      "route": string
    },
    "withdrawal_period": {
      "days": number,
      "end_date": timestamp
    }
  },
  "follow_up": {
    "required": boolean,
    "date": timestamp,
    "instructions": string
  }
}
```

## Notes

1. All tables include:
   - UUID primary keys
   - Timestamps for creation/updates
   - Appropriate foreign key constraints
   - Row Level Security policies

2. JSON structures are used for:
   - Flexible metadata storage
   - Complex scoring systems
   - Extensible measurement data
   - Detailed health records

3. Indexing strategy:
   - B-tree indexes on all foreign keys
   - GiST indexes on jsonb columns
   - Composite indexes for common queries

4. Data validation:
   - Check constraints on status fields
   - JSON schema validation for structured data
   - Trigger-based validation for complex rules

5. Extension considerations:
   - Schema designed to accommodate multiple species
   - Flexible scoring systems for different categories
   - Extensible metadata structures
   - Configurable breed standards