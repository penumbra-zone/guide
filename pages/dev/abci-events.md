# Querying ABCI events

In order to write an application that understands Penumbra chain state,
configure access to a [pindexer] database.
More advanced use cases may require a custom implementation of the underlying
[cometindex] logic that powers `pindexer`.

## pindexer
Below are some examples to orient a developer to the structure of a `pindexer` database,
which is intended to be more ergonomic for application development than the default
CometBFT ABCI event schema.

### Example: Total Supply Indexing

For example, after running `pindexer`, here's a query to get the total amount of the native
staking token up to the current height:

```sql
SELECT (staked_um + unstaked_um + auction + dex)::NUMERIC / 10^6 as total
FROM (
  SELECT SUM(um) as staked_um
  FROM (
    SELECT * 
    FROM supply_validators
  ) validators
  LEFT JOIN LATERAL (
    SELECT um  
    FROM supply_total_staked
    WHERE validator_id = id 
    ORDER BY height DESC 
    LIMIT 1
  ) ON TRUE
) staked
LEFT JOIN LATERAL (
  SELECT um as unstaked_um, auction, dex 
  FROM supply_total_unstaked
  ORDER BY height DESC
  LIMIT 1
) on TRUE
```

<!--
TODO: add more examples plucked from real-world use cases
-->

## cometindex

When writing your own [cometindex] implementation, you'll need to reference a source
CometBFT database and query it for information. Here are some example for how to do that.

### View all events in database

```sql
SELECT type, COUNT(*) as count
FROM events
GROUP BY type
ORDER BY count DESC;
```

### View all non-Penumbra-specific events

```sql
SELECT type, COUNT(*) as count
FROM events WHERE type NOT LIKE 'penumbra.core.%'
GROUP BY type
ORDER BY count DESC;
```

[pindexer]: ../event-indexing/pindexer.md
[cometindex]: https://github.com/penumbra-zone/penumbra/tree/main/crates/util/cometindex
