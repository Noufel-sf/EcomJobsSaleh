'use client';

import { memo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, TrendingDown, type LucideIcon } from 'lucide-react';

interface Stat {
  title: string;
  value: string;
  change: string;
  trend: 'up' | 'down';
  description: string;
  subtitle: string;
  icon: LucideIcon;
}

interface SuperAdminDashboardStatsProps {
  stats: Stat[];
}

const StatCard = memo(({ stat }: { stat: Stat }) => {
  const Icon = stat.icon;
  
  return (
    <Card className="bg-card border-border cursor-pointer hover:shadow-lg transition-shadow">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
        <div
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
        </div>
      </CardHeader>
      <CardContent className="">
        <div className="flex items-center justify-between">
          <div className="text-2xl font-bold">{stat.value}</div>
          <Icon className="h-8 w-8 text-muted-foreground opacity-40" />
        </div>
        <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1">
          {stat.description}
          {stat.trend === 'up' ? (
            <TrendingUp className="w-3 h-3" />
          ) : (
            <TrendingDown className="w-3 h-3" />
          )}
        </p>
        <p className="text-xs text-muted-foreground mt-1">{stat.subtitle}</p>
      </CardContent>
    </Card>
  );
});

StatCard.displayName = 'StatCard';

const SuperAdminDashboardStats = memo(({ stats }: SuperAdminDashboardStatsProps) => (
  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
    {stats.map((stat, index) => (
      <StatCard key={`${stat.title}-${index}`} stat={stat} />
    ))}
  </div>
));

SuperAdminDashboardStats.displayName = 'SuperAdminDashboardStats';

export default SuperAdminDashboardStats;
