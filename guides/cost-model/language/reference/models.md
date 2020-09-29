# Model

A _Model_ is a sequence of _Statements_ which execute in order.

Before a query is priced by a _Model_, it is broken up into multiple top-level queries. Each top-level query is priced separately, and the results are summed to produce the final price.

```
# This query:
{ tokens($first: 10) { id } transactions { buyer seller } }

# Will be priced as the sum of these two queries:
{ tokens($first: 10) { id } }
{ transactions { buyer seller} }
```

For each top-level query, the first _Statement_ which matches and prices a query determines the price for that query. Subsequent _Statements_ will be ignored. Because of this, it is necessary to order _Statements_ from most to least specific.

If any matching _Statement_ produces an error then the entire query will produce an error. 



## See also
* [Table of Contents](./toc.md)
* [Statements](./statements.md)