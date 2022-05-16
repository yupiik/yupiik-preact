import jsonLogic from "json-logic-js";
import { h } from "preact";
import { useEffect, useMemo, useReducer, useState } from "preact/hooks";
import { Dynamic } from "./Dynamic";

jsonLogic.add_operation('fn', function (fn, params) {
    return fn(params);
});

const rewriteProp = (source, args) => {
    if (Array.isArray(source)) {
        return source.map(it => typeof it === 'object' ? rewriteProp(it, args) : it);
    }
    if (source.jsonLogic) {
        return jsonLogic.apply(source.jsonLogic, args);
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
 * @param {object} parentDispatch parent dispatch callback (to be able to modify parent state).
 */

// todo: this state management is all wrong, ensure to have a HoC which handles the state and to propagate its
//       state and dispatch values to all children
export const FromConfiguratonHoc = ({
    registry,
    parentState = undefined,
    parentDispatch = undefined,
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
            if (action.type === '$state') {
                return action.value;
            }
            if (reducerJsonLogic) {
                return jsonLogic.apply(reducerJsonLogic, { parentState, parentDispatch, state: currentState, action });
            }
            if (parentDispatch) { // bubble up if there is no own definition
                parentDispatch(action);
            }
            // here there is no reducerJsonLogic so we just back with parent state
            return parentState;
        },
        initialState,
        localState => localState === undefined ? parentState : localState);

    useEffect(() => {
        if (!reducerJsonLogic) {
            dispatch({ type: '$state', value: parentState });
        }

        if (!useEffectCallback) {
            return;
        }

        if (Array.isArray(useEffectCallback)) {
            return useEffectCallback
                .map(it => jsonLogic.apply(it, { parentState, parentDispatch, state, dispatch }))
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

        const result = jsonLogic.apply(useEffectCallback, { parentState, parentDispatch, state, dispatch });
        if (typeof result === 'function') {
            return result;
        }
    }, [useEffectCallback, initialState, parentState]);

    const computedOptions = useMemo(() => {
        const opts = Object
            .keys(configuration)
            .reduce((aggregator, name) => {
                const value = configuration[name];
                aggregator[name] = typeof value === 'object' ?
                    rewriteProp(value, {
                        parentState,
                        parentDispatch,
                        state,
                        dispatch,
                    }) :
                    value;
                return aggregator;
            }, {});

        const callbackOpts = Object
            .keys(callbacks)
            .reduce((aggregator, callback) => {
                const spec = callbacks[callback];
                aggregator[callback] = e => jsonLogic.apply(spec, {
                    parentState,
                    parentDispatch,
                    state,
                    dispatch,
                    event: e,
                });
                return aggregator;
            }, {});

        return { name, options: { state, dispatch, ...opts, ...callbackOpts } };
    }, [callbacks, configuration, state, parentState]);

    return (
        <Dynamic
            registry={registry}
            options={computedOptions}
        />
    )
};

export const simpleComponent = name => ({ registry, children, state, dispatch, ...props }) => {
    const Comp = name;
    return (<Comp {...props}>
        {children && (Array.isArray(children) ? children : [children])
            .map(it => {
                // all the trick is there, wrap the children with FromConfiguratonHoc to enable the configuration to propagate properly 
                if (typeof it === 'object' && it.options) {
                    if (it.name) { // not wrapped, we tolerate it since it is simpler to write
                        return (
                            <FromConfiguratonHoc registry={registry} options={it} parentState={state} parentDispatch={dispatch} />
                        );
                    }
                    return (
                        <FromConfiguratonHoc registry={registry} {...it} parentState={state} parentDispatch={dispatch} />
                    );
                }
                return it;
            })}
    </Comp>);
};

export const HtmlRegistry = {
    a: simpleComponent('a'),
    abbr: simpleComponent('abbr'),
    address: simpleComponent('address'),
    area: simpleComponent('area'),
    article: simpleComponent('article'),
    aside: simpleComponent('aside'),
    audio: simpleComponent('audio'),
    b: simpleComponent('b'),
    base: simpleComponent('base'),
    bdi: simpleComponent('bdi'),
    bdo: simpleComponent('bdo'),
    blockquote: simpleComponent('blockquote'),
    body: simpleComponent('body'),
    br: simpleComponent('br'),
    button: simpleComponent('button'),
    canvas: simpleComponent('canvas'),
    caption: simpleComponent('caption'),
    cite: simpleComponent('cite'),
    code: simpleComponent('code'),
    col: simpleComponent('col'),
    colgroup: simpleComponent('colgroup'),
    data: simpleComponent('data'),
    datalist: simpleComponent('datalist'),
    dd: simpleComponent('dd'),
    del: simpleComponent('del'),
    details: simpleComponent('details'),
    dfn: simpleComponent('dfn'),
    dialog: simpleComponent('dialog'),
    div: simpleComponent('div'),
    dl: simpleComponent('dl'),
    dt: simpleComponent('dt'),
    em: simpleComponent('em'),
    embed: simpleComponent('embed'),
    fieldset: simpleComponent('fieldset'),
    figcaption: simpleComponent('figcaption'),
    figure: simpleComponent('figure'),
    footer: simpleComponent('footer'),
    form: simpleComponent('form'),
    h1: simpleComponent('h1'),
    h2: simpleComponent('h2'),
    h3: simpleComponent('h3'),
    h4: simpleComponent('h4'),
    h5: simpleComponent('h5'),
    h6: simpleComponent('h6'),
    head: simpleComponent('head'),
    header: simpleComponent('header'),
    hr: simpleComponent('hr'),
    html: simpleComponent('html'),
    i: simpleComponent('i'),
    iframe: simpleComponent('iframe'),
    img: simpleComponent('img'),
    input: simpleComponent('input'),
    ins: simpleComponent('ins'),
    kbd: simpleComponent('kbd'),
    label: simpleComponent('label'),
    legend: simpleComponent('legend'),
    li: simpleComponent('li'),
    link: simpleComponent('link'),
    main: simpleComponent('main'),
    map: simpleComponent('map'),
    mark: simpleComponent('mark'),
    meta: simpleComponent('meta'),
    meter: simpleComponent('meter'),
    nav: simpleComponent('nav'),
    object: simpleComponent('object'),
    ol: simpleComponent('ol'),
    optgroup: simpleComponent('optgroup'),
    option: simpleComponent('option'),
    p: simpleComponent('p'),
    param: simpleComponent('param'),
    picture: simpleComponent('picture'),
    pre: simpleComponent('pre'),
    progress: simpleComponent('progress'),
    q: simpleComponent('q'),
    rp: simpleComponent('rp'),
    rt: simpleComponent('rt'),
    ruby: simpleComponent('ruby'),
    s: simpleComponent('s'),
    samp: simpleComponent('samp'),
    script: simpleComponent('script'),
    section: simpleComponent('section'),
    select: simpleComponent('select'),
    small: simpleComponent('small'),
    source: simpleComponent('source'),
    span: simpleComponent('span'),
    strong: simpleComponent('strong'),
    style: simpleComponent('style'),
    sub: simpleComponent('sub'),
    summary: simpleComponent('summary'),
    sup: simpleComponent('sup'),
    svg: simpleComponent('svg'),
    table: simpleComponent('table'),
    tbody: simpleComponent('tbody'),
    td: simpleComponent('td'),
    template: simpleComponent('template'),
    textarea: simpleComponent('textarea'),
    tfoot: simpleComponent('tfoot'),
    th: simpleComponent('th'),
    thead: simpleComponent('thead'),
    time: simpleComponent('time'),
    title: simpleComponent('title'),
    tr: simpleComponent('tr'),
    track: simpleComponent('track'),
    u: simpleComponent('u'),
    ul: simpleComponent('ul'),
    var: simpleComponent('var'),
    video: simpleComponent('video'),
    wbr: simpleComponent('wbr'),
};
