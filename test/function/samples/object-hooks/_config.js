const assert = require('assert');
const fs = require('fs');
const path = require('path');
const acorn = require('acorn');

const ID_MAIN = path.join(__dirname, 'main.js');
const code = fs.readFileSync(ID_MAIN, 'utf8');

const hooks = [
	'buildEnd',
	'buildStart',
	'generateBundle',
	'load',
	'moduleParsed',
	'options',
	'renderChunk',
	'renderStart',
	'resolveDynamicImport',
	'resolveId',
	'shouldTransformCachedModule',
	'transform'
];

const plugin = { name: 'test' };
const calledHooks = new Set();

for (const hook of hooks) {
	plugin[hook] = {
		handle() {
			calledHooks.add(hook);
		}
	};
}

module.exports = {
	description: 'supports using objects as hooks',
	options: {
		plugins: [plugin],
		cache: {
			modules: [
				{
					id: ID_MAIN,
					ast: acorn.parse(code, {
						ecmaVersion: 2020,
						sourceType: 'module'
					}),
					code,
					dependencies: [],
					dynamicDependencies: [],
					originalCode: code,
					resolvedIds: {},
					sourcemapChain: [],
					transformDependencies: []
				}
			]
		}
	},
	exports() {
		assert.deepStrictEqual(
			[...calledHooks],
			[
				'options',
				'buildStart',
				'resolveId',
				'load',
				'shouldTransformCachedModule',
				'resolveDynamicImport',
				'moduleParsed',
				'transform',
				'buildEnd',
				'renderStart',
				'renderChunk',
				'generateBundle'
			]
		);
	}
};
