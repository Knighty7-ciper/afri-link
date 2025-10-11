/*
  # Create Countries Table

  1. New Tables
    - `countries`
      - `id` (uuid, primary key)
      - `code` (text, unique, 2-char country code)
      - `name` (text, country name)
      - `currency_code` (text, 3-char currency code)
      - `flag_url` (text, optional flag image URL)
      - `is_active` (boolean, default true)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `countries` table
    - Add policy for public read access to active countries
    - Add policy for admin to manage countries

  3. Notes
    - Used for storing country information and currency mapping
    - Links to currencies table via currency_code
*/

CREATE TABLE IF NOT EXISTS countries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code text UNIQUE NOT NULL CHECK (length(code) = 2),
  name text NOT NULL,
  currency_code text NOT NULL CHECK (length(currency_code) = 3),
  flag_url text,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE countries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active countries"
  ON countries
  FOR SELECT
  USING (is_active = true);

CREATE POLICY "Admins can manage countries"
  ON countries
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

CREATE INDEX IF NOT EXISTS idx_countries_code ON countries(code);
CREATE INDEX IF NOT EXISTS idx_countries_currency_code ON countries(currency_code);
CREATE INDEX IF NOT EXISTS idx_countries_is_active ON countries(is_active);
