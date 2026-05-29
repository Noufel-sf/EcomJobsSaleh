"use client";

import { useMemo, useState, memo } from "react";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";

import { useIsMobile } from "@/hooks/use-mobile";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { chartData } from "@/admin-seller/lib/chartData";

type MetricAreaChartProps = {
  title: string;
  description: string;
  totalLabel: string;
  totalValue: number;
  data?: Array<Record<string, number | string>>;
  dateKey?: string;
  primaryKey?: string;
  secondaryKey?: string;
  primaryLabel?: string;
  secondaryLabel?: string;
  primaryColor?: string;
  secondaryColor?: string;
};

export const MetricAreaChart = memo(function MetricAreaChart({
  title,
  description,
  totalLabel,
  totalValue,
  data,
  dateKey = "date",
  primaryKey = "mobile",
  secondaryKey = "desktop",
  primaryLabel = "Mobile",
  secondaryLabel = "Desktop",
  primaryColor = "var(--primary)",
  secondaryColor = "var(--primary)",
}: MetricAreaChartProps) {
  const isMobile = useIsMobile();
  const [timeRange, setTimeRange] = useState(() => (isMobile ? "7d" : "90d"));

  const dynamicConfig = useMemo(
    () => ({
      [primaryKey]: { label: primaryLabel, color: primaryColor },
      [secondaryKey]: { label: secondaryLabel, color: secondaryColor },
    }),
    [primaryColor, primaryKey, primaryLabel, secondaryColor, secondaryKey, secondaryLabel],
  );

  const filteredData = useMemo(() => {
    const source = data && data.length > 0 ? data : chartData;

    const referenceDate = new Date();
    let daysToSubtract = 90;

    if (timeRange === "30d") {
      daysToSubtract = 30;
    } else if (timeRange === "7d") {
      daysToSubtract = 7;
    }

    const startDate = new Date(referenceDate);
    startDate.setDate(startDate.getDate() - daysToSubtract);

    return source.filter((item) => {
      const date = new Date(String(item[dateKey] ?? ""));
      return date >= startDate;
    });
  }, [dateKey, timeRange, data]);

  return (
    <Card className="@container/card">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>
          <span className="hidden @[540px]/card:block">{description}</span>
          <span className="@[540px]/card:hidden">{description}</span>
        </CardDescription>
        <CardAction>
          <div className="flex items-center gap-3">
            <span className="rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground">
              {totalLabel}: {new Intl.NumberFormat().format(totalValue)}
            </span>
            <ToggleGroup
              type="single"
              value={timeRange}
              onValueChange={setTimeRange}
              variant="outline"
              className="hidden *:data-[slot=toggle-group-item]:px-4! @[767px]/card:flex"
            >
              <ToggleGroupItem value="90d">Last 3 months</ToggleGroupItem>
              <ToggleGroupItem value="30d">Last 30 days</ToggleGroupItem>
              <ToggleGroupItem value="7d">Last 7 days</ToggleGroupItem>
            </ToggleGroup>
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger
                className="flex w-40 **:data-[slot=select-value]:block **:data-[slot=select-value]:truncate @[767px]/card:hidden"
                size="sm"
                aria-label="Select a value"
              >
                <SelectValue placeholder="Last 3 months" />
              </SelectTrigger>
              <SelectContent className="rounded-xl">
                <SelectItem value="90d" className="rounded-lg">
                  Last 3 months
                </SelectItem>
                <SelectItem value="30d" className="rounded-lg">
                  Last 30 days
                </SelectItem>
                <SelectItem value="7d" className="rounded-lg">
                  Last 7 days
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardAction>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer config={dynamicConfig} className="aspect-auto h-62.5 w-full">
          <AreaChart data={filteredData}>
            <defs>
              <linearGradient id={`fill-${secondaryKey}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={`var(--color-${secondaryKey})`} stopOpacity={1.0} />
                <stop offset="95%" stopColor={`var(--color-${secondaryKey})`} stopOpacity={0.1} />
              </linearGradient>
              <linearGradient id={`fill-${primaryKey}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={`var(--color-${primaryKey})`} stopOpacity={0.8} />
                <stop offset="95%" stopColor={`var(--color-${primaryKey})`} stopOpacity={0.1} />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => {
                const date = new Date(value);
                return date.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                });
              }}
            />
            <ChartTooltip
              cursor={false}
              defaultIndex={isMobile ? -1 : 10}
              content={
                <ChartTooltipContent
                  labelFormatter={(value) =>
                    new Date(String(value)).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })
                  }
                  indicator="dot"
                />
              }
            />
            <Area
              dataKey={primaryKey}
              type="natural"
              fill={`url(#fill-${primaryKey})`}
              stroke={`var(--color-${primaryKey})`}
              stackId="a"
            />
            <Area
              dataKey={secondaryKey}
              type="natural"
              fill={`url(#fill-${secondaryKey})`}
              stroke={`var(--color-${secondaryKey})`}
              stackId="a"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
});