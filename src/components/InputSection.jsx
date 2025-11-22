import React from 'react';
import { motion } from 'framer-motion';
import { ChevronDown, Loader2 } from 'lucide-react';
import { educationLevels, workclasses, majors, relationships, races, sexes, maritalStatus, nativeCountry } from '../data/options';

const CustomSelect = ({ id, value, onChange, children }) => (
  <div className="relative">
    <select
      id={id}
      name={id}
      value={value}
      onChange={onChange}
      className="w-full bg-slate-50/50 border border-slate-200 rounded-lg p-2.5 appearance-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 focus:outline-none transition"
    >
      {children}
    </select>
    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
  </div>
);

const InputSection = ({ formData, handleChange, onCalculate, isLoading }) => {
  return (
    <motion.div 
      className="h-full bg-white/80 backdrop-blur-md border border-white/20 shadow-xl rounded-2xl overflow-hidden flex flex-col"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <div className="p-6 border-b border-white/20">
        <h2 className="text-2xl font-bold text-slate-800">Your Profile</h2>
        <p className="text-slate-500">Enter your details to predict income.</p>
      </div>
      <div className="p-6 space-y-6 overflow-y-auto flex-grow">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="age" className="block text-sm font-medium text-slate-600 mb-1">Age</label>
            <input type="number" id="age" name="age" value={formData.age} onChange={handleChange} className="w-full bg-slate-50/50 border border-slate-200 rounded-lg p-2.5 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 focus:outline-none transition" />
          </div>
          <div>
            <label htmlFor="education" className="block text-sm font-medium text-slate-600 mb-1">Education</label>
            <CustomSelect id="education" value={formData.education} onChange={handleChange}>
              {educationLevels.map(e => <option key={e.value} value={e.value}>{e.label}</option>)}
            </CustomSelect>
          </div>
          <div>
            <label htmlFor="major" className="block text-sm font-medium text-slate-600 mb-1">Major</label>
            <CustomSelect id="major" value={formData.major} onChange={handleChange}>
              {majors.map(m => <option key={m} value={m}>{m}</option>)}
            </CustomSelect>
          </div>
          <div>
            <label htmlFor="workclass" className="block text-sm font-medium text-slate-600 mb-1">Work Class</label>
            <CustomSelect id="workclass" value={formData.workclass} onChange={handleChange}>
              {workclasses.map(w => <option key={w} value={w}>{w}</option>)}
            </CustomSelect>
          </div>
          <div>
            <label htmlFor="maritalStatus" className="block text-sm font-medium text-slate-600 mb-1">Marital Status</label>
            <CustomSelect id="maritalStatus" value={formData.maritalStatus} onChange={handleChange}>
              {maritalStatus.map(m => <option key={m} value={m}>{m}</option>)}
            </CustomSelect>
          </div>
          <div>
            <label htmlFor="relationship" className="block text-sm font-medium text-slate-600 mb-1">Relationship</label>
            <CustomSelect id="relationship" value={formData.relationship} onChange={handleChange}>
              {relationships.map(r => <option key={r} value={r}>{r}</option>)}
            </CustomSelect>
          </div>
          <div>
            <label htmlFor="race" className="block text-sm font-medium text-slate-600 mb-1">Race</label>
            <CustomSelect id="race" value={formData.race} onChange={handleChange}>
              {races.map(r => <option key={r} value={r}>{r}</option>)}
            </CustomSelect>
          </div>
          <div>
            <label htmlFor="sex" className="block text-sm font-medium text-slate-600 mb-1">Sex</label>
            <CustomSelect id="sex" value={formData.sex} onChange={handleChange}>
              {sexes.map(s => <option key={s} value={s}>{s}</option>)}
            </CustomSelect>
          </div>
          <div>
            <label htmlFor="hoursPerWeek" className="block text-sm font-medium text-slate-600 mb-1">Hours per Week</label>
            <input type="number" id="hoursPerWeek" name="hoursPerWeek" value={formData.hoursPerWeek} onChange={handleChange} className="w-full bg-slate-50/50 border border-slate-200 rounded-lg p-2.5 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 focus:outline-none transition" />
          </div>
          <div>
            <label htmlFor="nativeCountry" className="block text-sm font-medium text-slate-600 mb-1">Native Country</label>
            <CustomSelect id="nativeCountry" value={formData.nativeCountry} onChange={handleChange}>
              {nativeCountry.map(c => <option key={c} value={c}>{c}</option>)}
            </CustomSelect>
          </div>
        </div>
      </div>
      <div className="p-6 border-t border-white/20">
        <button
          onClick={onCalculate}
          disabled={isLoading}
          className="w-full bg-emerald-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-emerald-700 transition-all duration-300 disabled:bg-slate-400 flex items-center justify-center shadow-lg hover:shadow-emerald-300/50 hover:-translate-y-0.5"
        >
          {isLoading ? <Loader2 className="animate-spin mr-2" /> : 'Calculate Prediction'}
        </button>
      </div>
    </motion.div>
  );
};

export default InputSection;