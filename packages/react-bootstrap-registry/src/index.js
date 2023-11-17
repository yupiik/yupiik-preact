import { simpleComponent } from '@yupiik/dynamic/src/component/registry';
import * as reactBootstrap from 'react-bootstrap';

const isComponent = it =>
    it.charAt(0) === it.charAt(0).toUpperCase() &&
    !it.includes('$') &&
    !it.includes('_') &&
    !it.endsWith('Props');

const forward = obj => Object
    .keys(obj)
    .filter(it => isComponent(it))
    .reduce((a, i) => {
        const wrapper = obj[i];

        a[i] = simpleComponent(wrapper);

        // subcomponents
        Object
            .keys(wrapper)
            .filter(it => isComponent(it))
            .forEach(it => {
                a[`${i}.${it}`] = simpleComponent(wrapper[it]);
            });

        return a;
    }, {});

export const ReactBootstrapRegistry = forward(reactBootstrap);
