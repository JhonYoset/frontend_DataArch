-- Initialize database with sample data
-- This script runs automatically when the PostgreSQL container starts

-- Create sample users (these will be linked to Google OAuth users)
INSERT INTO users (id, email, role, full_name, created_at, updated_at) VALUES 
  ('550e8400-e29b-41d4-a716-446655440000', 'admin@dataarchlabs.com', 'admin', 'Santiago Rodriguez', NOW(), NOW()),
  ('550e8400-e29b-41d4-a716-446655440001', 'dario@dataarchlabs.com', 'member', 'Dario Martinez', NOW(), NOW()),
  ('550e8400-e29b-41d4-a716-446655440002', 'naomi@dataarchlabs.com', 'member', 'Naomi Chen', NOW(), NOW()),
  ('550e8400-e29b-41d4-a716-446655440003', 'fabiola@dataarchlabs.com', 'member', 'Fabiola Garcia', NOW(), NOW())
ON CONFLICT (email) DO NOTHING;

-- Create sample team members
INSERT INTO team_members (id, user_id, name, role, bio, research_areas, email, is_active, created_at, updated_at) VALUES 
  ('660e8400-e29b-41d4-a716-446655440000', '550e8400-e29b-41d4-a716-446655440000', 'Santiago Rodriguez', 'Principal Investigator', 'Leading researcher in AI applications for architecture and sustainable design. PhD in Computer Science with focus on machine learning and data science.', ARRAY['AI in Architecture', 'Sustainable Design', 'Data Science'], 'santiago@dataarchlabs.com', true, NOW(), NOW()),
  ('660e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440001', 'Dario Martinez', 'Senior Researcher', 'Computer Scientist specializing in AI and software development. Expert in machine learning algorithms and their applications in architectural design.', ARRAY['Artificial Intelligence', 'Software Development', 'Machine Learning'], 'dario@dataarchlabs.com', true, NOW(), NOW()),
  ('660e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440002', 'Naomi Chen', 'Architecture Researcher', 'Undergraduate student in Architecture with research interests in sustainable design and AI applications in architecture.', ARRAY['Sustainable Design', 'AI in Architecture', 'Technology Innovation'], 'naomi@dataarchlabs.com', true, NOW(), NOW()),
  ('660e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440003', 'Fabiola Garcia', 'Data Scientist', 'Systems Engineering graduate with expertise in software engineering and data science. Focuses on data analysis and visualization.', ARRAY['Data Science', 'Software Engineering', 'Data Visualization'], 'fabiola@dataarchlabs.com', true, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- Create sample projects
INSERT INTO projects (id, name, description, content, team_members, status, created_by, created_at, updated_at) VALUES 
  ('770e8400-e29b-41d4-a716-446655440000', 'Elevated Cycleway', 'Research on sustainable urban mobility solutions using Rhino & Grasshopper with AI integration.', 'This project explores the development of elevated cycling infrastructure using computational design tools and artificial intelligence. We utilize Rhino and Grasshopper for parametric design and integrate AI algorithms for optimization.', ARRAY['660e8400-e29b-41d4-a716-446655440000', '660e8400-e29b-41d4-a716-446655440001'], 'active', '550e8400-e29b-41d4-a716-446655440000', NOW(), NOW()),
  ('770e8400-e29b-41d4-a716-446655440001', 'Biophilic Design - Schools', 'Integrating nature-inspired design principles in educational environments for enhanced learning.', 'This research focuses on implementing biophilic design principles in school environments to improve student well-being and learning outcomes. We study the impact of natural elements in architectural design.', ARRAY['660e8400-e29b-41d4-a716-446655440000', '660e8400-e29b-41d4-a716-446655440002'], 'active', '550e8400-e29b-41d4-a716-446655440000', NOW(), NOW()),
  ('770e8400-e29b-41d4-a716-446655440002', 'Smart Building Analytics', 'Development of AI-powered analytics for smart building management and energy optimization.', 'This project focuses on creating intelligent systems for building management using IoT sensors and machine learning algorithms to optimize energy consumption and improve occupant comfort.', ARRAY['660e8400-e29b-41d4-a716-446655440001', '660e8400-e29b-41d4-a716-446655440003'], 'completed', '550e8400-e29b-41d4-a716-446655440000', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- Create sample announcements
INSERT INTO announcements (id, title, content, date, links, created_by, created_at, updated_at) VALUES 
  ('880e8400-e29b-41d4-a716-446655440000', 'Welcome to Data Arch Labs Portal', 'We are excited to launch our new research group portal. This platform will serve as our central hub for collaboration and knowledge sharing.', CURRENT_DATE, ARRAY['https://dataarchlabs.com'], '550e8400-e29b-41d4-a716-446655440000', NOW(), NOW()),
  ('880e8400-e29b-41d4-a716-446655440001', 'Weekly Team Meeting', 'Join us for our weekly team meeting every Friday at 2:00 PM. We will discuss project updates and upcoming deadlines.', CURRENT_DATE + INTERVAL '1 day', ARRAY['https://meet.google.com/abc-defg-hij'], '550e8400-e29b-41d4-a716-446655440000', NOW(), NOW()),
  ('880e8400-e29b-41d4-a716-446655440002', 'New Research Publication', 'Our latest paper on AI applications in sustainable architecture has been accepted for publication in the International Journal of Architectural Computing.', CURRENT_DATE - INTERVAL '2 days', ARRAY['https://journals.sagepub.com/home/ija'], '550e8400-e29b-41d4-a716-446655440000', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- Create sample events
INSERT INTO events (id, title, description, date, time, location, type, created_by, created_at, updated_at) VALUES 
  ('990e8400-e29b-41d4-a716-446655440000', 'Weekly Team Meeting', 'Regular team meeting to discuss project progress and upcoming tasks.', CURRENT_DATE + INTERVAL '7 days', '14:00', 'Conference Room A', 'meeting', '550e8400-e29b-41d4-a716-446655440000', NOW(), NOW()),
  ('990e8400-e29b-41d4-a716-446655440001', 'Project Deadline: Elevated Cycleway', 'Final submission deadline for the Elevated Cycleway project deliverables.', CURRENT_DATE + INTERVAL '14 days', '23:59', 'Online', 'deadline', '550e8400-e29b-41d4-a716-446655440000', NOW(), NOW()),
  ('990e8400-e29b-41d4-a716-446655440002', 'AI in Architecture Conference', 'Annual conference on artificial intelligence applications in architectural design.', CURRENT_DATE + INTERVAL '30 days', '09:00', 'University Auditorium', 'conference', '550e8400-e29b-41d4-a716-446655440000', NOW(), NOW()),
  ('990e8400-e29b-41d4-a716-446655440003', 'Research Presentation', 'Presentation of our latest findings on biophilic design in educational environments.', CURRENT_DATE + INTERVAL '21 days', '15:30', 'Main Lecture Hall', 'other', '550e8400-e29b-41d4-a716-446655440000', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;