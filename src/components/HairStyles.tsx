export default function HairStyles() {
  const styles = [
    {
      id: 1,
      name: 'Classic Fade',
      description: 'Clean and timeless fade haircut',
      image: 'https://images.unsplash.com/photo-1619233543640-af09c173763b',
      products: ['Pomade', 'Hair Spray'],
      howTo: 'Start with the sides using a #2 guard...'
    },
    {
      id: 2,
      name: 'Modern Quiff',
      description: 'Stylish and contemporary quiff style',
      image: 'https://images.unsplash.com/photo-1456327102063-fb5054efe647',
      products: ['Volume Spray', 'Matte Clay'],
      howTo: 'Begin by blow-drying the hair forward...'
    },
    {
      id: 3,
      name: 'Textured Crop',
      description: 'A modern short style with a natural, messy texture.',
      image: 'https://images.unsplash.com/photo-1593702275687-f8b402bf1fb5',
      products: ['Texture Powder', 'Matte Paste'],
      howTo: 'Apply matte paste to damp hair and use fingers to create a textured, natural look.'
    },
    {
      id: 4,
      name: 'Slicked Back Undercut',
      description: 'A bold style with shaved sides and a slicked-back top.',
      image: 'https://images.unsplash.com/photo-1621605815971-fbc98d665033',
      products: ['Pomade', 'Fine-Tooth Comb'],
      howTo: 'Apply pomade to towel-dried hair and use a comb to slick it back for a sleek finish.'
    }
  ];

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Popular Hairstyles</h1>
      <div className="space-y-6">
        {styles.map((style) => (
          <div key={style.id} className="bg-secondary rounded-lg overflow-hidden">
            <img className="aspect-video bg-gray-700" src={style.image} alt={style.name}/>
            <div className="p-4">
              <h2 className="text-xl font-bold mb-2">{style.name}</h2>
              <p className="text-gray-400 mb-4">{style.description}</p>
              
              <h3 className="font-bold text-accent mb-2">Required Products</h3>
              <ul className="list-disc list-inside mb-4 text-gray-300">
                {style.products.map((product) => (
                  <li key={product}>{product}</li>
                ))}
              </ul>
              
              <h3 className="font-bold text-accent mb-2">How to Style</h3>
              <p className="text-gray-300">{style.howTo}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8">
        <h2 className="text-xl font-bold text-accent mb-4">Hair Products Guide</h2>
        <div className="space-y-4">
          <div className="bg-secondary p-4 rounded-lg">
            <p className="text-gray-300">
              Product type will vary based on hair texture and desired style. 
              Consult with your barber for personalized recommendations.
            </p>
          </div>
          <div className="bg-secondary p-4 rounded-lg">
            <p className="text-gray-300">
              Strong hold will be better suited for thicker hair, while 
              lighter holds work best for fine hair.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}