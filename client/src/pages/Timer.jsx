import React, { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import {
  Play,
  Pause,
  RotateCcw,
  Settings2,
  AlertTriangle,
  CheckCircle2,
  Tv,
  Home,
  MessageSquare,
  Layout,
  PanelLeft,
  ToggleRight,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import ProgressRing from "@/components/ui/ProgressRing";

import { useApp } from "@/context/AppContext";
import { formatTime } from "@/utils/formatTime";
import { toast } from "@/hooks/use-toast";

import { getCurrentSessionApi } from "@/api/session.api";

const Timer = () => {
  const { timerSettings, toggleSettings, updateToggleSettings } = useApp();

  // ================= SESSION STATUS =================
  const [sessionStatus, setSessionStatus] = useState("WAITING");
  const [backendSessionId, setBackendSessionId] = useState(null);

  // ================= TIMER STATE =================
  const [timeLeft, setTimeLeft] = useState(timerSettings.focusDuration);
  const [timerState, setTimerState] = useState("idle");
  const [timerMode, setTimerMode] = useState("focus");
  const [sessionsCompleted, setSessionsCompleted] = useState(0);

  // =========================================================
  // 🔥 LOAD BACKEND SESSION ON MOUNT
  // =========================================================
  useEffect(() => {
    const loadSession = async () => {
      try {
        const res = await getCurrentSessionApi();
        const backendSession = res.data.session;

        if (!backendSession) {
          setSessionStatus("WAITING");
          return;
        }

        setBackendSessionId(backendSession.id);

        switch (backendSession.status) {
          case "ARMED":
            setSessionStatus("WAITING");
            break;
          case "RUNNING":
            setSessionStatus("ACTIVE");
            setTimerState("running");
            break;
          case "INVALID":
            setSessionStatus("INVALID");
            break;
          default:
            setSessionStatus("WAITING");
        }

      } catch (err) {
        console.error("Failed to load session", err);
      }
    };

    loadSession();
  }, []);

  // ================= TIMER CALCULATIONS =================
  const totalTime =
    timerMode === "focus"
      ? timerSettings.focusDuration
      : timerMode === "shortBreak"
      ? timerSettings.shortBreakDuration
      : timerSettings.longBreakDuration;

  const progress = ((totalTime - timeLeft) / totalTime) * 100;

  const allTogglesEnabled = Object.values(toggleSettings).every(Boolean);

  // ================= TIMER COMPLETE =================
  const handleTimerComplete = useCallback(() => {
    setTimerState("idle");

    if (timerMode === "focus") {
      const newSessions = sessionsCompleted + 1;
      setSessionsCompleted(newSessions);

      toast({
        title: "Focus session complete!",
        description: `You've completed ${newSessions} session${
          newSessions > 1 ? "s" : ""
        } today.`,
      });

      if (newSessions % 4 === 0) {
        setTimerMode("longBreak");
        setTimeLeft(timerSettings.longBreakDuration);
      } else {
        setTimerMode("shortBreak");
        setTimeLeft(timerSettings.shortBreakDuration);
      }
    } else {
      setTimerMode("focus");
      setTimeLeft(timerSettings.focusDuration);
    }
  }, [timerMode, sessionsCompleted, timerSettings]);

  // ================= COUNTDOWN =================
  useEffect(() => {
    let interval;

    if (timerState === "running" && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    }

    if (timeLeft === 0 && timerState === "running") {
      handleTimerComplete();
    }

    return () => clearInterval(interval);
  }, [timerState, timeLeft, handleTimerComplete]);

  // ================= CONTROLS =================
  const startTimer = () => {
    if (!allTogglesEnabled) {
      toast({
        title: "Enable all distraction blockers",
        description: "For best focus, enable all YouTube toggles.",
        variant: "destructive",
      });
      return;
    }

    if (sessionStatus === "INVALID") {
      toast({
        title: "Session stopped",
        description: "Topic mismatch. Start a new session.",
        variant: "destructive",
      });
      return;
    }

    setTimerState("running");
    setSessionStatus("ACTIVE");
  };

  const pauseTimer = () => {
    setTimerState("paused");
  };

  const resetTimer = () => {
    setTimerState("idle");
    setTimeLeft(totalTime);
  };

  const switchMode = (mode) => {
    setTimerState("idle");
    setTimerMode(mode);
    setTimeLeft(
      mode === "focus"
        ? timerSettings.focusDuration
        : mode === "shortBreak"
        ? timerSettings.shortBreakDuration
        : timerSettings.longBreakDuration
    );
  };

  const enableAllToggles = () => {
    updateToggleSettings({
      hideShorts: true,
      hideHome: true,
      hideComments: true,
      hideRecommendations: true,
      hideSidebar: true,
    });

    toast({
      title: "All distractions blocked!",
      description: "Maximum focus mode enabled.",
    });
  };

  const toggleItems = [
    { key: "hideShorts", label: "Hide Shorts", icon: Tv },
    { key: "hideHome", label: "Hide Home", icon: Home },
    { key: "hideComments", label: "Hide Comments", icon: MessageSquare },
    { key: "hideRecommendations", label: "Hide Recommendations", icon: Layout },
    { key: "hideSidebar", label: "Hide Sidebar", icon: PanelLeft },
  ];

  return (
    <div className="container mx-auto px-4 py-8">

      {/* STATUS TEXT */}
      <p className="text-sm text-muted-foreground mb-6 text-center">
        {sessionStatus === "WAITING" && "Waiting for valid video..."}
        {sessionStatus === "ACTIVE" && "Focus session active"}
        {sessionStatus === "INVALID" && "Session stopped due to topic mismatch"}
      </p>

      <div className="max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">

        {/* TIMER PANEL */}
        <motion.div className="glass-card rounded-2xl p-8">

          <div className="flex justify-center gap-2 mb-8">
            {["focus", "shortBreak", "longBreak"].map((mode) => (
              <button
                key={mode}
                onClick={() => switchMode(mode)}
                className={`px-4 py-2 rounded-lg text-sm font-medium ${
                  timerMode === mode
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                {mode}
              </button>
            ))}
          </div>

          <div className="flex justify-center mb-8">
            <ProgressRing progress={progress} size={260} strokeWidth={10}>
              <div className="text-center">
                <p className="font-display text-5xl font-bold">
                  {formatTime(timeLeft)}
                </p>
              </div>
            </ProgressRing>
          </div>

          <div className="flex justify-center gap-4">
            {timerState === "running" ? (
              <Button onClick={pauseTimer}>
                <Pause /> Pause
              </Button>
            ) : (
              <Button onClick={startTimer}>
                <Play /> Start
              </Button>
            )}
            <Button variant="ghost" onClick={resetTimer}>
              <RotateCcw /> Reset
            </Button>
          </div>

        </motion.div>

        {/* TOGGLES PANEL */}
        <motion.div className="glass-card rounded-2xl p-6">

          <div className="flex justify-between mb-6">
            <div className="flex items-center gap-2">
              <Settings2 />
              <h3 className="font-semibold">Distraction Controls</h3>
            </div>
            <Button size="sm" variant="outline" onClick={enableAllToggles}>
              <ToggleRight /> Enable All
            </Button>
          </div>

          {toggleItems.map(({ key, label, icon: Icon }) => (
            <div
              key={key}
              className="flex justify-between p-4 bg-muted/50 rounded-lg mb-3"
            >
              <div className="flex gap-3">
                <Icon />
                <Label>{label}</Label>
              </div>
              <Switch
                checked={toggleSettings[key]}
                onCheckedChange={(checked) =>
                  updateToggleSettings({ [key]: checked })
                }
              />
            </div>
          ))}

        </motion.div>

      </div>
    </div>
  );
};

export default Timer;