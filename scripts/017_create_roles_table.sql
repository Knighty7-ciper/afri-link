/*
  # Create Roles Table

  1. New Tables
    - `roles`
      - `id` (uuid, primary key)
      - `name` (text, unique role name)
      - `description` (text, optional description)
      - `permissions` (text array, list of permissions)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `roles` table
    - Admins can view and manage roles
    - Regular users cannot access roles

  3. Notes
    - Role-based access control system
    - Permissions stored as array of strings
    - Used for fine-grained authorization
*/

CREATE TABLE IF NOT EXISTS roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text UNIQUE NOT NULL,
  description text,
  permissions text[] DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE roles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view roles"
  ON roles
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

CREATE POLICY "Admins can manage roles"
  ON roles
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

CREATE INDEX IF NOT EXISTS idx_roles_name ON roles(name);

INSERT INTO roles (name, description, permissions) VALUES
  ('admin', 'Administrator with full access', ARRAY['*']),
  ('user', 'Regular user with basic access', ARRAY['read:own', 'write:own'])
ON CONFLICT (name) DO NOTHING;
