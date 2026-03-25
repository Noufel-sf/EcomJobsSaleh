'use client';

import { memo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Briefcase, Users } from 'lucide-react';
import Link from 'next/link';

const QuickLinks = memo(() => (
  <div className="grid gap-4 md:grid-cols-2">
    <Card className="hover:shadow-lg transition-shadow cursor-pointer">
      <CardHeader className="">
        <CardTitle className="flex items-center gap-2">
          <Briefcase className="h-5 w-5" />
          Manage Jobs
        </CardTitle>
      </CardHeader>
      <CardContent className="">
        <p className="text-sm text-muted-foreground mb-4">
          Create and manage your job listings.
        </p>
        <Button variant="primary" asChild>
          <Link href="/employer/jobs">Go to Jobs</Link>
        </Button>
      </CardContent>
    </Card>

    <Card className="hover:shadow-lg transition-shadow cursor-pointer">
      <CardHeader className="">
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          Review Applications
        </CardTitle>
      </CardHeader>
      <CardContent className="">
        <p className="text-sm text-muted-foreground mb-4">
          View and manage all incoming applications.
        </p>
        <Button variant="primary" asChild>
          <Link href="/employer/applications">Go to Applications</Link>
        </Button>
      </CardContent>
    </Card>
  </div>
));

QuickLinks.displayName = 'QuickLinks';

export default QuickLinks;
