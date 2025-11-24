'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/AuthProvider';
import { API_URL } from '@/lib/api';

type MyRecipe = {
  id: number;
  title: string;
  description?: string | null;
  cuisine?: string | null;
  averageRating: number;
  ratingsCount: number;
};

export default function MyRecipesPage() {
  const { user, token } = useAuth();
  const router = useRouter();

  const [recipes, setRecipes] = useState<MyRecipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user || !token) {
      router.push('/auth/login');
      return;
    }

    const loadMyRecipes = async () => {
      setLoading(true);
      setError(null);

      try {
        const res = await fetch(`${API_URL}/recipes/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await res.json();

        if (!res.ok) {
          const message =
            Array.isArray(data?.message) ? data.message.join(', ') : data?.message || 'Failed to load recipes';
          throw new Error(message);
        }

        setRecipes(data);
      } catch (err: any) {
        setError(err.message || 'Something went wrong');
      } finally {
        setLoading(false);
      }
    };

    loadMyRecipes();
  }, [user, token, router]);

  if (!user || !token) {
    return null;
  }

  return (
    <div className="mt-4 space-y-4">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-emerald-400">My recipes</h1>
          <p className="text-sm text-slate-400">
            Manage your own collection of FlavorAI recipes.
          </p>
        </div>
        <Link
          href="/recipes/new"
          className="rounded-md bg-emerald-500 px-3 py-1.5 text-xs font-medium text-slate-950 hover:bg-emerald-400"
        >
          Add new recipe
        </Link>
      </header>

      {loading && <p className="text-sm text-slate-400">Loading your recipes...</p>}

      {error && (
        <div className="rounded-md border border-red-500/50 bg-red-500/10 px-3 py-2 text-sm text-red-300">
          {error}
        </div>
      )}

      {!loading && !error && recipes.length === 0 && (
        <p className="text-sm text-slate-500">
          You have no recipes yet. Start by adding your first one!
        </p>
      )}

      <div className="space-y-3">
        {recipes.map((recipe) => (
          <Link
            key={recipe.id}
            href={`/recipes/${recipe.id}`}
            className="flex justify-between rounded-xl border border-slate-800 bg-slate-900/60 p-4 hover:border-emerald-500/70"
          >
            <div>
              <h2 className="text-sm font-semibold text-slate-50">
                {recipe.title}
              </h2>
              {recipe.cuisine && (
                <p className="mt-1 text-xs uppercase tracking-wide text-emerald-400/80">
                  {recipe.cuisine}
                </p>
              )}
              {recipe.description && (
                <p className="mt-1 line-clamp-2 text-xs text-slate-400">
                  {recipe.description}
                </p>
              )}
            </div>
            <div className="flex flex-col items-end justify-center text-xs text-slate-400">
              <span>⭐ {recipe.averageRating.toFixed(1)}</span>
              <span className="text-slate-500">
                ({recipe.ratingsCount} rating
                {recipe.ratingsCount !== 1 ? 's' : ''})
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
