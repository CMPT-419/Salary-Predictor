import React from 'react';
import { motion } from 'framer-motion';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp, Zap } from 'lucide-react';

const cardVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
};

const ResultsSection = ({ prediction }) => {
  if (!prediction) {
    return (
      <div className="flex items-center justify-center h-full">
        <motion.div 
          className="text-center p-8 bg-white/80 backdrop-blur-md border border-white/20 shadow-xl rounded-2xl"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
        >
          <Zap className="mx-auto h-12 w-12 text-slate-400" />
          <h3 className="mt-4 text-lg font-medium text-slate-700">Awaiting Calculation</h3>
          <p className="mt-1 text-sm text-slate-500">Your results will appear here.</p>
        </motion.div>
      </div>
    );
  }

  const { salary_prob, growth_curve_data, influence_scores } = prediction;
  const isAbove50k = salary_prob > 0.5;
  const confidence = isAbove50k ? salary_prob : 1 - salary_prob;

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
        <h3 className="text-lg font-semibold text-slate-600">Predicted Salary Category</h3>
        <p className={`text-5xl font-bold my-2 ${isAbove50k ? 'text-emerald-600' : 'text-slate-700'}`}>
          {isAbove50k ? '> $50K' : '<= $50K'}
        </p>
        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${isAbove50k ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-800'}`}>
          {Math.round(confidence * 100)}% Confidence
        </span>
      </motion.div>

      {/* Growth Curve Card */}
      <motion.div 
        className="bg-white/80 backdrop-blur-md border border-white/20 shadow-xl rounded-2xl p-6 h-[300px]"
        variants={cardVariants}
      >
        <h3 className="text-lg font-semibold text-slate-600 mb-4 flex items-center"><TrendingUp className="mr-2 h-5 w-5 text-emerald-500"/>Projected Income Growth</h3>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={growth_curve_data} margin={{ top: 10, right: 30, left: 0, bottom: 30 }}>
            <defs>
              <linearGradient id="colorGrowth" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(226, 232, 240, 0.5)" />
            <XAxis dataKey="years" label={{ value: 'Years of Experience', position: 'insideBottom', offset: -15 }} />
            <YAxis tickFormatter={(value) => `$${Math.round(value/1000)}k`} />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'rgba(255, 255, 255, 0.8)', 
                backdropFilter: 'blur(5px)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '1rem'
              }}
              formatter={(value) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(value)} 
            />
            <Area type="monotone" dataKey="salary" stroke="#059669" strokeWidth={2} fillOpacity={1} fill="url(#colorGrowth)" />
          </AreaChart>
        </ResponsiveContainer>
      </motion.div>

      {/* Fairness Check Card */}
      <motion.div 
        className="bg-white/80 backdrop-blur-md border border-white/20 shadow-xl rounded-2xl p-6"
        variants={cardVariants}
      >
        <h3 className="text-lg font-semibold text-slate-600 mb-4">Top Influencing Factors</h3>
        <ul className="space-y-3">
          {influence_scores.map((item, index) => (
            <li key={index} className="flex items-center justify-between text-sm">
              <span className="font-medium text-slate-700">{item.feature}</span>
              <div className="flex items-center">
                <span className={`font-semibold w-12 text-right ${item.impact > 0 ? 'text-emerald-600' : 'text-red-500'}`}>
                  {item.impact > 0 ? '+' : ''}{item.impact.toFixed(2)}
                </span>
                <div className="w-24 h-2 bg-slate-200 rounded-full ml-3 overflow-hidden">
                   <motion.div 
                     className={`h-full rounded-full ${item.impact > 0 ? 'bg-emerald-500' : 'bg-red-500'}`}
                     initial={{ width: 0 }}
                     animate={{ width: `${Math.min(Math.abs(item.impact) * 200, 100)}%` }}
                     transition={{ duration: 0.8, ease: "easeOut" }}
                   />
                </div>
              </div>
            </li>
          ))}
        </ul>
      </motion.div>
    </motion.div>
  );
};

export default ResultsSection;
