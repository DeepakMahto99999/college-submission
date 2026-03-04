import React from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/context/AuthContext";
import { motion } from "framer-motion";
import {
  Flame,
  Timer,
  Trophy,
  Clock,
  TrendingUp,
  Play,
  BarChart3,
  Medal,
  Calendar,
} from "lucide-react";

import { getDashboardOverviewApi } from "@/api/dashboard.api";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import FeatureCard from "@/components/ui/FeatureCard";
import Testimonials from "@/components/Testimonials";

const dummyData = {
  summary: {
    totalFocusMinutes: 420,
    totalSessions: 67,
    currentStreak: 12,
    longestStreak: 21,
    todayFocusMinutes: 75,
    todaySessions: 3,
  },
  weeklyProgress: {
    totalMinutesThisWeek: 240,
    daily: {
      Mon: 30,
      Tue: 25,
      Wed: 40,
      Thu: 20,
      Fri: 50,
      Sat: 45,
      Sun: 30,
    },
  },
  recentSessions: [
    { topic: "React Advanced Patterns", statusLabel: "Completed" },
    { topic: "TypeScript Deep Dive", statusLabel: "Completed" },
    { topic: "CSS Grid Masterclass", statusLabel: "Incomplete" },
    { topic: "Node.js Best Practices", statusLabel: "Completed" },
    { topic: "System Design Interview", statusLabel: "Completed" },
  ],
  achievementsPreview: {
    unlockedCount: 5,
    totalCount: 12,
  },
};

const Dashboard = () => {
  const { user, isAuthenticated } = useAuth();

  const { data, isLoading } = useQuery({
    queryKey: ["dashboard-overview"],
    queryFn: async () => {
      const res = await getDashboardOverviewApi();
      return res.data;
    },
    enabled: isAuthenticated, // 🔥 only fetch if logged in
    staleTime: 1000 * 30,
  });

  const dashboardData = isAuthenticated ? data : dummyData;

  if (isAuthenticated && isLoading) {
    return (
      <div className="p-6 grid grid-cols-1 md:grid-cols-4 gap-6">
        {Array(4)
          .fill(0)
          .map((_, i) => (
            <Skeleton key={i} className="h-32 rounded-xl" />
          ))}
      </div>
    );
  }

  const {
    summary,
    weeklyProgress,
    recentSessions,
    achievementsPreview,
  } = dashboardData;

  return (
    <div className="p-6 space-y-10">

      {/* ================= HEADER ================= */}
      <div className="container mx-auto px-4 py-8">

        <motion.div
          initial={{ opacity: 0, y: 20 }}   // start animation
          animate={{ opacity: 1, y: 0 }}    // end animation
          className=""
        >

        <h1 className="text-3xl font-bold">
          {isAuthenticated
            ? `Welcome back, ${user?.name}!`
            : "Welcome to FocusTube 👋"}
        </h1>
        <p className="text-muted-foreground mt-2">
          Here’s your focus journey at a glance.
        </p>
          </motion.div>
      </div>

      {/* ================= SUMMARY CARDS ================= */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">

        <Card className="p-6 flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">Total Focus Time</p>
            <p className="text-2xl font-bold">
              {summary.totalFocusMinutes} min
            </p>
          </div>
          <Clock className="text-primary" size={28} />
        </Card>

        <Card className="p-6 flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">Total Sessions</p>
            <p className="text-2xl font-bold">
              {summary.totalSessions}
            </p>
          </div>
          <Timer className="text-primary" size={28} />
        </Card>

        <Card className="p-6 flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">Current Streak</p>
            <p className="text-2xl font-bold">
              {summary.currentStreak} days
            </p>
            <p className="text-xs text-muted-foreground">
              Best: {summary.longestStreak} days
            </p>
          </div>
          <Flame className="text-orange-500" size={28} />
        </Card>

        <Card className="p-6 flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">Today's Progress</p>
            <p className="text-2xl font-bold">
              {summary.todayFocusMinutes} min
            </p>
            <p className="text-xs text-muted-foreground">
              {summary.todaySessions} sessions
            </p>
          </div>
          <TrendingUp className="text-green-500" size={28} />
        </Card>

      </div>

      {/* ================= WEEKLY ================= */}
      <Card className="p-6"> 

        
        <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
          <Calendar className="h-5 w-5 text-primary" />
          Weekly Progress
          </h3>
        <div className="grid grid-cols-7 gap-3 text-center">
          {Object.entries(weeklyProgress.daily).map(([day, value]) => (
            <div key={day}>
              <p className="text-xs text-muted-foreground">{day}</p>
              <motion.div
                initial={{ height: 0 }}
                animate={{ height: `${Math.min(value, 120)}px` }}
                className="bg-primary rounded mt-2"
              />
            </div>
          ))}
        </div>
      </Card>



      {/* ================= RECENT ================= */}
      <Card className="p-6">
        <h3 className="font-semibold text-lg flex items-center gap-2">
          <Clock className="h-5 w-5 text-primary" />
          Recent Sessions
          </h3>
        <div className="space-y-3">
          {recentSessions.map((s, i) => (
            <div
              key={i}
              className="flex justify-between bg-muted/50 p-3 rounded-lg"
            >
              <span>{s.topic}</span>
              <span className="text-muted-foreground">
                {s.statusLabel}
              </span>
            </div>
          ))}
        </div>
      </Card> 


      <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">

        <FeatureCard
          title="Start Timer"
          description="Begin a 25-minute Pomodoro focus session with distraction blocking"
          icon={Play}
          href="/timer"
          delay={0.5}
        />

        <FeatureCard
          title="View Statistics"
          description="Analyze your focus patterns and track progress over time"
          icon={BarChart3}
          href="/statistics"
          delay={0.6}
        />

        <FeatureCard
          title="Achievements"
          description="Earn badges and rewards for your dedication"
          icon={Trophy}
          href="/achievements"
          delay={0.7}
        />

        <FeatureCard
          title="Leaderboard"
          description="Compare your progress with other focused learners"
          icon={Medal}
          href="/leaderboard"
          delay={0.8}
        />

      </div>

        <Testimonials />

      {/* ================= READY SECTION ================= */}
      <div className="text-center py-10">
        <h2 className="text-2xl font-bold mb-2">
          Ready to focus?
        </h2>
        <p className="text-muted-foreground mb-4">
          Start your next Pomodoro session and boost your productivity
        </p>
        <Link to="/timer">
          <Button size="lg" className="btn-gradient gap-2">
            <Play className="h-5 w-5" />
            Start Timer
          </Button>
        </Link>
      </div>

    </div>
  );
};

export default Dashboard;