import React from 'react';
import { ComposedChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { TrendingUp } from 'lucide-react';

const generateProjection = (low, med, high) => {
  const data = [];
  let currentLow = low;
  let currentMed = med;
  let currentHigh = high;
  const growthRate = 1.04; // 4% annual growth

  for (let i = 1; i <= 10; i++) {
    data.push({
      year: i,
      low: Math.round(currentLow),
      med: Math.round(currentMed),
      high: Math.round(currentHigh),
    });
    currentLow *= growthRate;
    currentMed *= growthRate;
    currentHigh *= growthRate;
  }
  return data;
};

const formatCurrency = (value) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(value);

const SalaryGraph = ({ low, med, high }) => {
  const projectionData = generateProjection(low, med, high);

  return (
    <div className="bg-white/80 backdrop-blur-md border border-white/20 shadow-xl rounded-2xl p-6 h-[350px]">
      <h3 className="text-lg font-semibold text-slate-600 mb-4 flex items-center">
        <TrendingUp className="mr-2 h-5 w-5 text-emerald-500" />
        10-Year Salary Projection
      </h3>
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart data={projectionData} margin={{ top: 10, right: 30, left: 0, bottom: 30 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(226, 232, 240, 0.5)" />
          <XAxis dataKey="year" label={{ value: 'Years', position: 'insideBottom', offset: -15 }} />
          <YAxis tickFormatter={(value) => `$${Math.round(value / 1000)}k`} />
          <Tooltip formatter={(value) => formatCurrency(value)} />
          <Legend verticalAlign="top" height={36} />
          <Line type="monotone" dataKey="med" name="Median" stroke="#3b82f6" strokeWidth={3} dot={false} />
          <Line type="monotone" dataKey="low" name="Lower Bound" stroke="#fb923c" strokeWidth={2} strokeDasharray="5 5" dot={false} />
          <Line type="monotone" dataKey="high" name="Upper Bound" stroke="#fb923c" strokeWidth={2} strokeDasharray="5 5" dot={false} />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
};

export default SalaryGraph;
