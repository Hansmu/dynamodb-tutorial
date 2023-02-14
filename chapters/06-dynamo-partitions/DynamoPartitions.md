# DynamoDB Partitions
DynamoDB stores data in partitions. A partition is nothing more than a
block of memory allocated that will be used for storage. A table can have
one or more partitions depending on its size and region throughput. The
partitions are managed internally by DynamoDB.

1 partition = 10 GB of data, 1000 WCUs/3000 RCUs. If our application
exceeds one or more of these limits, then DynamoDB would allocate more
partitions. This happens in the background with no downtime.

When we create a new table, the initial number of partitions are determined
by the provision capacity. Let's say that we create a table with 500 RCUs
and 500 WCUs. Number of partitions would then be:
```
PARTITIONS NEEDED BASED ON RCUs = 500 RCUs / 3000 PER-PARTITION-MAX-RCUs = 0.16(6)
PARTITIONS NEEDED BASED ON WCUs =  500 WCUs / 1000 PER-PARTITION-MAX-WCUs = 0.5
PARTITIONS NEEDED BASED ON RCUs + PARTITIONS NEEDED BASED ON WCUs = 0.67
0.67 ~= 1 partition
```

Once this partition runs out of the allowed memory of 10 GB, then additional
partitions would be allocated.

Now suppose you increase your provisioned amounts to 1000 RCUs and 1000 WCUs.
```
PARTITIONS NEEDED BASED ON RCUs = 1000 RCUs / 3000 PER-PARTITION-MAX-RCUs = 0.33(3)
PARTITIONS NEEDED BASED ON WCUs =  1000 WCUs / 1000 PER-PARTITION-MAX-WCUs = 1
PARTITIONS NEEDED BASED ON RCUs + PARTITIONS NEEDED BASED ON WCUs = 1.33
1.33 ~= 2 partitions
```

DynamoDB would distribute the data uniformly between the two partitions. It
will then de-allocate the old partition. The throughput capacity is also
equally divided between the partitions. So both new partitions receive
500 WCUs and 500 RCUs. Once a partition is allocated, you will not be able
to deallocate it when you scale down the table capacity. This is a problem
because the provision capacity gets divided between all the partitions.
This will cause our table to perform at a far lower throughput than desired.

The only way to get rid of extra partitions is to re-create the table.

### Partition
Partitions are the core storage units underlying your DynamoDB table. Dynamo shards
your data across multiple server instances.

When a request comes into DynamoDB, the request router looks at
the partition key in the request and applies a hash function to it.
The result of that hash function indicates the server where that data
will be stored, and the request is forwarded to that server to read or
write the data as requested.

In earlier versions of DynamoDB, you needed to be more aware of
partitions. Previously, the total throughput on a table was shared
evenly across all partitions. You could run into issues when
unbalanced access meant you were getting throttled without using
your full throughput. You could also run into an issue called
throughput dilution if you temporarily scaled the throughput very
high on your table, such as if you were running a bulk import job,
then scaled the throughput back down.

All of this is less of a concern now as the DynamoDB team has
added a concept called adaptive capacity. With adaptive capacity,
throughput is automatically spread around your table to the items
that need it. There’s no more uneven throughput distribution and
no more throughput dilution.