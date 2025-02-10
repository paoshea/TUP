window.AnimalsWrapper = function AnimalsWrapper() {
  return React.createElement(
    'div',
    { className: 'container mx-auto p-6' },
    [
      React.createElement(
        'h1',
        { 
          key: 'title',
          className: 'text-3xl font-bold tracking-tight mb-6' 
        },
        'Animals'
      ),
      React.createElement(
        'p',
        { 
          key: 'description',
          className: 'text-muted-foreground mb-8' 
        },
        'Manage your show animals and track their progress.'
      ),
      React.createElement(
        'div',
        { 
          key: 'stats',
          className: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' 
        },
        [
          React.createElement(
            'div',
            { 
              key: 'total',
              className: 'p-6 bg-card rounded-lg shadow-sm' 
            },
            [
              React.createElement(
                'h2',
                { 
                  key: 'total-title',
                  className: 'text-xl font-semibold mb-2' 
                },
                'Total Animals'
              ),
              React.createElement(
                'p',
                { 
                  key: 'total-value',
                  className: 'text-3xl font-bold' 
                },
                '0'
              )
            ]
          )
        ]
      )
    ]
  );
};