/*
  # Create Economic Indicators Table

  1. New Tables
    - `economic_indicators`
      - `id` (uuid, primary key)
      - `country_code` (text, 2-char country code)
      - `indicator_type` (text, type of indicator: gdp, inflation, etc.)
      - `value` (numeric, indicator value)
      - `period` (text, time period for the indicator)
      - `source` (text, optional data source)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `economic_indicators` table
    - Public can view all economic indicators
    - Admins can manage economic indicators

  3. Notes
    - Stores economic data for different countries
    - Used for analytics and currency predictions
    - Period format: YYYY-MM or YYYY-Q1/Q2/Q3/Q4
*/

CREATE TABLE IF NOT EXISTS economic_indicators (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  country_code text NOT NULL CHECK (length(country_code) = 2),
  indicator_type text NOT NULL CHECK (
    indicator_type IN ('gdp', 'inflation', 'unemployment', 'interest_rate', 'trade_balance')
  ),
  value numeric NOT NULL,
  period text NOT NULL,
  source text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE economic_indicators ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view economic indicators"
  ON economic_indicators
  FOR SELECT
  USING (true);

CREATE POLICY "Admins can manage economic indicators"
  ON economic_indicators
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

CREATE INDEX IF NOT EXISTS idx_economic_indicators_country_code ON economic_indicators(country_code);
CREATE INDEX IF NOT EXISTS idx_economic_indicators_type ON economic_indicators(indicator_type);
CREATE INDEX IF NOT EXISTS idx_economic_indicators_period ON economic_indicators(period DESC);
CREATE INDEX IF NOT EXISTS idx_economic_indicators_country_type ON economic_indicators(country_code, indicator_type);
