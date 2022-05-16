module.exports = {
    ...require('../../jest.config.base'),
    moduleNameMapper: {
        '^preact$': '<rootDir>/node_modules/preact/dist/preact.min.js',
        '^react$': 'preact/compat',
        '^react-dom$': 'preact/compat',
    },
};
