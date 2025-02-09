import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { WifiOff, RefreshCw } from 'lucide-react';

export default function OfflinePage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <div className="flex items-center justify-center mb-4">
            <WifiOff className="h-12 w-12 text-muted-foreground" />
          </div>
          <CardTitle className="text-center">You&apos;re Offline</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p className="text-center text-muted-foreground">
              Don&apos;t worry! You can still:
            </p>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground">
              <li>View cached evaluations</li>
              <li>Create new evaluations (they&apos;ll sync when you&apos;re back online)</li>
              <li>Access previously viewed animals</li>
              <li>Review saved show information</li>
            </ul>
            <div className="flex justify-center mt-6">
              <Button
                onClick={() => window.location.reload()}
                className="flex items-center space-x-2"
              >
                <RefreshCw className="h-4 w-4" />
                <span>Try Again</span>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}