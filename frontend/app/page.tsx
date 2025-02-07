"use client";

import { useState } from 'react';
import { FlockAnalyzer } from '@/components/FlockAnalyzer';
import { EvaluationForm } from '@/components/EvaluationForm';
import { PhotoGallery } from '@/components/PhotoGallery';
import { RegionalInsights } from '@/components/RegionalInsights';
import { UserGuide } from '@/components/UserGuide';
import { PreShowChecklist } from '@/components/PreShowChecklist';
import { EvaluationCriteria } from '@/components/EvaluationCriteria';

type Tab = 'analyzer' | 'evaluation' | 'photos' | 'insights' | 'guide' | 'checklist' | 'criteria';

export default function Home() {
  const [activeTab, setActiveTab] = useState<Tab>('analyzer');
  const [selectedAnimalId, setSelectedAnimalId] = useState<string | null>(null);

  const renderContent = () => {
    switch (activeTab) {
      case 'analyzer':
        return <FlockAnalyzer onAnimalSelect={setSelectedAnimalId} />;
      case 'evaluation':
        return <EvaluationForm onSave={async () => {}} />;
      case 'photos':
        return selectedAnimalId ? (
          <PhotoGallery animalId={selectedAnimalId} photos={[]} />
        ) : (
          <div className="text-center p-4">
            Please select an animal from the Flock Analyzer to view photos
          </div>
        );
      case 'criteria':
        return <EvaluationCriteria />;
      case 'insights':
        return <RegionalInsights />;
      case 'guide':
        return <UserGuide />;
      case 'checklist':
        return <PreShowChecklist />;
      default:
        return <FlockAnalyzer onAnimalSelect={setSelectedAnimalId} />;
    }
  };

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8 px-6" aria-label="Tabs">
              {[
                { id: 'analyzer', name: 'Flock Analyzer' },
                { id: 'evaluation', name: 'Evaluation' },
                { id: 'photos', name: 'Photos' },
                { id: 'insights', name: 'Regional Insights' },
                { id: 'guide', name: 'User Guide' },
                { id: 'checklist', name: 'Pre-Show Checklist' },
                { id: 'criteria', name: 'Evaluation Criteria' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as Tab)}
                  className={`
                    whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm
                    ${
                      activeTab === tab.id
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }
                  `}
                >
                  {tab.name}
                </button>
              ))}
            </nav>
          </div>
          <div className="p-6">{renderContent()}</div>
        </div>
      </div>
    </main>
  );
}
