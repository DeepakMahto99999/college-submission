import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

/**
 * FeatureCard - Clickable feature/shortcut card with hover effects
 */
const FeatureCard = ({
  title,
  description,
  icon: Icon,
  href,
  onClick,
  className,
  delay = 0,
}) => {
  const isLink = !!href;

  const Wrapper = isLink ? Link : "button";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5 }}
      whileHover={{ y: -4 }}
      className={cn("block", className)}
    >
      <Wrapper
        {...(isLink
          ? { to: href }   // 🔥 SPA navigation (NO reload)
          : { onClick })}
        className="block w-full h-full glass-card rounded-xl p-6 text-left transition-all duration-300 hover:shadow-xl hover:border-primary/30 group"
      >
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary mb-4 transition-transform duration-300 group-hover:scale-110">
          <Icon className="h-6 w-6" />
        </div>

        <h3 className="font-display text-lg font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
          {title}
        </h3>

        <p className="text-sm text-muted-foreground leading-relaxed">
          {description}
        </p>
      </Wrapper>
    </motion.div>
  );
};

export default FeatureCard;