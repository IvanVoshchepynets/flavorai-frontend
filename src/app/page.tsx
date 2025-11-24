'use client';

import { FormEvent, useEffect, useState } from 'react';
import Link from 'next/link';
import { API_URL } from '@/lib/api';

type RecipeListItem = {
  id: number;
  title: string;
  description?: string | null;
  cuisine?: string | null;
  averageRating: number;
  ratingsCount: number;
  author?: {
    id: number;
    email: string;
  };
};

export default function HomePage() {
  const [recipes, setRecipes] = useState<RecipeListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');

  const loadRecipes = async (searchQuery?: string) => {
    setLoading(true);
    setError(null);

    try {
      const params = searchQuery ? `?search=${encodeURIComponent(searchQuery)}` : '';
      const res = await fetch(`${API_URL}/recipes${params}`);
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

  useEffect(() => {
    loadRecipes();
  }, []);

  const handleSearch = (e: FormEvent) => {
    e.preventDefault();
    loadRecipes(search);
  };

  return (
    <div className="space-y-6">
      <section className="mt-4 rounded-xl border border-slate-800 bg-gradient-to-br from-slate-900 to-slate-950 p-5">
        <h1 className="text-2xl font-bold text-emerald-400">Discover recipes with FlavorAI</h1>
        <p className="mt-2 text-sm text-slate-400">
          Browse community recipes, see what others are cooking, and get inspired.
        </p>

        <form onSubmit={handleSearch} className="mt-4 flex flex-col gap-2 sm:flex-row">
          <input
            type="text"
            placeholder="Search recipes by name..."
            className="w-full rounded-md border border-slate-700 bg-slate-900 p-3 text-white placeholder-slate-400 outline-none focus:border-emerald-500"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button
            type="submit"
            className="rounded-md bg-emerald-500 px-4 py-2 text-sm font-medium text-slate-950 hover:bg-emerald-400"
          >
            Search
          </button>
        </form>
      </section>

      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-400">
            All recipes
          </h2>
          <span className="text-xs text-slate-500">
            {recipes.length} recipe{recipes.length !== 1 ? 's' : ''}
          </span>
        </div>

        {loading && <p className="text-sm text-slate-400">Loading recipes...</p>}

        {error && (
          <div className="rounded-md border border-red-500/50 bg-red-500/10 px-3 py-2 text-sm text-red-300">
            {error}
          </div>
        )}

        {!loading && !error && recipes.length === 0 && (
          <p className="text-sm text-slate-500">No recipes found yet.</p>
        )}

        <div className="grid gap-4 sm:grid-cols-2">
          {recipes.map((recipe) => (
            <Link
              key={recipe.id}
              href={`/recipes/${recipe.id}`}
              className="flex flex-col rounded-xl border border-slate-800 bg-slate-900/60 p-4 shadow-sm hover:border-emerald-500/70 hover:shadow-emerald-500/10"
            >
              <div className="flex-1">
                <h3 className="text-base font-semibold text-slate-50">
                  {recipe.title}
                </h3>
                {recipe.cuisine && (
                  <p className="mt-1 text-xs uppercase tracking-wide text-emerald-400/80">
                    {recipe.cuisine}
                  </p>
                )}
                {recipe.description && (
                  <p className="mt-2 line-clamp-3 text-xs text-slate-400">
                    {recipe.description}
                  </p>
                )}
              </div>

              <div className="mt-3 flex items-center justify-between text-xs text-slate-400">
                <div className="flex items-center gap-1">
                  <span>⭐ {recipe.averageRating.toFixed(1)}</span>
                  <span className="text-slate-500">
                    ({recipe.ratingsCount} rating
                    {recipe.ratingsCount !== 1 ? 's' : ''})
                  </span>
                </div>
                {recipe.author && (
                  <span className="truncate text-right text-[11px] text-slate-500">
                    by {recipe.author.email}
                  </span>
                )}
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
