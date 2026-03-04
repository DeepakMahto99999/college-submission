import React from "react";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Trophy, Medal, Crown } from "lucide-react";

import { getLeaderboardApi } from "@/api/leaderboard.api";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const Leaderboard = () => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["leaderboard"],
    queryFn: async () => {
      const res = await getLeaderboardApi();
      return res.data;
    },
    staleTime: 1000 * 30,
  });

  if (isLoading) {
    return (
      <div className="p-6 space-y-4">
        {Array(8)
          .fill(0)
          .map((_, i) => (
            <Skeleton key={i} className="h-16 rounded-xl" />
          ))}
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-6 text-red-500">
        Failed to load leaderboard.
      </div>
    );
  }

  const { leaderboard, currentUser } = data;

  const getRankIcon = (rank) => {
    if (rank === 1) return <Crown className="text-yellow-500" size={20} />;
    if (rank === 2) return <Medal className="text-gray-400" size={20} />;
    if (rank === 3) return <Medal className="text-amber-600" size={20} />;
    return <Trophy size={18} className="text-muted-foreground" />;
  };

  return (
    <div className="p-6 space-y-8">

      {/* ================= CURRENT USER SUMMARY ================= */}
      <Card className="p-6 flex items-center justify-between bg-primary/5 border border-primary/20">
        <div>
          <p className="text-sm text-muted-foreground">Your Rank</p>
          <p className="text-3xl font-bold">
            #{currentUser.rank}
          </p>
        </div>

        <div className="text-right">
          <p className="font-semibold">{currentUser.name}</p>
          <p className="text-sm text-muted-foreground">
            {currentUser.points} pts • {currentUser.totalSessions} sessions
          </p>
        </div>
      </Card>

      {/* ================= LEADERBOARD LIST ================= */}
      <div className="space-y-3">

        {leaderboard.map((user, index) => {
          const rank = index + 1;

          return (
            <motion.div
              key={user._id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.03 }}
            >
              <Card
                className={`p-4 flex items-center justify-between ${
                  user.isCurrentUser
                    ? "border-2 border-primary bg-primary/5"
                    : ""
                }`}
              >
                <div className="flex items-center gap-4">

                  {/* Rank Icon */}
                  <div className="w-8 flex justify-center">
                    {getRankIcon(rank)}
                  </div>

                  {/* Rank Number */}
                  <p className="w-8 text-muted-foreground font-medium">
                    #{rank}
                  </p>

                  {/* Avatar (optional) */}
                  <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-sm font-bold">
                    {user.name?.charAt(0)?.toUpperCase() || "U"}
                  </div>

                  {/* Name */}
                  <div>
                    <p className="font-medium">{user.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {user.totalSessions} sessions • {user.currentStreak} streak
                    </p>
                  </div>
                </div>

                {/* Points */}
                <div className="text-right">
                  <p className="font-semibold">{user.points}</p>
                  <p className="text-xs text-muted-foreground">points</p>
                </div>
              </Card>
            </motion.div>
          );
        })}

      </div>
    </div>
  );
};

export default Leaderboard;