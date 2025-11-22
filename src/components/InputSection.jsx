import React from 'react';
import { ChevronDown, Loader2 } from 'lucide-react';
import { educationLevels, workclasses, occupations, relationships, races, sexes, maritalStatus, nativeCountry } from '../data/options';

const CustomSelect = ({ id, value, onChange, children }) => (
  <div className="relative">
    <select
      id={id}
      name={id}
      value={value}
      onChange={onChange}
      className="w-full bg-slate-100 border-slate-200 rounded-md p-2 appearance-none focus:ring-2 focus:ring-emerald-500 focus:outline-none"
    >
      {children}
    </select>
    <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
  </div>
);

const InputSection = ({ formData, handleChange, onCalculate, isLoading }) => {
  return (
    <div className="h-full bg-white/40 backdrop-blur-lg border border-white/20 shadow-lg rounded-2xl overflow-hidden">
      <div className="p-6 border-b border-white/20 sticky top-0 bg-white/60 backdrop-blur-lg z-10">
        <h2 className="text-2xl font-bold text-slate-800">Your Profile</h2>
        <p className="text-slate-500">Enter your details to predict income.</p>
      </div>
      <div className="p-6 space-y-6 overflow-y-auto h-[calc(100%-150px)]">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="age" className="block text-sm font-medium text-slate-600 mb-1">Age</label>
            <input type="number" id="age" name="age" value={formData.age} onChange={handleChange} className="w-full bg-slate-100 border-slate-200 rounded-md p-2 focus:ring-2 focus:ring-emerald-500 focus:outline-none" />
          </div>
          <div>
            <label htmlFor="education" className="block text-sm font-medium text-slate-600 mb-1">Education</label>
            <CustomSelect id="education" value={formData.education} onChange={handleChange}>
              {educationLevels.map(e => <option key={e} value={e}>{e}</option>)}
            </CustomSelect>
          </div>
          <div>
            <label htmlFor="workclass" className="block text-sm font-medium text-slate-600 mb-1">Work Class</label>
            <CustomSelect id="workclass" value={formData.workclass} onChange={handleChange}>
              {workclasses.map(w => <option key={w} value={w}>{w}</option>)}
            </CustomSelect>
          </div>
          <div>
            <label htmlFor="occupation" className="block text-sm font-medium text-slate-600 mb-1">Occupation</label>
            <CustomSelect id="occupation" value={formData.occupation} onChange={handleChange}>
              {occupations.map(o => <option key={o} value={o}>{o}</option>)}
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
            <input type="number" id="hoursPerWeek" name="hoursPerWeek" value={formData.hoursPerWeek} onChange={handleChange} className="w-full bg-slate-100 border-slate-200 rounded-md p-2 focus:ring-2 focus:ring-emerald-500 focus:outline-none" />
          </div>
          <div>
            <label htmlFor="nativeCountry" className="block text-sm font-medium text-slate-600 mb-1">Native Country</label>
            <CustomSelect id="nativeCountry" value={formData.nativeCountry} onChange={handleChange}>
              {nativeCountry.map(c => <option key={c} value={c}>{c}</option>)}
            </CustomSelect>
          </div>
        </div>
      </div>
      <div className="p-6 border-t border-white/20 sticky bottom-0 bg-white/60 backdrop-blur-lg z-10">
        <button
          onClick={onCalculate}
          disabled={isLoading}
          className="w-full bg-emerald-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-emerald-700 transition-colors duration-300 disabled:bg-slate-400 flex items-center justify-center"
        >
          {isLoading ? <Loader2 className="animate-spin mr-2" /> : 'Calculate Income'}
        </button>
      </div>
    </div>
  );
};

export default InputSection;
