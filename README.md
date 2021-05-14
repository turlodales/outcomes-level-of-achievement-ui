# d2l-outcomes-level-of-achievements-ui

[![CI][CI Badge]][CI Workflows]

## Developing

After cloning the repo, run `npm install` to install dependencies.

### Running the Demos

Start local dev server that hosts the demo pages.

```sh
npm start
```

### Linting

```sh
# eslint and messageformat-validator
npm run lint

# eslint only
npm run lint:eslint

# messageformat-validator only
npm run lint:lang
```

### Formatting

```sh
# eslint
npm run format

# eslint only
npm run format:eslint
```

### Testing

```sh
# lint and unit tests
npm test

# unit tests
npm run test:headless

# debug or run a subset of local unit tests
# then navigate to `http://localhost:9876/debug.html`
npm run test:headless:watch
```

### Versioning & Releasing

Run `npm version --no-git-tag-version [major | minor | patch]` in project
root directory, selecting the appropriate version increase type. This will bump
the version in both `package.json` and `package-lock.json` and leave it in your
working changes. Once checking this in and it being merged to `master` create
a GitHub release matching the version in the `package.json`.

<!-- links -->
[CI Badge]: https://github.com/Brightspace/outcomes-level-of-achievement-ui/workflows/CI/badge.svg?branch=master
[CI Workflows]: https://github.com/Brightspace/outcomes-level-of-achievement-ui/actions?query=workflow%3ACI+branch%3Amaster
