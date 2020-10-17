#!/bin/bash

for id in $(./non-mainnet-subgraphs.ts | cut -d, -f2); do
  echo "Ignore $id"
  graph indexer rules never $id
done