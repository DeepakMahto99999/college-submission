// Dummy data for FocusTube dashboard

// Recent sessions data
export const recentSessions = [
  {
    id: '1',
    date: new Date(Date.now() - 1000 * 60 * 30),
    duration: 1500,
    completed: true,
    videoTitle: 'React Advanced Patterns',
  },
  {
    id: '2',
    date: new Date(Date.now() - 1000 * 60 * 60 * 2),
    duration: 1500,
    completed: true,
    videoTitle: 'TypeScript Deep Dive',
  },
  {
    id: '3',
    date: new Date(Date.now() - 1000 * 60 * 60 * 5),
    duration: 1200,
    completed: false,
    videoTitle: 'CSS Grid Masterclass',
  },
  {
    id: '4',
    date: new Date(Date.now() - 1000 * 60 * 60 * 24),
    duration: 1500,
    completed: true,
    videoTitle: 'Node.js Best Practices',
  },
  {
    id: '5',
    date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2),
    duration: 1500,
    completed: true,
    videoTitle: 'System Design Interview',
  },
];

// Achievements data
export const achievements = [
  {
    id: '1',
    title: 'First Steps',
    description: 'Complete your first focus session',
    icon: '🎯',
    unlocked: true,
    unlockedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30),
  },
  {
    id: '2',
    title: '1 Day Streak',
    description: 'Maintain a 1-day focus streak',
    icon: '🔥',
    unlocked: true,
    unlockedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 28),
  },
  {
    id: '3',
    title: '5 Sessions',
    description: 'Complete 5 focus sessions',
    icon: '⭐',
    unlocked: true,
    unlockedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 20),
  },
  {
    id: '4',
    title: '1 Week Streak',
    description: 'Maintain a 7-day focus streak',
    icon: '💪',
    unlocked: true,
    unlockedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 14),
  },
  {
    id: '5',
    title: 'Focus Master',
    description: 'Complete 25 focus sessions',
    icon: '🏆',
    unlocked: true,
    unlockedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7),
  },
  {
    id: '6',
    title: '50 Hours Club',
    description: 'Accumulate 50 hours of focus time',
    icon: '🎖️',
    unlocked: false,
    progress: 42,
    target: 50,
  },
  {
    id: '7',
    title: 'Month Warrior',
    description: 'Maintain a 30-day focus streak',
    icon: '👑',
    unlocked: false,
    progress: 12,
    target: 30,
  },
  {
    id: '8',
    title: 'Century Mark',
    description: 'Complete 100 focus sessions',
    icon: '💯',
    unlocked: false,
    progress: 67,
    target: 100,
  },
  {
    id: '9',
    title: 'Early Bird',
    description: 'Complete a session before 7 AM',
    icon: '🌅',
    unlocked: false,
  },
  {
    id: '10',
    title: 'Night Owl',
    description: 'Complete a session after 11 PM',
    icon: '🦉',
    unlocked: true,
    unlockedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5),
  },
  {
    id: '11',
    title: 'Weekend Warrior',
    description: 'Complete 5 sessions on a weekend',
    icon: '🎮',
    unlocked: false,
    progress: 3,
    target: 5,
  },
  {
    id: '12',
    title: 'Perfect Day',
    description: 'Complete 8 sessions in one day',
    icon: '✨',
    unlocked: false,
    progress: 4,
    target: 8,
  },
];

