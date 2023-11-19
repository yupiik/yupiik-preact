import { h } from 'preact';
import { render } from '@testing-library/preact';
import { expect } from 'expect';
import { FromConfiguratonHoc } from '../../dynamic/src';
import { PreactRouterRegistry } from './index';

test('Should render preact-router components', () => {
    // statc part (JSON friendly)
    const opts = {
        name: 'Router',
        options: {
            configuration: {
                history: { // just for the test
                    location: {
                        pathname: '/home',
                    },
                    push: function () { },
                    listen: function () { },
                },
                children: [
                    {
                        name: 'div',
                        options: {
                            wrapperProps: {
                                path: '/home',
                            },
                            configuration: {
                                children: [
                                    'home',
                                ],
                            },
                        },
                    },
                    {
                        name: 'div',
                        options: {
                            wrapperProps: {
                                default: true,
                            },
                            configuration: {
                                children: [
                                    'default',
                                ],
                            },
                        },
                    },
                ],
            },
        },
    };

    // rendering
    const { container: { children } } = render(
        <FromConfiguratonHoc
            registry={PreactRouterRegistry}
            options={opts}
        />
    );

    // test
    expect(children).toMatchSnapshot();
});
