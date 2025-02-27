import { useState } from 'react';
import { useAuth } from '../lib/AuthContext';

export default function Auth() {
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { signIn, signUp } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (mode === 'signin') {
        const { error } = await signIn(email, password);
        if (error) throw error;
      } else {
        const { error } = await signUp(email, password);
        if (error) throw error;
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-primary flex items-center justify-center p-4">
      <div className="bg-secondary rounded-lg p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-accent">Trim</h1>
          <p className="text-gray-400 mt-2">Find the perfect barber for your style</p>
        </div>

        <div className="flex mb-6">
          <button
            className={`flex-1 py-2 text-center ${
              mode === 'signin' ? 'text-accent border-b-2 border-accent' : 'text-gray-400'
            }`}
            onClick={() => setMode('signin')}
          >
            Sign In
          </button>
          <button
            className={`flex-1 py-2 text-center ${
              mode === 'signup' ? 'text-accent border-b-2 border-accent' : 'text-gray-400'
            }`}
            onClick={() => setMode('signup')}
          >
            Sign Up
          </button>
        </div>

        {error && (
          <div className="bg-red-500 bg-opacity-10 border border-red-500 text-red-500 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium text-gray-400 mb-1">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 bg-primary border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
              required
            />
          </div>

          <div className="mb-6">
            <label htmlFor="password" className="block text-sm font-medium text-gray-400 mb-1">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 bg-primary border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-neutral hover:bg-opacity-90 text-white py-2 px-4 rounded-lg font-medium transition-colors"
          >
            {loading ? 'Loading...' : mode === 'signin' ? 'Sign In' : 'Sign Up'}
          </button>
        </form>

        {mode === 'signin' && (
          <p className="text-center mt-4 text-sm text-gray-400">
            Don't have an account?{' '}
            <button onClick={() => setMode('signup')} className="text-accent">
              Sign up
            </button>
          </p>
        )}

        {mode === 'signup' && (
          <p className="text-center mt-4 text-sm text-gray-400">
            Already have an account?{' '}
            <button onClick={() => setMode('signin')} className="text-accent">
              Sign in
            </button>
          </p>
        )}
      </div>
    </div>
  );
}