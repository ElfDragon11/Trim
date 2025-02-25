import { StarIcon, MapPinIcon } from '@heroicons/react/24/solid';
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

interface Barber {
  id: string;
  name: string;
  location: string;
  rating: number;
  image_url: string;
}

interface Follow {
  barber_id: string;
}

export default function BarbersList() {
  const [barbers, setBarbers] = useState<Barber[]>([]);
  const [followedBarbers, setFollowedBarbers] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBarbers();
    fetchFollowedBarbers();
  }, []);

  async function fetchBarbers() {
    const { data, error } = await supabase
      .from('barbers')
      .select('*')
      .order('rating', { ascending: false });

    if (error) {
      console.error('Error fetching barbers:', error);
      return;
    }

    setBarbers(data || []);
    setLoading(false);
  }

  async function fetchFollowedBarbers() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data, error } = await supabase
      .from('follows')
      .select('barber_id')
      .eq('user_id', user.id);

    if (error) {
      console.error('Error fetching follows:', error);
      return;
    }

    setFollowedBarbers((data || []).map((follow: Follow) => follow.barber_id));
  }

  async function handleFollow(barberId: string) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      alert('Please sign in to follow barbers');
      return;
    }

    const isFollowing = followedBarbers.includes(barberId);

    if (isFollowing) {
      const { error } = await supabase
        .from('follows')
        .delete()
        .eq('user_id', user.id)
        .eq('barber_id', barberId);

      if (error) {
        console.error('Error unfollowing barber:', error);
        return;
      }

      setFollowedBarbers(followedBarbers.filter(id => id !== barberId));
    } else {
      const { error } = await supabase
        .from('follows')
        .insert([{ user_id: user.id, barber_id: barberId }]);

      if (error) {
        console.error('Error following barber:', error);
        return;
      }

      setFollowedBarbers([...followedBarbers, barberId]);
    }
  }

  if (loading) {
    return <div className="max-w-2xl mx-auto p-4">Loading...</div>;
  }

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Barbers</h1>
      <div className="space-y-4">
        {barbers.map((barber) => (
          <div key={barber.id} className="bg-secondary rounded-lg p-4">
            <Link to={`/barber/${barber.id}`} className="flex items-center gap-4">
              <img
                src={barber.image_url}
                alt={barber.name}
                className="w-16 h-16 rounded-full object-cover"
              />
              <div className="flex-1">
                <h2 className="font-bold text-lg">{barber.name}</h2>
                <div className="flex items-center gap-1 text-sm text-gray-400">
                  <MapPinIcon className="w-4 h-4" />
                  <span>{barber.location}</span>
                </div>
                <div className="flex items-center gap-1 mt-1">
                  <StarIcon className="w-4 h-4 text-accent" />
                  <span>{barber.rating}</span>
                </div>
              </div>
              <button
                onClick={(e) => {
                  e.preventDefault();
                  handleFollow(barber.id);
                }}
                className={`btn ${followedBarbers.includes(barber.id) ? 'btn-secondary' : 'btn-primary'}`}
              >
                {followedBarbers.includes(barber.id) ? 'Following' : 'Follow'}
              </button>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}