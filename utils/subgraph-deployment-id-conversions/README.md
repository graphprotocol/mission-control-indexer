# Convert Subgraph Deployment IDs

This utility converts a Subgraph Deployment IDs between available encodings.  
It takes a Subgraph deployment ID input and returns a display of all available
encodings for it: bytes32 (`0x...`) and base58 (`Qm...`).

## Install dependencies

```
yarn
```

## Display All Encodings for a Subgraph Deployment ID

```
yarn convert <ID>
```

_Note: The input encoding type is detected automatically by the utility_ 
