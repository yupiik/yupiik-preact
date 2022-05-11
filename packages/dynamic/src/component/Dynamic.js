import { createContext, h } from 'preact';
import { useContext } from 'preact/hooks';

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
    const contextualRegistry = useContext(ComponentRegistryContext);
    const internalRegistry = registry || contextualRegistry || {};

    if (!name) {
        return (<NoComponentFound registry={internalRegistry} name={name} />);
    }

    const Component = internalRegistry[name];
    if (!Component) {
        return (<NoComponentFound registry={internalRegistry} name={name} />);
    }

    const { children, ...rest } = options || {};
    return (
        <Component
            registry={internalRegistry}
            {...(rest || {})}>
            {children || []}
        </Component >
    );
};

export const ComponentRegistryContext = createContext();
