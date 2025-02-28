import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { StarIcon, MapPinIcon } from '@heroicons/react/24/solid';
import { supabase } from '../lib/supabase';

interface Barber {
  id: string;
  name: string;
  location: string;
  rating: number;
  image_url: string;
  about: string;
}

interface Review {
  id: number;
  name: string;
  date: string;
  content: string;
}

const services = [
  { name: 'Haircut', duration: '45 min', price: 30 },
  { name: 'Beard Trim', duration: '30 min', price: 20 },
  { name: 'Hot Towel Shave', duration: '45 min', price: 35 },
  { name: 'Hair + Beard Combo', duration: '1 hour', price: 45 },
];

const reviews: Review[] = [
  { 
    id: 1, 
    name: 'Mike R.', 
    date: '2 days ago',
    content: 'Best fade I\'ve ever gotten. John really takes his time to get everything perfect.'
  },
  {
    id: 2,
    name: 'David K.',
    date: '1 week ago',
    content: 'Great attention to detail and very professional service.'
  },
  {
    id: 3,
    name: 'Chris M.',
    date: '2 weeks ago',
    content: 'Solid haircut and great conversation. Will definitely return.'
  },
];

export default function BarberProfile() {
  const { id } = useParams<{ id: string }>();
  const [barber, setBarber] = useState<Barber | null>(null);
  const [isFollowing, setIsFollowing] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBarber();
    checkFollowStatus();
  }, [id]);

  async function fetchBarber() {
    if (!id) return;

    const { data, error } = await supabase
      .from('barbers')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching barber:', error);
      return;
    }

    setBarber(data);
    setLoading(false);
  }

  async function checkFollowStatus() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user || !id) return;

    try {
      const { data, error } = await supabase
        .from('follows')
        .select('id')
        .eq('user_id', user.id)
        .eq('barber_id', id);

      if (error) {
        console.error('Error checking follow status:', error);
        return;
      }

      setIsFollowing(data && data.length > 0);
    } catch (error) {
      console.error('Error in follow status check:', error);
    }
  }

  async function handleFollow() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user || !id) {
      alert('Please sign in to follow barbers');
      return;
    }

    if (isFollowing) {
      const { error } = await supabase
        .from('follows')
        .delete()
        .eq('user_id', user.id)
        .eq('barber_id', id);

      if (error) {
        console.error('Error unfollowing barber:', error);
        return;
      }

      setIsFollowing(false);
    } else {
      const { error } = await supabase
        .from('follows')
        .insert([{ user_id: user.id, barber_id: id }]);

      if (error) {
        console.error('Error following barber:', error);
        return;
      }

      setIsFollowing(true);
    }
  }

  if (loading || !barber) {
    return <div className="max-w-2xl mx-auto p-4">Loading...</div>;
  }

  return (
    <div className="max-w-2xl mx-auto p-4">
      <div className="flex items-center gap-4 mb-6">
        <img
          src={barber.image_url}
          alt={barber.name}
          className="w-24 h-24 rounded-full object-cover"
        />
        <div>
          <h1 className="text-2xl font-bold">{barber.name}</h1>
          <div className="flex items-center gap-1">
            <StarIcon className="w-5 h-5 text-accent" />
            <span>{barber.rating} (127 reviews)</span>
          </div>
          <div className="flex items-center gap-1 text-gray-400">
            <MapPinIcon className="w-4 h-4" />
            <span>{barber.location}</span>
          </div>
        </div>
      </div>

      <div className="mb-4">
        <button
          onClick={handleFollow}
          className={`btn w-full ${isFollowing ? 'btn-secondary' : 'btn-primary'}`}
        >
          {isFollowing ? 'Following' : 'Follow'}
        </button>
      </div>

      <section className="mb-8">
        <h2 className="text-xl font-bold text-accent mb-2">About</h2>
        <p className="text-gray-300">{barber.about}</p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-bold text-accent mb-2">Specialties</h2>
        <div className="flex flex-wrap gap-2">
          {['Fades', 'Beard Trimming', 'Hot Towel Shaves', 'Classic Cuts'].map((specialty) => (
            <span key={specialty} className="px-4 py-2 bg-secondary rounded-full text-sm">
              {specialty}
            </span>
          ))}
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-bold text-accent mb-2">Services & Pricing</h2>
        <div className="space-y-4">
          {services.map((service) => (
            <div key={service.name} className="flex justify-between items-center p-4 bg-secondary rounded-lg">
              <div>
                <h3 className="font-medium">{service.name}</h3>
                <p className="text-sm text-gray-400">{service.duration}</p>
              </div>
              <span className="text-accent font-bold">${service.price}</span>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-xl font-bold text-accent mb-2">Recent Reviews</h2>
        <div className="space-y-4">
          {reviews.map((review) => (
            <div key={review.id} className="p-4 bg-secondary rounded-lg">
              <div className="flex justify-between mb-2">
                <span className="font-medium">{review.name}</span>
                <span className="text-sm text-gray-400">{review.date}</span>
              </div>
              <p className="text-gray-300">{review.content}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}