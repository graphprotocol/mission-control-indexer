# Substitutions
Substitutions are placeholders in _Expressions_ for values that will not be known until runtime. They include _Captures_ that were captured in the _Match_ part of a statement, as well as _Globals_.

Syntactically, a Substitution always starts with a `$` and is followed by an _Identifier_

_Globals_ and _Captures_ have the same syntax and are used in the same positions. In order to prevent a name collision, it is recommended that globals use $UPPER_CASE_SNAKE_CASE, and _Captures_ use $lowerCamelCase.

In the event that a _Global_ and _Capture_ do have a name collision, the _Capture_ will take precedence.

```
# These are all valid globals conforming convention:
$GAS_PRICE
$ENABLE_SURGE_PRICING
$AVG_RESPONSE_BYTES

# And these are all valid captures conforming to convention:
$first
$skip

# This is a When Clause that uses a substitution
when $skip > 1000

# And this is a Cost expression using substitutions
(500 + $skip) * $AVG_TIME
```

If the value of a _Substitution_ cannot be found, the _Statement_ will return an error and the query will not be costed. This can be used to ban problematic or unknown queries, if desired.

```
# A statement preventing matching queries from being costed
query { problem } => $_BAN_;
```


## Globals
A global is a value that is supplied at runtime from outside of the cost model. This enables making efficient incremental changes to a cost model in response to market conditions, traffic spikes, and the like.

## Captures
Captures are covered in more detail in [Matches](./matches.md).

## Type Coercion
The following coercions are supported:

### Converting to bool
    null => false
    int => int != 0
    string => string.len() != 0
    list => list.len() != 0
    object => true

### Converting to rational
    true => 1
    false => 0
    null => 0
    string => parseDecimal(string)

If the coercion fails, the pricing will return an error and the query will not be costed.

Note that because of limitations of JSON, large numbers and numbers with decimals must be passed in as strings.

# See also
* [Table of Contents](./toc.md)
* [Identifiers](./identifiers.md)
* [Matches](./matches.md)
* [Expressions](./expressions.md)
* [Rational Expressions](./rational-expressions.md)
* [Boolean Expressions](./boolean-expressions.md)