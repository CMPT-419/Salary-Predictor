import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

const AboutModal = ({ isOpen, onClose }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 50 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 50 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="bg-white/80 backdrop-blur-md border border-white/20 shadow-2xl rounded-2xl max-w-2xl w-full p-8 relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button onClick={onClose} className="absolute top-4 right-4 text-slate-500 hover:text-slate-800 transition-colors">
              <X size={24} />
            </button>
            <h2 className="text-2xl font-bold text-slate-800 mb-4">About FairML Predictor</h2>
            <div className="text-slate-600 space-y-4">
              <p>
                This project, developed by Sandeep Dhillon, Annu Semwal, and Tanvir Samra, reflects FairML principles by prioritizing fairness in both data selection and model interpretation.
              </p>
              <p>
                We aim to identify and mitigate biases (e.g., race, gender) while supporting users in making informed, autonomous career decisions. The model utilizes the UCI Adult Dataset augmented with real-world median salary data.
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AboutModal;
