export default function MobileDemoPage() {
  return (
    <div className="min-h-screen bg-background">
      <div id="mobile-demo-root">
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            <p className="mt-4 text-muted-foreground">Loading mobile demo...</p>
          </div>
        </div>
      </div>
      <script
        dangerouslySetInnerHTML={{
          __html: `
            (function() {
              if (typeof window !== 'undefined') {
                Promise.all([
                  import('react'),
                  import('react-dom'),
                  import('./MobileDemoContent')
                ]).then(([React, ReactDOM, module]) => {
                  const root = document.getElementById('mobile-demo-root');
                  if (root) {
                    const Component = module.default;
                    ReactDOM.render(React.createElement(Component), root);
                  }
                }).catch(console.error);
              }
            })();
          `,
        }}
      />
    </div>
  );
}