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

  const hairProducts = [
    {
      id: 1,
      name: 'Shampoo',
      description: 'Cleanses the scalp and hair by removing dirt, oil, and product buildup.',
      types: [
        'Moisturizing - for dry hair',
        'Volumizing - for fine hair',
        'Clarifying - for removing heavy buildup',
        'Medicated - for dandruff (with ketoconazole or salicylic acid)'
      ],
      tips: 'Avoid over-washing as daily shampooing can strip hair of natural oils, leading to dryness and irritation.'
    },
    {
      id: 2,
      name: 'Conditioner',
      description: 'Replenishes moisture and nutrients, making hair softer, smoother, and more manageable.',
      types: [
        'Rinse-out - used after shampooing',
        'Leave-in - provides ongoing hydration',
        'Deep conditioning - for repairing dry or damaged hair'
      ],
      tips: 'Especially beneficial for men with curly, wavy, or coarse hair textures.'
    },
    {
      id: 3,
      name: 'Pomade',
      description: 'Provides a flexible hold with medium to high shine without hardening.',
      types: [
        'Oil-based - longer-lasting hold but harder to wash out',
        'Water-based - easier to rinse out with a more modern feel'
      ],
      tips: 'Perfect for classic looks like slick-backs, side parts, and pompadours.'
    },
    {
      id: 4,
      name: 'Wax',
      description: 'Delivers strong, pliable hold with low to medium shine for textured, defined styles.',
      types: [
        'Hard wax - stronger hold',
        'Soft wax - more pliable'
      ],
      tips: 'Ideal for messy, tousled, or spiky hairstyles. May require clarifying shampoo to prevent buildup.'
    },
    {
      id: 5,
      name: 'Clay',
      description: 'Offers strong hold with a natural, matte finish for thick, textured looks.',
      types: [
        'Bentonite clay - absorbs excess oil',
        'Kaolin clay - adds volume and texture'
      ],
      tips: 'Especially useful for men with fine or thinning hair. Easy to restyle throughout the day.'
    },
    {
      id: 6,
      name: 'Paste',
      description: 'Versatile product providing medium hold with a natural finish for texture and separation.',
      types: [
        'Water-based - washes out easily',
        'Matte finish - for natural look',
        'Light shine - for subtle polish'
      ],
      tips: 'Works well on all hair lengths and is perfect for achieving a relaxed, effortless look.'
    },
    {
      id: 7,
      name: 'Gel',
      description: 'Known for strong, rigid hold and high-shine finish for structured styles.',
      types: [
        'Traditional - maximum hold but can be stiff',
        'Alcohol-free - avoids dryness and flaking'
      ],
      tips: 'Ideal for short hairstyles that need extra control. Apply sparingly to avoid buildup.'
    },
    {
      id: 8,
      name: 'Mousse',
      description: 'Lightweight foam that provides volume, body, and light hold without weighing hair down.',
      types: [
        'Volumizing - for fine or thinning hair',
        'Curl-enhancing - for wavy or curly hair'
      ],
      tips: 'Apply to damp hair and air dry for a natural look or blow-dry for added volume.'
    },
    {
      id: 9,
      name: 'Hairspray',
      description: 'Finishing product that locks in styles and maintains hold throughout the day.',
      types: [
        'Light hold - for natural movement',
        'Medium hold - for everyday styles',
        'Strong hold - for structured styles',
        'Extra-strong hold - for special occasions'
      ],
      tips: 'Use as a final step in styling to provide lasting hold without excessive buildup.'
    },
    {
      id: 10,
      name: 'Sea Salt Spray',
      description: 'Adds texture, volume, and a natural, beachy feel to the hair.',
      types: [
        'Light hold - for subtle texture',
        'Medium hold - for more defined waves'
      ],
      tips: 'Works well for men with medium to longer hair who want a casual, tousled look.'
    },
    {
      id: 11,
      name: 'Leave-in Conditioner',
      description: 'Provides continuous hydration and protection throughout the day.',
      types: [
        'Spray - lightweight for fine hair',
        'Cream - richer for thick or curly hair'
      ],
      tips: 'Particularly beneficial for men with longer hair or those who experience dryness.'
    },
    {
      id: 12,
      name: 'Hair Serum/Oil',
      description: 'Adds shine, reduces frizz, and nourishes hair with essential nutrients.',
      types: [
        'Lightweight serums - for fine hair',
        'Argan oil - for medium to thick hair',
        'Coconut oil - for coarse or curly hair'
      ],
      tips: 'A small amount goes a long way, so use sparingly to avoid a greasy look.'
    }
  ];

  return (
    <div className="max-w-2xl mx-auto p-4 pb-20">
      <h1 className="text-2xl font-bold mb-6">Popular Hairstyles</h1>
      <div className="space-y-6">
        {styles.map((style) => (
          <div key={style.id} className="bg-secondary rounded-lg overflow-hidden">
            <img className="aspect-video bg-gray-700 w-full object-cover" src={style.image} alt={style.name}/>
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

      <div className="mt-12">
        <h2 className="text-2xl font-bold text-accent mb-6">Men's Hair Care Products Guide</h2>
        <p className="text-gray-300 mb-6">
          Choosing the right products for your hair type and desired style is essential for achieving 
          and maintaining your look. Here's a comprehensive guide to men's hair care products.
        </p>
        
        <div className="space-y-8">
          {hairProducts.map((product) => (
            <div key={product.id} className="bg-secondary p-5 rounded-lg">
              <h3 className="text-xl font-bold mb-2">{product.name}</h3>
              <p className="text-gray-300 mb-3">{product.description}</p>
              
              <h4 className="font-bold text-accent mb-2">Types</h4>
              <ul className="list-disc list-inside mb-4 text-gray-300">
                {product.types.map((type, index) => (
                  <li key={index}>{type}</li>
                ))}
              </ul>
              
              <h4 className="font-bold text-accent mb-2">Pro Tip</h4>
              <p className="text-gray-300 italic">{product.tips}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-8">
        <h2 className="text-xl font-bold text-accent mb-4">Product Selection Tips</h2>
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
          <div className="bg-secondary p-4 rounded-lg">
            <p className="text-gray-300">
              For daily use, consider water-based products that wash out easily and 
              won't cause buildup over time.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}