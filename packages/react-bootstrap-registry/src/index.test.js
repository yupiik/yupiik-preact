import { h } from 'preact';
import { render } from '@testing-library/preact';
import { expect } from 'expect';
import { FromConfiguratonHoc, HtmlRegistry } from '../../dynamic/src';
import { ReactBootstrapRegistry } from './index';

test('Should render react-bootstrap components', () => {
    // statc part (JSON friendly)
    const opts = {
        name: 'Container',
        options: {
            configuration: {
                children: [
                    {
                        name: 'Row',
                        options: {
                            configuration: {
                                children: [
                                    {
                                        name: 'Col',
                                        options: {
                                            configuration: {
                                                children: [
                                                    'some value',
                                                ],
                                            },
                                        },
                                    },
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
            registry={{
                ...HtmlRegistry, // for <div />
                ...ReactBootstrapRegistry,
            }}
            options={opts}
        />
    );

    // test
    expect(children).toMatchSnapshot();
});
