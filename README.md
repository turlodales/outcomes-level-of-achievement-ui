# d2l-outcomes-level-of-achievements-ui

[![CI][CI Badge]][CI Workflows]

## Prerequisites

- NPM (Installs with [NodeJS](https://nodejs.org))

## Setup

Run `npm i` in project root directory

## Version Bump

Run `npm version --no-git-tag-version [major | minor | patch]` in project
root directory, selecting the appropriate version increase type. This will bump
the version in both `package.json` and `package-lock.json` and leave it in your
working changes.

## Formatting

To deal with pedantic issues that will not pass linting you can run `npm run
format`. This will run the various linters in fix mode to help get rid of
issues.

## Testing

Simply run `npm test` to run all local tests including linting.

<!-- links -->
[CI Badge]: https://github.com/Brightspace/outcomes-level-of-achievement-ui/workflows/CI/badge.svg?branch=master
[CI Workflows]: https://github.com/Brightspace/outcomes-level-of-achievement-ui/actions?query=workflow%3ACI+branch%3Amaster
