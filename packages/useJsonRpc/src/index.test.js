import { renderHook } from '@testing-library/preact-hooks';
import { act } from 'preact/test-utils';
import { useJsonRpc } from './index';

const mocks = {
    fetch: {
        config: {},
        handle: (request) => {
            if (mocks.fetch.config.requestValidator) {
                mocks.fetch.config.requestValidator(request);
            }
            return mocks.fetch.config.result || Promise.resolve({ json: Promise.resolve({ jsonrpc: '2.0', result: {} }) });
        },
        reset: () => Promise.resolve(mocks.fetch.config = {}),
    },
};
const greetingConfig = {
    method: 'greeting',
    params: { name: 'Yupiik' },
    needsSecurity: false,
};

beforeAll(() => {
    if (!global.fetch) {
        global.fetch = mocks.fetch.handle;
    }
});

afterEach(() => mocks.fetch.reset());

afterAll(() => {
    if (global.fetch === mocks.fetch.handle) {
        delete global.fetch;
    }
});

const expectJsonRpc = (hook, loadingValue, errorValue, dataValue) => {
    expect(hook[0]).toBe(loadingValue);
    expect(hook[1]).toStrictEqual(errorValue);
    expect(hook[2]).toStrictEqual(dataValue);
};

function newControlledPromise() {
    const handles = {};
    const promise = new Promise((ok, ko) => {
        handles.resolve = ok;
        handles.fail = ko;
    });
    promise.resolve = value => handles.resolve(value);
    promise.fail = value => handles.fail(value);
    return promise;
};
function newServerMockPromise() {
    const promise = newControlledPromise();
    mocks.fetch.config.result = promise;
    return promise;
};

test('useJsonRpc(object)', async () => {
    const server = newServerMockPromise();
    const { result, rerender } = renderHook(() => useJsonRpc(greetingConfig));
    expectJsonRpc(result.current, true, undefined, undefined);
    await act(async () => server.resolve({
        status: 200,
        json: () => Promise.resolve({
            jsonrpc: '2.0',
            result: {
                test: true,
            },
        }),
    }));
    rerender();
    expectJsonRpc(result.current, false, undefined, {
        jsonrpc: '2.0',
        result: {
            test: true,
        },
    });
});

test('useJsonRpc(object) KO', async () => {
    const server = newServerMockPromise();
    const { result, rerender } = renderHook(() => useJsonRpc(greetingConfig));
    expectJsonRpc(result.current, true, undefined, undefined);
    await act(async () => server.resolve({
        status: 200,
        json: () => Promise.resolve({
            jsonrpc: '2.0',
            error: {
                code: -1,
                test: true,
            },
        }),
    }));
    rerender();
    expectJsonRpc(result.current, false, {
        code: -1,
        test: true,
    }, undefined);
});

test('useJsonRpc(array) OK', async () => {
    const server = newServerMockPromise();
    const { result, rerender } = renderHook(() => useJsonRpc(greetingConfig));
    expectJsonRpc(result.current, true, undefined, undefined);
    const data = [
        {
            jsonrpc: '2.0',
            result: {
                test: true,
            },
        },
        {
            jsonrpc: '2.0',
            error: {
                failed: true,
            },
        },
    ];
    await act(async () => server.resolve({
        status: 200,
        json: () => Promise.resolve(data),
    }));
    rerender();
    expectJsonRpc(result.current, false, undefined, data);
});

test('useJsonRpc(object) unexpected failure', async () => {
    const server = newServerMockPromise();
    const { result } = renderHook(() => useJsonRpc(greetingConfig));
    expectJsonRpc(result.current, true, undefined, undefined);
    await act(async () => server.fail('oops'));
    expectJsonRpc(result.current, false, 'oops', undefined);
});
