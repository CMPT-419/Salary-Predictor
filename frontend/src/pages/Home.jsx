import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronDown, Loader2 } from 'lucide-react';
import ResultsSection from '../components/ResultsSection';
import {
  educationLevels,
  workClasses,
  maritalStatuses,
  sexes,
  occupationCategories,
  races
} from '../data/options';

const CustomSelect = ({ name, value, onChange, options, placeholder }) => (
  <div className="relative">
    <select
      name={name}
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

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } }
};

const Home = () => {
  const [formData, setFormData] = useState({
    age: 30,
    education_level: 'Bachelors',
    work_class: 'Private',
    marital_status: 'Never-married',
    sex: 'Male',
    hours_per_week: 40,
    occupation_category: 'Tech & Engineering',
    race: 'White',
  });
  const [prediction, setPrediction] = useState(null);
  const [fairnessData, setFairnessData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleCalculate = async () => {
    setIsLoading(true);
    setPrediction(null);
    setFairnessData(null);

    try {
      const payload = { ...formData };

      // --- 1. Get Salary Prediction ---
      const salaryResponse = await fetch("http://127.0.0.1:8000/predict_salary_range", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      if (!salaryResponse.ok) throw new Error(`API error: ${salaryResponse.status}`);
      const salaryData = await salaryResponse.json();
      setPrediction(salaryData);

      // --- 2. Get Fairness Analysis ---
      const fairnessResponse = await fetch("http://127.0.0.1:8000/analyze_fairness", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
      });
      if (fairnessResponse.ok) {
          const fairnessResult = await fairnessResponse.json();
          setFairnessData(fairnessResult);
      }

    } catch (error) {
      console.error("Error during calculation:", error);
      alert("An error occurred. Please check the console for details.");
    } finally {
      setIsLoading(false);
    }
  };

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
        
        <motion.div 
          className="h-full bg-white border border-slate-100 shadow-sm rounded-2xl flex flex-col"
          variants={cardVariants}
          initial="hidden"
          animate="visible"
        >
          <div className="p-6">
            <h2 className="text-xl font-bold text-slate-800">Your Profile</h2>
          </div>
          <div className="p-6 space-y-5 flex-grow">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
              <div>
                <FormLabel>Age</FormLabel>
                <input type="number" name="age" value={formData.age} onChange={handleChange} className="w-full bg-slate-50 border-slate-200 rounded-lg p-3"/>
              </div>
              <div>
                <FormLabel>Hours Per Week</FormLabel>
                <input type="number" name="hours_per_week" value={formData.hours_per_week} onChange={handleChange} min="1" max="80" className="w-full bg-slate-50 border-slate-200 rounded-lg p-3"/>
              </div>
              <div className="md:col-span-2">
                <FormLabel>Education Level</FormLabel>
                <CustomSelect name="education_level" value={formData.education_level} onChange={handleChange} options={educationLevels} placeholder="Select Education"/>
              </div>
              <div className="md:col-span-2">
                <FormLabel>Occupation Sector</FormLabel>
                <CustomSelect name="occupation_category" value={formData.occupation_category} onChange={handleChange} options={occupationCategories} placeholder="Select Occupation"/>
              </div>
              <div>
                <FormLabel>Work Class</FormLabel>
                <CustomSelect name="work_class" value={formData.work_class} onChange={handleChange} options={workClasses} placeholder="Select Work Class"/>
              </div>
              <div>
                <FormLabel>Marital Status</FormLabel>
                <CustomSelect name="marital_status" value={formData.marital_status} onChange={handleChange} options={maritalStatuses} placeholder="Select Status"/>
              </div>
              <div>
                <FormLabel>Sex</FormLabel>
                <CustomSelect name="sex" value={formData.sex} onChange={handleChange} options={sexes} placeholder="Select Sex"/>
              </div>
              <div>
                <FormLabel>Race</FormLabel>
                <CustomSelect name="race" value={formData.race} onChange={handleChange} options={races} placeholder="Select Race"/>
              </div>
            </div>
          </div>
          <div className="p-6 border-t border-slate-100">
            <button
              onClick={handleCalculate}
              disabled={isLoading}
              className="w-full bg-indigo-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-indigo-700 disabled:bg-slate-400"
            >
              {isLoading ? <Loader2 className="animate-spin mr-2" /> : 'Predict Salary Range'}
            </button>
          </div>
        </motion.div>

        <div className="h-full">
          {isLoading ? (
            <div className="flex items-center justify-center h-full min-h-[400px]">
                <Loader2 className="w-12 h-12 text-indigo-600 animate-spin" />
            </div>
          ) : (
            <ResultsSection prediction={prediction} fairnessData={fairnessData} originalProfile={formData} />
          )}
        </div>

      </main>
    </motion.div>
  );
};

export default Home;
