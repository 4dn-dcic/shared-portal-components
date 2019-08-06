

## Intro

This is a repo of various code/components which is meant to be re-used between CGAP and 4DN portals.

## Setup

If you plan on importing this repo into another without making changes to it, then simply run `npm install` from parent repo which contains this repo as a regular NPM dependency and it will install it as usual in your project's `node_modules` directory. Since the repo is not yet published to NPM, it must be defined in dependencies to reference GitHub release tags, e.g. `"@hms-dbmi-bgm/shared-portal-components": "github:4dn-dcic/shared-portal-components#0.0.1.1",`

For both usage & development installation use cases, you may need to make sure your `webpack.config.js` file in the parent repo is set to transpile this module's ES6/JSX code into raw JS along with the parent code as we currently do not build/transpile the JSX code ourselves in this repo for ease of development as the module/package is for internal usage. See the [4DN Portal's Webpack Config File](https://github.com/4dn-dcic/fourfront/blob/master/webpack.config.js#L40) for an example of this.

### Setup in order to develop `shared-portal-components` further

First, if not already the case, clone both parent/portal repo as well as this repo into their own separate working directories on your local machine.

From child component (shared-portal-components working dir):
- `npm install`

From parent component (CGAP portal or 4DN portal working dir):
- `npm install`

From child component:
- `npm link` (if not globally linked already)
- `node ./setup-npm-links-for-local-development.js <path_to_parent_repo>`
   e.g. _`<path_to_parent_repo>`_ might be `../../cgap_portal`.

From parent component:
- `npm link @hms-dbmi-bgm/shared-portal-components`
- followed by your build/dev script, e.g. `npm run dev-quick`, `npm run build`, etc.


