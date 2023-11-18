const builder = require('../../esbuild.config.base');

const opts = {
    analyze: false,
    mergeConfs: true,
    conf: {
        external: [],
        outdir: 'public/dist', // for serve to work it must be under the same directory static resources are
        inject: ['@yupiik/dynamic/src/esbuild/shim.js'],
    },
};
if (process.env.NODE_ENV !== 'dev') {
    builder.buildWithCompat(opts);
} else {
    builder.serveWithCompat({ ...opts, serve: { servedir: 'public' } });
}
