# Statements

A statement is comprised of a _Predicate_, which is used for matching GraphQL queries, and a _CostExpression_ which when evaluated outputs a cost in GRT (expressed in wei).

```
default => 1;
```
This is the simplest statement. The Predicate `default` matches any GraphQL. The Cost Expression `1` evaluates to 1 GRT (expressed in wei).

The Predicate and Cost Function are separated by `=>` and terminated with `;`.

Statements can express a complex set of rules:

```
query { pairs(skip: $skip) { id } } when $skip > 2000 => 1000000 * $skip;
```

would cost the query `{ pairs(skip: 5000) { id } }` at 5000000000 wei but would not match the query `{ token }`.

## Comments
A Statement may be preceded by explanatory text, called a _Comment_. A comment starts with a `#` and continues until the end of the line.

```
# This is a comment about the following statement.
default => 1;
```

**See also**
* [Table of Contents](./toc.md)
* [Predicates](./predicates.md)
* [Expressions](./expressions.md)
* [Models](./models.md)
