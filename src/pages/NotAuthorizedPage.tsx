'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAppSelector } from '@/Redux/hooks';
import { Lock, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function NotAuthorizedPage() {
  const router = useRouter();
  const user = useAppSelector((state) => state.auth.user);

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 dark:from-slate-950 dark:to-slate-900 flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        {/* Icon */}
        <div className="flex justify-center mb-6">
          <div className="bg-red-100 dark:bg-red-900/30 p-4 rounded-full">
            <Lock className="w-12 h-12 text-red-600 dark:text-red-400" />
          </div>
        </div>

        {/* Content */}
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-3">
            Access Denied
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mb-2">
            You don't have permission to access this page.
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-8">
            {user
              ? `Your current role (${user.role}) does not have the required permissions.`
              : 'Please log in with an authorized account.'}
          </p>

          {/* Details Box */}
          <div className="bg-white dark:bg-slate-800 rounded-lg p-4 mb-8 border border-gray-200 dark:border-slate-700">
            <dl className="space-y-2 text-sm">
              <div className="flex justify-between">
                <dt className="text-gray-600 dark:text-gray-400">Your Role:</dt>
                <dd className="font-mono font-medium text-gray-900 dark:text-white">
                  {user?.role || 'No role assigned'}
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-gray-600 dark:text-gray-400">Requested:</dt>
                <dd className="font-mono font-medium text-gray-900 dark:text-white">
                  Admin Access
                </dd>
              </div>
            </dl>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 flex-col sm:flex-row">
            <Button
              onClick={() => router.back()}
              variant="outline"
              className="w-full"
            >
              Go Back
            </Button>
            <Link href="/" className="w-full">
              <Button variant="primary" className="w-full primary hover:from-primary/20">
                Go Home
                <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
        </div>

        {/* Support Message */}
        <p className="text-center text-xs text-gray-500 dark:text-gray-400 mt-8">
          If you believe this is an error, please contact support.
        </p>
      </div>
    </div>
  );
}
