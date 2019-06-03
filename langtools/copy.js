/*
 * Copies new lang terms from the source file to all other lang term files
 */
const
	fs = require('fs'),
	yargs = require('yargs');

const args = yargs.usage('USAGE: $0 [options]\n\nCopies new lang terms from the source file to all other lang term files. Default behaviour will only copy new terms over, leaving existing translations intact. If an existing term is modified, you must run with the `--all` flag to ensure all terms are overwritten; however all translations will need to be redone.')
	.strict(true)
	.option('config', {
		alias: 'c',
		describe: 'Config file path',
		required: true,
		requiresArg: true
	}).option('all', {
		alias: [ 'a', 'copy-all' ],
		describe: 'If this flag is set, the entirety of all lang term files will be overwritten with the contents of the source lang file; deleting any existing translations.',
		boolean: true,
		default: false
	}).argv;

const configFile = args.config;
const copyAll = args.all;

let config = null;
try {
	config = JSON.parse(fs.readFileSync(configFile));
} catch (e) {
	let msg = null;
	if (e instanceof SyntaxError) {
		msg = 'Config file is not valid JSON!';
	} else {
		msg = 'Unable to open config file!';
	}

	throw new Error(`${msg} ${e}`);
}

function getLangFilePath(langName) {
	return `${config.langDir}/${langName}.json`;
}

const sourcePath = getLangFilePath(config.copySourceLang);
if (!fs.existsSync(sourcePath)) {
	throw new Error(`Source file does not exist! ${sourcePath}`);
}

let sourceJson = null;
try {
	const sourceContents = fs.readFileSync(sourcePath);
	sourceJson = JSON.parse(sourceContents);
} catch (e) {
	let msg = null;
	if (e instanceof SyntaxError) {
		msg = 'Source file is not valid JSON!';
	} else {
		msg = 'Unable to open source file!';
	}

	throw new Error(`${msg} ${e}`);
}

config.langNames.forEach(langName => {
	if (langName === config.copySourceLang) {
		return;
	}

	const destPath = getLangFilePath(langName);

	let outputJson = {};
	if (copyAll || !fs.existsSync(destPath)) {
		Object.assign(outputJson, sourceJson);
	} else {
		try {
			const destContents = fs.readFileSync(destPath);
			outputJson = JSON.parse(destContents);
		} catch (e) {
			let msg = null;
			if (e instanceof SyntaxError) {
				msg = 'Lang file is not valid JSON!';
			} else {
				msg = 'Unable to open lang file!';
			}

			throw new Error(`${msg} ${e}`);
		}

		// Copy new values over only
		Object.keys(sourceJson).forEach(key => {
			if (!outputJson[key]) {
				outputJson[key] = sourceJson[key];
			}
		});
	}

	fs.writeFileSync(destPath, JSON.stringify(outputJson, null, 4) + '\n');
});
