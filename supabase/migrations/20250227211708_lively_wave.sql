/*
  # Add Utah barbers

  1. New Data
    - Add barbers in Provo, Orem, and other Utah locations
  
  2. Details
    - Adds barbers with realistic Utah locations
    - Includes ratings, images, and descriptions
*/

-- Insert barbers from Utah (only if they don't exist)
INSERT INTO barbers (name, location, rating, image_url, about)
VALUES 
  -- Provo
  (
    'Jake Thompson',
    'Provo, UT',
    4.8,
    'https://images.unsplash.com/photo-1560250097-0b93528c311a',
    'Specializing in classic and modern cuts with a focus on precision fades. BYU graduate with 8 years of experience.'
  ),
  (
    'Emily Richards',
    'Provo, UT',
    4.7,
    'https://images.unsplash.com/photo-1494790108377-be9c29b29330',
    'Master stylist with expertise in all hair types. Known for creating styles that are easy to maintain.'
  ),
  
  -- Orem
  (
    'Brandon Miller',
    'Orem, UT',
    4.9,
    'https://images.unsplash.com/photo-1566492031773-4f4e44671857',
    'Award-winning barber specializing in hot towel shaves and precision cuts. Creating the perfect look for over 10 years.'
  ),
  (
    'Sophia Jensen',
    'Orem, UT',
    4.6,
    'https://images.unsplash.com/photo-1438761681033-6461ffad8d80',
    'Passionate about creating styles that enhance natural features. Specializes in beard grooming and styling.'
  ),
  
  -- Other Utah locations
  (
    'Tyler Wilson',
    'Lehi, UT',
    4.7,
    'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61',
    'Modern barber with a classic touch. Specializes in trendy cuts and styling for all occasions.'
  ),
  (
    'Olivia Hansen',
    'American Fork, UT',
    4.8,
    'https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb',
    'Creating custom styles tailored to each client. Expert in textured cuts and beard designs.'
  ),
  (
    'Nathan Parker',
    'Pleasant Grove, UT',
    4.5,
    'https://images.unsplash.com/photo-1552374196-c4e7ffc6e126',
    'Specializing in men\'s grooming with a focus on classic techniques and modern trends.'
  ),
  (
    'Rachel Davis',
    'Springville, UT',
    4.7,
    'https://images.unsplash.com/photo-1534751516642-a1af1ef26a56',
    'Dedicated to creating styles that work with your lifestyle. Known for attention to detail and personalized service.'
  )
ON CONFLICT DO NOTHING;