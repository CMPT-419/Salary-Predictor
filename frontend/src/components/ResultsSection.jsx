import React from 'react';
import { motion } from 'framer-motion';
import { Zap } from 'lucide-react';
import SalaryGraph from './SalaryGraph'; // Import the new graph component
import FairnessAudit from './FairnessAudit'; // Import the new fairness component

const cardVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
};

const formatCurrency = (value) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(value);

const ResultsSection = ({ prediction, fairnessData, originalProfile }) => {
  if (!prediction) {
    return (
      <div className="flex items-center justify-center h-full">
        <motion.div 
          className="text-center p-8 bg-white/80 backdrop-blur-md border-white/20 shadow-xl rounded-2xl"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <Zap className="mx-auto h-12 w-12 text-slate-400" />
          <h3 className="mt-4 text-lg font-medium text-slate-700">Awaiting Calculation</h3>
          <p className="mt-1 text-sm text-slate-500">Your results will appear here.</p>
        </motion.div>
      </div>
    );
  }

  const { lower_bound, median, upper_bound } = prediction;

  return (
    <motion.div 
      className="space-y-8 h-full overflow-y-auto p-1"
      initial="hidden"
      animate="visible"
      variants={{ visible: { transition: { staggerChildren: 0.15 } } }}
    >
      {/* Salary Prediction Card */}
      <motion.div 
        className="bg-white/80 backdrop-blur-md border border-white/20 shadow-xl rounded-2xl p-6 text-center"
        variants={cardVariants}
      >
        <h3 className="text-lg font-semibold text-slate-600">Estimated Annual Salary</h3>
        <p className="text-5xl font-bold my-2 text-emerald-600">
          {formatCurrency(median)}
        </p>
        <p className="text-md text-slate-500">
          Estimated Range: {formatCurrency(lower_bound)} - {formatCurrency(upper_bound)}
        </p>
      </motion.div>

      {/* Salary Graph */}
      <motion.div variants={cardVariants}>
        <SalaryGraph low={lower_bound} med={median} high={upper_bound} />
      </motion.div>

      {/* Fairness Audit */}
      {fairnessData && (
          <motion.div variants={cardVariants}>
            <FairnessAudit fairnessData={fairnessData} originalProfile={originalProfile} />
          </motion.div>
      )}
    </motion.div>
  );
};

export default ResultsSection;