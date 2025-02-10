"use client";

import { useState, useEffect } from 'react';
import { BarChart2, TrendingUp, Users, Calendar, Star } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ResizablePanelGroup, ResizablePanel } from '@/components/ui/resizable';
import { EnhancedTable } from '@/components/ui/enhanced-table';
import { storage } from '@/services/storage';

interface MetricCard {
  title: string;
  value: number;
  icon: React.ReactNode;
  description: string;
  trend?: number;
}

export default function AnalyticsPage() {
  const [metrics, setMetrics] = useState<MetricCard[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = () => {
      const analytics = storage.getAnalytics();
      
      setMetrics([
        {
          title: 'Total Animals',
          value: analytics.totalAnimals,
          icon: <Users className="h-6 w-6 text-blue-500" />,
          description: 'Active animals in system',
        },
        {
          title: 'Upcoming Shows',
          value: analytics.upcomingShows,
          icon: <Calendar className="h-6 w-6 text-purple-500" />,
          description: 'Shows scheduled',
        },
        {
          title: 'Evaluations',
          value: analytics.completedEvaluations,
          icon: <Star className="h-6 w-6 text-yellow-500" />,
          description: 'Total evaluations completed',
        },
        {
          title: 'Average Score',
          value: Object.values(analytics.averageScores).reduce((a, b) => a + b, 0) / 4,
          icon: <TrendingUp className="h-6 w-6 text-green-500" />,
          description: 'Overall performance',
          trend: 5.2,
        },
      ]);
      
      setIsLoading(false);
    };

    loadData();
  }, []);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((metric, index) => (
          <Card key={index} className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-gray-100 rounded-lg">
                {metric.icon}
              </div>
              <div>
                <p className="text-sm text-gray-600">{metric.title}</p>
                <div className="flex items-end gap-2">
                  <h3 className="text-2xl font-bold">
                    {typeof metric.value === 'number' 
                      ? metric.value.toFixed(1) 
                      : metric.value}
                  </h3>
                  {metric.trend && (
                    <span className={`text-sm ${metric.trend > 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {metric.trend > 0 ? '+' : ''}{metric.trend}%
                    </span>
                  )}
                </div>
                <p className="text-xs text-gray-500">{metric.description}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <ResizablePanelGroup direction="horizontal">
        <ResizablePanel defaultSize={60}>
          <Card className="h-full p-6">
            <Tabs defaultValue="performance">
              <TabsList>
                <TabsTrigger value="performance">Performance</TabsTrigger>
                <TabsTrigger value="trends">Trends</TabsTrigger>
              </TabsList>

              <TabsContent value="performance" className="space-y-4">
                <div className="h-[400px]">
                  <BarChart2 className="h-full w-full text-gray-300" />
                  <div className="text-center text-sm text-gray-500 mt-4">
                    Performance chart coming soon
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="trends" className="space-y-4">
                <div className="h-[400px]">
                  <TrendingUp className="h-full w-full text-gray-300" />
                  <div className="text-center text-sm text-gray-500 mt-4">
                    Trends chart coming soon
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </Card>
        </ResizablePanel>

        <ResizablePanel defaultSize={40}>
          <Card className="h-full p-6">
            <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
            <div className="space-y-4">
              <div className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                <Calendar className="h-5 w-5 text-gray-500" />
                <div>
                  <p className="font-medium">New Show Added</p>
                  <p className="text-sm text-gray-600">Spring Show 2025</p>
                </div>
              </div>
              <div className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                <Star className="h-5 w-5 text-gray-500" />
                <div>
                  <p className="font-medium">Evaluation Completed</p>
                  <p className="text-sm text-gray-600">Highland Chief - Score: 8.5</p>
                </div>
              </div>
              <div className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                <Users className="h-5 w-5 text-gray-500" />
                <div>
                  <p className="font-medium">New Animal Added</p>
                  <p className="text-sm text-gray-600">Royal Star</p>
                </div>
              </div>
            </div>
          </Card>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
}