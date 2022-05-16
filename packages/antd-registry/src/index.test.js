import { h } from 'preact';
import { render } from '@testing-library/preact';
import { expect } from 'expect';
import { FromConfiguratonHoc, HtmlRegistry } from '../../dynamic/src';
import { AntdRegistry } from './index';

test('Should render ant components', () => {
    // statc part (JSON friendly)
    const header = {
        options: {
            name: 'Layout.Header',
            options: {
                configuration: {
                    children: [
                        {
                            name: 'div',
                            options: {
                                configuration: {
                                    className: 'logo',
                                },
                            },
                        },
                        {
                            name: 'Menu',
                            options: {
                                configuration: {
                                    theme: 'dark',
                                    mode: 'horizontal',
                                    items: [
                                        {
                                            label: 'sub menu',
                                            key: 'submenu',
                                        },
                                    ],
                                },
                            },
                        },
                    ],
                },
            },
        },
    };
    const routes = [
        {
            name: 'home',
            breadcrumbName: 'Home',
            path: '/',
            childRoutes: [
                {
                    name: 'apps',
                    breadcrumbName: 'Application List',
                    path: 'apps',
                    childRoutes: [
                        {
                            name: 'app',
                            breadcrumbName: 'Application:id',
                            path: ':id',
                            childRoutes: [
                                {
                                    name: 'detail',
                                    breadcrumbName: 'Detail',
                                    path: 'detail',
                                },
                            ],
                        },
                    ],
                },
            ],
        },
        {
            name: 'apps',
            breadcrumbName: 'Application List',
            path: 'apps',
            childRoutes: [
                {
                    name: 'app',
                    breadcrumbName: 'Application:id',
                    path: ':id',
                    childRoutes: [
                        {
                            name: 'detail',
                            breadcrumbName: 'Detail',
                            path: 'detail',
                        },
                    ],
                },
            ],
        },
    ];
    const breadcrumb = {
        options: {
            name: 'Breadcrumb',
            options: {
                configuration: {
                    style: { margin: '16px 0' },
                    routes,
                },
            },
        },
    };
    const content = {
        options: {
            name: 'Layout.Content',
            options: {
                configuration: {
                    style: { padding: '0 50px' },
                    children: [
                        breadcrumb,
                    ],
                },
            },
        },
    };
    const opts = {
        name: 'Layout',
        options: {
            configuration: {
                className: 'layout',
                children: [
                    header,
                    content,
                ],
            },
        },
    };

    // rendering
    const ui = (
        <FromConfiguratonHoc
            registry={{
                ...HtmlRegistry, // for <div />
                ...AntdRegistry,
            }}
            options={opts}
        />
    );
    const { container: { children } } = render(ui);

    // test
    expect(children).toMatchSnapshot();
});
