import React from 'react';
import { motion } from 'framer-motion';
import { BarChart, ToggleLeft, ShieldCheck } from 'lucide-react';

const Dashboard = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="p-4 sm:p-6 lg:p-8 bg-slate-50 min-h-[calc(100vh-4rem)]"
    >
      <h1 className="text-3xl font-bold text-slate-800 mb-6">Career Insights</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        
        {/* Compare Majors Card */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-indigo-100 p-2 rounded-lg">
              <BarChart className="h-6 w-6 text-indigo-600" />
            </div>
            <h2 className="text-lg font-semibold text-slate-700">Compare Majors</h2>
          </div>
          <p className="text-slate-500 text-sm mb-4">
            Compare salary trajectories between different fields of study.
          </p>
          <button className="mt-auto text-sm font-semibold text-indigo-600 hover:text-indigo-700">
            Compare CS vs Engineering &rarr;
          </button>
        </div>

        {/* Inflation Adjustment Card */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-emerald-100 p-2 rounded-lg">
                <ToggleLeft className="h-6 w-6 text-emerald-600" />
            </div>
            <h2 className="text-lg font-semibold text-slate-700">Inflation Adjustment</h2>
          </div>
          <p className="text-slate-500 text-sm mb-4">
            Adjust your predicted salary for the upcoming year's inflation.
          </p>
          <div className="mt-auto flex items-center justify-between">
            <span className="text-sm font-medium text-slate-600">Adjust for 2025 Inflation</span>
            {/* Simple Toggle Switch UI */}
            <div className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" value="" className="sr-only peer" />
              <div className="w-11 h-6 bg-slate-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
            </div>
          </div>
        </div>
        
        {/* Bias Metrics Card */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col">
          <div className="flex items-center gap-3 mb-4">
             <div className="bg-indigo-100 p-2 rounded-lg">
                <ShieldCheck className="h-6 w-6 text-indigo-600" />
            </div>
            <h2 className="text-lg font-semibold text-slate-700">Bias Metrics</h2>
          </div>
          <p className="text-slate-500 text-sm mb-4">
            Ensuring fairness by evaluating our dataset against biases.
          </p>
          <div className="mt-auto text-3xl font-bold text-emerald-500 flex items-baseline gap-2">
            92<span className="text-lg font-medium text-slate-400">/100</span>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Fairness Score</span>
          </div>
        </div>

      </div>
    </motion.div>
  );
};

export default Dashboard;