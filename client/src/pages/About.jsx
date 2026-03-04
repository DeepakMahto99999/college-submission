import React from 'react';
import { motion } from 'framer-motion';
import { Play, Target, Zap, Shield, Users, Heart } from 'lucide-react';

const About = () => {
  const features = [
    {
      icon: Target,
      title: 'Pomodoro Timer',
      description: 'Stay focused with the proven Pomodoro Technique. Work in 25-minute sprints with short breaks in between.',
    },
    {
      icon: Shield,
      title: 'Distraction Blocking',
      description: 'Block YouTube distractions like Shorts, comments, and recommendations to keep you focused on learning.',
    },
    {
      icon: Zap,
      title: 'Streak Tracking',
      description: 'Build consistency with daily streaks. Watch your focus habits grow stronger over time.',
    },
    {
      icon: Users,
      title: 'Leaderboard',
      description: 'Compete with other focused learners. Climb the ranks and stay motivated.',
    },
  ];

  const team = [
    { name: 'Deepak Mahto', role: 'Co-Founder & Developer', avatar: '👨‍💻' },
    { name: 'Sujal Gaikwad', role: 'UX Designer', avatar: '👩‍🎨' },
    { name: 'Sujal Gaikwad', role: 'Co-Founder & Product Lead', avatar: '👨‍💼' },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center max-w-3xl mx-auto mb-16"
      >
        <div className="flex justify-center mb-6">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary">
            <Play className="h-8 w-8 fill-primary-foreground text-primary-foreground" />
          </div>
        </div>
        <h1 className="font-display text-4xl md:text-5xl font-bold mb-4">
          About <span className="gradient-text">FocusTube</span>
        </h1>
        <p className="text-lg text-muted-foreground leading-relaxed">
          FocusTube is your productivity companion for focused YouTube learning.
          We help students and professionals eliminate distractions and build
          consistent study habits.
        </p>
      </motion.div>

      {/* Mission Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="glass-card rounded-2xl p-8 md:p-12 mb-16"
      >
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div>
            <h2 className="font-display text-3xl font-bold mb-4">Our Mission</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              YouTube has become one of the world's largest educational platforms,
              but it's also designed to keep you scrolling. We believe learning
              should be intentional, not accidental.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              FocusTube transforms YouTube from a distraction machine into a
              powerful learning tool. With our Pomodoro timer and distraction
              blocking features, you can finally focus on what matters.
            </p>
          </div>
          <div className="flex justify-center">
            <div className="relative">
              <div className="absolute inset-0 bg-primary/20 rounded-full blur-3xl" />
              <div className="relative text-8xl">🎯</div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Features Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mb-16"
      >
        <h2 className="font-display text-3xl font-bold text-center mb-8">
          Key Features
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + index * 0.1 }}
              className="glass-card rounded-xl p-6 text-center"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary mx-auto mb-4">
                <feature.icon className="h-6 w-6" />
              </div>
              <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
              <p className="text-sm text-muted-foreground">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Team Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="text-center mb-16"
      >
        <h2 className="font-display text-3xl font-bold mb-8">Meet the Team</h2>
        <div className="flex flex-wrap justify-center gap-8">
          {team.map((member, index) => (
            <motion.div
              key={member.name}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.7 + index * 0.1 }}
              className="text-center"
            >
              <div className="flex h-24 w-24 items-center justify-center rounded-full bg-muted text-5xl mx-auto mb-3">
                {member.avatar}
              </div>
              <p className="font-semibold">{member.name}</p>
              <p className="text-sm text-muted-foreground">{member.role}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Values Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="glass-card rounded-2xl p-8 text-center"
      >
        <Heart className="h-12 w-12 text-destructive mx-auto mb-4" />
        <h2 className="font-display text-2xl font-bold mb-4">Built with Love</h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          FocusTube is a college project born from the frustration of 
          getting distracted while trying to learn on YouTube. We built 
          this tool for ourselves first, and now we're sharing it with 
          learners everywhere.
        </p>
      </motion.div>
    </div>
  );
};

export default About;
