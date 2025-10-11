/*
  # Create News and News Categories Tables

  1. New Tables
    - `news_categories`
      - `id` (uuid, primary key)
      - `name` (text, category name)
      - `description` (text, optional description)
      - `slug` (text, unique URL-friendly identifier)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

    - `news`
      - `id` (uuid, primary key)
      - `title` (text, news title)
      - `content` (text, news content)
      - `category_id` (uuid, optional foreign key to news_categories)
      - `author_id` (uuid, foreign key to profiles)
      - `published` (boolean, default false)
      - `image_url` (text, optional featured image)
      - `tags` (text array, optional tags)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on both tables
    - Public can view published news and all categories
    - Authenticated users can view all news
    - Admins can manage news and categories

  3. Notes
    - News system for currency/economic updates
    - Categories help organize news items
    - Tags provide additional classification
*/

CREATE TABLE IF NOT EXISTS news_categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  slug text UNIQUE NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS news (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  content text NOT NULL,
  category_id uuid REFERENCES news_categories(id) ON DELETE SET NULL,
  author_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  published boolean DEFAULT false,
  image_url text,
  tags text[],
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE news_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE news ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view news categories"
  ON news_categories
  FOR SELECT
  USING (true);

CREATE POLICY "Admins can manage news categories"
  ON news_categories
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

CREATE POLICY "Anyone can view published news"
  ON news
  FOR SELECT
  USING (published = true);

CREATE POLICY "Authenticated users can view all news"
  ON news
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admins can manage news"
  ON news
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

CREATE INDEX IF NOT EXISTS idx_news_categories_slug ON news_categories(slug);
CREATE INDEX IF NOT EXISTS idx_news_category_id ON news(category_id);
CREATE INDEX IF NOT EXISTS idx_news_author_id ON news(author_id);
CREATE INDEX IF NOT EXISTS idx_news_published ON news(published);
CREATE INDEX IF NOT EXISTS idx_news_created_at ON news(created_at DESC);
