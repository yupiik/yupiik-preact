const esbuild = require('esbuild');
const path = require('path');
const http = require('node:http');


const preactCompatPlugin = {
    name: 'preact-react-alias',

    setup(build) {
        const preact = path.join(process.cwd(), '..', '..', 'node_modules', 'preact', 'compat', 'dist', 'compat.module.js');
        const preactRuntime = path.join(process.cwd(), '../../node_modules/preact/jsx-runtime/dist/jsxRuntime.module.js');
        build.onResolve({ filter: /^(react-dom|react)$/ }, () => ({ path: preact }));
        build.onResolve({ filter: /^react\/jsx-runtime$/ }, () => ({ path: preactRuntime }));
    }
};


const baseConf = {
    loader: { '.js': 'jsx' },
    entryPoints: ['./src/index.js'],
    plugins: [],
    format: 'esm',
    bundle: true,
    minify: !process.env.SKIP_MINIFY,
    sourcemap: true,
    metafile: true,
    legalComments: 'none',
    logLevel: 'info',
    target: ['chrome58', 'firefox57', 'safari11'],
    outdir: 'dist',
    jsxFactory: 'h',
    jsxFragment: 'Fragment',
    external: [
        '@ant-design/icons',
        '@yupiik/dynamic',
        'antd',
        'json-logic-js',
        'preact',
        'react-bootstrap',
        'react-feather',
    ],
    define: {
        'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'production'),
        global: 'window',
    },
    // we don't use it since we don't want to bundle shim.js by default, it is just an utility consumers can use
    // inject: ['./src/esbuild/shim.js'],
};

const build = async ({ conf, analyze } = { conf: false, analyze: true }) => {
    const result = await esbuild.build(conf || baseConf);
    if (analyze) {
        const analyze = await esbuild.analyzeMetafile(result.metafile);
        console.log(`\nBundle:\n${analyze}`);
    }
};

const prepareWithCompat = ({
    conf,
    analyze,
    mergeConfs,
}) => {
    const configuration = mergeConfs ? { ...baseConf, ...conf } : (conf || baseConf);
    return {
        analyze,
        conf: {
            ...configuration,
            plugins: [
                ...(configuration.plugins || []),
                preactCompatPlugin,
            ],
        },
    };
};

const buildWithCompat = opts => build(prepareWithCompat(opts));
const serveWithCompat = async opts => {
    const ctx = await esbuild.context(prepareWithCompat(opts).conf);
    await ctx.watch();
    const { host, port } = await ctx.serve(opts.serve);

    const proxyPort = +(process.env.DEV_SERVER_PORT || '3000');

    const jsonRpcMocks = (process.env.DEV_JSONRPC_MOCK && require(process.env.DEV_JSONRPC_MOCK)) || function () {
        return {
            jsonrpc: '2.0',
            error: {
                code: -32601,
                message: 'unknown method',
            },
        };
    };
    http.createServer((req, res) => {
        const { method, url } = req;

        if (method === 'POST' && '/jsonrpc' === url) {
            let buffer = '';
            req.on('data', chunk => buffer += chunk);
            req.on('end', () => {
                try {
                    const data = JSON.parse(buffer);

                    res.setHeader('content-type', 'application/json');
                    res.writeHead(200);
                    if (Array.isArray(data)) {
                        res.end(data.map(it => JSON.stringify(jsonRpcMocks(it), null, 2)));
                    } else {
                        res.end(JSON.stringify(jsonRpcMocks(data), null, 2));
                    }
                } catch (e) {
                    console.error(e, `'${buffer.toString()}'`);
                    throw e;
                }
            });
            return;
        }

        const proxyReq = http.request(
            {
                hostname: host,
                port,
                path: req.url.indexOf('.') > 1 ? req.url : '/index.html',
                method: req.method,
                headers: req.headers,
            },
            proxyRes => {
                if (proxyRes.statusCode === 404) {
                    res.writeHead(404, { 'Content-Type': 'text/html' })
                    res.end('<h1>404 page</h1>')
                    return
                }

                res.writeHead(proxyRes.statusCode, proxyRes.headers)
                proxyRes.pipe(res, { end: true })
            });
        req.pipe(proxyReq, { end: true })
    }).listen(proxyPort, 'localhost', () => console.log(`Started server on http://localhost:${proxyPort}`));
};

module.exports = {
    esbuild,
    baseConf,
    preactCompatPlugin,

    build,
    buildWithCompat,
    serveWithCompat,
};
