import React from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle } from 'lucide-react';

const formatCurrency = (value) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(value);

const FairnessAudit = ({ fairnessData, originalProfile }) => {
    if (!fairnessData) return null;

    const oppositeGender = originalProfile.sex === 'Male' ? 'Female' : 'Male';
    // Simple race swap for demonstration
    const oppositeRace = originalProfile.race === 'White' ? 'Black' : 'White';

    const cardVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } }
    };

    return (
        <motion.div
            className="bg-amber-50 border border-amber-200 rounded-2xl p-6"
            variants={cardVariants}
        >
            <h3 className="text-lg font-semibold text-amber-900 mb-3 flex items-center">
                <AlertTriangle className="mr-2 h-5 w-5 text-amber-500" />
                AI Fairness & Bias Audit
            </h3>
            <p className="text-sm text-amber-800 mb-4">
                This tool analyzes how your specific demographic attributes influence the model's prediction, highlighting potential systemic biases in the census data.
            </p>
            <div className="space-y-3 text-sm">
                <div className="flex justify-between items-center">
                    <p className="text-slate-700">
                        If profile were <span className="font-bold">{oppositeGender}</span> instead of {originalProfile.sex}:
                    </p>
                    <p className="font-bold text-slate-800">
                        {formatCurrency(fairnessData.gender_counterfactual)}
                        <span className={`ml-2 ${fairnessData.gender_gap_percent >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                            ({fairnessData.gender_gap_percent > 0 ? '+' : ''}{fairnessData.gender_gap_percent}%)
                        </span>
                    </p>
                </div>
                <div className="flex justify-between items-center">
                    <p className="text-slate-700">
                        If race were <span className="font-bold">{oppositeRace}</span> instead of {originalProfile.race}:
                    </p>
                    <p className="font-bold text-slate-800">
                        {formatCurrency(fairnessData.race_counterfactual)}
                        <span className={`ml-2 ${fairnessData.race_gap_percent >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                            ({fairnessData.race_gap_percent > 0 ? '+' : ''}{fairnessData.race_gap_percent}%)
                        </span>
                    </p>
                </div>
            </div>
        </motion.div>
    );
};

export default FairnessAudit;
