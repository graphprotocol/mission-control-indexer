# Boolean Expressions
A _BooleanExpression_ evaluates to `true` or `false`. Syntactically, it may take any of the following forms:

* Const
* _Substitution_
* (_BooleanExpression_)
* _BooleanExpression_ _BooleanBinaryOperator_ _BooleanExpression_
* _LinearExpression_ _ComparisonBinaryOperator_ _LinearExpression_

```
# A Const BooleanExpression
true

# A Substitution BooleanExpression
$UNDER_LOAD

# A Parenthesized BooleanExpression
(false)

# A BooleanExpression using a BooleanBinaryOperator
true || false

# BooleanExpression using a ComparisonBinaryOperator
1 >= 2

# A BooleanExpression combining several of the above
($skip > 1000 || $first > 500) && $UNDER_LOAD
```

## Boolean Binary Operators
The following BooleanBinaryOperators are supported and are applied in order:

* `&&` And
* `||` Or

## Comparison Binary Operators
The following ComparisonBinaryOperators are supported:

* `==` Equal
* `!=` Not Equal
* `>` Greater Than
* `<` Less Than
* `>=` Greater Than Or Equal
* `<=` Less Than Or Equal

## See also
* [Table of Contents](./toc.md)
* [Expressions](./expressions.md)
* [Substitutions](./substitutions.md)