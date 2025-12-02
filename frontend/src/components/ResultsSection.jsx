import React from 'react';
import { motion } from 'framer-motion';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, Line } from 'recharts';
import { TrendingUp, Zap, DollarSign } from 'lucide-react';

const cardVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
};

// Helper function to generate salary growth data
const generateGrowthData = (low, med, high) => {
  const data = [];
  let currentLow = low;
  let currentMed = med;
  let currentHigh = high;

  for (let i = 1; i <= 10; i++) {
    data.push({
      year: i,
      low: Math.round(currentLow),
      med: Math.round(currentMed),
      high: Math.round(currentHigh),
      range: [Math.round(currentLow), Math.round(currentHigh)]
    });

    // Apply a random annual raise between 3% and 5%
    const raiseLow = 1 + (Math.random() * (0.05 - 0.03) + 0.03);
    const raiseMed = 1 + (Math.random() * (0.05 - 0.03) + 0.03);
    const raiseHigh = 1 + (Math.random() * (0.05 - 0.03) + 0.03);

    currentLow *= raiseLow;
    currentMed *= raiseMed;
    currentHigh *= raiseHigh;
  }
  return data;
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

  const { lower_bound, median, upper_bound } = prediction;
  const growthData = generateGrowthData(lower_bound, median, upper_bound);

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
          {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(median)}
        </p>
        <p className="text-md text-slate-500">
          Estimated Range: {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(lower_bound)} - {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(upper_bound)}
        </p>
      </motion.div>

      {/* Growth Curve Card */}
      <motion.div 
        className="bg-white/80 backdrop-blur-md border border-white/20 shadow-xl rounded-2xl p-6 h-[350px]"
        variants={cardVariants}
      >
        <h3 className="text-lg font-semibold text-slate-600 mb-4 flex items-center"><TrendingUp className="mr-2 h-5 w-5 text-emerald-500"/>10-Year Salary Projection</h3>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={growthData} margin={{ top: 10, right: 30, left: 0, bottom: 30 }}>
            <defs>
              <linearGradient id="colorRange" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.4}/>
                <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(226, 232, 240, 0.5)" />
            <XAxis dataKey="year" label={{ value: 'Years', position: 'insideBottom', offset: -15 }} />
            <YAxis tickFormatter={(value) => `$${Math.round(value/1000)}k`} />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'rgba(255, 255, 255, 0.8)', 
                backdropFilter: 'blur(5px)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '1rem'
              }}
              formatter={(value, name) => {
                if (name === 'range') {
                  return [
                    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(value[0]),
                    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(value[1])
                  ].join(' - ');
                }
                return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(value);
              }}
            />
            <Legend verticalAlign="top" height={36}/>
            <Area type="monotone" dataKey="range" stroke={false} fill="url(#colorRange)" name="Confidence Range" />
            <Line type="monotone" dataKey="med" stroke="#059669" strokeWidth={3} dot={false} name="Median" />
          </AreaChart>
        </ResponsiveContainer>
      </motion.div>
    </motion.div>
  );
};

export default ResultsSection;