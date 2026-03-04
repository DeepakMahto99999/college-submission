import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Lock, Eye, Database, Mail, FileText } from 'lucide-react';

const PrivacyPolicy = () => {
  const lastUpdated = 'December 1, 2024';

  const sections = [
    {
      icon: Database,
      title: 'Information We Collect',
      content: [
        'Account information (email, username) when you create an account',
        'Focus session data (duration, completion status, timestamps)',
        'Usage analytics to improve our service',
        'Device information for compatibility purposes',
      ],
    },
    {
      icon: Eye,
      title: 'How We Use Your Information',
      content: [
        'Provide and maintain the FocusTube service',
        'Track your focus statistics and achievements',
        'Display leaderboard rankings',
        'Send important service updates (with your consent)',
        'Improve and optimize our application',
      ],
    },
    {
      icon: Lock,
      title: 'Data Security',
      content: [
        'All data is encrypted in transit using SSL/TLS',
        'Passwords are hashed using industry-standard algorithms',
        'Regular security audits and updates',
        'Limited employee access to user data',
      ],
    },
    {
      icon: Shield,
      title: 'Your Rights',
      content: [
        'Access your personal data at any time',
        'Request deletion of your account and data',
        'Export your focus history',
        'Opt out of marketing communications',
        'Update or correct your information',
      ],
    },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center max-w-2xl mx-auto mb-12"
      >
        <div className="flex justify-center mb-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <FileText className="h-7 w-7" />
          </div>
        </div>

        <h1 className="font-display text-4xl font-bold mb-4">Privacy Policy</h1>

        <p className="text-muted-foreground">
          Your privacy is important to us. This policy explains how we collect,
          use, and protect your information.
        </p>

        <p className="text-sm text-muted-foreground mt-4">
          Last updated: {lastUpdated}
        </p>
      </motion.div>

      <div className="max-w-3xl mx-auto space-y-8">
        {/* Intro Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass-card rounded-xl p-6"
        >
          <p className="text-muted-foreground leading-relaxed">
            FocusTube ("we", "our", or "us") is committed to protecting your
            privacy. This Privacy Policy explains how we collect, use, disclose,
            and safeguard your information when you use our web application and
            Chrome extension.
          </p>
        </motion.div>

        {/* Main Sections */}
        {sections.map((section, index) => (
          <motion.div
            key={section.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 + index * 0.1 }}
            className="glass-card rounded-xl p-6"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <section.icon className="h-5 w-5" />
              </div>
              <h2 className="font-display text-xl font-bold">{section.title}</h2>
            </div>

            <ul className="space-y-2">
              {section.content.map((item, i) => (
                <li key={i} className="flex items-start gap-2 text-muted-foreground">
                  <span className="text-primary mt-1">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </motion.div>
        ))}

        {/* Third-Party Services */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="glass-card rounded-xl p-6"
        >
          <h2 className="font-display text-xl font-bold mb-4">Third-Party Services</h2>

          <p className="text-muted-foreground leading-relaxed mb-4">
            We may use third-party services that collect information used to
            identify you. These services have their own privacy policies:
          </p>

          <ul className="space-y-2 text-muted-foreground">
            <li className="flex items-start gap-2">
              <span className="text-primary mt-1">•</span>
              <span>Google Analytics (usage analytics)</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary mt-1">•</span>
              <span>YouTube API (video information)</span>
            </li>
          </ul>
        </motion.div>

        {/* Children's Privacy */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="glass-card rounded-xl p-6"
        >
          <h2 className="font-display text-xl font-bold mb-4">Children's Privacy</h2>

          <p className="text-muted-foreground leading-relaxed">
            FocusTube is not intended for users under 13 years of age. We do not
            knowingly collect personal information from children under 13. If you
            are a parent or guardian and believe your child has provided us with
            personal information, please contact us.
          </p>
        </motion.div>

        {/* Contact Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          className="glass-card rounded-xl p-6 border-2 border-primary/20"
        >
          <div className="flex items-center gap-3 mb-4">
            <Mail className="h-5 w-5 text-primary" />
            <h2 className="font-display text-xl font-bold">Questions?</h2>
          </div>

          <p className="text-muted-foreground mb-4">
            If you have any questions about this Privacy Policy, please contact us:
          </p>

          <a
            href="mailto:privacy@focustube.app"
            className="text-primary font-medium hover:underline"
          >
            privacy@focustube.app
          </a>
        </motion.div>

        {/* Changes Notice */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
          className="text-center py-8"
        >
          <p className="text-sm text-muted-foreground">
            We may update this Privacy Policy from time to time. We will notify you
            of any changes by posting the new Privacy Policy on this page and
            updating the "Last updated" date.
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
