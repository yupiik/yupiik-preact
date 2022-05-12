import { h } from "preact";
import { useEffect, useMemo, useReducer } from "preact/hooks";
import jsonLogic from 'json-logic-js';
import { Dynamic } from "./Dynamic";

jsonLogic.add_operation('fn', function (fn, params) {
    return fn(params);
});

const rewriteProp = (source, args) => {
    if (Array.isArray(source)) {
        return source.map(it => typeof it === 'object' ? rewriteProp(it, args) : it);
    }
    if (source.jsonLogic) {
        const value = jsonLogic.apply(source.jsonLogic, args);
        return value;
    }
    return source;
};

/**
 * A HoC wrapping {@link Dynamic} component with some more connection options.
 * Its primary intent is to provide a plain configuration (JSON friendly) to render support - whereas dynamic still requires javascript for callacks for example.
 * For callbacks, it uses JSON-Logic evaluation to solve the JSON -> js mapping.
 * 
 * @param {object} registry component registry (key matching the component name)
 * @param {string} name the component name in the registry
 * @param {array} useEffectCallback the {@link useEffect} callbacks properties definition in JSON-Logic format, it can be an array or an object (behaves as an array of 1 element). Each element is a JSON-Logic expression.
 * @param {array} useReducerCallback the {@link useReducer} callbacks. {@constant initialState} is the state initial value and {@constant reducerJsonLogic} the JSON-Logic implementation which takes the current state and action as parameters. JSONLogic take the state and dispatch functions as parameters.
 * @param {object} callbacks the callbacks properties definition in JSON-Logic format, key is the callback name and value its JSON-Logic chain. The JSON-Logic can use variables `state`, `dispatch` and `event` (the callback event).
 * @param {object} configuration properties to passthrough the underlying component.
 * @param {object} parentState if no {@constant initialState} is passed it will be used to overwrite it, enables to forward through children the state when children are compatible.
 */

// todo: this state management is all wrong, ensure to have a HoC which handles the state and to propagate its
//       state and dispatch values to all children
export const FromConfiguratonHoc = ({
    registry,
    parentState = undefined,
    options: {
        name,
        options: {
            useReducerCallback: {
                initialState = undefined,
                reducerJsonLogic = false,
            } = {},
            useEffectCallback = [],
            callbacks = {},
            configuration = {},
        } = {},
    },
}) => {
    const [state, dispatch] = useReducer(
        (currentState, action) => {
            if (reducerJsonLogic) {
                return jsonLogic.apply(reducerJsonLogic, { parentState, state: currentState, action });
            }
            // todo: nicer default like inject action type in current state?
            return currentState;
        },
        initialState || parentState);

    useEffect(() => {
        if (!useEffectCallback) {
            return;
        }

        // todo: handle promise/cleanup call
        if (Array.isArray(useEffectCallback)) {
            return useEffectCallback
                .map(it => jsonLogic.apply(it, { parentState, state, dispatch }))
                .filter(it => it)
                .reduce((a, i) => {
                    if (typeof i === 'function') {
                        return () => {
                            a();
                            i();
                        };
                    }
                }, () => { });
        }

        const result = jsonLogic.apply(useEffectCallback, { parentState, state, dispatch });
        if (typeof result === 'function') {
            return result;
        }
    }, [useEffectCallback, dispatch]);

    const computedOptions = useMemo(() => ({
        state,
        dispatch,
        ...Object
            .keys(configuration)
            .reduce((aggregator, name) => {
                const value = configuration[name];
                if (typeof value === 'object') {
                    aggregator[name] = rewriteProp(value, {
                        parentState,
                        state,
                        dispatch,
                    });
                } else {
                    aggregator[name] = value;
                }
                return aggregator;
            }, {}),
        ...Object
            .keys(callbacks)
            .reduce((aggregator, callback) => {
                aggregator[callback] = e => {
                    return jsonLogic.apply(callbacks[callback], {
                        parentState,
                        state,
                        dispatch,
                        event: e,
                    });
                };
                return aggregator;
            }, {}),
    }), [callbacks, configuration, state]);

    return (
        <Dynamic
            registry={registry}
            options={{ name, options: computedOptions }}
        />
    )
};
