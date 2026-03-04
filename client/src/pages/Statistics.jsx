import React, { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import {
  BarChart3,
  TrendingUp,
  Clock,
  Calendar,
} from "lucide-react";

import {
  getTodayStatsApi,
  getWeeklyStatsApi,
  getDailyPatternApi,
  getMonthlyStatsApi,
} from "@/api/statistics.api";

import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useTheme } from "@/context/ThemeContext";

const Statistics = () => {
  const [timeRange, setTimeRange] = useState("weekly");
  const { theme } = useTheme();

  const chartColors = {
    primary: theme === "dark"
      ? "hsl(174, 72%, 50%)"
      : "hsl(174, 72%, 40%)",
    accent: theme === "dark"
      ? "hsl(16, 85%, 60%)"
      : "hsl(16, 85%, 57%)",
    grid: theme === "dark"
      ? "hsl(217, 33%, 20%)"
      : "hsl(214, 32%, 91%)",
  };

  const { data, isLoading, isError } = useQuery({
    queryKey: ["statistics-full"],
    queryFn: async () => {
      const [today, weekly, daily, monthly] = await Promise.all([
        getTodayStatsApi(),
        getWeeklyStatsApi(),
        getDailyPatternApi(),
        getMonthlyStatsApi(),
      ]);

      return {
        today: today.data,
        weekly: weekly.data.daily,
        dailyPattern: daily.data.pattern,
        monthly: monthly.data.monthly,
      };
    },
    staleTime: 1000 * 30,
  });

  if (isLoading) {
    return (
      <div className="p-6 space-y-6">
        {Array(6).fill(0).map((_, i) => (
          <Skeleton key={i} className="h-32 rounded-xl" />
        ))}
      </div>
    );
  }

  if (isError) {
    return <div className="p-6 text-red-500">Failed to load statistics</div>;
  }

  const { today, weekly, dailyPattern, monthly } = data;

  // ================= DERIVED METRICS =================

  const totalWeeklyMinutes = Object.values(weekly).reduce(
    (a, b) => a + b,
    0
  );

  const totalWeeklySessions = today.sessions || 0;

  const avgDailyMinutes = Math.round(totalWeeklyMinutes / 7);

  const bestDayEntry = Object.entries(weekly).reduce(
    (max, curr) => (curr[1] > max[1] ? curr : max),
    ["N/A", 0]
  );

  const bestDay = bestDayEntry[0];
  const bestDayMinutes = Math.round(bestDayEntry[1]);

  const peakHourEntry = Object.entries(dailyPattern).reduce(
    (max, curr) => (curr[1] > max[1] ? curr : max),
    ["0:00", 0]
  );

  const peakStart = parseInt(peakHourEntry[0]);
  const peakEnd = peakStart + 2;

  // ================= CHART DATA =================

  const weeklyChartData = Object.entries(weekly).map(
    ([day, minutes]) => ({
      label: day,
      minutes,
      sessions: Math.round(minutes / 25),
    })
  );

  const dailyChartData = Object.entries(dailyPattern).map(
    ([bucket, minutes]) => ({
      label: bucket,
      minutes,
    })
  );

  const monthlyChartData = Object.entries(monthly).map(
    ([week, value]) => ({
      label: week,
      hours: value.hours,
      sessions: value.sessions,
    })
  );

  const chartData =
    timeRange === "daily"
      ? dailyChartData
      : timeRange === "weekly"
      ? weeklyChartData
      : monthlyChartData;

  return (
    <div className="container mx-auto px-4 py-8 space-y-10">

      {/* HEADER */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <h1 className="text-4xl font-bold">Statistics</h1>
        <p className="text-muted-foreground">
          Track your focus patterns and productivity trends
        </p>
      </motion.div>

      {/* SUMMARY CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

        <Card className="p-6">
          <div className="flex items-center gap-3">
            <Calendar />
            <div>
              <p className="text-sm text-muted-foreground">This Week</p>
              <p className="text-2xl font-bold">
                {Math.floor(totalWeeklyMinutes / 60)}h{" "}
                {totalWeeklyMinutes % 60}m
              </p>
              <p className="text-xs text-muted-foreground">
                {totalWeeklySessions} sessions
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-3">
            <Clock />
            <div>
              <p className="text-sm text-muted-foreground">
                Daily Average
              </p>
              <p className="text-2xl font-bold">
                {avgDailyMinutes} min
              </p>
              <p className="text-xs text-muted-foreground">
                Focus time
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-3">
            <TrendingUp />
            <div>
              <p className="text-sm text-muted-foreground">
                Best Day
              </p>
              <p className="text-2xl font-bold">{bestDay}</p>
              <p className="text-xs text-muted-foreground">
                {bestDayMinutes} minutes focused
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-3">
            <BarChart3 />
            <div>
              <p className="text-sm text-muted-foreground">
                Peak Hours
              </p>
              <p className="text-2xl font-bold">
                {peakStart}–{peakEnd} PM
              </p>
              <p className="text-xs text-muted-foreground">
                Most productive time
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* TIME RANGE */}
      <div className="flex justify-center">
        <div className="inline-flex bg-muted rounded-lg p-1">
          {["daily", "weekly", "monthly"].map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-6 py-2 rounded-md text-sm ${
                timeRange === range
                  ? "bg-background shadow-sm"
                  : "text-muted-foreground"
              }`}
            >
              {range}
            </button>
          ))}
        </div>
      </div>

      {/* CHARTS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        <Card className="p-6">
          <h3 className="font-semibold mb-4">Focus Minutes</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <CartesianGrid stroke={chartColors.grid} />
                <XAxis dataKey="label" />
                <YAxis />
                <Tooltip />
                <Area
                  dataKey={timeRange === "monthly" ? "hours" : "minutes"}
                  stroke={chartColors.primary}
                  fill={chartColors.primary}
                  fillOpacity={0.3}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="font-semibold mb-4">
            Sessions Completed
          </h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyChartData}>
                <CartesianGrid stroke={chartColors.grid} />
                <XAxis dataKey="label" />
                <YAxis />
                <Tooltip />
                <Bar
                  dataKey="sessions"
                  fill={chartColors.accent}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-6 lg:col-span-2">
          <h3 className="font-semibold mb-4">
            Monthly Progress
          </h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthlyChartData}>
                <CartesianGrid stroke={chartColors.grid} />
                <XAxis dataKey="label" />
                <YAxis />
                <Tooltip />
                <Line
                  dataKey="hours"
                  stroke={chartColors.primary}
                />
                <Line
                  dataKey="sessions"
                  stroke={chartColors.accent}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* INSIGHTS */}
      <Card className="p-6">
        <h3 className="font-semibold mb-4">💡 Insights</h3>
        <div className="grid md:grid-cols-3 gap-4">
          <div className="p-4 bg-primary/5 rounded-lg">
            Peak productivity is between {peakStart}–{peakEnd} PM
          </div>
          <div className="p-4 bg-accent/5 rounded-lg">
            Best day this week was {bestDay}
          </div>
          <div className="p-4 bg-green-500/5 rounded-lg">
            Consistency improves productivity
          </div>
        </div>
      </Card>

    </div>
  );
};

export default Statistics;