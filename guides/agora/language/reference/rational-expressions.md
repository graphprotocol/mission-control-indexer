# Rational Expressions
A _RationalExpression_ evaluates to a rational number.

Syntactically, it may any of the following forms:

* _Const_
* _Sustitution_
* (_RationalExpression_)
* _RationalExpression_ _BinaryOperator_ _RationalExpression_

```
# A const Rational Expression
10.00198

# A Substitution Rational Expression
$sub

#A parenthesized Rational Expression
(1)

# A Rational Expression using a Binary Operator
2 + 4

# A Rational expression using all of the above
500.0 + ($skip + 10) * $ENTITY_COST
```

## Binary Operators in Rational Expressions
The following binary operators are supported and are applied order:

* `*` Mult
* `/` Div
* `+` Add
* `-` Sub

All math is lossless during the execution of an expression, but is rounded toward zero and clamped between 0 (inclusive) and 2^256 (exclusive) GRT expressed in wei when outputting the final cost.

A divide-by-zero will cause the expression to fail and not output a cost.

## See also
* [Table of Contents](./toc.md)
* [Expressions](./expressions.md)
* [Substitutions](./substitutions.md)