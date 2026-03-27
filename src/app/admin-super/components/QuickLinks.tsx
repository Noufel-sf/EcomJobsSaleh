'use client';

import { memo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Briefcase, Users } from 'lucide-react';
import Link from 'next/link';
import { type Language, useI18n } from '@/context/I18nContext';

const quickLinksCopy: Record<Language, Record<string, string>> = {
  en: {
    manageJobs: 'Manage Jobs',
    jobsDescription: 'Check your posted jobs and manage them effectively.',
    goJobs: 'Go to Jobs',
    reviewProducts: 'Review Products',
    productsDescription: 'View and manage all incoming product reviews.',
    goProducts: 'Go to Products',
  },
  fr: {
    manageJobs: 'Gerer les emplois',
    jobsDescription: 'Consultez et gerez efficacement les offres publiees.',
    goJobs: 'Aller aux emplois',
    reviewProducts: 'Verifier les produits',
    productsDescription: 'Consultez et gerez tous les produits recus.',
    goProducts: 'Aller aux produits',
  },
  ar: {
    manageJobs: 'ادارة الوظائف',
    jobsDescription: 'راجع الوظائف المنشورة وقم بادارتها بكفاءة.',
    goJobs: 'الذهاب للوظائف',
    reviewProducts: 'مراجعة المنتجات',
    productsDescription: 'عرض وادارة جميع المنتجات الواردة.',
    goProducts: 'الذهاب للمنتجات',
  },
};

const QuickLinks = memo(() => {
  const { language } = useI18n();
  const copy = quickLinksCopy[language];

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card className="hover:shadow-lg transition-shadow cursor-pointer">
        <CardHeader className="">
          <CardTitle className="flex items-center gap-2">
            <Briefcase className="h-5 w-5" />
            {copy.manageJobs}
          </CardTitle>
        </CardHeader>
        <CardContent className="">
          <p className="text-sm text-muted-foreground mb-4">
            {copy.jobsDescription}
          </p>
          <Button variant="primary" asChild>
            <Link href="/admin-super/jobs">{copy.goJobs}</Link>
          </Button>
        </CardContent>
      </Card>

      <Card className="hover:shadow-lg transition-shadow cursor-pointer">
        <CardHeader className="">
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            {copy.reviewProducts}
          </CardTitle>
        </CardHeader>
        <CardContent className="">
          <p className="text-sm text-muted-foreground mb-4">
            {copy.productsDescription}
          </p>
          <Button variant="primary" asChild>
            <Link href="/admin-super/products">{copy.goProducts}</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
});

QuickLinks.displayName = 'QuickLinks';

export default QuickLinks;
