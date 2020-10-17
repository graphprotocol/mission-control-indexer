# List/Ignore Non-Mainnet Subgraphs

This utility allows you to list all subgraphs in the network that are
non-mainnet. It also allows you to generate indexing rules to ignore these
subgraphs.

## Install dependencies

```
yarn
```

## List non-mainnet subgraphs

```
yarn non-mainnet-subgraphs
```

## Don't index non-mainnet subgraphs

This will call `graph indexer rules never <id>` for all IDs that are not for
mainnet.

```
yarn ignore-non-mainnet-subgraphs
```