import React, { useState } from 'react';
import { motion } from 'framer-motion';
import InputSection from './components/InputSection';
import ResultsSection from './components/ResultsSection';
import AboutModal from './components/AboutModal';
import { BarChart3 } from 'lucide-react';

const App = () => {
  const [formData, setFormData] = useState({
    age: 30,
    education: 'Bachelors',
    major: 'Computer Science',
    workclass: 'Private',
    maritalStatus: 'Never-married',
    relationship: 'Not-in-family',
    race: 'White',
    sex: 'Male',
    hoursPerWeek: 40,
    nativeCountry: 'United-States',
  });
  const [predictionResult, setPredictionResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isAboutOpen, setIsAboutOpen] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePredict = () => {
    setIsLoading(true);
    setPredictionResult(null);

    setTimeout(() => {
      const mockResult = {
        salary_prob: Math.random(),
        growth_curve_data: Array.from({ length: 15 }, (_, i) => ({
          years: i * 2,
          salary: 55000 + i * 4000 + Math.random() * 5000,
        })),
        influence_scores: [
          { feature: 'Education: Masters', impact: Math.random() * 0.3 },
          { feature: 'Age', impact: Math.random() * 0.2 },
          { feature: 'Major: CompSci', impact: Math.random() * 0.15 },
          { feature: 'Sex: Male', impact: -(Math.random() * 0.1) },
          { feature: 'Race: White', impact: -(Math.random() * 0.05) },
        ].sort((a, b) => Math.abs(b.impact) - Math.abs(a.impact)),
      };
      setPredictionResult(mockResult);
      setIsLoading(false);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50 to-slate-100 font-sans text-slate-800">
      <header className="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-30 border-b border-white/30">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <BarChart3 className="text-emerald-600" size={28} />
            <h1 className="text-xl font-bold text-slate-800">
              FairML Income Predictor
            </h1>
          </div>
          <button 
            onClick={() => setIsAboutOpen(true)}
            className="bg-emerald-50 text-emerald-700 font-semibold py-2 px-4 rounded-lg hover:bg-emerald-100 transition-colors duration-300"
          >
            About Project
          </button>
        </div>
      </header>
      
      <main className="container mx-auto p-6">
        <motion.div 
          className="grid grid-cols-1 lg:grid-cols-10 gap-8"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.2 } }
          }}
        >
          <div className="lg:col-span-4">
            <InputSection
              formData={formData}
              handleChange={handleChange}
              onCalculate={handlePredict}
              isLoading={isLoading}
            />
          </div>
          <motion.div 
            className="lg:col-span-6"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <ResultsSection prediction={predictionResult} />
          </motion.div>
        </motion.div>
      </main>

      <AboutModal isOpen={isAboutOpen} onClose={() => setIsAboutOpen(false)} />
    </div>
  );
};

export default App;