/*
  # Add initial barber data

  1. Data Changes
    - Insert sample barber records with:
      - Names
      - Locations
      - Ratings
      - Profile images
      - About descriptions
  
  Note: Using high-quality placeholder images from Unsplash for demonstration
*/

INSERT INTO barbers (name, location, rating, image_url, about)
VALUES 
  (
    'John Smith',
    'Downtown LA',
    4.9,
    'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7',
    'Master barber with over 10 years of experience specializing in classic cuts and modern fades.'
  ),
  (
    'Mike Johnson',
    'West Hollywood',
    4.8,
    'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e',
    'Award-winning stylist known for precision fades and beard grooming.'
  ),
  (
    'David Williams',
    'Santa Monica',
    4.7,
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d',
    'Specializing in modern haircuts and traditional hot towel shaves.'
  ),
  (
    'James Rodriguez',
    'Beverly Hills',
    4.9,
    'https://images.unsplash.com/photo-1500648767791-00dcc994a43e',
    'Celebrity barber bringing high-end styling and grooming services.'
  )
ON CONFLICT DO NOTHING;