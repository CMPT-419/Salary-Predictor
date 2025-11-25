import React from 'react';
import { motion } from 'framer-motion';

const About = () => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col items-center justify-center min-h-[calc(100vh-10rem)] bg-slate-50"
    >
      <div className="w-full max-w-2xl mx-auto p-8 bg-white rounded-2xl shadow-sm border border-slate-100">
        <h1 className="text-3xl font-bold text-center text-slate-800 mb-6">
          About the Project
        </h1>
        <div className="space-y-6 text-slate-600">
          <div className="p-4 rounded-lg">
            <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Team</h2>
            <p>Sandeep Dhillon, Annu Semwal, Tanvir Samra</p>
          </div>
          <div className="p-4 rounded-lg">
            <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Mission</h2>
            <p>Prioritizing fairness in AI to help users make autonomous career decisions.</p>
          </div>
          <div className="p-4 rounded-lg">
            <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Method</h2>
            <p>
              Uses the UCI <a 
                href="https://archive.ics.uci.edu/dataset/2/adult" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-indigo-600 hover:text-indigo-700 underline underline-offset-2"
              >Adult</a> Dataset + Median Salary Augmentation.
            </p>
          </div>
          <div className="p-4 rounded-lg">
            <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Goal</h2>
            <p>To identify and mitigate biases (race, gender, education) in financial modeling.</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default About;
