# DynamoDB

> [Relational vs NoSQL](./chapters/01-relational-vs-no-sql/RelationalVsNoSQL.md)

> [DynamoDB Intro](./chapters/02-dynamodb-intro/DynamodbIntro.md)

> [DynamoDB Tables and Data Types](./chapters/03-dynamo-tables-and-data-types/DynamoTablesAndDataTypes.md)

> [DynamoDB Consistency](./chapters/04-dynamo-consistency/DynamoConsistency.md)

> [DynamoDB Capacity](./chapters/05-dynamo-capacity/DynamoCapacity.md)

> [DynamoDB Partitions](./chapters/06-dynamo-partitions/DynamoPartitions.md)

> [DynamoDB Indexes](./chapters/07-dynamo-indexes/DynamoIndexes.md)

> [DynamoDB Streams and TTL](./chapters/08-dynamo-streams-and-ttl/DynamoStreamsAndTTL.md)

> [DynamoDB Interactions](./chapters/09-dynamo-interactions/DynamoInteractions.md)

> [Data Modeling Intro](./chapters/10-data-modeling-intro/DynamoDataModelingIntro.md)

> [One-To-Many Modeling](./chapters/11-one-to-many/OneToManyStrategies.md)

> [Many-To-Many Modeling](./chapters/12-many-to-many/ManyToManyStrategies.md)

> [Filtering Strategies](./chapters/13-filtering-strategies/FilteringStrategies.md)

> [Sorting Strategies](./chapters/14-sorting-strategies/SortingStrategies.md)

> [Migration Strategies](./chapters/15-migration-strategies/MigrationStrategies.md)

> [Additional Strategies](./chapters/16-additional-strategies/AdditionalStrategies.md)


--------------------------------------------------------FIND A PLACE FOR THE BELOW INFORMATION
## DynamoDB Architecture
DynamoDB utilizes a service oriented architecture. This means that software components,
which are called services, are provided to other services through a communication
protocol over the network. Basically think of REST.

Just like other AWS services, DynamoDB ensures a predefined and predictable level
of performance at all times.

Data transfer in DynamoDB happens through simple APIs like the GET, PUT, DELETE.

Data is stored on SSDs. Each partition in DynamoDB provides about 10 GB data and is
optimized to deliver predictable throughput. Offers a per partition maximum of 3000 RCUs and 1000 WCUs. In addition,
DynamoDB stores at least 3 copies of your data in different facilities within the
region.

DynamoDB uses consistent hashing for distributing its data among nodes.

A table's throughput is divided between its partitions. The number of partitions is
decided upon by considering the required throughput and/or size. 

Let's say that only size increases, and it causes the need for extra partitions. 
If you do not scale up your throughput, then you'll suffer in performance, as the 
throughput is divided between the partitions.

Another situation, let's say that you want to migrate an SQL table to Dynamo. To
speed up the process, you increase the WCUs to a large amount. This allocates a 
certain number of partitions. After you're done, you deallocate to a smaller load,
as you don't need that much WCUs anymore. However, the number of partitions stays
the same and your throughput gets divided between all of those partitions, causing
terrible performance.

**DynamoDB DOES NOT deallocate a partition once it has been provisioned!**

## Efficient Key Design
* Simple keys - just a partition key. Partition key has to be unique in a table.
* Composite keys - partition key + sort key. Combination has to be unique in a table.

The sort keys do not influence the partition choice that Dynamo makes.

Consider data distribution:
* Ensure uniform distribution of data across partitions
* Use as many unique values for partition key as possible

Consider read/write patterns:
* RCUs and WCUs get equally distributed between the partitions
* Prevent hot partitions
* Ensure uniform utilization of RCUs and WCUs

Consider time series data:
* Segregate hot and cold data in to separate tables

Consider scan operations and filters:
* Always prefer query operations
* Choose sort keys and indexes to avoid scan operations and filters

|                 | Local secondary indexes                                | Global secondary indexes                                            |
|-----------------|--------------------------------------------------------|---------------------------------------------------------------------|
| Key             | Same partition key as the table index                  | Different partition key than the table index                        |
| Throughput      | Uses table throughput (capacity units)                 | Uses its own throughput (capacity units)                            |
| Nr allowed      | 5                                                      | 5                                                                   |
| When to choose? | When application needs same partition key as the table | When application needs different or same partition key as the table |
|                 | When you need to avoid additional costs                | When application needs finer throughput control                     |
|                 | When application needs strongly consistent index reads | When application only needs eventually consistent index reads       |

Consider item size:
* Max size per item - 400 KB
* Prefer shorter (yet intuitive) attribute names over long and descriptive ones

Consider index attribute size for string and binary data types:
* Max size of simple partition key = 2 KB
* Max size of composite partition key = 1 KB
* Max size of sort key = 1 KB

Summary:
* Partition key should have many unique values
* Uniform distribution of read/write operations across partitions
* Store hot and cold data in separate tables
* Consider all possible query patterns to eliminate use of scan operations and filters
* Choose sort key depending on your application's needs
* Use indexes when your application requires multiple query patterns
* Use primary key or local secondary indexes when strong consistency is desired
* Use global secondary index for finer control over throughput or when your application
needs to query using a different partition key
* Use shorter attribute names


## Hot keys or hot partitions
There are two main ways how hot partitions happen - time series data and popular
datasets.

Time series data would cause it by having some time related partition key attached to it.
The recent data would be used more frequently. Could solve this by having different
tables for each year, and the month still being the partition key. 
Could also use DAX to cache the hot partition.
![Hot time series data](./images/hot_time_series_data.png)

An example of popular datasets would be singing contestants. There are clear favourites
that develop over the course of the competition, but we do not know beforehand. We
could use write sharding there, where we split the partition key into separate sub IDs.
When we're writing, we'd choose one ID at random. When we're reading data back, then
we use shard aggregation. Since we know the range of sub IDs, then we can use a 
batch GET item and pass all the sub IDs.
![Hot popular datasets](./images/hot_popular_datasets.png)


## DynamoDB Design Patterns

Since DynamoDB has no concept of a foreign key, then there is no enforcement from
Dynamo's side to it. We must maintain a correct relationship programmatically.

### One-to-One
We implement it using simple keys on both entities.

#### Within a table
To achieve this within a table, then we use a global secondary index with that 
alternate partition key.

#### Between tables
To achieve this between tables, we can have primary keys denote the same values
in both the tables. Or we can create global secondary indexes again.

### One-to-Many
We implement it using a simple key on one entity and a composite key on the other. Or
by using set types.

Composite keys should be used for large item sizes, and if querying multiple items
within a partition key is required.

Set types should be used for small item sizes, and if querying individual item attributes
in Sets is not needed.

#### Within a table


#### Between tables


### Many-to-Many
We implement it using composite keys or indexes on both entities.

### Hierarchical Data Structures
These can be modeled as table items or JSON documents.

#### Table items

#### JSON documents
Here you'd save the related data as a full JSON inside an attribute. E.g. metadata.
![JSON Document](./images/json_document.png)
