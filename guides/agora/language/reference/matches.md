# Matches

A _Match_ describes a set of GraphQL queries that it selects for. _Matches_ come in 2 forms: _DefaultMatch_ and _QueryMatch_.

## Default Match

A _DefaultMatch_ will select for all GraphQL Queries.

```
# This default match
default

# Will select this query
{ tokens pairs }

# And all other queries as well
{ unexpected(value_in: [2]) { id field } }
```

## Query Match

A _QueryMatch_ is specified by the tag `query` followed a `Query shorthand` as defined in the [GraphQL Spec](https://spec.graphql.org/June2018/#sec-Language.Operations)

```
query { tokens }
```

In order for a _QueryMatch_ to select a query, the entire `SelectionSet` of the _QueryMatch_ must have an exact match within the query.

```
# Given this Query Match:
query { tokens mints }

# This query is selected:
{ mints tokens }

# And this query is selected:
{ tokens mints pairs }

# But this query is NOT selected
{ tokens }
```

It is also possible to match arguments in a query.

```
# Given this Query Match:
query { tokens(first: 100) }

# This query will be selected:
{ tokens(first: 100) { id } }

# But this query will not be selected:
{ tokens(first: 200) { id } }

# And neither will this one:
{ tokens { id } }
```

It is possible to match any GraphQL value in an argument, including lists, objects, strings, etc.

### Captures

The above examples matching query arguments match only very narrow sets of queries, since the arguments supplied must match exactly.

Captures allow you to select for any value in the named argument position and are specified using the GraphQL variable syntax.

```
# This query match:
query { tokens(first: $first, skip: $skip) }

# Will select this query:
query { tokens(first: 50, skip: 2000) { id } }

# And 'capture' the values
{ "first": 50, "skip": 2000 }
```

Once a value is captured, it can be used in any _Expression_ in the current statement. This includes the _BooleanExpression_ of the optional _WhenClause_, as well as the _RationalExpression_ for the cost.


### Query Normalization

An input query is treated as though it were in a normalized form with all of it's fragments expanded and all of it's variables substituted.

**Examples:**
```
# This query:
query pairs($skip: Int!) {
  pairs(skip: $skip) { ...fields }
}
fragment fields on Name {
   id, reserveUSD
}
# With these variables:
{ "skip": 1 }

# Is treated the same as this query
{ pairs(skip: 1) { id reserveUSD } }
```


## See also
* [Table of Contents](./toc.md)
* [Expressions](./expressions.md)
* [When Clauses](./when-clauses.md)
* [Predicates](./predicates.md)
* [Substitutions](./substitutions.md)