# d2l-outcomes-level-of-achievements-ui

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
# eslint and messageformat-validator
npm run format

# eslint only
npm run format:eslint

# messageformat-validator only
npm run format:lang
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

### Adding/Updating Lang Term

1. Add the new term to `/lang/en.js`.
2. Run `npm run format`, this will add any new terms to all other languages and
   remove any terms not in `/lang/en.js` from all other languages.
3. Manually add french translations to `/lang/fr.js`.
   - Google translate. This is in case auto-translations don't run in time, if
     we don't have french, we can get fined.

## Versioning & Releasing

> TL;DR: Commits prefixed with `fix:` and `feat:` will trigger patch and minor releases when merged to `master`. Read on for more details...
The [sematic-release GitHub Action](https://github.com/BrightspaceUI/actions/tree/master/semantic-release) is called from the `release.yml` GitHub Action workflow to handle version changes and releasing.

### Version Changes

All version changes should obey [semantic versioning](https://semver.org/) rules:

1. **MAJOR** version when you make incompatible API changes,
2. **MINOR** version when you add functionality in a backwards compatible manner, and
3. **PATCH** version when you make backwards compatible bug fixes.

The next version number will be determined from the commit messages since the previous release. Our semantic-release configuration uses the [Angular convention](https://github.com/conventional-changelog/conventional-changelog/tree/master/packages/conventional-changelog-angular) when analyzing commits:

- Commits which are prefixed with `fix:` or `perf:` will trigger a `patch` release. Example: `fix: validate input before using`
- Commits which are prefixed with `feat:` will trigger a `minor` release. Example: `feat: add toggle() method`
- To trigger a MAJOR release, include `BREAKING CHANGE:` with a space or two newlines in the footer of the commit message
- Other suggested prefixes which will **NOT** trigger a release: `build:`, `ci:`, `docs:`, `style:`, `refactor:` and `test:`. Example: `docs: adding README for new component`

To revert a change, add the `revert:` prefix to the original commit message. This will cause the reverted change to be omitted from the release notes. Example: `revert: fix: validate input before using`.

### Releases

When a release is triggered, it will:

- Update the version in `package.json`
- Tag the commit
- Create a GitHub release (including release notes)

### Releasing from Maintenance Branches

Occasionally you'll want to backport a feature or bug fix to an older release. `semantic-release` refers to these as [maintenance branches](https://semantic-release.gitbook.io/semantic-release/usage/workflow-configuration#maintenance-branches).

Maintenance branch names should be of the form: `+([0-9])?(.{+([0-9]),x}).x`.

Regular expressions are complicated, but this essentially means branch names should look like:

- `1.15.x` for patch releases on top of the `1.15` release (after version `1.16` exists)
- `2.x` for feature releases on top of the `2` release (after version `3` exists)
