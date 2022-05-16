const builder = require('../../esbuild.config.base');

const copyUtilities = () => {
    const fs = require('fs');
    if (!fs.existsSync('dist/esbuild')) {
        fs.mkdirSync('dist/esbuild');
    }
    fs.copyFileSync('src/esbuild/shim.js', 'dist/esbuild/shim.js');
};

(async function build() {
    await builder.build();
    copyUtilities();
})();