// Leaderboard data
export const leaderboardData = [
  {
    rank: 1,
    name: 'Alex Chen',
    avatar: '🧑‍💻',
    totalSessions: 342,
    streak: 45,
    points: 15680,
  },
  {
    rank: 2,
    name: 'Sarah Johnson',
    avatar: '👩‍🎓',
    totalSessions: 298,
    streak: 32,
    points: 13450,
  },
  {
    rank: 3,
    name: 'Mike Williams',
    avatar: '👨‍💼',
    totalSessions: 276,
    streak: 28,
    points: 12200,
  },
  {
    rank: 4,
    name: 'Emma Davis',
    avatar: '👩‍🔬',
    totalSessions: 245,
    streak: 21,
    points: 10890,
  },
  {
    rank: 5,
    name: 'You',
    avatar: '🎯',
    totalSessions: 67,
    streak: 12,
    points: 4520,
    isCurrentUser: true,
  },
  {
    rank: 6,
    name: 'James Wilson',
    avatar: '👨‍🎨',
    totalSessions: 198,
    streak: 15,
    points: 8760,
  },
  {
    rank: 7,
    name: 'Lisa Anderson',
    avatar: '👩‍💻',
    totalSessions: 187,
    streak: 12,
    points: 8230,
  },
  {
    rank: 8,
    name: 'Tom Harris',
    avatar: '👨‍🚀',
    totalSessions: 165,
    streak: 9,
    points: 7340,
  },
  {
    rank: 9,
    name: 'Anna Martinez',
    avatar: '👩‍🏫',
    totalSessions: 143,
    streak: 7,
    points: 6280,
  },
  {
    rank: 10,
    name: 'David Lee',
    avatar: '👨‍🔧',
    totalSessions: 128,
    streak: 5,
    points: 5670,
  },
];

// Weekly stats
export const weeklyStats = [
  { day: 'Mon', minutes: 120, sessions: 4 },
  { day: 'Tue', minutes: 150, sessions: 5 },
  { day: 'Wed', minutes: 75, sessions: 3 },
  { day: 'Thu', minutes: 150, sessions: 5 },
  { day: 'Fri', minutes: 1400, sessions: 56 },
  { day: 'Sat', minutes: 500, sessions: 20 },
  { day: 'Sun', minutes: 45, sessions: 2 },
];

// Monthly focus pattern (weekly breakdown inside a month)
export const monthlyPattern = [
  { week: 'Week 1', minutes: 1380 }, // 23 hours
  { week: 'Week 2', minutes: 1080 }, // 18 hours
  { week: 'Week 3', minutes: 1620 }, // 27 hours
  { week: 'Week 4', minutes: 1200 }, // 20 hours
];


// Monthly stats
export const monthlyStats = [
  { week: 'Week 1', hours: 23.3, sessions: 57 },
  { week: 'Week 2', hours: 12.3, sessions: 25 },
  { week: 'Week 3', hours: 10.2, sessions: 22 },
  { week: 'Week 4', hours: 15.8, sessions: 32 },
];

// Daily pattern
export const dailyPattern = [
  { hour: '6AM', minutes: 15 },
  { hour: '8AM', minutes: 45 },
  { hour: '10AM', minutes: 75 },
  { hour: '12PM', minutes: 30 },
  { hour: '2PM', minutes: 60 },
  { hour: '4PM', minutes: 90 },
  { hour: '6PM', minutes: 45 },
  { hour: '8PM', minutes: 60 },
  { hour: '10PM', minutes: 30 },
  { hour: '12AM', minutes: 30 },
];

// Dashboard stats
export const dashboardStats = {
  totalFocusTime: 42 * 60 * 60,
  totalSessions: 67,
  currentStreak: 12,
  longestStreak: 21,
  weeklyProgress: 72,
  todaySessions: 3,
  todayMinutes: 75,
};


// Testimonials
export const testimonials = [
  {
    id: '1',
    name: 'Jessica Park',
    role: 'Computer Science Student',
    avatar: '👩‍🎓',
    content:
      'FocusTube transformed my study sessions. I went from getting distracted every 5 minutes to completing full 25-minute focus blocks!',
    rating: 5,
  },
  {
    id: '2',
    name: 'Marcus Johnson',
    role: 'Software Developer',
    avatar: '👨‍💻',
    content:
      'The distraction blocking features are game-changing. I can finally watch educational content without falling down the YouTube rabbit hole.',
    rating: 5,
  },
  {
    id: '3',
    name: 'Emily Chen',
    role: 'Medical Student',
    avatar: '👩‍⚕️',
    content:
      'Love the streak system! It keeps me motivated to study every day. My retention has improved significantly since using FocusTube.',
    rating: 5,
  },
];
