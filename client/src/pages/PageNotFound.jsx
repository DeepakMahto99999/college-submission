import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

const PageNotFound = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex min-h-[60vh] items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center max-w-md"
        >
          {/* 404 animated text */}
          <motion.div
            initial={{ y: -20 }}
            animate={{ y: 0 }}
            transition={{
              type: 'spring',
              stiffness: 300,
              damping: 20,
              repeat: Infinity,
              repeatType: 'reverse',
              duration: 2
            }}
            className="text-8xl md:text-9xl font-display font-bold gradient-text mb-4"
          >
            404
          </motion.div>

          {/* Icon */}
          <div className="text-6xl mb-6">🔍</div>

          {/* Message */}
          <h1 className="font-display text-2xl font-bold mb-2">Page Not Found</h1>

          <p className="text-muted-foreground mb-8">
            Oops! The page you're looking for doesn't exist or has been moved.
            Let's get you back on track.
          </p>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/">
              <Button className="btn-gradient gap-2">
                <Home className="h-4 w-4" />
                Go to Dashboard
              </Button>
            </Link>

            <Button
              variant="outline"
              onClick={() => window.history.back()}
              className="gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Go Back
            </Button>
          </div>

          {/* Tip message */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-8 text-sm text-muted-foreground"
          >
            💡 Tip: Use the navigation menu to find what you're looking for.
          </motion.p>
        </motion.div>
      </div>
    </div>
  );
};

export default PageNotFound;
