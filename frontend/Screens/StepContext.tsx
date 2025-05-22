import React, { createContext, useState, useContext, ReactNode } from 'react';


const getTodayDate = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = (today.getMonth() + 1).toString().padStart(2, '0'); // month is 0-indexed
  const day = today.getDate().toString().padStart(2, '0');
  return `${year}-${month}-${day}`;
};

type StepContextType = {
  sleepFatigue: boolean;
  medicationAdherence: boolean;
  mentalHealth: boolean;
  alcoholSubstanceUse: boolean;
  physicalActivity: boolean;
  foodDiet: boolean;
  menstrualCycle: boolean;
  stepNb: number;
  selectedDate: string;
  setSelectedDate: (date: string) => void;
  setStepValue: (
    key: keyof Omit<
      StepContextType,
      'setStepValue' | 'stepNb' | 'setStepNb' | 'selectedDate' | 'setSelectedDate'
    >,
    value: boolean
  ) => void;
  setStepNb: (value: number) => void;
  dailyLog: any;
  setDailyLog: (log: any) => void;
};

const StepContext = createContext<StepContextType | undefined>(undefined);

export const StepProvider = ({ children }: { children: ReactNode }) => {
  const [steps, setSteps] = useState({
    sleepFatigue: false,
    medicationAdherence: false,
    mentalHealth: false,
    alcoholSubstanceUse: false,
    physicalActivity: false,
    foodDiet: false,
    menstrualCycle: false,
  });

  const [stepNb, setStepNb] = useState(0);
  const [selectedDate, setSelectedDate] = useState(getTodayDate());  // <-- Default to today

  const setStepValue = (
    key: keyof Omit<
      StepContextType,
      'setStepValue' | 'stepNb' | 'setStepNb' | 'selectedDate' | 'setSelectedDate'
    >,
    value: boolean
  ) => {
    setSteps((prev) => ({ ...prev, [key]: value }));
  };
  const [dailyLog, setDailyLog] = useState<any>(null); // ✅ ADD THIS


  return (
    <StepContext.Provider
      value={{
        ...steps,
        stepNb,
        selectedDate,
        setSelectedDate,
        setStepValue,
        setStepNb,
        dailyLog, // ✅ ADD THIS
  setDailyLog, // ✅ ADD THIS
      }}
    >
      {children}
    </StepContext.Provider>
  );
};

export const useStep = (): StepContextType => {
  const context = useContext(StepContext);
  if (!context) {
    throw new Error('useStep must be used within a StepProvider');
  }
  return context;
};
