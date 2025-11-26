import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronDown, Loader2, TrendingUp, Zap, ShieldCheck } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Label } from 'recharts';
import {
  educationLevels,
  workClasses,
  majors,
  maritalStatuses,
  relationships,
  races,
  countries
} from '../data/options';

// --- Reusable & Chart-Specific Components ---

const CustomSelect = ({ id, value, onChange, options, placeholder }) => (
  <div className="relative">
    <select
      id={id}
      name={id}
      value={value}
      onChange={onChange}
      className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 appearance-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:outline-none transition"
    >
      <option value="" disabled>{placeholder}</option>
      {options.map(option => <option key={option.value} value={option.value}>{option.label}</option>)}
    </select>
    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
  </div>
);

const FormLabel = ({ children }) => (
  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
    {children}
  </label>
);

const CustomTooltip = ({ active, payload, label, data }) => {
  if (active && payload && payload.length) {
    const startSalary = data[0]?.salary;
    const currentSalary = payload[0].value;
    const growth = startSalary ? ((currentSalary - startSalary) / startSalary) * 100 : 0;

    return (
      <div className="p-3 bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-slate-100">
        <p className="text-sm font-bold text-slate-700">{`Year ${label}`}</p>
        <p className="text-base text-slate-600">{`Salary: ${new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(currentSalary)}`}</p>
        <p className={`text-sm font-medium ${growth >= 0 ? 'text-emerald-500' : 'text-red-500'}`}>
          {`Growth: ${growth >= 0 ? '+' : ''}${growth.toFixed(1)}% from start`}
        </p>
      </div>
    );
  }
  return null;
};

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } }
};

// --- Main Home Page ---

