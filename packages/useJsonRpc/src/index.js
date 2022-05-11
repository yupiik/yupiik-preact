import { createContext } from 'preact';
import { useContext, useEffect, useState } from 'preact/hooks';

export const SecurityContext = createContext();

export const useJsonRpc = ({
    endpoint = '/jsonrpc',
    payload,
    needsSecurity = true,
    fetchOptions = {},
    dependencies = [],
    fetch = (window || {}).fetch,
}) => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(undefined);
    const [data, setData] = useState(undefined);
    const securityContext = useContext(SecurityContext);

    const deps = dependencies && !dependencies.length ? dependencies : [endpoint, payload];
    useEffect(async () => {
        if (needsSecurity && !securityContext) {
            setError('You must be logged to access this page.');
            setLoading(false);
            return;
        }

        const onExit = () => controller.abort();
        const controller = new AbortController();
        try {
            setLoading(true);
            setError(undefined);
            setData(undefined);

            const headers = {
                accept: 'application/json',
                ...(needsSecurity ?
                    {
                        authorization: `Bearer ${securityContext.access_token}`,
                    } :
                    {}
                ),
                ...(fetchOptions.headers || {}),
            };
            const options = {
                headers,
                signal: controller.signal,
                body: typeof payload === 'string' ? payload : JSON.stringify(payload),
                ...fetchOptions,
            };

            const result = await fetch(endpoint, options);
            if (result.status !== 200) {
                setError(`Invalid response: HTTP ${result.status}`);
                return onExit;
            }

            const json = await result.json();
            if (Array.isArray(json)) { // let the caller handle the errors for bulk
                setData(json);
                return onExit;
            }

            if (json.error) {
                setError(json.error);
                return onExit;
            }

            setData(json);
        } catch (e) {
            setError(e);
        } finally {
            setLoading(false);
        }

        return onExit;
    }, deps);

    return [loading, error, data];
};
