import { JSX } from 'react';

export interface DemoComponentProps {
  isLoading?: boolean;
  onAction?: () => void;
}

export interface DemoStep {
  id: string;
  title: string;
  description: string;
  component: JSX.Element;
  action?: () => Promise<void>;
}

export interface DemoContextProps {
  currentStep: string;
  progress: number;
  completedSteps: string[];
}

export interface WizardPhilDemoProps {
  initialMessage: string;
  demoContext?: DemoContextProps;
}