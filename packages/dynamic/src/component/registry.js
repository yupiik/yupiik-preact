import { h } from 'preact';
import { FromConfiguratonHoc } from './FromConfiguratonHoc';

export const simpleComponent = nameOrComponent => ({
    registry,
    children,
    state,
    dispatch,
    ...props
}) => {
    const Comp = nameOrComponent;
    const subComponents = children !== undefined && (Array.isArray(children) ? children : [children])
        .filter(it => it !== undefined)
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
        });
    return (
        <Comp {...props}>
            {subComponents}
        </Comp>
    );
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
