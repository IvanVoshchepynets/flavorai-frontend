'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from './AuthProvider';

export function Header() {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  const isActive = (href: string) =>
    pathname === href ? 'text-emerald-400' : 'text-slate-200';

  return (
    <header className="border-b border-slate-800 bg-slate-950/80 backdrop-blur">
      <div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-3">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-lg font-bold text-emerald-400">FlavorAI</span>
          <span className="text-xs uppercase tracking-wide text-slate-500">
            Smart Recipes
          </span>
        </Link>

        <nav className="flex items-center gap-4 text-sm">
          <Link href="/" className={isActive('/')}>
            All recipes
          </Link>

          {user && (
            <>
              <Link href="/my-recipes" className={isActive('/my-recipes')}>
                My recipes
              </Link>
              <Link href="/recipes/new" className={isActive('/recipes/new')}>
                Add recipe
              </Link>
            </>
          )}

          {!user && (
            <>
              <Link
                href="/auth/login"
                className={isActive('/auth/login')}
              >
                Log in
              </Link>
              <Link
                href="/auth/register"
                className="rounded-md bg-emerald-500 px-3 py-1 text-xs font-medium text-slate-950 hover:bg-emerald-400"
              >
                Sign up
              </Link>
            </>
          )}

          {user && (
            <button
              onClick={handleLogout}
              className="rounded-md border border-slate-700 px-3 py-1 text-xs text-slate-300 hover:border-emerald-500 hover:text-emerald-400"
            >
              Logout
            </button>
          )}
        </nav>
      </div>
    </header>
  );
}
