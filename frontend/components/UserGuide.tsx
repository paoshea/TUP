"use client";

import React from 'react';
import { Book, Camera, Map, Settings, HelpCircle, Info, CheckSquare } from 'lucide-react';
import { Card, CardHeader, CardContent } from './ui/card';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from './ui/accordion';
import { Button } from './ui/button';

interface GuideSection {
  id: string;
  title: string;
  icon: React.ReactNode;
  content: React.ReactNode;
  subsections?: { title: string; content: React.ReactNode }[];
}

export function UserGuide() {
  const guideSections: GuideSection[] = [
    {
      id: 'getting-started',
      title: "Getting Started",
      icon: <Info className="w-5 h-5" />,
      content: (
        <div className="space-y-3">
          <p className="text-sm text-muted-foreground">Welcome to the LiveStock Show Assistant! This guide will help you get started with the system.</p>
          <p className="text-sm font-medium">The application is designed to help you:</p>
          <ul className="text-sm text-muted-foreground space-y-2">
            <li className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-primary" />
              Prepare for livestock shows
            </li>
            <li className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-primary" />
              Evaluate animals according to breed standards
            </li>
            <li className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-primary" />
              Track performance and progress
            </li>
            <li className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-primary" />
              Access regional insights and historical data
            </li>
          </ul>
        </div>
      )
    },
    {
      id: 'pre-show',
      title: "Pre-Show Preparation",
      icon: <CheckSquare className="w-5 h-5" />,
      content: (
        <div className="space-y-3">
          <p className="text-sm text-muted-foreground">Learn how to effectively prepare for upcoming shows:</p>
          <ul className="text-sm text-muted-foreground space-y-2">
            <li className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-primary" />
              Create and manage checklists
            </li>
            <li className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-primary" />
              Review breed standards
            </li>
            <li className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-primary" />
              Organize documentation
            </li>
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
      id: 'photos',
      title: "Photo Management",
      icon: <Camera className="w-5 h-5" />,
      content: (
        <div className="space-y-3">
          <p className="text-sm text-muted-foreground">Learn how to use the photo management features:</p>
          <ul className="text-sm text-muted-foreground space-y-2">
            <li className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-primary" />
              Upload and organize photos
            </li>
            <li className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-primary" />
              Add notes and details
            </li>
            <li className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-primary" />
              Track progress over time
            </li>
          </ul>
        </div>
      )
    },
    {
      id: 'insights',
      title: "Regional Insights",
      icon: <Map className="w-5 h-5" />,
      content: (
        <div className="space-y-3">
          <p className="text-sm text-muted-foreground">Access region-specific information and insights:</p>
          <ul className="text-sm text-muted-foreground space-y-2">
            <li className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-primary" />
              View regional breed characteristics
            </li>
            <li className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-primary" />
              Access historical show data
            </li>
            <li className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-primary" />
              Understand local preferences
            </li>
          </ul>
        </div>
      )
    },
    {
      id: 'settings',
      title: "Settings & Preferences",
      icon: <Settings className="w-5 h-5" />,
      content: (
        <div className="space-y-3">
          <p className="text-sm text-muted-foreground">Customize the application to suit your needs:</p>
          <ul className="text-sm text-muted-foreground space-y-2">
            <li className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-primary" />
              Set default preferences
            </li>
            <li className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-primary" />
              Configure notifications
            </li>
            <li className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-primary" />
              Manage data synchronization
            </li>
          </ul>
        </div>
      )
    }
  ];

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Book className="h-6 w-6 text-primary" />
          <h2 className="text-2xl font-semibold tracking-tight">User Guide</h2>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <Accordion type="single" collapsible className="w-full">
          {guideSections.map((section) => (
            <AccordionItem key={section.id} value={section.id}>
              <AccordionTrigger>
                <div className="flex items-center gap-3">
                  <span className="text-primary">{section.icon}</span>
                  <span>{section.title}</span>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="pt-2 pb-4">
                  <Card>
                    <CardContent className="pt-6">
                      {section.content}
                    </CardContent>
                  </Card>

                  {section.subsections && (
                    <div className="mt-4 space-y-4">
                      {section.subsections.map((subsection) => (
                        <Card key={subsection.title}>
                          <CardContent className="pt-4">
                            <h4 className="font-medium mb-1">
                              {subsection.title}
                            </h4>
                            <p className="text-sm text-muted-foreground">
                              {subsection.content}
                            </p>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>

        <div className="flex justify-center">
          <Button variant="outline" className="gap-2">
            <HelpCircle className="h-4 w-4" />
            Need more help? Contact support
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}