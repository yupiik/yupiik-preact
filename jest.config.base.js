module.exports = {
    verbose: true,
    testEnvironment: 'jsdom',
    transform: {
        '^.+\\.js$': [
            'esbuild-jest',
            {
                jsxFactory: 'h',
                jsxFragment: 'Fragment',
                sourcemap: true,
                target: ['chrome58'],
                loaders: {
                    '.test.js': 'jsx',
                    '.js': 'jsx',
                },
            }
        ]
    },
    transformIgnorePatterns: [
        '!node_modules/'
    ],
    testMatch: [
        '<rootDir>/src/**/*.test.js'
    ],
    reporters: [
        'default',
        ['jest-html-reporters', { 'publicPath': 'dist/test-reports', 'filename': 'report.html' }]
    ]
};
