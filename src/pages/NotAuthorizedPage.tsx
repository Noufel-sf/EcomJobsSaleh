'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Lock, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { I18nProvider, useI18n } from '@/context/I18nContext';

export default function NotAuthorizedPage() {
  return (
    <I18nProvider>
      <NotAuthorizedPageContent />
    </I18nProvider>
  );
}

function NotAuthorizedPageContent() {
  const router = useRouter();
  const { messages } = useI18n();

  return (
    <div className="min-h-screen  flex items-center justify-center px-4">
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
            {messages.unauthorized.title}
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mb-2">
            {messages.unauthorized.description}
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-8">
              {messages.unauthorized.loginHint}
          </p>

        

          {/* Action Buttons */}
          <div className="flex gap-3 flex-col">
            <Button
              onClick={() => router.back()}
              variant="outline"
              className="w-full"
            >
              {messages.unauthorized.goBack}
            </Button>
            <Link href="/" className="w-full">
              <Button variant="primary" className="w-full primary hover:from-primary/20">
                {messages.unauthorized.goHome}
                <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
        </div>

        {/* Support Message */}
        <p className="text-center text-xs text-gray-500 dark:text-gray-400 mt-8">
          {messages.unauthorized.supportHint}
        </p>
      </div>
    </div>
  );
}