const Home = () => {
  const [formData, setFormData] = useState({
    age: 30,
    education: 'Bachelors',
    major: 'Computer Science',
    workclass: 'Private',
    maritalStatus: 'Never-married',
    relationship: 'Not-in-family',
    race: 'White',
    nativeCountry: 'United-States',
    gender: 'Male',
  });
  const [prediction, setPrediction] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  /*
  const handleCalculate = () => {
    setIsLoading(true);
    setPrediction(null);

    setTimeout(() => {
      const isHighIncome = Math.random() > 0.3;
      const growthData = Array.from({ length: 11 }, (_, i) => ({
          years: i * 2,
          salary: 50000 + (i * 2 * 3500) + (Math.random() * 15000 * (i/2)),
      }));
      setPrediction({
        salary_prob: isHighIncome ? (0.75 + Math.random() * 0.2) : (0.2 + Math.random() * 0.2),
        growth_curve_data: growthData,
      });
      setIsLoading(false);
    }, 1500);
  };
  */

  const handleCalculate = async () => {
    setIsLoading(true);
    setPrediction(null);

    try{
      const response = await fetch("http://localhost:8000/predict",{
        method: "POST",
        headers: {"Content-Type" : "application/json"},
        body: JSON.stringify(formData),
      });
      const data = await response.json()
      setPrediction(data);
    } catch(error){
      console.error("API Error: ", error)
    }
    setIsLoading(false);
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-slate-50 min-h-[calc(100vh-4rem)]"
    >
      <main className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        
        {/* Input Form Section */}
        <motion.div 
          className="h-full bg-white border border-slate-100 shadow-sm rounded-2xl flex flex-col"
          variants={cardVariants}
          initial="hidden"
          animate="visible"
        >
          <div className="p-6">
            <h2 className="text-xl font-bold text-slate-800">Your Profile</h2>
            <p className="text-sm text-slate-500 mt-1">Enter your details to predict your income.</p>
          </div>
          <div className="p-6 space-y-5 flex-grow">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
              <div>
                <FormLabel>Age</FormLabel>
                <input type="number" name="age" value={formData.age} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:outline-none transition" />
              </div>
              <div>
                <FormLabel>Education Level</FormLabel>
                <CustomSelect name="education" value={formData.education} onChange={handleChange} options={educationLevels} placeholder="Select Education"/>
              </div>
              <div className="md:col-span-2">
                <FormLabel>Major</FormLabel>
                <CustomSelect name="major" value={formData.major} onChange={handleChange} options={majors} placeholder="Select Major"/>
              </div>
              <div>
                <FormLabel>Work Class</FormLabel>
                <CustomSelect name="workclass" value={formData.workclass} onChange={handleChange} options={workClasses} placeholder="Select Work Class"/>
              </div>
              <div>
                <FormLabel>Marital Status</FormLabel>
                <CustomSelect name="maritalStatus" value={formData.maritalStatus} onChange={handleChange} options={maritalStatuses} placeholder="Select Status"/>
              </div>
              <div>
                <FormLabel>Relationship</FormLabel>
                <CustomSelect name="relationship" value={formData.relationship} onChange={handleChange} options={relationships} placeholder="Select Relationship"/>
              </div>
               <div>
                <FormLabel>Race</FormLabel>
                <CustomSelect name="race" value={formData.race} onChange={handleChange} options={races} placeholder="Select Race"/>
              </div>
               <div className="md:col-span-2">
                <FormLabel>Country</FormLabel>
                <CustomSelect name="nativeCountry" value={formData.nativeCountry} onChange={handleChange} options={countries} placeholder="Select Country"/>
              </div>
            </div>
          </div>
          <div className="p-6 border-t border-slate-100">
            <button
              onClick={handleCalculate}
              disabled={isLoading}
              className="w-full bg-indigo-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-indigo-700 transition-all duration-300 disabled:bg-slate-400 disabled:cursor-not-allowed flex items-center justify-center shadow-md hover:shadow-lg hover:-translate-y-0.5"
            >
              {isLoading ? <Loader2 className="animate-spin mr-2" /> : 'Predict'}
            </button>
          </div>
        </motion.div>

        {/* Results Section */}
        <div className="h-full">
          {isLoading ? (
            <div className="flex items-center justify-center h-full min-h-[400px]">
                <Loader2 className="w-12 h-12 text-indigo-600 animate-spin" />
            </div>
          ) : !prediction ? (
            <motion.div 
              className="flex flex-col items-center justify-center text-center p-8 bg-white h-full rounded-2xl shadow-sm border border-slate-100 min-h-[400px]"
              variants={cardVariants}
              initial="hidden"
              animate="visible"
            >
              <Zap className="mx-auto h-12 w-12 text-slate-400" />
              <h3 className="mt-4 text-lg font-medium text-slate-700">Awaiting Calculation</h3>
              <p className="mt-1 text-sm text-slate-500">Your results will appear here.</p>
            </motion.div>
          ) : (
            <motion.div 
              className="space-y-6"
              initial="hidden"
              animate="visible"
              variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
            >
              <motion.div 
                className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 text-center"
                variants={cardVariants}
              >
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Predicted Salary</h3>
                <p className={`text-5xl font-bold my-2 ${prediction.salary_prob > 0.5 ? 'text-emerald-500' : 'text-slate-800'}`}>
                  {prediction.salary_prob > 0.5 ? '> $50K' : '<= $50K'}
                </p>
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${prediction.salary_prob > 0.5 ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-800'}`}>
                  {`${Math.round(prediction.salary_prob * 100)}% Confidence`}
                </span>
              </motion.div>

              <motion.div 
                className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 h-[350px]"
                variants={cardVariants}
              >
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center">
                  <TrendingUp className="mr-2 h-4 w-4 text-slate-400"/>
                  Projected Income Growth
                </h3>
                <ResponsiveContainer width="100%" height="90%">
                  <AreaChart data={prediction.growth_curve_data} margin={{ top: 5, right: 20, left: 10, bottom: 20 }}>
                    <defs>
                      <linearGradient id="colorGrowth" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.4}/>
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis dataKey="years" tick={{fontSize: 12}} interval={1}>
                       <Label value="Years of Experience" offset={-15} position="insideBottom" />
                    </XAxis>
                    <YAxis tickFormatter={(value) => `$${Math.round(value/1000)}k`} tick={{fontSize: 12}} />
                    <Tooltip content={<CustomTooltip data={prediction.growth_curve_data} />} />
                    <Area type="monotone" dataKey="salary" stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#colorGrowth)" />
                  </AreaChart>
                </ResponsiveContainer>
              </motion.div>
              
              <motion.div
                variants={cardVariants}
                className="p-4 rounded-2xl bg-slate-100 border border-slate-200/80"
              >
                <p className="text-xs text-slate-500 leading-relaxed">
                  <span className="font-bold text-slate-600">Data Transparency:</span> This projection is based on the UCI Adult Dataset augmented with real-world median salary data. The model applies FairML principles to mitigate bias from attributes like race or gender, ensuring the growth curve reflects merit-based potential rather than historical discrimination.
                </p>
              </motion.div>

            </motion.div>
          )}
        </div>

      </main>
    </motion.div>
  );
};

export default Home;
