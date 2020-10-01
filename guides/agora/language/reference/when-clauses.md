# When Clauses

A _WhenClause_ is the keyword `when` followed by a _BooleanExpression_ that must evaluate to `true` for a GraphQL query to be filtered by it's containing _Predicate_.

```
# A when clause used in a statement
query { tokens } when true => 1;

# A more typical use with a Substitution
query { tokens(first: $first) } when $first > 1000 => $SURCHARGE;
```

**See Also**
* [Table of Contents](./toc.md)
* [Predicates](./predicates.md)
* [Boolean Expressions](./boolean-expressions.md)
* [Substitutions](./substitutions.md)
* [Matches](./matches.md)