# security-audit-nodejs

A collection of security tests for your Node.js project.

## Installation

```sh
npm install security-audit-nodejs --save-dev
```

## Usage

This module provides no API. It provides a script for you to include in your `package.json` file, called simply
`security-audit-nodejs`. You can add it to your `"test"` script for example:

```json
{
  "scripts": {
    "test": "eslint . && security-audit-nodejs"
  }
}
```

Every time you run `npm test` now, it will run a wide array of security tests on your project. The tests may take a
while, so it can be beneficial to put it in a separate script and run it as part of your CI setup:

```json
{
  "scripts": {
    "test:security": "security-audit-nodejs"
  }
}
```

```sh
npm run test:security
```

If any vulnerabilities are found, the program will exit with a non-zero exit code.

### Arguments

You can pass the following to `security-audit-nodejs`:

- `--severity [low|medium|high|critical]` Only vulnerabilities of this level or higher will be shown.

### Ignoring vulnerabilities

It can happen that a module you use has a vulnerability, but the way you use it guarantees you that that vulnerability
will not expose itself. When you're really sure about this, you can add the vulnerability ID to
`.security-audit-nodejs-ignore` in your project-folder. Every vulnerability is assigned a unique ID, that is shown in
the output of the test you run. Every ID you mention in the ignore file must be on a new line. You may add comments to
the line as follows: `some:vulnerability-id   # this is a comment`. This way you can document *why* you explicitly chose
to ignore a particular vulnerability.

## License

MIT
