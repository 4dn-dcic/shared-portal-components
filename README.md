

# Introduction

This is a repo of various code/components which is meant to be re-used between CGAP and 4DN portals.

## Setup

If you plan on importing this repo into another without making changes to it, then simply run `npm install` from parent repo which contains this repo as a regular NPM dependency and it will install it as usual in your project's `node_modules` directory. Since the repo is not yet published to NPM, it must be defined in dependencies to reference GitHub release tags, e.g. `"@hms-dbmi-bgm/shared-portal-components": "github:4dn-dcic/shared-portal-components#0.0.1.1",`

For both usage & development installation use cases, you may need to make sure your `webpack.config.js` file in the parent repo is set to transpile this module's ES6/JSX code into raw JS along with the parent code as we currently do not build/transpile the JSX code ourselves in this repo for ease of development as the module/package is for internal usage. See the [4DN Portal's Webpack Config File](https://github.com/4dn-dcic/fourfront/blob/master/webpack.config.js#L40) for an example of this.

### Setup in order to develop `shared-portal-components` further

First, if not already the case, clone both parent/portal repo as well as this repo into their own separate working directories on your local machine.

1. From **child** component (shared-portal-components working dir):
   - `npm install`

2. From **parent** component (CGAP portal or 4DN portal working dir):
   - `npm install`

3. From **child** component:
   - `npm link` (if not globally linked already)
   - `node ./setup-npm-links-for-local-development.js <path_to_parent_repo>`
       - e.g. _`<path_to_parent_repo>`_ might be `../../cgap_portal`.

4. From **parent** component:
   - `npm link @hms-dbmi-bgm/shared-portal-components`
   - followed by your build/dev script, e.g. `npm run dev-quick`, `npm run build`, etc.

### ESM (ECMAScript Module) Compilation of shared-portal-components

For development and testing purposes, compilation of this repository should be performed by parent repo such as cgap-portal or fourfront. The built /es/ directory is excluded from git repository by default. For production, when development of /src/ is complete, then whenever master branch is pushed to GitHub, it is built by a GitHub Action and the output built files are pushed to the `build` directory, from which tagged releases can be made.

For development purposes, the `npm run dev-quick` command in each respective portal repo will determine if `shared-portal-components` is sym-linked, and if so, will compile the "es" directory of shared-portal-components' working directory. Contents from "es" directory are then imported and used in portal(s). Alternatively, if not running `npm run dev-quick`, can build from working dir of `shared-portal-components` using command `npm run build`.

#### Future
If we ever decide to publish this on NPM (maybe as private org/package), we can add ~~`/es/` stuff to `.gitignore` and~~ `/src/` stuff to `.npmignore` to no longer clutter our PRs as much.

# Important Notes

## Updating (any) NPM dependencies
Updating (ordinary) dependencies either in this `shared-portal-components` repo or in a parent/portal repo, assuming you have or have had the shared-portal-components `npm link`ed, requires a few additional steps in addition to uptading package.json and running `npm install`:

Whenever update a package dependency in package.json in any portal, you **must** also run `npm install` and commit the resulting `package-lock.json`. If have any modules `link`ed, then you must run `npm install` **twice**, possibly also followed by `npm dedupe`. This is because NPM will reconcile dependencies from _linked_ locations and install over any linked modules/locations. The first time is run, it will assume some dependency requirements are falsely satisfied due to the sym-link(s). The second time is run, it will run with all local (non-sym-linked) modules and correctly concile dependencies. `npm dedupe` does what it sounds like and remove any redundant packages which might have been installed.

## Version Releases

We currently hold this `shared-portal-components` (SPC) only in GitHub and not on NPM. We might publish in NPM in the future, but this a big big maybe. Once have reviewed & merged a branch or commit, to make changes appear in non-sym-linked local or in production, will need to release a new version of SPC repository using GitHub Releases. Then will need to `npm install` the new version in both 4DN and CGAP portals (depending on priority, if changes needed in portal repo, etc.) according to the above "Updating (any) NPM dependencies" notes to test ordinary/production installation/usage of SPC. Once package.json & package-lock.json have been updated accordingly and committed, changes will show up in production deployments.
