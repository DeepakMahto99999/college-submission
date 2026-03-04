import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Ghost, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

const NotFound = () => {
  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center max-w-lg"
      >
        {/* Ghost Icon */}
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="flex items-center justify-center mb-6"
        >
          <Ghost className="h-24 w-24 text-primary opacity-80" />
        </motion.div>

        {/* Title */}
        <h1 className="font-display text-5xl font-bold mb-4">404</h1>

        <h2 className="font-display text-2xl font-semibold mb-3">
          Page Not Found
        </h2>

        <p className="text-muted-foreground mb-6">
          Looks like this page has disappeared into the void.  
          Don’t worry — let's get you back to safety.
        </p>

        {/* Back Home Button */}
        <Link to="/">
          <Button className="btn-gradient gap-2">
            <ArrowLeft className="h-5 w-5" />
            Go Back Home
          </Button>
        </Link>
      </motion.div>
    </div>
  );
};

export default NotFound;
