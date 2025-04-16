'use client';

import React, { useState, ReactNode, createContext, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Types
interface Step {
  id: string;
  title: string;
  content: ReactNode;
  onNext?: () => boolean | Promise<boolean>; // Return false to prevent advancing
  onPrev?: () => void;
}

interface StepWizardContextProps {
  currentStepIndex: number;
  totalSteps: number;
  goToStep: (index: number) => void;
  goToNext: () => void;
  goToPrevious: () => void;
  isFirstStep: boolean;
  isLastStep: boolean;
  isStepComplete: (index: number) => boolean;
}

// Context
const StepWizardContext = createContext<StepWizardContextProps | null>(null);

export const useStepWizard = () => {
  const context = useContext(StepWizardContext);
  if (!context) {
    throw new Error('useStepWizard must be used within a StepWizardProvider');
  }
  return context;
};

// Props
interface StepWizardProps {
  steps: Step[];
  onComplete?: () => void;
  initialStep?: number;
}

const StepWizard: React.FC<StepWizardProps> = ({ 
  steps, 
  onComplete,
  initialStep = 0 
}) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(initialStep);
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());
  const [isTransitioning, setIsTransitioning] = useState(false);

  const goToStep = (index: number) => {
    if (index >= 0 && index < steps.length && !isTransitioning) {
      setCurrentStepIndex(index);
    }
  };

  const goToNext = async () => {
    if (currentStepIndex < steps.length - 1 && !isTransitioning) {
      const currentStep = steps[currentStepIndex];
      
      // Check if there's an onNext handler
      if (currentStep.onNext) {
        const canAdvance = await Promise.resolve(currentStep.onNext());
        if (!canAdvance) return; // Don't advance if handler returns false
      }
      
      // Mark current step as completed
      const newCompletedSteps = new Set(completedSteps);
      newCompletedSteps.add(currentStepIndex);
      setCompletedSteps(newCompletedSteps);
      
      // Transition animation
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentStepIndex(prev => prev + 1);
        setIsTransitioning(false);
      }, 300);
    } else if (currentStepIndex === steps.length - 1 && onComplete) {
      onComplete();
    }
  };

  const goToPrevious = () => {
    if (currentStepIndex > 0 && !isTransitioning) {
      const currentStep = steps[currentStepIndex];
      
      // Call onPrev handler if exists
      if (currentStep.onPrev) {
        currentStep.onPrev();
      }
      
      // Transition animation
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentStepIndex(prev => prev - 1);
        setIsTransitioning(false);
      }, 300);
    }
  };

  const isStepComplete = (index: number) => {
    return completedSteps.has(index);
  };

  const contextValue: StepWizardContextProps = {
    currentStepIndex,
    totalSteps: steps.length,
    goToStep,
    goToNext,
    goToPrevious,
    isFirstStep: currentStepIndex === 0,
    isLastStep: currentStepIndex === steps.length - 1,
    isStepComplete,
  };

  return (
    <StepWizardContext.Provider value={contextValue}>
      <div className="w-full">
        {/* Progress Indicators */}
        <div className="step-progress mb-10">
          {steps.map((step, index) => (
            <React.Fragment key={step.id}>
              {/* Step Indicator */}
              <div 
                className={`step-indicator ${isStepComplete(index) ? 'step-complete' : ''}`}
              >
                <button 
                  className={`step-indicator-circle 
                    ${index === currentStepIndex 
                      ? 'bg-[var(--color-primary)] text-white shadow-[var(--glow-primary)]' 
                      : index < currentStepIndex || isStepComplete(index)
                        ? 'bg-[var(--color-primary)] text-white' 
                        : 'bg-[var(--color-surface)] border border-[var(--color-primary)]/50 text-[var(--color-primary)]'
                    }`}
                  onClick={() => {
                    // Only allow navigating to completed steps or current + 1
                    if (index <= currentStepIndex + 1 && (isStepComplete(index - 1) || index <= currentStepIndex)) {
                      goToStep(index);
                    }
                  }}
                  disabled={index > currentStepIndex + 1 || (index > currentStepIndex && !isStepComplete(index - 1))}
                  aria-label={`Go to step ${index + 1}: ${step.title}`}
                  aria-current={index === currentStepIndex ? 'step' : undefined}
                >
                  {isStepComplete(index) ? (
                    <span className="material-icons text-xs">check</span>
                  ) : (
                    index + 1
                  )}
                </button>
                <div className="mt-2 text-xs text-center whitespace-nowrap">
                  <span className={index === currentStepIndex 
                    ? 'text-[var(--color-primary)] font-bold' 
                    : 'text-[var(--color-text-secondary)]'
                  }>
                    {step.title}
                  </span>
                </div>
              </div>
              
              {/* Connector line between steps */}
              {index < steps.length - 1 && (
                <div 
                  className={`step-connector ${
                    index < currentStepIndex 
                      ? 'bg-[var(--color-primary)]' 
                      : 'bg-[var(--color-primary)]/20'
                  }`}
                ></div>
              )}
            </React.Fragment>
          ))}
        </div>
        
        {/* Step Content with Animation */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStepIndex}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="step-content"
          >
            {steps[currentStepIndex].content}
          </motion.div>
        </AnimatePresence>
        
        {/* Navigation Buttons */}
        <div className="mt-8 flex justify-between">
          <button
            className="btn-cyberpunk bg-transparent border border-[var(--color-primary)] text-[var(--color-primary)] 
                     px-6 py-2 rounded hover:bg-[var(--color-primary)]/10 transition-all duration-300
                     focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]
                     disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={goToPrevious}
            disabled={currentStepIndex === 0}
            aria-label="Previous step"
          >
            <span className="material-icons mr-1 text-sm align-text-bottom">arrow_back</span>
            Back
          </button>
          
          <button
            className="btn-cyberpunk bg-[var(--color-primary)] text-white px-6 py-2 rounded 
                     hover:bg-[var(--color-primary)]/90 hover:shadow-[var(--glow-primary)] transition-all duration-300
                     focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]"
            onClick={goToNext}
            aria-label={currentStepIndex === steps.length - 1 ? "Complete" : "Next step"}
          >
            {currentStepIndex === steps.length - 1 ? 'Complete' : 'Next'}
            {currentStepIndex < steps.length - 1 && (
              <span className="material-icons ml-1 text-sm align-text-bottom">arrow_forward</span>
            )}
          </button>
        </div>
      </div>
    </StepWizardContext.Provider>
  );
};

export default StepWizard; 