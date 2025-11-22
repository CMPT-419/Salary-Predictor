import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Cell } from 'recharts';
import { TrendingUp, Zap } from 'lucide-react';

const ResultsSection = ({ prediction }) => {
  if (!prediction) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center p-8 bg-white/40 backdrop-blur-lg border border-white/20 shadow-lg rounded-2xl">
          <Zap className="mx-auto h-12 w-12 text-slate-400" />
          <h3 className="mt-4 text-lg font-medium text-slate-700">Awaiting Calculation</h3>
          <p className="mt-1 text-sm text-slate-500">Your results will appear here.</p>
        </div>
      </div>
    );
  }

  const { salary_prob, growth_curve_data, influence_scores } = prediction;
  const isAbove50k = salary_prob > 0.5;
  const confidence = isAbove50k ? salary_prob : 1 - salary_prob;

  return (
    <div className="space-y-8 h-full overflow-y-auto p-1">
      {/* Salary Prediction Card */}
      <div className="bg-white/40 backdrop-blur-lg border border-white/20 shadow-lg rounded-2xl p-6 text-center">
        <h3 className="text-lg font-semibold text-slate-600">Predicted Salary Category</h3>
        <p className={`text-5xl font-bold my-2 ${isAbove50k ? 'text-emerald-600' : 'text-slate-700'}`}>
          {isAbove50k ? '> $50K' : '<= $50K'}
        </p>
        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${isAbove50k ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-800'}`}>
          {Math.round(confidence * 100)}% Confidence
        </span>
      </div>

      {/* Growth Curve Card */}
      <div className="bg-white/40 backdrop-blur-lg border border-white/20 shadow-lg rounded-2xl p-6 h-[300px]">
        <h3 className="text-lg font-semibold text-slate-600 mb-4 flex items-center"><TrendingUp className="mr-2 h-5 w-5 text-emerald-500"/>Projected Income Growth</h3>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={growth_curve_data} margin={{ top: 10, right: 30, left: 0, bottom: 30 }}>
            <defs>
              <linearGradient id="colorGrowth" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis dataKey="years" label={{ value: 'Years of Experience', position: 'insideBottom', offset: -15 }} />
            <YAxis tickFormatter={(value) => `$${value/1000}k`} />
            <Tooltip formatter={(value) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value)} />
            <Area type="monotone" dataKey="salary" stroke="#059669" fillOpacity={1} fill="url(#colorGrowth)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Fairness Check Card */}
      <div className="bg-white/40 backdrop-blur-lg border border-white/20 shadow-lg rounded-2xl p-6">
        <h3 className="text-lg font-semibold text-slate-600 mb-4">Top Influencing Factors</h3>
        <ul className="space-y-2">
          {influence_scores.map((item, index) => (
            <li key={index} className="flex items-center justify-between text-sm">
              <span className="font-medium text-slate-700">{item.feature}</span>
              <div className="flex items-center">
                <span className={`font-semibold ${item.impact > 0 ? 'text-emerald-600' : 'text-red-500'}`}>
                  {item.impact > 0 ? '+' : ''}{item.impact.toFixed(2)}
                </span>
                <div className="w-20 h-2 bg-slate-200 rounded-full ml-3 overflow-hidden">
                   <div 
                     className={`h-full rounded-full ${item.impact > 0 ? 'bg-emerald-500' : 'bg-red-500'}`}
                     style={{ width: `${Math.abs(item.impact) * 100}%` }}
                   ></div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ResultsSection;
