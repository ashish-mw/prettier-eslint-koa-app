# Test koa app for eslint + prettier setup

This project uses
- https://www.robinwieruch.de/prettier-eslint
- https://www.robinwieruch.de/how-to-use-prettier-vscode
- https://mherman.org/blog/swagger-and-nodejs/ - for swagger

## Steps

- Install globally `$ npm install -g prettier eslint`
- Install `eslint` and `prettier` extensions for vscode/atom/`$EDITOR_OF_CHOICE`
- In our project run, `$ npm install --save-dev eslint-config-prettier eslint-plugin-prettier`. Make sure there's a `package.json` file.
- Files `.eslintrc.json`, `.eslintignore` and `.prettierrc` needs to be added.
- `npx install-peerdeps --dev eslint-config-koa`
- Open vscode's `settings.json` file and add these in.
    ```json
    ...
    // Set the default
    "editor.formatOnSave": false,
    // Enable per-language
    "[javascript]": {
        "editor.formatOnSave": true
    }
    ...
    ```

## Installing packages globally
When installing packages like `prettier` globally, I prefer doing this without `sudo`.

**Read:** https://docs.npmjs.com/resolving-eacces-permissions-errors-when-installing-packages-globally

**TLDR:**
```
$ mkdir ~/.npm-global
$ npm config set prefix '~/.npm-global'
```
A file called `.npmrc` will be created. This file configures `npm`. To check the things 
we can change,
```
$ npm config list -l
```

Add the following lines to `~/.profile`. Logout!
```
NPM_CONFIG_PREFIX=~/.npm-global
export PATH=$NPM_CONFIG_PREFIX/bin:$PATH
```

## A word on `.gitignore` + `package-lock.json` files

**Read:** https://stackoverflow.com/questions/48524417/should-the-package-lock-json-file-be-added-to-gitignore

**TLDR:** use `npm ci` instead of `npm install` when installing packages for deployment.

This project uses the same `.gitignore` file as [pd-care](https://github.com/mindwaveventures/pd-care/blob/staging/server/user/.gitignore).

## Running the test app

### The app
```
npm install
npm run dev
```

- Visit http://localhost:5000 for swagger ui.

### The endpoints

[![Run in Postman](https://run.pstmn.io/button.svg)](https://app.getpostman.com/run-collection/d27489bcb249ce5ec595)
