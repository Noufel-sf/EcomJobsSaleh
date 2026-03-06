'use client';

import { TrendingUp, TrendingDown, Briefcase, Users, CheckCircle2, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAppSelector } from '@/Redux/hooks';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useGetAllJobsQuery } from '@/Redux/Services/JobApi';
import { useGetAllApplicationsQuery } from '@/Redux/Services/JobApi';
import EmployerSidebarLayout from '@/components/EmployerSidebarLayout';

export default function EmployerDashboard() {
  const user = useAppSelector((state) => state.auth.user);

  const { data: jobsData, error: jobsError } = useGetAllJobsQuery(undefined);
  const { data: applicationsData, error: appsError } = useGetAllApplicationsQuery(undefined);

  // Handle API errors gracefully
  if (jobsError) {
    console.warn('Jobs API not available:', jobsError);
  }
  if (appsError) {
    console.warn('Applications API not available:', appsError);
  }

  const totalJobs = jobsData?.totalJobs || 0;
  const totalApplications = applicationsData?.totalApplications || 0;
  const pendingApplications =
    applicationsData?.content?.filter((app) => app.status === 'pending').length || 0;
  const acceptedApplications =
    applicationsData?.content?.filter((app) => app.status === 'accepted').length || 0;

  const stats = [
    {
      title: 'Total Jobs',
      value: totalJobs.toString(),
      change: '+12.5%',
      trend: 'up',
      description: 'Active job listings',
      subtitle: 'Manage your postings',
      icon: Briefcase,
    },
    {
      title: 'Total Applications',
      value: totalApplications.toString(),
      change: '+8.2%',
      trend: 'up',
      description: 'Received applications',
      subtitle: 'Review candidates',
      icon: Users,
    },
    {
      title: 'Pending Review',
      value: pendingApplications.toString(),
      change: '-5%',
      trend: 'down',
      description: 'Awaiting your response',
      subtitle: 'Take action soon',
      icon: Clock,
    },
    {
      title: 'Accepted',
      value: acceptedApplications.toString(),
      change: '+15%',
      trend: 'up',
      description: 'Candidates hired',
      subtitle: 'Successful placements',
      icon: CheckCircle2,
    },
  ];

  return (
    <EmployerSidebarLayout breadcrumbTitle="Dashboard">
      <h1 className="font-medium text-xl mb-8">
        Welcome Back, <span>{user?.name || 'Employer'}</span> 👋🏻
        <br />
        <span className="text-gray-600 dark:text-gray-400">
          Manage your jobs and review applications!
        </span>
      </h1>

          {/* Stats Grid */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <Card
                  key={index}
                  className="bg-card border-border cursor-pointer hover:shadow-lg transition-shadow"
                >
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      {stat.title}
                    </CardTitle>
                    <Icon className="w-4 h-4 text-primary" />
                  </CardHeader>
                  <CardContent className="">
                    <div className="text-2xl font-bold">{stat.value}</div>
                    <div className="flex items-center gap-2 mt-3">
                      <p
                        className={`text-xs font-medium flex items-center gap-1 ${
                          stat.trend === 'up'
                            ? 'text-green-600 dark:text-green-500'
                            : 'text-red-600 dark:text-red-500'
                        }`}
                      >
                        {stat.trend === 'up' ? (
                          <TrendingUp className="w-3 h-3" />
                        ) : (
                          <TrendingDown className="w-3 h-3" />
                        )}
                        {stat.change}
                      </p>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      {stat.description}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Quick Actions */}
          <div className="grid gap-4 md:grid-cols-2 mb-8">
            <Card className="bg-card border-border hover:shadow-lg transition-shadow">
              <CardHeader className="">
                <CardTitle className="">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button asChild variant="default" className="w-full">
                  <Link href="/employer/jobs">Manage Jobs</Link>
                </Button>
                <Button asChild variant="outline" className="w-full">
                  <Link href="/employer/applications">Review Applications</Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-card border-border hover:shadow-lg transition-shadow">
              <CardHeader className="">
                <CardTitle className="">Recent Activity</CardTitle>
              </CardHeader>
              <CardContent className="">
                <p className="text-sm text-muted-foreground">
                  {totalApplications > 0
                    ? `You have ${pendingApplications} pending applications to review.`
                    : 'No recent activity. Start posting jobs to attract candidates!'}
                </p>
              </CardContent>
            </Card>
          </div>
    </EmployerSidebarLayout>
  );
}
