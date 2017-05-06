const path = require('path');
const fs = require('fs');
const {rollup} = require('rollup');
const nodeResolve = require('rollup-plugin-node-resolve');
const commonjs = require('rollup-plugin-commonjs');
const builtins = require('rollup-plugin-node-builtins');
const babel = require('babel-core');
const promisify = require('j1/promisify');
const readFile = promisify(fs.readFile, fs);


function transpile() {
	return {
		transformBundle: function (code) {
			const {code: babeledCode} = babel.transform(code, {presets: ['env']});
			const wrappedCode = `(function(){\n${babeledCode}\n}())`;
			return wrappedCode;
		}
	};
}

function json() {
	const entries = [];
	const sep = 'json-proxy:';
	/* eslint-disable no-control-regex */
	const CONTROL_CHARACTERS = /[\x00-\x1F\x7F-\x9F]/g;
	/* eslint-enable no-control-regex */
	function normalize(importee) {
		return importee
		.split('commonjs-proxy:').join('')
		.replace(CONTROL_CHARACTERS, '');
	}
	async function loadJSON({importee, importer}) {
		const filePath = path.join(path.dirname(importer), importee);
		const data = JSON.parse(await readFile(filePath, 'utf8'));
		const code = `export default ${JSON.stringify(data)};`;
		return code;
	}
	return {
		resolveId: (importee, importer) => {
			if (!(/\.json/).test(importee)) {
				return;
			}
			const id = `${importer}${sep}${importee}`;
			if (!entries.find(([codeId]) => {
				return codeId === id;
			})) {
				entries.push({
					id,
					importee: normalize(importee),
					importer
				});
			}
			return id;
		},
		load: (id) => {
			const entry = entries.find(({id: codeId}) => {
				return codeId === id;
			});
			if (!entry) {
				return;
			}
			let {code} = entry;
			if (!code) {
				code = loadJSON(entry);
				entry.code = code;
			}
			return code;
		}
	};
}

async function buildJS({entry, dest}) {
	const bundle = await rollup({
		entry,
		plugins: [
			nodeResolve(),
			json(),
			builtins(),
			commonjs(),
			transpile()
		]
	});
	return bundle.write({
		format: 'cjs',
		dest
	});
}

module.exports = buildJS;
