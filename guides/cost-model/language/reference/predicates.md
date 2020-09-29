# Predicates

Predicates are used for matching GraphQL queries.

A Predicate is composed of a Match, followed by an optional When Clause.

**Examples:**
```
# A match for a query
query { tokens }

# A match that uses a when clause
query { tokens } when $RATE_LIMITED
```

## See also
* [Table of Contents](./toc.md)
* [Matches](./matches.md)
* [When Clauses](./when-clauses.md)
* [Statements](./statements.md)