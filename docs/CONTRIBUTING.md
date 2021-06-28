# Contributing

When contributing to this repository, please first discuss the change you wish to make via issue,
email, or any other method with the owners of this repository before making a change.

Please note we have a [code of conduct](CODE_OF_CONDUCT.md), please follow it in all your interactions with the project.

## Pull Request Process

For changes that address core functionality or would require breaking changes (e.g. a major release), it's best to open an Issue to discuss your proposal first. This is not required but can save time creating and reviewing changes.

In general, we follow the ["fork-and-pull" Git workflow](https://github.com/susam/gitpr)

1. Fork the repository to your own Github account
1. Clone the project to your machine
1. Create a branch locally with a succinct but descriptive name
1. Make changes and commit to the branch
   1. Following any formatting and testing guidelines specific to this repo
   1. Run `yarn run pretty:fix` (if changes are made to react-client)
   1. Run `yarn run lint:fix` and fix all errors and warnings possible thrown. Mention the ones that aren't fixed.
   1. Increase the version numbers in relevant files (e.g. package.json) to the new version that this Pull Request would represent. The versioning scheme we use is [SemVer](http://semver.org/).
1. Push changes to your fork
1. Open a PR in our repository and follow the PR template so that we can efficiently review the changes.
