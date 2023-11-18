import { h } from 'preact';
import { simpleComponent } from '@yupiik/dynamic';
import { Link, Router, route } from 'preact-router';

// avoids page reloading
const NavLink = ({ href, children, ...rest }) => (
    <a href={href || ''} {...rest} onClick={e => {
        e.preventDefault();
        route(href || '');
    }}>
        {children || ''}
    </a>);

export const PreactRouterRegistry = {
    Router: simpleComponent(Router),
    Link: simpleComponent(Link),
    NavLink: simpleComponent(NavLink),
};
