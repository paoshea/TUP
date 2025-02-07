"use client";

import React, { useState } from 'react';
import { Book, ChevronDown, ChevronRight, Info, CheckSquare, Camera, Map, Settings, HelpCircle } from 'lucide-react';

interface GuideSection {
  title: string;
  icon: React.ReactNode;
  content: React.ReactNode;
  subsections?: { title: string; content: React.ReactNode }[];
}

export function UserGuide() {
  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  const guideSections: GuideSection[] = [
    {
      title: "Getting Started",
      icon: <Info className="w-5 h-5" />,
      content: (
        <div className="space-y-3">
          <p>Welcome to the LiveStock Show Assistant! This guide will help you get started with the system.</p>
          <p>The application is designed to help you:</p>
          <ul className="list-disc list-inside space-y-1 text-gray-700">
            <li>Prepare for livestock shows</li>
            <li>Evaluate animals according to breed standards</li>
            <li>Track performance and progress</li>
            <li>Access regional insights and historical data</li>
          </ul>
        </div>
      )
    },
    {
      title: "Pre-Show Preparation",
      icon: <CheckSquare className="w-5 h-5" />,
      content: (
        <div className="space-y-3">
          <p>Learn how to effectively prepare for upcoming shows:</p>
          <ul className="list-disc list-inside space-y-1 text-gray-700">
            <li>Create and manage checklists</li>
            <li>Review breed standards</li>
            <li>Organize documentation</li>
          </ul>
        </div>
      ),
      subsections: [
        {
          title: "Using Checklists",
          content: "Create custom checklists to ensure you're prepared for each show. Add, edit, and track completion of tasks."
        },
        {
          title: "Documentation",
          content: "Keep all necessary documentation organized and readily available. This includes registration papers, health certificates, and show rules."
        }
      ]
    },
    {
      title: "Photo Management",
      icon: <Camera className="w-5 h-5" />,
      content: (
        <div className="space-y-3">
          <p>Learn how to use the photo management features:</p>
          <ul className="list-disc list-inside space-y-1 text-gray-700">
            <li>Upload and organize photos</li>
            <li>Add notes and details</li>
            <li>Track progress over time</li>
          </ul>
        </div>
      )
    },
    {
      title: "Regional Insights",
      icon: <Map className="w-5 h-5" />,
      content: (
        <div className="space-y-3">
          <p>Access region-specific information and insights:</p>
          <ul className="list-disc list-inside space-y-1 text-gray-700">
            <li>View regional breed characteristics</li>
            <li>Access historical show data</li>
            <li>Understand local preferences</li>
          </ul>
        </div>
      )
    },
    {
      title: "Settings & Preferences",
      icon: <Settings className="w-5 h-5" />,
      content: (
        <div className="space-y-3">
          <p>Customize the application to suit your needs:</p>
          <ul className="list-disc list-inside space-y-1 text-gray-700">
            <li>Set default preferences</li>
            <li>Configure notifications</li>
            <li>Manage data synchronization</li>
          </ul>
        </div>
      )
    }
  ];

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <div className="flex items-center gap-2 mb-6">
        <Book className="h-6 w-6 text-blue-600" />
        <h2 className="text-xl font-semibold">User Guide</h2>
      </div>

      <div className="space-y-4">
        {guideSections.map((section) => (
          <div key={section.title} className="border rounded-lg">
            <button
              onClick={() => setExpandedSection(
                expandedSection === section.title ? null : section.title
              )}
              className="w-full flex items-center justify-between p-4 hover:bg-gray-50"
            >
              <div className="flex items-center gap-3">
                <span className="text-blue-600">{section.icon}</span>
                <span className="font-medium">{section.title}</span>
              </div>
              {expandedSection === section.title ? (
                <ChevronDown className="h-5 w-5 text-gray-500" />
              ) : (
                <ChevronRight className="h-5 w-5 text-gray-500" />
              )}
            </button>

            {expandedSection === section.title && (
              <div className="p-4 pt-0">
                <div className="p-4 bg-gray-50 rounded-lg">
                  {section.content}
                </div>

                {section.subsections && (
                  <div className="mt-4 space-y-3 pl-4">
                    {section.subsections.map((subsection) => (
                      <div key={subsection.title}>
                        <h4 className="font-medium text-gray-900 mb-1">
                          {subsection.title}
                        </h4>
                        <p className="text-gray-600 text-sm">
                          {subsection.content}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Help Button */}
      <div className="mt-8 flex items-center justify-center">
        <button className="flex items-center gap-2 text-blue-600 hover:text-blue-700">
          <HelpCircle className="h-5 w-5" />
          <span>Need more help? Contact support</span>
        </button>
      </div>
    </div>
  );
}