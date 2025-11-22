import React, { useState } from 'react';
import InputSection from './components/InputSection';
import ResultsSection from './components/ResultsSection';

const App = () => {
  const [formData, setFormData] = useState({
    age: 30,
    education: 'Bachelors',
    workclass: 'Private',
    occupation: 'Tech-support',
    maritalStatus: 'Never-married',
    relationship: 'Not-in-family',
    race: 'White',
    sex: 'Male',
    hoursPerWeek: 40,
    nativeCountry: 'United-States',
  });
  const [predictionResult, setPredictionResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePredict = () => {
    setIsLoading(true);
    setPredictionResult(null);

    // Simulate an API call to the Python backend
    setTimeout(() => {
      // Mock data structure
      const mockResult = {
        salary_prob: Math.random(), // Probability of being >50k
        growth_curve_data: [
          { years: 0, salary: 55000 },
          { years: 2, salary: 62000 },
          { years: 5, salary: 75000 },
          { years: 10, salary: 95000 },
          { years: 15, salary: 110000 },
        ],
        influence_scores: [
          { feature: 'Education: Masters', impact: 0.25 },
          { feature: 'Age', impact: 0.18 },
          { feature: 'Occupation: Exec-managerial', impact: 0.15 },
          { feature: 'Sex: Male', impact: -0.05 },
          { feature: 'Race: White', impact: -0.02 },
        ],
      };
      setPredictionResult(mockResult);
      setIsLoading(false);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-slate-100 font-sans text-slate-800">
      <header className="bg-white/80 backdrop-blur-lg shadow-sm sticky top-0 z-20">
        <div className="container mx-auto px-6 py-4">
          <h1 className="text-3xl font-bold text-emerald-700">
            FairML Income Growth Predictor
          </h1>
        </div>
      </header>
      <main className="container mx-auto p-6">
        <div className="grid grid-cols-1 lg:grid-cols-10 gap-8">
          <div className="lg:col-span-4">
            <InputSection
              formData={formData}
              handleChange={handleChange}
              onCalculate={handlePredict}
              isLoading={isLoading}
            />
          </div>
          <div className="lg:col-span-6">
            <ResultsSection prediction={predictionResult} />
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;
