/*
  # Create barbers and follows tables

  1. New Tables
    - `barbers`
      - `id` (uuid, primary key)
      - `name` (text)
      - `location` (text)
      - `rating` (numeric)
      - `image_url` (text)
      - `about` (text)
      - `created_at` (timestamp)
    - `follows`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `barber_id` (uuid, references barbers)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on both tables
    - Add policies for:
      - Anyone can read barbers
      - Authenticated users can follow/unfollow barbers
      - Users can read their own follows
*/

-- Create barbers table
CREATE TABLE IF NOT EXISTS barbers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  location text NOT NULL,
  rating numeric NOT NULL DEFAULT 0,
  image_url text,
  about text,
  created_at timestamptz DEFAULT now()
);

-- Create follows table
CREATE TABLE IF NOT EXISTS follows (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL,
  barber_id uuid REFERENCES barbers NOT NULL,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, barber_id)
);

-- Enable RLS
ALTER TABLE barbers ENABLE ROW LEVEL SECURITY;
ALTER TABLE follows ENABLE ROW LEVEL SECURITY;

-- Policies for barbers
CREATE POLICY "Anyone can read barbers"
  ON barbers
  FOR SELECT
  TO public
  USING (true);

-- Policies for follows
CREATE POLICY "Users can manage their own follows"
  ON follows
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id);