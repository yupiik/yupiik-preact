import { h } from 'preact';

const getErrorComponent = (registry) => registry.error || (({ children }) => (<div className="error">{children})</div>));

const NoComponentFound = (registry, name) => {
    const Error = getErrorComponent(registry);
    return (
        <Error>No component {name} found!</Error>
    );
}

/**
 * A generic component using a component registry to render the request (config).
 * @param {object} registry the component registry (an object where the key is component name).
 * @param {object} config the underlying component configuration (name and options).
 * @returns a preact component which looks up in the registry the actual component to use for rendering.
 */
export const Dynamic = ({
    registry,
    options: { name, options },
}) => {
    const internalRegistry = registry; // todo: support optional context if registry is false?

    if (!name) {
        return (<NoComponentFound registry={internalRegistry} name={name} />);
    }

    const component = registry[name];
    if (!component) {
        return (<NoComponentFound registry={internalRegistry} name={name} />);
    }

    const { children, ...rest } = options || {};
    return h(
        component,
        {
            registry: internalRegistry,
            ...(rest || {}),
        },
        children || []);
};
