"use client";

import { useState } from 'react';
import { Header } from '@/components/Header';
import { Dashboard } from '@/components/Dashboard';
import { EvaluationForm } from '@/components/EvaluationForm';
import { RegionalInsights } from '@/components/RegionalInsights';
import { PreShowChecklist } from '@/components/PreShowChecklist';
import { PhotoGallery } from '@/components/PhotoGallery';
import { EvaluationCriteria } from '@/components/EvaluationCriteria';
import { FlockAnalyzer } from '@/components/FlockAnalyzer';
import { UserGuide } from '@/components/UserGuide';
import { WizardPhil } from '@/components/WizardPhil';

type ViewType = 'dashboard' | 'regional' | 'checklist' | 'photos' | 'criteria' | 'analyzer' | 'guide';

export default function Home() {
  const [activeView, setActiveView] = useState<ViewType>('dashboard');

  const renderMainContent = () => {
    switch (activeView) {
      case 'regional':
        return <RegionalInsights />;
      case 'checklist':
        return <PreShowChecklist />;
      case 'photos':
        return <PhotoGallery />;
      case 'criteria':
        return <EvaluationCriteria />;
      case 'analyzer':
        return <FlockAnalyzer />;
      case 'guide':
        return <UserGuide />;
      default:
        return <Dashboard />;
    }
  };

  const navigationItems = [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'regional', label: 'Regional Insights' },
    { id: 'checklist', label: 'Pre-Show Checklist' },
    { id: 'photos', label: 'Photo Gallery' },
    { id: 'criteria', label: 'Evaluation Criteria' },
    { id: 'analyzer', label: 'Flock Analyzer' },
    { id: 'guide', label: 'User Guide' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container mx-auto px-4 py-8">
        {/* Navigation */}
        <div className="flex space-x-4 mb-6 overflow-x-auto pb-2">
          {navigationItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveView(item.id as ViewType)}
              className={`px-4 py-2 rounded-lg whitespace-nowrap transition-colors ${
                activeView === item.id
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* Main content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            {renderMainContent()}
          </div>
          <div>
            <EvaluationForm onSave={console.log} />
          </div>
        </div>
      </main>
      
      <WizardPhil />
    </div>
  );
}
