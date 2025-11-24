'use client';

import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/AuthProvider';
import { API_URL } from '@/lib/api';

export default function NewRecipePage() {
  const { user, token } = useAuth();
  const router = useRouter();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [ingredients, setIngredients] = useState('');
  const [instructions, setInstructions] = useState('');
  const [cuisine, setCuisine] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!user || !token) {
    router.push('/auth/login');
    return null;
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch(`${API_URL}/recipes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title,
          description: description || undefined,
          ingredients,
          instructions,
          cuisine: cuisine || undefined,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        const message =
          Array.isArray(data?.message)
            ? data.message.join(', ')
            : data?.message || 'Failed to create recipe';
        throw new Error(message);
      }

      router.push('/my-recipes');
    } catch (err: any) {
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto mt-4 max-w-2xl rounded-xl border border-slate-800 bg-slate-900/60 p-5">
      <h1 className="mb-2 text-xl font-semibold text-emerald-400">
        Add new recipe
      </h1>
      <p className="mb-5 text-sm text-slate-400">
        Share your favourite dish with the FlavorAI community.
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="rounded-md border border-red-500/50 bg-red-500/10 px-3 py-2 text-sm text-red-300">
            {error}
          </div>
        )}

        <div>
          <label className="mb-1 block text-sm text-slate-300">Title</label>
          <input
            type="text"
            className="w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white placeholder-slate-400 outline-none ring-emerald-500/60 focus:ring"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Recipe title"
            required
          />
        </div>

        <div>
          <label className="mb-1 block text-sm text-slate-300">
            Short description (optional)
          </label>
          <textarea
            className="min-h-[60px] w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white placeholder-slate-400 outline-none ring-emerald-500/60 focus:ring"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="A short summary of your recipe."
          />
        </div>

        <div>
          <label className="mb-1 block text-sm text-slate-300">
            Ingredients
          </label>
          <textarea
            className="min-h-[80px] w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white placeholder-slate-400 outline-none ring-emerald-500/60 focus:ring"
            value={ingredients}
            onChange={(e) => setIngredients(e.target.value)}
            placeholder="Write ingredients as free text, one per line or comma separated."
            required
          />
        </div>

        <div>
          <label className="mb-1 block text-sm text-slate-300">
            Instructions
          </label>
          <textarea
            className="min-h-[100px] w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white placeholder-slate-400 outline-none ring-emerald-500/60 focus:ring"
            value={instructions}
            onChange={(e) => setInstructions(e.target.value)}
            placeholder="Step-by-step cooking instructions."
            required
          />
        </div>

        <div>
          <label className="mb-1 block text-sm text-slate-300">
            Cuisine (optional)
          </label>
          <input
            type="text"
            className="w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white placeholder-slate-400 outline-none ring-emerald-500/60 focus:ring"
            value={cuisine}
            onChange={(e) => setCuisine(e.target.value)}
            placeholder="Italian, Asian, Ukrainian..."
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="rounded-md bg-emerald-500 px-4 py-2 text-sm font-medium text-slate-950 hover:bg-emerald-400 disabled:opacity-60"
        >
          {loading ? 'Saving...' : 'Save recipe'}
        </button>
      </form>
    </div>
  );
}
