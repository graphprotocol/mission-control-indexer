# NPM Registry Access

For the testnet, we operate a private NPM registry at
https://testnet.thegraph.com/npm-registry/. All indexer components apart from Graph Node and Agora are published here, so make sure you have this set up correctly.

```sh
npm set registry https://testnet.thegraph.com/npm-registry/
npm login
```

If you build your own Docker images, you will have to obtain the NPM auth
token from `~/.npmrc` and store it in an environment variable:

```sh
$ cat ~/.npmrc | grep authToken
//testnet.thegraph.com/:_authToken=<NPM_TOKEN>
```

Use the `<NPM_TOKEN>` part as the `NPM_TOKEN=...` that you pass to `docker build`.