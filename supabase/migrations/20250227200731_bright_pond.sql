/*
  # Add nationwide barbers

  1. New Data
    - Add barbers from different states across the US
  
  2. Purpose
    - Expand the barber database to include locations nationwide
    - Provide a more realistic dataset for the map view
*/

-- Insert barbers from different states (only if they don't exist)
INSERT INTO barbers (name, location, rating, image_url, about)
VALUES 
  -- New York
  (
    'Michael Chen',
    'Manhattan, NY',
    4.9,
    'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d',
    'Specializing in modern cuts and styling for all hair types. Known for attention to detail and precision work.'
  ),
  (
    'Sarah Williams',
    'Brooklyn, NY',
    4.8,
    'https://images.unsplash.com/photo-1580489944761-15a19d654956',
    'Award-winning stylist with expertise in textured hair and creative coloring techniques.'
  ),
  
  -- Texas
  (
    'Robert Garcia',
    'Austin, TX',
    4.7,
    'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce',
    'Traditional barber with a modern twist. Specializes in classic cuts, hot towel shaves, and beard styling.'
  ),
  (
    'Maria Hernandez',
    'Houston, TX',
    4.8,
    'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91',
    'Master barber with 15 years of experience. Known for exceptional fade techniques and beard designs.'
  ),
  
  -- Illinois
  (
    'Daniel Kim',
    'Chicago, IL',
    4.9,
    'https://images.unsplash.com/photo-1531384441138-2736e62e0919',
    'Precision haircuts and styling with a focus on Asian hair textures. Expert in modern trends and classic styles.'
  ),
  
  -- Florida
  (
    'Sophia Martinez',
    'Miami, FL',
    4.7,
    'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f',
    'Celebrity stylist specializing in high-end cuts and styling for all occasions. Known for creating beach-ready looks.'
  ),
  
  -- Washington
  (
    'James Wilson',
    'Seattle, WA',
    4.6,
    'https://images.unsplash.com/photo-1463453091185-61582044d556',
    'Eco-conscious barber using sustainable products. Specializes in modern cuts with a Pacific Northwest flair.'
  ),
  
  -- Massachusetts
  (
    'Emma Thompson',
    'Boston, MA',
    4.8,
    'https://images.unsplash.com/photo-1544005313-94ddf0286df2',
    'Classic barbering with a focus on traditional techniques. Offers hot towel shaves and precision cuts.'
  ),
  
  -- Georgia
  (
    'Marcus Johnson',
    'Atlanta, GA',
    4.9,
    'https://images.unsplash.com/photo-1504257432389-52343af06ae3',
    'Specializing in textured hair and creative designs. Known for exceptional fade work and beard grooming.'
  ),
  
  -- Nevada
  (
    'Jessica Lee',
    'Las Vegas, NV',
    4.7,
    'https://images.unsplash.com/photo-1499952127939-9bbf5af6c51c',
    'High-end stylist catering to celebrities and locals alike. Expert in transformative cuts and styling.'
  ),
  
  -- Colorado
  (
    'Tyler Adams',
    'Denver, CO',
    4.6,
    'https://images.unsplash.com/photo-1500648767791-00dcc994a43e',
    'Mountain-inspired cuts with a focus on low-maintenance styles. Specializes in beard grooming for outdoor enthusiasts.'
  )
ON CONFLICT DO NOTHING;