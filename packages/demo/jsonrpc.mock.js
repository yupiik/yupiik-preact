const MOCKS = {
    missing_method: {
        jsonrpc: '2.0',
        error: {
            code: -32601,
            message: 'unknown method',
        },
    },
    'demo.form.submit': {
        jsonrpc: '2.0',
        result: {
            success: true,
        },
    },
    'demo.init': {
        jsonrpc: '2.0',
        result: {
            user: {
                name: 'John Doe',
                age: 33,
            },
        },
    },
};

module.exports = (request) => {
    const lookedUpResponse = MOCKS[request.method || 'missing_method'];
    return lookedUpResponse || MOCKS['missing_method'];
};
