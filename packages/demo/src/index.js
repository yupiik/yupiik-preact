import { h } from 'preact';
import { FromConfiguratonHoc, simpleRegistry, nestedRegistry } from "@yupiik/dynamic";
import { PreactRouterRegistry } from "@yupiik/preact-router-registry";
import { render } from "preact";
import { useEffect, useState } from "preact/hooks";
import * as reactBootstrap from "react-bootstrap";
import * as reactFeather from "react-feather";
import { customRegistry } from './registry';
import './app.css';

const registry = {
    ...simpleRegistry(reactFeather),
    ...nestedRegistry(reactBootstrap),
    ...PreactRouterRegistry,
    ...customRegistry,
};

function App() {
    // todo: useJsonRpc once the mock setup uses express?
    const [opts, setOpts] = useState();
    useEffect(() => {
        fetch('app.json')
            .then(res => res.json())
            .then(res => setOpts(res));
    }, []);

    if (!opts) {
        return (<div>Loading...</div>);
    }

    return (<FromConfiguratonHoc registry={registry} options={opts} />);
}

render(<App />, document.getElementById('app'));
