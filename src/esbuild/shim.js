// We force the import of this in all components
// because IDE tends to remove it (not directly used in code but used through JSX).
// Trick is to use esbuild to force the inject at the top of the code.
//
// in esbuild simply pass this script in inject array: { inject: ['./esbuild/shim.js'] }

import { h, Fragment } from 'preact';
export { h, Fragment };
