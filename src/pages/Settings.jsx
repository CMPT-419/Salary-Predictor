import React from 'react';
import { motion } from 'framer-motion';
import { SlidersHorizontal, ShieldCheck, Database } from 'lucide-react';

const ToggleSwitch = ({ label, description, enabled }) => (
  <div className="flex items-center justify-between">
    <div>
      <h4 className="font-medium text-slate-700">{label}</h4>
      <p className="text-sm text-slate-500">{description}</p>
    </div>
    <div className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors ${enabled ? 'bg-indigo-600' : 'bg-slate-200'}`}>
      <span className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform ${enabled ? 'translate-x-6' : 'translate-x-1'}`} />
    </div>
  </div>
);

const SettingsCard = ({ children }) => (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
        {children}
    </div>
);

const Settings = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="p-4 sm:p-6 lg:p-8 bg-slate-50 min-h-[calc(100vh-4rem)]"
    >
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-slate-800 mb-8">Settings</h1>
        
        {/* Section 1: Model Parameters */}
        <section className="mb-10">
          <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center">
            <SlidersHorizontal className="w-4 h-4 mr-2" />
            Model Parameters
          </h2>
          <SettingsCard>
            <div className="space-y-6">
              <ToggleSwitch 
                label="Inflation Adjustment" 
                description="Adjust projections for 2025 inflation rates."
                enabled={true}
              />
              <hr className="border-slate-100" />
              <ToggleSwitch 
                label="Comparison Mode" 
                description="Enable multi-major comparison in results."
                enabled={false}
              />
            </div>
          </SettingsCard>
        </section>

        {/* Section 2: Fairness & Transparency */}
        <section>
          <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center">
            <ShieldCheck className="w-4 h-4 mr-2" />
            Fairness & Transparency (FairML)
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <SettingsCard>
                <h3 className="font-semibold text-slate-800 mb-2">Bias Mitigation</h3>
                <p className="text-sm text-slate-500 mb-3">The model is currently penalizing sensitive attributes (Race, Gender) to ensure fair predictions.</p>
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-emerald-100 text-emerald-800">
                    Active
                </span>
            </SettingsCard>
            <SettingsCard>
                <h3 className="font-semibold text-slate-800 mb-2">Dataset Source</h3>
                <div className="flex items-center gap-3">
                    <Database className="w-5 h-5 text-slate-400" />
                    <p className="text-sm text-slate-600 font-medium">UCI Adult Dataset (Augmented)</p>
                </div>
            </SettingsCard>
          </div>
        </section>
      </div>
    </motion.div>
  );
};

export default Settings;
