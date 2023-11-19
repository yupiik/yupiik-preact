import { cloneElement } from "preact";
import { useJsonRpc } from "@yupiik/use-json-rpc";

export const JsonRpcDataLoader = ({
    hookProps,
    wrapperConfiguration,
    children,
}) => {
    const [loading, error, data] = useJsonRpc(hookProps);

    const Wrapper = (wrapperConfiguration || {}).name || 'div';
    const props = { loading, error, data };
    return (
        <Wrapper {...((wrapperConfiguration || {}).props || {})}>
            {(children || []).map(child => cloneElement(child, props))}
        </Wrapper>
    );
};
