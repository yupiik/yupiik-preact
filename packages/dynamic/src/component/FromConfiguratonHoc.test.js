import { h } from 'preact';
import { render, fireEvent, screen, waitFor } from '@testing-library/preact';
import { expect } from 'expect';
import { HtmlRegistry } from './registry';
import { FromConfiguratonHoc } from './FromConfiguratonHoc';

const TestFCHoc = (props) => (
    <FromConfiguratonHoc
        registry={HtmlRegistry}
        options={props}
    />
);

test('FromConfiguratonHoc should render static components', () => {
    const { container: { children } } = render(
        <TestFCHoc
            name="div"
            options={{
                callbacks: {},
                configuration: {
                    className: 'test',
                    children: 'Tests',
                },
            }}
        />
    );
    expect(children).toMatchSnapshot();
});

// inspired from
// https://preactjs.com/guide/v10/hooks/#usereducer
// and
// https://preactjs.com/guide/v10/preact-testing-library/#usage
test('FromConfiguratonHoc should render components with state', async () => {
    const { container: { children } } = render(
        <TestFCHoc
            name="div"
            options={{
                useReducerCallback: {
                    initialState: 0,
                    /* equivalent to
                    const reducer = (state, action) => {
                    switch (action) {
                        case 'increment': return state + 1;
                        case 'decrement': return state - 1;
                        case 'reset': return 0;
                        default: throw new Error('Unexpected action');
                    }
                    };
                    */
                    reducerJsonLogic: {
                        'if': [
                            { '==': [{ 'var': 'action' }, 'increment'] },
                            { '+': [{ 'var': 'state' }, 1] },
                            {
                                'if': [
                                    { '==': [{ 'var': 'action' }, 'decrement'] },
                                    { '-': [{ 'var': 'state' }, 1] },
                                    {
                                        'if': [
                                            { '==': [{ 'var': 'action' }, 'reset'] },
                                            0,
                                            // not a real operator but will fail and it is what we want
                                            { 'invalid_action': [] },
                                        ],
                                    },
                                ],
                            },
                        ],
                    },
                },
                configuration: {
                    className: 'test',
                    children: [
                        { // <span>Current value: {count}</span>
                            name: 'span',
                            options: {
                                configuration: {
                                    'data-testid': 'current',
                                    children: [
                                        {
                                            jsonLogic: {
                                                cat: [
                                                    'Current value: ',
                                                    { var: 'state' },
                                                ]
                                            },
                                        },
                                    ],
                                },
                            },
                        },
                        { // <button onClick={() => dispatch('increment')}>+1</button>
                            name: 'button',
                            options: {
                                callbacks: {
                                    onClick: {
                                        'fn': [
                                            { var: 'dispatch' },
                                            'increment'
                                        ],
                                    },
                                },
                                configuration: {
                                    children: ['+1'],
                                },
                            },
                        },
                        { // <button onClick={() => dispatch('decrement')}>-1</button>
                            name: 'button',
                            options: {
                                callbacks: {
                                    onClick: {
                                        'fn': [
                                            { var: 'dispatch' },
                                            'decrement',
                                        ],
                                    },
                                },
                                configuration: {
                                    children: ['-1'],
                                },
                            },
                        },
                        { // <button onClick={() => dispatch('reset')}>reset</button>
                            name: 'button',
                            options: {
                                callbacks: {
                                    onClick: [
                                        {
                                            'fn': [
                                                { var: 'dispatch' },
                                                'reset',
                                            ],
                                        }
                                    ],
                                },
                                configuration: {
                                    children: ['Reset'],
                                },
                            },
                        }
                    ],
                },
            }}
        />
    );

    expect(children).toMatchSnapshot();

    fireEvent.click(screen.getByText('+1'));
    await waitFor(() => expect(screen.getByTestId('current').innerHTML).toBe('Current value: 1'));
});
