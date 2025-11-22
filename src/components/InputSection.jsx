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
      className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 appearance-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:outline-none transition"
    >
      {children}
    </select>
    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
  </div>
);

const FormLabel = ({ children }) => (
  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
    {children}
  </label>
);

const InputSection = ({ formData, handleChange, onCalculate, isLoading }) => {
  return (
    <div className="h-full bg-white border border-slate-100 shadow-sm rounded-2xl overflow-hidden flex flex-col">
      <div className="p-6 border-b border-slate-100">
        <h2 className="text-xl font-bold text-slate-800">Your Profile</h2>
      </div>
      <div className="p-6 space-y-6 overflow-y-auto flex-grow">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
          <div>
            <FormLabel>Age</FormLabel>
            <input type="number" name="age" value={formData.age} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:outline-none transition" />
          </div>
          <div>
            <FormLabel>Education</FormLabel>
            <CustomSelect name="education" value={formData.education} onChange={handleChange}>
              {educationLevels.map(e => <option key={e.value} value={e.value}>{e.label}</option>)}
            </CustomSelect>
          </div>
          <div className="md:col-span-2">
            <FormLabel>Major</FormLabel>
            <CustomSelect name="major" value={formData.major} onChange={handleChange}>
              {majors.map(m => <option key={m.value} value={m.value}>{m.label}</option>)}
            </CustomSelect>
          </div>
          <div>
            <FormLabel>Work Class</FormLabel>
            <CustomSelect name="workclass" value={formData.workclass} onChange={handleChange}>
              {workclasses.map(w => <option key={w.value} value={w.value}>{w.label}</option>)}
            </CustomSelect>
          </div>
          <div>
            <FormLabel>Marital Status</FormLabel>
            <CustomSelect name="maritalStatus" value={formData.maritalStatus} onChange={handleChange}>
              {maritalStatus.map(m => <option key={m.value} value={m.value}>{m.label}</option>)}
            </CustomSelect>
          </div>
          <div>
            <FormLabel>Relationship</FormLabel>
            <CustomSelect name="relationship" value={formData.relationship} onChange={handleChange}>
              {relationships.map(r => <option key={r.value} value={r.value}>{r.label}</option>)}
            </CustomSelect>
          </div>
          <div>
            <FormLabel>Race</FormLabel>
            <CustomSelect name="race" value={formData.race} onChange={handleChange}>
              {races.map(r => <option key={r.value} value={r.value}>{r.label}</option>)}
            </CustomSelect>
          </div>
          <div>
            <FormLabel>Sex</FormLabel>
            <CustomSelect name="sex" value={formData.sex} onChange={handleChange}>
              {sexes.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
            </CustomSelect>
          </div>
          <div>
            <FormLabel>Native Country</FormLabel>
            <CustomSelect name="nativeCountry" value={formData.nativeCountry} onChange={handleChange}>
              {nativeCountry.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
            </CustomSelect>
          </div>
        </div>
      </div>
      <div className="p-6 border-t border-slate-100">
        <button
          onClick={onCalculate}
          disabled={isLoading}
          className="w-full bg-indigo-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-indigo-700 transition-all duration-300 disabled:bg-slate-400 flex items-center justify-center shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/40 hover:-translate-y-0.5"
        >
          {isLoading ? <Loader2 className="animate-spin mr-2" /> : 'Calculate Prediction'}
        </button>
      </div>
    </div>
  );
};

export default InputSection;