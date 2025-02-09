import dynamic from 'next/dynamic';

// Create a client component wrapper
const AnimalsWrapper = dynamic(
  () => import('../animals/AnimalsWrapper'),
  {
    ssr: false,
    loading: () => (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          <p className="mt-4 text-muted-foreground">Loading animals...</p>
        </div>
      </div>
    )
  }
);

// Server component
export default function AnimalsPage() {
  return <AnimalsWrapper />;
}