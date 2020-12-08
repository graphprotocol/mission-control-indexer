# Indexer Selection Example

This guide will help to provide an understanding of how indexer selection works by running through a simulation of a days worth of queries across several indexers. The simulation produces 2000 queries per second and for each query selects and indexer based on knowledge of the indexer at that point in time during the simulation. At the end of the day, the total query fees for each Indexer are tallied to highlight the result.

The Indexers in the simulation have been chosen to highlight good strategies, point out mistakes, and show the general behavior of the algorithm.

For simplicity we are using a single Consumer. In The Network, it is expected that there will be many different Consumers with differing needs and budgets depending on their use-case. For example, a Consumer doing data analytics may emphasize price and economic security in their selection. A Consumer developing a DeFi app may value performance and data freshness instead. For this example we are using an expected DeFi app developer profile as the Consumer, with a balanced weighting across all factors.

A simplified view of the data from one run follows. Feel free to skip over this important points will be made below that reference this data.

| ID | Stake | Blocks Behind | Price | Latency | Reliability | Daily Fees |
| --- | --- | --- | --- | --- | --- | --- |
| 0 | 500,000 GRT | 0 | 0.000040 DAI | 200 ms | 99.9% | 942 DAI |
| 1 | 400,000 GRT | 1 | 0.000040 DAI | 150 ms | 99.5% | 761 DAI |
| 2 | 300,000 GRT | 1 | 0.000034 DAI | 650 ms | 95% | 376 DAI |
| 3 | 400,000 GRT | 1 | 0.000005 DAI | 450 ms | 96% | 210 DAI |
| 4 | 100,000 GRT | 8 | 0.000024 DAI | 1600 ms | 80% | 26 DAI |
| 5 | 100,000 GRT | 8 | 0.000040 DAI | 1900 ms | 80% | 23 DAI |
| 6 | 500,000 GRT | 0 | 0.000999 DAI | 200 ms | 99.9% | 0 DAI |
| 7 | 1,000,000 GRT | 1 | 0.000045 DAI | 300 ms | 99% | 1173 DAI |
| 8 | 400,000 GRT | 1 | 0.000030 DAI | 185 ms | 99% | 869 DAI |
| 9 | 300,000 GRT | 0 | 0.000032 DAI | 220 ms | 99.9% | 647 DAI |

#
The first thing to notice it that it's not winner-take-all. Aside from a few notably bad Indexers which will be covered, there is a good spread of query fees across many Indexers.

The next important thing to note is that being a better Indexer is the best way to maximize profits. Consider for example Indexer 1 vs Indexer 2. Indexer 1 provides better economic security, performance, and reliability. Despite it's higher price, it rakes in plenty of fees for better service.

Another important property is that a race to the bottom does not occur. Compare Indexer 2 with Indexer 3. Indexer 3 is better than Indexer 2 in every regard. Despite the rock-bottom prices, Indexer 3 does not have higher revenue than Indexer 2 and to behave rationally should increase it's prices significantly. This remains true even if Indexer 3 lowers prices further. Behaving this way lowers total query fees for everyone, without moving more query fees your way. If Indexer 3 raised their prices from 0.000005 DAI to 0.000035 DAI and we run the simulation again they would increase their own revenue by 530 DAI (from 210 DAI to 740 DAI) and the revenue of all participants would increase by 1312 (from 5030 DAI to 6342 DAI) as some queries shift to other Indexers.

There is a point at which if you raise your prices higher than what the Consumer will bear though, the Consumer will stop sending you queries. This is the case for Indexer 6. Similarly, below a certain threshold of economic security, freshness, or performance it will be very unlikely that you will receive any queries.

It's ok to specialize in some area, as with Indexers 7-9. But raising the worst metric in any area is likely to have the biggest impact until there are more Consumers with less balanced weights. In the testnet, we are using the same Consumer as is being used by this simulation (but this may change in the future).