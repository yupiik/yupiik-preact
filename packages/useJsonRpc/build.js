require('esbuild').buildSync({
    loader: { '.js': 'jsx' },
    entryPoints: [
        './src/index.js'
    ],
    bundle: true,
    metafile: false,
    minify: true,
    sourcemap: true,
    legalComments: 'none',
    logLevel: 'info',
    target: ['chrome58', 'firefox57', 'safari11'],
    outdir: 'dist',
    jsxFactory: 'h',
    jsxFragment: 'Fragment',
    external: ['preact'],
});
