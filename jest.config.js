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
                loaders: {
                    '.test.js': 'jsx',
                    '.js': 'jsx',
                },
                target: ['chrome58'],
            }
        ]
    },
    transformIgnorePatterns: [
        "!node_modules/"
    ],
    testMatch: [
        '<rootDir>/src/**/*.test.js'
    ]
};
