# Phase 2.2 Testnet Economics
A reminder that this phase is for honest profit maximization. Do your best to make as much profit
as possible, with no economic attacks, and no collusion with other indexers.

# Parameters

The following parameters will be set for Phase 2.2. They can be changed
at any time during the testnet as well, but these will be the params
at launch:

- `networkGRTIssuance = 3%`
- `*α* - 0.85` (in the rebate rewards formula)
- `defaultReserveRatio = 1/2 ` (for bonding curves)
- `savingsRate = 5%`
- `epochLength = 138 blocks` (~30 mins)
- `maxAllocationEpochs = 24` (~12 hrs)

There are many other params not mentioned here. They are unlikely to change this phase. You can
always see all the network parameters in the Network Subgraph, in the `GraphNetwork` entity.

With this information, you should be able to perform economic calculations and determine the most
profitable strategy. Please see the information below as well.

# Unique actions that will effect the economics during this phase

## Oversignaling by The Graph
**IMPORTANT**
This phase we will be over-signal on all the subgraphs at the start. This means that we will
purposely signal an extremely high amount of GRT on all the bonding curves. And then we will
unsignal back to a reasonable value. **If you do not pay attention to this, you might get rug**
**pulled by us, and lost a lot of your GRT, and you will not be refunded.** The reason we are doing
this, is to allow users to do their own calculations on what bonding curves are under signaled. Each
bonding curve actually has it's own expected return, based on the query fees it receives, and so
there is an equilibrium price of shares for the bonding curve. When we unsignal, we might leave
some over signaled, and some under signaled. The Indexers that are able to recognize which ones
are under signaled, will be able to get signal for a great price. 

## Sending Queries
We will be sending queries to the indexers for the first time. The amount of queries will not
be announced. However, you can watch, and determine where the queries go. The amount of queries
send to specific subgraphs, and the price of those queries, will factor into your econmoic
calculations.

## Scoring
We will be scoring all ways to maximize profit separately and evenly. That means, that the Indexer
with the most GRT will not necessarily score the highest.

For example, a good rug pull can net millions of GRT in the first minutes of the testnet.
However, the testnet can run for weeks, and there are a lot of actions to perform to be a
great indexer. So we want to score all of these actions, which requires us to not just consider
which Indexer has the most GRT at the end of a phase.

We will be watching the trends of each indexer as we are analyzing all the data the protocol is
producing. A very active indexer, who is moving their stake strategically, paying attention to the
amount of queries on each subgraph, and watching the curation bonding curves, should do well in
the scoring overall.