"use strict";

(function() {
  const React = require('react');
  const { useState, useEffect } = React;
  const mockStore = require('@/lib/mock/store');

  function AnimalsWrapper() {
    const [animals, setAnimals] = useState([]);

    useEffect(() => {
      setAnimals(mockStore.getAnimals());
    }, []);

    return React.createElement(
      'div',
      { className: 'min-h-screen bg-background' },
      [
        React.createElement('header', { className: 'container mx-auto p-6' },
          React.createElement('h1', { className: 'text-3xl font-bold tracking-tight mb-6' }, 'Animal Management')
        ),
        React.createElement('main', { className: 'container mx-auto p-6' },
          React.createElement('div', { className: 'grid gap-6' },
            animals.map(animal => 
              React.createElement('div', { key: animal.id, className: 'border rounded-lg p-6' },
                [
                  React.createElement('h2', { className: 'text-xl font-semibold mb-4' }, animal.name),
                  React.createElement('div', { className: 'grid md:grid-cols-2 gap-6' },
                    [
                      React.createElement('div', null,
                        [
                          React.createElement('p', null, `Breed: ${animal.breed}`),
                          React.createElement('p', null, `Age: ${animal.age} years`),
                          React.createElement('p', null, `Weight: ${animal.weight} kg`)
                        ]
                      ),
                      React.createElement('div', null,
                        React.createElement('div', { className: 'space-y-4' },
                          Object.entries(animal.scores).map(([key, value]) =>
                            React.createElement('div', { key },
                              [
                                React.createElement('p', null, `${key}: ${value}/10`),
                                React.createElement('div', { 
                                  className: 'h-2 bg-blue-100 rounded-full overflow-hidden'
                                },
                                  React.createElement('div', {
                                    className: 'h-full bg-blue-500',
                                    style: { width: `${value * 10}%` }
                                  })
                                )
                              ]
                            )
                          )
                        )
                      )
                    ]
                  )
                ]
              )
            )
          )
        )
      ]
    );
  }

  window.AnimalsWrapper = AnimalsWrapper;
})();