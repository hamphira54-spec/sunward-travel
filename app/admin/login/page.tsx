'use client';

import { useActionState } from 'react';
import { login } from './actions';
import { Lock } from 'lucide-react';

export default function LoginPage() {
  // @ts-ignore - useActionState is React 19, which is fine
  const [state, formAction, isPending] = useActionState(login, null);

  return (
    <div className="min-h-screen bg-[#F7EBDD] flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <div className="w-12 h-12 rounded-full bg-[#E8622C] flex items-center justify-center">
            <Lock className="text-white w-6 h-6" />
          </div>
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-[#2B221C] font-serif">
          Sunward Admin
        </h2>
        <p className="mt-2 text-center text-sm text-[#5C3D2E]">
          Restricted administrative access
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10 border-t-4 border-[#E8622C]">
          <form className="space-y-6" action={formAction}>
            {state?.error && (
              <div className="bg-red-50 border-l-4 border-red-500 p-4" role="alert">
                <p className="text-sm text-red-700">{state.error}</p>
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-[#2B221C]">
                Email address
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="appearance-none block w-full px-3 py-2 border border-[#8B5E3C] border-opacity-30 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-[#E8622C] focus:border-[#E8622C] sm:text-sm text-[#2B221C]"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-[#2B221C]">
                Password
              </label>
              <div className="mt-1">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  className="appearance-none block w-full px-3 py-2 border border-[#8B5E3C] border-opacity-30 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-[#E8622C] focus:border-[#E8622C] sm:text-sm text-[#2B221C]"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={isPending}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#E8622C] hover:bg-[#C74A1E] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#E8622C] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isPending ? 'Signing in...' : 'Sign in'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

