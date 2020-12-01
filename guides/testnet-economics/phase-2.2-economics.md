# Phase 2.2 Testnet Economics
A reminder that this phase is for honest profit maximization. Do your best to make as much profit
as possible, with no economic attacks, and no collusion with other Indexers.

# Parameters

The following parameters will be set for Phase 2.2. They can be changed
at any time during the testnet as well, but these will be the params
at launch:

- `networkGRTIssuance = 3%`
- `α - 0.85` (for the rebate rewards formula)
- `defaultReserveRatio = 1/2 ` (for bonding curves)
- `savingsRate = 5%`
- `epochLength = 138 blocks` (~30 mins)
- `maxAllocationEpochs = 24` (~12 hrs)

There are many other params not mentioned here. They are unlikely to change this phase. You can
always see all the network parameters in the Network Subgraph, in the `GraphNetwork` entity.

With this information, you should be able to perform economic calculations and determine the most
profitable strategy.

# Unique actions that will effect the economics during this phase

## Oversignaling by The Graph
**IMPORTANT!!!**

This phase we will be over-signaling on all the subgraphs at the start. This means that we will
purposely signal an extremely high amount of GRT on all the bonding curves. And then we will
unsignal back to a reasonable value. **If you do not pay attention to this, you might get rug**
**pulled by us, and lost a lot of your GRT, and you will not be refunded.** The reason we are doing
this, is to allow users to do their own calculations on what bonding curves are under signaled.

Each bonding curve actually has it's own expected return, based on the query fees it receives. This
means there is an equilibrium price of shares for the bonding curve. When we unsignal, we might leave
some over-signaled, and some under-signaled. The Indexers that are able to recognize which ones
are under-signaled, will be able to purchase that signal for a great price. 

## Sending Queries
We will be sending queries to the Indexers for the first time. The amount of queries will not
be announced. However, you can watch how many queries are sent, and to which subgraphs. This
information, as well as the price of those queries, will factor into your economic
calculations.

## Scoring
We will be scoring all ways to maximize profit separately and evenly. That means, that the Indexer
with the most GRT will not necessarily score the highest.

For example, a good rug pull can net millions of GRT in the first minutes of the testnet.
However, the testnet can run for weeks, and there are a lot of actions to perform to be a
great Indexer. So we want to score all of these actions, which requires us to not just consider
which Indexer has the most GRT at the end of a phase.

We will be watching the trends of each Indexer as we are analyzing all the data the protocol is
producing. A very active Indexer who is moving their stake strategically, paying attention to the
amount of queries on each subgraph, and watching the curation bonding curves, should do well in
the scoring overall.
### Scoring with Bonding Curves
One might notice that, if a phase were to have a specific end date, there might be a "run on the
bank" with the Curation bonding curves, if it is not clear how users are scored. To make it clear
to everyone, your curation GRT will be calculated with the following at an unspecified snapshot
of time:

```
priceOfCurationShares * totalShares
```

This will be done for every set of shares, and the total GRT value will be added up. This is opposed
to calculating the average that everyones share is worth. Also note, we will do it at an unspecified
snapshot in time. This should prevent Indexers from withdrawing their signal
a few days before the end of the Phase, to maximize their GRT withdrawn from the curve,
while leaving other Indexers holding a worthless bag.
