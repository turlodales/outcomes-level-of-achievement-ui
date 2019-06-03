/* eslint-disable no-console */
/*
 * Builds lang data from JSON files into javascript
 */
const
	fs = require('fs'),
	yargs = require('yargs');

const args = yargs.usage('USAGE: $0 [options]\n\nBuilds lang data from JSON files into javascript.')
	.strict(true)
	.option('config', {
		alias: 'c',
		describe: 'Config file path',
		required: true,
		requiresArg: true
	}).argv;

const configFile = args.config;

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

function camelCase(str) {
	const orig = str.toLowerCase();
	let output = '';
	let newWord = false;

	for (let i = 0; i < orig.length; i++) {
		const char = orig.charAt(i);

		if (!char.match(/[a-z]/i)) {
			if (output.length > 0) {
				newWord = true;
			}
			continue;
		}

		output += newWord ? char.toUpperCase() : char;
		newWord = false;
	}

	return output;
}

function pascalCase(str) {
	const camel = camelCase(str);
	return camel.charAt(0).toUpperCase() + camel.slice(1);
}

const templatePath = config.buildTemplateFile;
if (!fs.existsSync(templatePath)) {
	throw new Error(`Template file does not exist! ${templatePath}`);
}

let templateContents = null;
try {
	templateContents = fs.readFileSync(templatePath).toString();
} catch (e) {
	throw new Error(`Unable to read template file! ${e}`);
}

config.langNames.forEach(langName => {
	const langPath = getLangFilePath(langName);

	if (!fs.existsSync(langPath)) {
		console.log(`Lang file does not exist: ${langPath}`);
		return;
	}

	let langJson = null;
	try {
		const langContents = fs.readFileSync(langPath);
		langJson = JSON.parse(langContents);
	} catch (e) {
		let msg = null;
		if (e instanceof SyntaxError) {
			msg = 'Lang file is not valid JSON';
		} else {
			msg = 'Unable to read lang file';
		}

		console.log(`${msg}: ${langPath}`);
	}

	const replacements = [
		{
			regex: /{{langPascal}}/g,
			value: pascalCase(langName)
		},
		{
			regex: /{{langCamel}}/g,
			value: camelCase(langName)
		},
		{
			regex: /{{langData}}/g,
			value: JSON.stringify(langJson)
		}
	];

	let built = templateContents;
	replacements.forEach(({ regex, value }) => {
		built = built.replace(regex, value);
	});

	fs.writeFileSync(`${config.buildDir}/${langName}.js`, built);
});
