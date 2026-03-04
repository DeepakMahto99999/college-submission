import React, { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import {
  Trophy,
  Star,
  Flame,
  Clock,
  Calendar,
  Award,
} from "lucide-react";

import {
  getAllAchievementsApi,
  getAchievementsPreviewApi,
} from "@/api/achievements.api";

import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";

/* =====================================================
   ICON MAP — MUST MATCH BACKEND ENUM EXACTLY
===================================================== */

const iconMap = {
  TOTAL_SESSIONS: Star,
  TOTAL_MINUTES: Clock,
  CURRENT_STREAK: Flame,
  LONGEST_STREAK: Flame,
  EARLY_BIRD: Calendar,
  NIGHT_OWL: Calendar,
  WEEKEND: Award,
  PERFECT_DAY: Award,
};

const Achievements = () => {
  const [filter, setFilter] = useState("all");

  /* =====================================================
     DATA FETCH
  ===================================================== */

  const { data, isLoading, isError } = useQuery({
    queryKey: ["achievements"], // add userId if multi-user context
    queryFn: async () => {
      const [allRes, previewRes] = await Promise.all([
        getAllAchievementsApi(),
        getAchievementsPreviewApi(),
      ]);

      return {
        all: Array.isArray(allRes?.data?.data)
          ? allRes.data.data
          : [],
        preview: previewRes?.data?.data ?? {},
      };
    },
    staleTime: 1000 * 60 * 5, // cache 5 min
  });

  const allAchievements = data?.all ?? [];
  const preview = data?.preview ?? {};

  /* =====================================================
     UNLOCKED SET (SAFE STRING MATCH)
  ===================================================== */

  const unlockedIds = useMemo(() => {
    const ids = preview?.unlockedIds ?? [];
    return new Set(ids.map(String));
  }, [preview]);

  /* =====================================================
     PROGRESS MAP
  ===================================================== */

  const progressMap = useMemo(() => {
    const map = {};
    (preview?.inProgress ?? []).forEach((item) => {
      if (item?.achievementId) {
        map[String(item.achievementId)] = item;
      }
    });
    return map;
  }, [preview]);

  /* =====================================================
     NORMALIZED DATA
  ===================================================== */

  const normalized = useMemo(() => {
    return allAchievements.map((ach) => {
      const id = String(ach._id);
      const unlocked = unlockedIds.has(id);
      const progressData = progressMap[id];

      return {
        ...ach,
        _id: id,
        unlocked,
        progress: progressData?.progress ?? 0,
        target: ach?.threshold ?? 1,
      };
    });
  }, [allAchievements, unlockedIds, progressMap]);

  /* =====================================================
     FILTER
  ===================================================== */

  const filtered = useMemo(() => {
    if (filter === "unlocked") {
      return normalized.filter((a) => a.unlocked);
    }
    if (filter === "locked") {
      return normalized.filter((a) => !a.unlocked);
    }
    return normalized;
  }, [normalized, filter]);

  const totalCount = normalized.length;
  const unlockedCount = unlockedIds.size;

  const overallPercent =
    totalCount > 0
      ? Math.round((unlockedCount / totalCount) * 100)
      : 0;

  /* =====================================================
     LOADING STATE
  ===================================================== */

  if (isLoading) {
    return (
      <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-40 rounded-xl" />
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-6 text-red-500">
        Failed to load achievements.
      </div>
    );
  }

  /* =====================================================
     UI
  ===================================================== */

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">

      {/* HEADER */}
      <div>
        <h1 className="text-4xl font-bold mb-2">
          Achievements
        </h1>
        <p className="text-muted-foreground">
          Collect badges and celebrate your productivity milestones
        </p>
      </div>

      {/* SUMMARY */}
      <Card className="p-6">
        <div className="flex flex-col md:flex-row items-center gap-6">
          <div className="h-20 w-20 flex items-center justify-center rounded-full bg-primary/10">
            <Trophy className="h-10 w-10 text-primary" />
          </div>

          <div className="flex-1 text-center md:text-left">
            <h2 className="text-2xl font-bold">
              {unlockedCount} / {totalCount} Unlocked
            </h2>

            <div className="mt-3">
              <Progress value={overallPercent} />
              <p className="text-sm text-muted-foreground mt-2">
                {overallPercent}% complete
              </p>
            </div>
          </div>
        </div>
      </Card>

      {/* FILTER */}
      <div className="flex justify-center">
        <div className="inline-flex rounded-lg bg-muted p-1">
          {["all", "unlocked", "locked"].map((key) => (
            <button
              key={key}
              onClick={() => setFilter(key)}
              className={`px-4 py-2 text-sm rounded-md transition ${
                filter === key
                  ? "bg-background shadow-sm"
                  : "text-muted-foreground"
              }`}
            >
              {key.charAt(0).toUpperCase() + key.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((ach, index) => {
          const Icon =
            iconMap[ach.conditionType] ?? Trophy;

          const percent =
            ach.target > 0
              ? Math.min(
                  (ach.progress / ach.target) * 100,
                  100
                )
              : 0;

          return (
            <motion.div
              key={ach._id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.04 }}
            >
              <Card
                className={`p-6 transition ${
                  ach.unlocked
                    ? "border-2 border-primary bg-primary/5"
                    : ""
                }`}
              >
                <div className="flex items-center gap-3 mb-3">
                  <Icon
                    className={
                      ach.unlocked
                        ? "text-yellow-500"
                        : "text-muted-foreground"
                    }
                  />
                  <h3 className="font-semibold">
                    {ach.title}
                  </h3>
                </div>

                <p className="text-sm text-muted-foreground mb-4">
                  {ach.description}
                </p>

                {!ach.unlocked && (
                  <>
                    <Progress value={percent} />
                    <p className="text-xs text-muted-foreground mt-2">
                      {ach.progress} / {ach.target}
                    </p>
                  </>
                )}

                {ach.unlocked && (
                  <p className="text-xs text-primary font-medium">
                    Unlocked
                  </p>
                )}
              </Card>
            </motion.div>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-10">
          No achievements found.
        </div>
      )}
    </div>
  );
};

export default Achievements;