import { h } from 'preact';
import { render } from '@testing-library/preact';
import { expect } from 'expect';
import { Dynamic } from './Dynamic';


const Container = ({ children, registry }) => (
    <div className="container">
        {children
            .map(options => (
                <Dynamic
                    registry={registry}
                    options={options}
                />))}
    </div>
);
const Greeting = ({ name }) => (<h1>Hello {name}!</h1>);
const Text = ({ value }) => (<div>{value}</div>);

const registry = {
    container: Container,
    greeting: Greeting,
    text: Text,
};

test('Dynamic should render', () => {
    const { container: { children } } = render(
        <Dynamic
            registry={registry}
            options={{
                name: 'greeting',
                options: {
                    name: 'Tests',
                },
            }}
        />
    );
    expect(children).toMatchSnapshot();
});

test('Dynamic should render complex trees', () => {
    const { container: { children } } = render(
        <Dynamic
            registry={registry}
            options={{
                name: 'container',
                options: {
                    children: [
                        {
                            name: 'greeting',
                            options: {
                                name: 'Yupiik',
                            },
                        },
                        {
                            name: 'text',
                            options: {
                                value: 'Some content.'
                            },
                        },
                    ],
                },
            }}
        />
    );
    expect(children).toMatchSnapshot();
});

test('Dynamic should render component not found', () => {
    expect(
        render(
            <Dynamic
                registry={registry}
                options={{ name: 'missing' }}
            />
        ).container.children
    ).toMatchSnapshot();
});
