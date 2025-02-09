export default function EvaluationsPage() {
  return (
    <div className="min-h-screen bg-background">
      <div id="evaluations-root">
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            <p className="mt-4 text-muted-foreground">Loading evaluations...</p>
          </div>
        </div>
      </div>
      <script
        dangerouslySetInnerHTML={{
          __html: `
            (function() {
              if (typeof window !== 'undefined') {
                import('/evaluations/EvaluationsContent')
                  .then(module => {
                    const root = document.getElementById('evaluations-root');
                    if (root) {
                      const Component = module.default;
                      const React = require('react');
                      const ReactDOM = require('react-dom');
                      ReactDOM.render(React.createElement(Component), root);
                    }
                  })
                  .catch(console.error);
              }
            })();
          `,
        }}
      />
    </div>
  );
}