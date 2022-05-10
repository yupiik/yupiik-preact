const esbuild = require('esbuild');

const dev = process.env.NODE_ENV === 'dev';

const copyUtilities = () => {
    const fs = require('fs');
    if (!fs.existsSync('dist/esbuild')) {
        fs.mkdirSync('dist/esbuild');
    }
    fs.copyFileSync('src/esbuild/shim.js', 'dist/esbuild/shim.js');
};

(async function build() {
    const result = await esbuild.build({
        loader: { '.js': 'jsx' },
        entryPoints: [
            './src/index.js'
        ],
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
        plugins: [],
        // we just want to bundle this very lib and not dependencies
        external: ['preact'],
        // we don't use it since we don't want to bundle shim.js by default, it is just an utility consumers can use
        // inject: ['./src/esbuild/shim.js'],
    });

    copyUtilities();

    const analyze = await esbuild.analyzeMetafile(result.metafile);
    console.log(`\nBundle:\n${analyze}`);
})();
