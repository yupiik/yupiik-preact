import * as antdIcons from '@ant-design/icons';
import * as antd from 'antd';
import { simpleComponent } from '@yupiik/dynamic/src/component/registry';

const isComponent = it => {
    const c = it.charAt(0);
    return c === c.toUpperCase() && c !== '$' && c !== '_' && !it.endsWith('Props');
};

const antdComponent = nameOrComponent => {
    const impl = simpleComponent(nameOrComponent);
    /* can forward static props - not that helpful since we have 2 HoC wrapping the actual component
       but antd checks if the child is directly an "Item" sometimes so we can probably hack up a proxy there?
    Object
        .keys(nameOrComponent)
        .filter(it => it.startsWith('__ANT_'))
        .forEach(i => impl[i] = nameOrComponent[i]);
    */
    return impl;
}

const forward = obj => Object
    .keys(obj)
    .filter(it => isComponent(it))
    .reduce((a, i) => {
        const wrapper = obj[i];

        a[i] = antdComponent(wrapper);

        // sub-components (Header, Content, Footer, Item, ...)
        Object
            .keys(wrapper)
            .filter(it => isComponent(it))
            .forEach(it => {
                a[`${i}.${it}`] = antdComponent(wrapper[it]);
            });

        return a;
    }, {});

export const AntdRegistry = {
    ...forward(antd),
    ...forward(antdIcons),
};
