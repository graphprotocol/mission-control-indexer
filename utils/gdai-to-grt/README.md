# GDAI to GRT Converter

## Install dependencies

```
yarn
```

## Run

```sh
$ ./gdai-to-grt.ts
10000000000000000000

$ ../gdai-to-grt.ts --agora
{"GDAI":"10000000000000000000"}
```
or
```
$ yarn gdai-to-grt-wei
10000000000000000000

$ yarn agora
{"GDAI":"10000000000000000000"}
```

## Why?

This allows you to express cost model rules in GDAI. For instance, the
following rule prices all queries as 2 GDAI (expressed as GRT wei) if there
is a variable called `$GDAI`:

```
default => 2 * $GDAI
```