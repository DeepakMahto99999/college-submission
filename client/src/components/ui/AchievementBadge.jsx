// Import React to create a React component
import React from "react";

// Import motion to add animations
import { motion } from "framer-motion";

// Import cn utility to merge conditional Tailwind CSS classes
import { cn } from "@/lib/utils";

/**
 * AchievementBadge
 * This component displays ONE achievement card.
 * It supports locked and unlocked states with animation and progress.
 */
const AchievementBadge = ({
  icon,         // Icon or emoji for the achievement
  title,        // Achievement title
  description,  // Short description of achievement
  unlocked,     // Boolean: true if achievement is unlocked
  unlockedAt,   // Date when achievement was unlocked
  progress,     // Current progress value
  target,       // Target value needed to unlock
  delay = 0,    // Animation delay (used when rendering list)
  className,    // Extra CSS classes if needed
}) => {

  // Check if progress tracking is available
  const hasProgress =
    typeof progress === "number" && typeof target === "number";

  // Calculate progress percentage for progress bar
  const progressPercent = hasProgress ? (progress / target) * 100 : 0;

  return (
    // Main animated card container
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}      // Initial animation state
      animate={{ opacity: 1, scale: 1 }}        // Final animation state
      transition={{ delay, duration: 0.4, type: "spring" }}
      whileHover={{ scale: 1.02 }}               // Slight zoom on hover

      // Combine base styles + conditional styles
      className={cn(
        "relative glass-card rounded-xl p-5 transition-all duration-300",
        unlocked ? "border-primary/30" : "opacity-75", // Highlight if unlocked
        className
      )}
    >
      {/* Glow background if achievement is unlocked */}
      {unlocked && (
        <div className="absolute inset-0 rounded-xl bg-primary/5 animate-pulse" />
      )}

      <div className="relative flex items-start gap-4">
        
        {/* Icon container */}
        <div
          className={cn(
            "flex h-14 w-14 items-center justify-center rounded-xl text-3xl shrink-0",
            unlocked ? "bg-primary/10" : "bg-muted grayscale"
          )}
        >
          {icon}
        </div>

        {/* Achievement details */}
        <div className="flex-1 min-w-0">

          {/* Title and unlocked badge */}
          <div className="flex items-center gap-2 mb-1">
            <h3
              className={cn(
                "font-semibold truncate",
                unlocked ? "text-foreground" : "text-muted-foreground"
              )}
            >
              {title}
            </h3>

            {/* Show unlocked label only if unlocked */}
            {unlocked && (
              <span className="text-xs px-2 py-0.5 rounded-full bg-success/10 text-success font-medium">
                Unlocked
              </span>
            )}
          </div>

          {/* Achievement description */}
          <p className="text-sm text-muted-foreground mb-2">
            {description}
          </p>

          {/* Progress bar (only if locked and progress exists) */}
          {!unlocked && hasProgress && (
            <div className="space-y-1">
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}                       // Start empty
                  animate={{ width: `${progressPercent}%` }}  // Animate to progress %
                  transition={{ delay: delay + 0.2, duration: 0.8 }}
                  className="h-full bg-primary rounded-full"
                />
              </div>
              <p className="text-xs text-muted-foreground">
                {progress} / {target}
              </p>
            </div>
          )}

          {/* Unlock date (only if unlocked) */}
          {unlocked && unlockedAt && (
            <p className="text-xs text-muted-foreground">
              Unlocked on {unlockedAt.toLocaleDateString()}
            </p>
          )}
        </div>
      </div>
    </motion.div>
  );
};

// Export component so it can be used in Achievements page
export default AchievementBadge;
