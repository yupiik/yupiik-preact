const esbuild = require('esbuild');
const path = require('path');

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
    bundle: true,
    metafile: true,
    minify: true,
    sourcemap: true,
    legalComments: 'none',
    logLevel: 'info',
    target: ['chrome58', 'firefox57', 'safari11'],
    outdir: 'dist',
    jsxFactory: 'h',
    jsxFragment: 'Fragment',
    // we just want to bundle this very lib and not dependencies
    external: ['preact'],
    // we don't use it since we don't want to bundle shim.js by default, it is just an utility consumers can use
    // inject: ['./src/esbuild/shim.js'],
};

const build = async (
    { conf, analyze } = { conf: false, analyze: true }
) => {
    const result = await esbuild.build(conf || baseConf);
    if (analyze) {
        const analyze = await esbuild.analyzeMetafile(result.metafile);
        console.log(`\nBundle:\n${analyze}`);
    }
};

const buildWithCompat = ({
    conf,
    analyze,
}) => {
    const configuration = conf || baseConf;
    return build({
        analyze,
        conf: {
            ...configuration,
            plugins: [
                ...(configuration.plugins || []),
                preactCompatPlugin,
            ],
        },
    });
};

module.exports = {
    esbuild,
    baseConf,
    preactCompatPlugin,

    build,
    buildWithCompat,
};
