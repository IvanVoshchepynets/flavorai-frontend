'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { API_URL } from '@/lib/api';
import { useAuth } from '@/components/AuthProvider';

type RecipeDetail = {
  id: number;
  title: string;
  description?: string | null;
  ingredients: string;
  instructions: string;
  cuisine?: string | null;
  author?: { id: number; email: string };
  averageRating: number;
  ratingsCount: number;
};

export default function RecipeDetailPage() {
  const params = useParams();
  const id = Number(params?.id);
  const { token } = useAuth();

  const [recipe, setRecipe] = useState<RecipeDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [ratingLoading, setRatingLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [ratingError, setRatingError] = useState<string | null>(null);

  const loadRecipe = async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`${API_URL}/recipes/${id}`);
      const data = await res.json();

      if (!res.ok) {
        const message =
          Array.isArray(data?.message) ? data.message.join(', ') : data?.message || 'Failed to load recipe';
        throw new Error(message);
      }

      setRecipe(data);
    } catch (err: any) {
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!id) return;
    loadRecipe();
  }, [id]);

  const handleRate = async (value: number) => {
    if (!token) {
      setRatingError('You must be logged in to rate recipes.');
      return;
    }

    setRatingLoading(true);
    setRatingError(null);

    try {
      const res = await fetch(`${API_URL}/recipes/${id}/rate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ value }),
      });

      const data = await res.json();

      if (!res.ok) {
        const message =
          Array.isArray(data?.message) ? data.message.join(', ') : data?.message || 'Rating failed';
        throw new Error(message);
      }

      setRecipe(data);
    } catch (err: any) {
      setRatingError(err.message || 'Something went wrong');
    } finally {
      setRatingLoading(false);
    }
  };

  if (loading) {
    return <p className="mt-6 text-sm text-slate-400">Loading recipe...</p>;
  }

  if (error || !recipe) {
    return (
      <div className="mt-6 rounded-md border border-red-500/50 bg-red-500/10 px-3 py-2 text-sm text-red-300">
        {error || 'Recipe not found'}
      </div>
    );
  }

  return (
    <article className="mt-4 space-y-5 rounded-xl border border-slate-800 bg-slate-900/60 p-5">
      <header className="space-y-2">
        <h1 className="text-2xl font-bold text-emerald-400">{recipe.title}</h1>
        <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400">
          {recipe.cuisine && (
            <span className="rounded-full border border-emerald-500/40 px-2 py-0.5 text-[11px] uppercase tracking-wide text-emerald-300">
              {recipe.cuisine}
            </span>
          )}
          {recipe.author && (
            <span className="text-[11px] text-slate-500">
              by {recipe.author.email}
            </span>
          )}
          <span>
            ⭐ {recipe.averageRating.toFixed(1)} ({recipe.ratingsCount} rating
            {recipe.ratingsCount !== 1 ? 's' : ''})
          </span>
        </div>
        {recipe.description && (
          <p className="text-sm text-slate-300">{recipe.description}</p>
        )}
      </header>

      <section>
        <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-slate-400">
          Ingredients
        </h2>
        <p className="whitespace-pre-line text-sm text-slate-200">
          {recipe.ingredients}
        </p>
      </section>

      <section>
        <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-slate-400">
          Instructions
        </h2>
        <p className="whitespace-pre-line text-sm text-slate-200">
          {recipe.instructions}
        </p>
      </section>

      <section className="border-t border-slate-800 pt-4">
        <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-slate-400">
          Rate this recipe
        </h2>

        {ratingError && (
          <div className="mb-2 rounded-md border border-red-500/50 bg-red-500/10 px-3 py-2 text-xs text-red-300">
            {ratingError}
          </div>
        )}

        <div className="flex items-center gap-2">
          {[1, 2, 3, 4, 5].map((value) => (
            <button
              key={value}
              type="button"
              disabled={ratingLoading}
              onClick={() => handleRate(value)}
              className="flex h-8 w-8 items-center justify-center rounded-full border border-slate-700 bg-slate-950 text-sm text-slate-200 hover:border-emerald-500 hover:text-emerald-400 disabled:opacity-50"
            >
              {value}
            </button>
          ))}
        </div>

        {ratingLoading && (
          <p className="mt-2 text-xs text-slate-400">
            Sending your rating...
          </p>
        )}
      </section>
    </article>
  );
}
