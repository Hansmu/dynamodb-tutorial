# DynamoDB tutorial

## Relational DB vs NoSQL DB

Relation databases are not suited for:
* Unstructured data
* Big data applications - huge volumes of data or high frequency data

NoSQL DBs
* While it is called NoSQL, we can actually use SQL even with DynamoDB
with the help of services like RedShift and Apache Hive. So a better
name might be Not-Only-SQL
* Non-relational in nature
* Support unstructured data
* Well suited for big data applications. Big data can be described using:
  * Volume - large volumes of data.
  * Velocity - a huge number of concurrent read/write operations, often
  in real time.
  * Variety - largely unstructured or semi-structured data.

![SQL vs NoSQL Data Model](./images/sql-vs-no-sql-data-model.png)


### ACID
* A - Atomicity. A transaction can either execute completely or not at all.
* C - Consistency. Once a transaction has been committed, it has to conform 
to the given schema.
* I - Isolation. Requires that the concurrent transactions execute separately
from one another.
* D - Durability. The ability of the database to recover from unexpected
system failures or an outage. So transactions are typically logged and in
case there is an outage or failure, these transactions can be replayed and
applied back to the database once the system is back up and running.

Relational DBs implement ACID in a very strict sense. These properties work
together to ensure a consistent and desired behavior of the relational
database transactions. However, this results in the loss of some flexibility,
and it vastly hinders the database performance and its ability to scale
horizontally, especially when dealing with big data.

NoSQL DBs often trade some ACID properties and thereby they provide us
with a more flexible data model.

### Scaling
SQL by default relies on vertical scaling. To enable horizontal scaling
you have to re-work your model, need additional investments into infra.

NoSQL by default relies on horizontal scaling.

### Interaction APIs
SQL uses SQL (Structured Query Language) for interaction.

NoSQL uses object-based APIs for interaction. So you use partition keys 
or primary keys to look up any data stored.

## NoSQL

### Types of NoSQL DBs
* **Columnar DBs** - column orientated. Optimized for reading and writing
columns of data as opposed to rows of data (relational DB). Great for things like data
warehousing and analytics. Reduces the overall disc I/O requirements and
the amount of data that needs to be loaded from the disc. Some examples are
Apache Casandra, Apache HBase, Amazon Redshift.
* **Key-value store** - data stored in key-value pairs. Optimized for read-heavy
application workloads. Ex. social networking, gaming, media sharing applications.
They are also suitable for compute-heavy workloads like recommendation engines.
These DBs often leverage in-memory caching to improve application performance
by storing critical pieces of data in memory and that allows for faster access.
Examples are Redis, Couchbase Server, Memcached, DynamoDB.
* **Graph DBs** - good for exploring data that is structured like a graph or
a tree for example. We have nodes and these nodes have relationships with
other nodes through edges. These are used for huge data sets like social
networking sites where everything is related. Some examples are Neo4j,
OrientDB, GraphDB.
* **Document DBs** - store semi-structured data as documents. Typically JSON
or XML documents. Some examples are Cassandra, Couchbase, MongoDB, DynamoDB.

DynamoDB is a key-value store, as well as a Document DB. It also supports
API operations in JSON format. DynamoDB does not actually store the data
in JSON format, but for all practical purposes, applications interact with
DynamoDB using the JSON format.

## DynamoDB

DynamoDB is
* Serverless - you do not have to manage the servers or any infrastructure
to use DynamoDB.
* A Cloud DB - Available in AWS
* NoSQL - built for big data
* Fast - High throughput with low latency. Can be further improved by using
DACS.
* Flexible - can store unstructured data
* Cost-effective - pay on the capacity that you provision for each table
* Highly scalable - can scale to demand
* Fault-tolerant - automatically replicates to multiple AZs, supports cross
region replication.
* Secure - has fine-grained access control.

![Terminology comparison](./images/terminology_comparison.png)

A table in DynamoDB is a grouping of records that conceptually belong together.
In a relational DB a table contains one entity, in DynamoDB it contains all the entities.
This helps to avoid the join operation, which is expensive as a DB scales.

A relational DB has a specified schema, that describes and enforces the shape of each
record in the table. At the DB level, DynamoDB is schemaless. You have to enforce a
schema in your application code.

An item is a single record in a DynamoDB table. Same as a row in a relational DB.

A dynamoDB item is made up of attributes, which are typed data values holding info
about the element. Attributes are similar to column values on relational records, except
not required.

### DynamoDB Tables
Tables are the top level entities in DynamoDB and all the tables within
the given AWS region can be looked at as a single DB.

In order to better organize tables related to our application, a good 
approach is to follow some kind of naming convention to name our tables.
One way could be to prefix each table with some identity. For example,
if I'm building a test application, then I could prefix them with `test.`
or `test_.`

Different AWS regions can have their own tables and these tables are
separate from each other. For example US-West-1 and US-West-2 can have
tables with the same names and be treated as two different entities as
they lie in two different locations.

There is no concept of foreign key relationships in DynamoDB. Two tables
are totally separate from each other. Each table is an independent entity.

Different table items can have different attributes. The only common attribute
that must be present in each item in the table is the primary key.

A primary key must be declared for a table on creation. Can be simple (a single value)
or composite (two values). Primary key selection and design is the most important
part of data modeling with DynamoDB. Almost all of your data access will be driven 
off primary keys.

The way you configure your primary key may allow for one read or write access pattern,
but may prevent you from handling a second access pattern. Secondary indexes allow you
to reshape your data into another format for querying, so you can add additional access
patterns to your data. When you create a secondary index on your table, you specify
the primary keys for your secondary index, just like when you're creating a table. AWS
will copy all items from your main table into the secondary index in the reshaped form.
You can then make queries against the secondary index.


### DynamoDB Data Types
Scalar types
* Exactly one value. Ex. string, number, binary, boolean, and null
* Depending on how the values are used, there are different max size
limitations.
* You cannot store empty string values in Dynamo.
* Numbers are sent across as strings through the API, but for any 
mathematical calculation they are treated as numbers.
* Binary data is blocks of compressed text, encrypted data, or even images.
* Empty values are not allowed in binary data types.
* Keys or index attributes only support string, number, and binary scalar
types.

Set types
* Multiple scalar values. Ex. string set, number set, binary set.
* Unordered collection of strings, numbers, or binary.
* Only non-empty values.
* No duplicates allowed.
* All values must be of the same Scalar type in a set.

Document types
* Complex structure with nested attributes. Ex. list and map.
* Nesting up to 32 levels deep.
* Only non-empty values within lists and maps.
* Empty lists and maps are allowed.
* Lists are ordered collection of values. Can have multiple data types
within one list. There is no restriction on the data types that can be 
stored in a list element.
* Maps are unordered collections of key-value pairs. Ideal for storing JSON
documents. There are no restrictions on the data types that can be stored
in a map element, and the elements in a map can be of different types as well.

When we create a table or an index, like a local or global secondary index,
we must specify the data type. The keys of any table can only be one of
Scalar types. That is string, number, binary.

Internally, DynamoDB doesn't actually store JSON, but it has its own
native data types.

### DynamoDB Consistency Model
DynamoDB automatically replicates your data between multiple facilities.
DynamoDB stores your data on at least 3 copies of high speed SSDs located
in three different facilities within the region.

![AWS Infrastructure](./images/aws-infrastructure.png)

When we write to one of our DBs, then that data is eventually replicated
to the other facilities. This usually happens within 1-2 seconds. If you
are instantly reading the data as well, then that means that the data might
not be up-to-date, as the data has not been synchronized across all facilities.
When a request comes in, then it will hit one of the facilities.

Considering that time constraint, DynamoDB supports two types of reader 
operations - strongly consistent reads and eventually consistent reads.

Strong consistency:
* The most up-to-date data
* Must be requested explicitly

Eventual consistency:
* May or may not reflect the latest copy of data. Provides you with data
from one of its facilities. Not reflecting the actual data would happen
only if the data was written in the last second or so.
* Default consistency for all operations
* 50% cheaper

Most applications, most of the time, should be fine with eventual consistency.

### DynamoDB Capacity
Since DynamoDB tables are independent of each other, their performance
can be controlled and tuned individually. To do this, we must provision
throughput capacity for each table that we create in DynamoDB.

Throughput capacity
* Allows for predictable performance at scale
* Used to control read/write throughput
* Supports auto-scaling
* Defined using RCUs and WCUs
* Major factor in DynamoDB pricing
* 1 capacity unit = 1 request/sec. There are read capacity units (RCU) and
write capacity units (WCU).

DynamoDB pricing is based on a pay per use concept, meaning you pay only
for what you use. It charges based on RCUs and WCUs consumed, and on
volume data.

RCU - Read Capacity Unit
* 1 RCU = 1 strongly consistent table read/sec
* 1 RCU = 2 eventually consistent table reads/sec
* An item of up to 4 KB of size. The items are rounded up to the nearest
next 4 KB to get the number of RCUs needed.

WCU - Write Capacity Unit
* 1 WCU = 1 table write/sec
* An item of up to 1 KB of size. Same as with RCU, rounding is done.

DynamoDB has burst capacity
* To provide for occasional bursts or spikes
* 5 minutes of unused read and write capacity
* Can get consumed quickly
* Must not be relied upon
* Beyond this our requests will likely get throttled

Scaling
* Happens async in the background without any downtime
* Scaling up: As and when needed
* Scaling down: up to 4 times a day
* Affects partition behavior (Important!)
* 1 partition supports up to 1000 WCUs or 3000 RCUs

On-Demand Capacity - DynamoDB charges you for the data reads/writes your
application performs on your tables. You do not need to specify how much
read and write throughput you expect your application to perform because 
DynamoDB instantly accommodates your workloads as they ramp up or down.
This is a good option if you:
* Create new tables with unknown workloads
* Have unpredictable application traffic
* Prefer the ease of paying for only what you use

### DynamoDB Partitions
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

### DynamoDB Indexes

It is good to have a string as a partition key, but not required. Also, it's
good to have a number as a sort key, but again, not required.

Since local secondary indexes can only be defined on create time, then it's
good to spend a considerable amount of time thinking about what use cases 
would be required.

#### Primary key
Each item in a table is uniquely identified by a primary key.
The primary key definition must be defined at the creation of the table, and
then primary key must be provided when inserting a new item.

There are two types of primary key:
* a **simple primary key** made up of just a partition key. Similar to accessing
rows in a SQL table by a primary key. Ex. get a row from a Users table with
a username, which is the primary key.
* a **composite primary key** made up of a partition key and a sort/range key. The sort key
is used to sort items with the same partition. Ex. Orders table for
recording customers on an e-commerce site. The partition key would be the
CustomerId, and the sort key would be the OrderId. The composite primary key 
enables sophisticated query patterns, including
grabbing all items with the given partition key or using the sort key to
narrow the relevant items for a particular query.

Each item in a table is uniquely identified by a primary key, even with
the composite key. When using a table with a composite primary key, you
may have multiple items with the same partition key, but different sort
keys. You can only have one item with a particular combination of partition
key and sort key.

The partition key is used to decide which partition the entry should go in.
A hashing function is run on the key and based on that hash a partition is
chosen.

In DynamoDB there is no way to query data without specifying the partition
key.

You can also perform scan operations that do not require you to specify
partition keys. This is, however, not recommended, unless really necessary.
Operations such as these, in most cases, indicate insufficient data modeling.


### Secondary Indexes
When creating a secondary index, you will need to specify the key schema of your index.
The key schema is similar to the primary key of your table - you will state the partition
and sort key (if desired) for your secondary index that will drive your access patterns.

#### Local secondary index
A local secondary index uses the same partition key as your table's primary key, but
a different sort key. This can be a nice fit when you are often filtering your data
by the same top-level property, but have access patterns to filter your dataset
further. The partition key can act as the top-level property, and the different sort
key arrangements will act as your more granular filters.

Local secondary indexes must be created when you create your table.
You cannot add a local secondary index later on. You can create up to
5 such local secondary indexes.

The RCUs and WCUs are shared with the local secondary indexes. You can
perform eventually consistent as well as strongly consistent queries
using these local secondary indexes.

#### Global secondary index
If you'd want to get information that isn't related to the primary
partition key, then this could be used. You can choose any attributes you want
for your partition key and your sort key. Global secondary indexes are used much
more frequently with DynamoDB due to their flexibility. For example, in the table, we'd
want to get all the employees working in NYC and sorted by their date of
joining.

![Index example](./images/index-example.png)

The partition key is different from that of the primary key. You can 
define up to 5 of these as well. Unlike the local secondary indexes,
these can be created at any time.

Global secondary indexes are stored separately in their own partitions.
They have their own throughput capacity as well, so their RCUs and WCUs
are not shared with the base table. You can only perform eventually
consistent reads with global secondary indexes. Data is replicated from the core table
to global secondary indexes in an async manner. This means it's possible that the data
returned in your global secondary index does not reflect the latest writes in your main
table. The delay in replication from the main table to the global secondary indexes 
is not large, but it may be something you need to account for in your application.

There is no uniqueness constraint with the global secondary index.

|                        | Key schema                                                  | Creation time                         | Consistency                                                                                                            |
|------------------------|-------------------------------------------------------------|---------------------------------------|------------------------------------------------------------------------------------------------------------------------|
| Local secondary index  | Must use same partition key as the base table               | Must be created when table is created | Eventual consistency by default. Can choose to receive strongly-consistent reads at a cost of higher throughput usage. |
| Global secondary index | May use any attribute from table as partition and sort keys | Can be created after the table exists | Eventual consistency only.                                                                                             |

### DynamoDB Streams
Streams are an immutable sequence of records that can be processed by multiple,
independent consumers.

![Generic stream example](./images/stream_generic.png)

With DynamoDB streams, you can create a stream of data that includes a record of 
each change to an item in your table. Whenever an item is written, updated, or 
deleted, a record containing the details of that record will be written to your
DynamoDB stream. You can then process this stream with AWS Lambda or other compute 
infrastructure.

![DynamoDB Stream example](./images/dynamo_stream.png)

### Time-to-live
TTLs allow you to have DynamoDB automatically delete items on a per-item basis. 
This is a great option for storing short-term data in DynamoDB as you can use
TTL to clean up your database rather than handling it manually via a scheduled job.

To use TTL, you specify an attribute on your DynamoDB table that will serve as the 
marker for item deletion. For each item that you want to expire, you should store a 
Unix timestamp as a number in your specified attribute. This timestamp should state 
the time after which the item should be deleted. DynamoDB will periodically review 
your table and delete items that have your TTL attribute set to a time before the 
current time.

For items that you don’t want to automatically expire, you can simply not set the 
TTL attribute on the item.

Items are generally deleted in a timely manner, but AWS only states that items 
will usually be deleted within 48 hours after the time indicated by the attribute.

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

### Consistency
At a general level, consistency refers to whether a particular read operation 
receives all write operations that have occurred prior to the read.

When you write data to DynamoDB, there is a request router that is the frontend for 
all requests. It will authenticate your request to ensure you have access to write 
to the table. If so, it will hash the partition key of your item and send that key 
to the proper primary node for that item.

The primary node for a partition holds the canonical, correct data for the items 
in that node. When a write request comes in, the primary node will commit the write 
and commit the write to one of two secondary nodes for the partition. This ensures 
the write is saved in the event of a loss of a single node.

After the primary node responds to the client to indicate that the write was 
successful, it then asynchronously replicates the write to a third storage node.

The secondary nodes provide fault-tolerance, and distributed load for read requests.
The reads, however, can be eventually consistent, because the write replication happens
async.

So the order of operations
1. PutItem is called by the client with a given partition key
2. The partition key is found to map to partition X
3. Write data for item to partition X
4. Copy write to a secondary node for partition X
5. Respond to client that write succeeded
6. Copy write to another node async

![Dynamo replication](./images/dynamo_replication.png)

The two types of consistency in Dynamo are 
* Strong consistency
  * Any read will reflect all writes that happened beforehand
  * Consumes more read capacity
* Eventual consistency
  * Reads may be slightly outdated
  * Consumes less read capacity

Dynamo defaults to eventual consistency. Can opt into strong consistency via an
API parameter when performing your read.

Should consider your needs when choosing your indexes as well. A local secondary
index allows for strongly-consistent reads, just like the underlying table. A
global secondary index allows only eventually-consistent reads.

### DynamoDB limits
A single item is limited to 400 KB of data (vs 16 MB in MongoDB, 2GB in Cassandra).
The size limit is intentional to push the user towards proper data modeling. The 
larger your item size, the slower your read. You should break down larger items into 
smaller items and do more targeted operations.

This limit will affect you most commonly as you denormalize your data. When you 
have a one-to-many relationship, you may be tempted to store all the related items 
on the parent item rather than splitting this out. This works for many situations 
but can blow up if you have an unbounded number of related items.

The maximum result set size for the Query and Scan operations is 1 MB of data. This 
is before any filter expressions are considered. If you have a need for more than 1 MB,
then you should paginate.

This 1MB limit is crucial to keeping DynamoDB’s promise of consistent single-digit 
response times.

A single partition can have a maximum of 3000 Read Capacity Units or 1000 Write 
Capacity Units. Remember, capacity units are on a per-second basis, and these 
limits apply to a single partition, not the table as a whole. Thus, you will need 
to be doing 3000 reads per second for a given partition key to hit these limits.
This is pretty high traffic volume, and not many users will hit it, though it’s 
definitely possible. If this is something your application could hit, you’ll need 
to look into read or write sharding your data.

The last limit you should know about involves local secondary
indexes and item collections. An item collection refers to all items
with a given partition key, both in your main table and any local
secondary indexes. If you have a local secondary index, a single
item collection cannot be larger than 10GB. If you have a data
model that has many items with the same partition key, this could
bite you at a bad time because your writes will suddenly get rejected
once you run out of partition space.

The partition size limit is not a problem for global secondary indexes. If the items in a global secondary index for a partition key
exceed 10 GB in total storage, they will be split across different
partitions under the hood. This will happen transparently to you—
one of the significant benefits of a fully-managed database.

Multiple entities are stored in a DynamoDB base. In order to do that, you need to
overload your keys, which means using generic names for your primary keys and
using different values depending on the type of item (ex. ORG#123, USER#123).

### Interacting with DynamoDB
When interacting with a relational DB, you'll often do so using SQL. In DynamoDB,
you usually do that using the AWS SDK, or a third party library in code. 

There are basically three areas one can group the API actions into:
* Item-based actions - when you're operating on specific items
  * GetItem - used for reading a single item from a table
  * PutItem - used for writing an item to a table. This can completely overwrite an 
  existing item with the same key, if any
  * UpdateItem - used for updating an item in a table. This can create a new item 
  if it doesn't previously exist, or it can add, remove, or alter properties on an 
  existing item.
  * DeleteItem - used for deleting an item from a table.
* Queries - operating on an item collection
* Scans - operating on an entire table

#### Item-based actions
There are three rules around item-based actions:
* The full primary key must be specified in your request
* All actions to alter data—writes, updates, or deletes—must use an item-based
action.
* All item-based actions must be performed on your main table, not a secondary index.

You can't make a write operation to DynamoDB that says, "Update the attribute X for 
all items with a partition key of Y" (assuming a composite primary key). You would 
need to specify the full key of each of the items you’d like to update.

The above described single-item actions can be performed in batches and transactions.
These allow for multiple operations in a single request. But in here, still, you need
to specify the exact items on which to operate. The actions are split up in Dynamo, but
save you from sending multiple requests.

In a batch request, the actions can succeed and fail independently. So one write won't
affect another in the batch.

In a transactional request, it is all or nothing. If one fails, everything fails, causing
a rollback.

DynamoDB sets its limits to disallow writing queries that do not scale. You need a
partition key as that allows for a O(1) lookup. No matter how large your table 
becomes, including a partition key makes it a constant time operation. With a 
Query you can do >=, <=, begins_with(), between, but not contains(), ends_with().
This is because an item collection is ordered and stored as a B-tree. The time 
complexity of a B-tree search is O(log n). Dynamo limits the data size so that you
wouldn't be querying too much at one time, thus keeping speed. 

#### Query
A Query action lets you retrieve multiple items with the same partition key. Especially
useful when modeling and retrieving data that includes relations. We can add a condition
on the sort key.

#### Scan
A Scan can take a long time to run. It'll take everything. If you have a large table,
you'll have to paginate. You can consider using it if:
* You have a very small table
* You're exporting all data from your table to a different sytem
* In exceptional situations, where you have specifically modeled a sparse secondary 
index in a way that expects a scan. 

#### Query structure
````ts
items = client.query(
  TableName='MoviesAndActors',
  KeyConditionExpression='#actor = :actor AND #movie BETWEEN :a AND :m',
  ExpressionAttributeNames={
    '#actor': 'Actor',
    '#movie': 'Movie'
  },
  ExpressionAttributeValues={
    ':actor': { 'S': 'Tom Hanks' },
    ':a': { 'S': 'A' },
    ':m': { 'S': 'M' }
  }
)
````

Expression attribute values - they start with a colon (:). They are substituted into the
KeyConditionExpression. This kind of structure simplifies parsing and validation the 
expression, as typing is separated from the expression.

Expression attribute names - start with a bars character (#). Specify the names of
the attributes you are evaluating in your request. You are not required to use this,
but they come in handy when you might have a clash with reserved keywords. Also, when 
you have a name with a period, as that would be interpreted as accessing a nested object.

Don't use an ODM (ORM equivalent). Fetching isn't straight-forward in Dynamo. It depends
heavily on your primary key design. Could use a helper library to translate the data
to objects, though, just not for queries.

You can provide additional optional properties to DynamoDB queries:
* ConsistentRead - set it to true to get a strongly-consistent read. It's available 
for GetItem, BatchGetItem, Query, Scan. Can only use on local secondary indexes, as
all global ones are eventually consistent.
* ScanIndexForward - controls which direction you are reading the results from the
sort key. Available on Query. Setting it to false reads it in descending order.
* ReturnValues - when performing a modification action, then you could get some
attributes back using this. Usable on PutItem, UpdateItem, DeleteItem, TransactWriteItem.
By default, Dynamo will not return any info for these operations. There are a couple
of options for this property:
  * NONE - return no attributes. The default.
  * ALL_OLD - return all attributes as they were BEFORE the operation was applied.
  * UPDATED_OLD - any attributes that were updated, return them as they were BEFORE the operation.
  * ALL_NEW - return all as they are AFTER the operation.
  * UPDATED_NEW - any attributes AFTER the operation.
* ReturnConsumedCapacity - returns info on the capacity units used. Can use it when
designing your table, for example, to see what access patterns consume how much. Could
also pass the info onward to the customers that are billed based on the units.
* ReturnItemCollectionMetrics - item collections cannot be larger than 10 GB for a 
local secondary index. You can use this property to give advanced warnings.


#### AWS Management Console
This is the GUI for managing your data.
#### AWS CLI
The command line interface. Run `aws configure` first to set up your CLI.
#### AWS SDK
The `DocumentClient` class provides higher level access. Abstracts more away.
Easier to use for item level operations. Maps to appropriate data types.

When inserting items with the same ID, then the previous one will get replaced.

When doing a conditional write, and it fails, then a WCU is still consumed.

Atomic counters are counters that increment/decrement atomically. Atomic means 
that it's independent of other similar operations. All requests are applied in order.
Not suitable for applications demanding high degree of accuracy.

When running a query, you are doing a direct lookup to a selected partition based on
primary or secondary partition/hash key.

Scan scans through the whole table looking for elements matching the criteria.

Query usually returns the results within a 100ms, whereas scan might even take a few
hours to find the relevant data.

#### Expressions
There are five types of expressions in DynamoDB:
* **Key condition expressions** - used in Query API calls to describe which items you 
want to retrieve in your query. Can only be used on elements of the primary key.
You can use simple comparisons in your sort key conditions, such as greater than (>), 
less than (<), or equal to (=). `KeyConditionExpression="#c = :c AND #ot BETWEEN 
:start and :end"`. While you can use greater than, less than, equal to, or 
begins_with, every condition on the sort key can be expressed with the BETWEEN 
operator. Key expressions are critical when fetching multiple, heterogeneous
items in a single request. With the right combination of item collection design and 
proper key expressions, you can essentially 'join' your data just like a relational 
database but without the performance impact of joins.
* **Filter expressions** - used in Query and Scan operations to describe which items
should be returned to the client after finding items that match your key condition
expression. The key difference with a filter expression vs. a key condition
expression is that a filter expression can be applied on any attribute in the table,
not just those in the primary key. `FilterExpression="#genre = :genre"`. The major
drawback of this expression is that filtering is applied after querying all
the items necessary. Filter expressions can save you a bit of data sent over the 
wire, but it won’t help you find data more quickly. It's also worth considering if
you have a TTL field in your DB, then Amazon can take up to 48 hours to remove those
entries, so it'd be safer to include that condition in your queries as well. Overall,
don't rely on these too heavily.
  ![Filter order](./images/filter_order.png)
* **Projection expressions** - used in all read operations to describe which attributes
you want to return on items that were read.  A projection expression is similar to a
filter expression in that its main utility is in reducing the amount of data sent 
over the wire in your response. While a filter expression works on an item-by-item 
basis, the projection expression works on an attribute-by-attribute basis within an 
item. `ProjectionExpression: "#actor, #movie, #role, #year, #genre"`. A projection 
expression is used to specify exactly the attributes you want to receive from the 
DynamoDB server. The projection expression can also be used to access nested
properties, such as in a list or map attribute. Projection expressions are subject to 
the same caveats as filter expressions—they are evaluated after the items are read 
from the table and the 1MB limit is reached. Thus, if you are looking to 
fetch a large number of items but each of them has a large attribute, you may find 
yourself paginating more than you’d like. If this is the case, you may need to 
create a secondary index with a custom projection that only copies certain 
attributes into the index. This will allow you to quickly query multiple items 
without having to paginate due to large, unneeded attributes.
* **Condition expressions** - used in write operations to assert the existing condition
(or non-condition) of an item before writing to it. Condition expressions are available 
on every operation where you will alter an item—PutItem, UpdateItem, DeleteItem, and 
their batch and transactional equivalents. They allow you to assert specific 
statements about the status of the item before performing the write operation. If 
the condition expression evaluates to false, the operation will be canceled. 
Condition expressions can operate on any attribute on your item, not just those in 
the primary key. This is because condition expressions are used with item-based 
actions where the item in question has already been identified by passing the key 
in a different parameter. Some reasons that you might want to use it are: do not 
overwrite using PutItem, prevent an UpdateItem from creating an invalid state, 
do not delete if the user is not the owner of an item. Without this property, 
you'd have to query before to check the conditions, and you would need to 
handle race conditions. In addition to the comparison operators, it has other 
functions that could be used:
  * attribute_exists() - check that an attribute exists
  * attribute_not_exists() - check that an attribute does not exist. 
  `ConditionExpression: "attribute_not_exists(#username)",`
  * attribute_type() - check an attribute's type
  * begins_with() - value begins with a substring
  * contains() - a string contains a substring
  * size() - check an attribute's size. For a string it's the length, binary is the number
  of bytes. For Lists, maps, sets it returns the number of elements in a set.
  `ConditionExpression: "size(#inprogress) <= 10",`
* **Update expressions** - used in the UpdateItem call to describe the desired updates
to an existing item. When using the UpdateItem API, you will only alter the 
properties you specify. If the item already exists in the table, the attributes 
that you don’t specify will remain the same as before the update operation. In an 
update expression, you need to state the changes you want to make. There are four 
verbs for stating these changes (`UpdateExpression="SET Name = :name, UpdatedAt = :updatedAt REMOVE InProgress"`):
  * SET: Used for adding or overwriting an attribute on an item. Can also be used 
  to add or subtract from a number attribute
  * REMOVE: Used for deleting an attribute from an item or deleting nested 
  properties from a list or map
  * ADD: Used for adding to a number attribute or inserting an element into a set 
  attribute
  * DELETE: Used for removing an element from a set attribute


Key condition expressions, filter expressions, and projection expressions are used
for read operations.

Condition expressions is for all write-based operations.

Update expressions is for update operations only.

All expressions may use the expression attribute names 
(`ExpressionAttributeNames={
  "#a": "Actor"
}`) and all expressions other
than the projection expression must use expression attribute values 
(`ExpressionAttributeValues={
  ":a": { "S": "Natalie Portman" }
}`).

Condition expressions can be used for checks across multiple items. If you want to
perform an action on a certain entity, but you do not have all the data needed
to decide whether to perform that action on the entity, then you can bind multiple
items together in a transaction and if a previous action fails, then the entire
thing fails. The TransactWriteItem API allows you to use up to 10 items in a 
single request. The below example first checks that the user is an admin account.
If so, then perform a delete.
```js
result = dynamodb.transact_write_items(
  TransactItems=[
    {
      "ConditionCheck": {
        "Key": {
          "PK": { "S": "Admins#<orgId>" }
        },
        "TableName": "SaasApp",
        ConditionExpression: "contains(#a, :user)",
        ExpressionAttributeNames={
            "#a": "Admins"
        },
        ExpressionAttributeValues={
            ":user": { "S": <username> }
        }
      }
    },
    {
      "Delete": {
        "Key": {
            "PK": { "S": "Billing#<orgId>" }
        },
        "TableName": "SaasApp"
      }
    }
  ]
}
```

## Data modeling in DynamoDB
It’s a bad idea to model your data in DynamoDB the same way you model your data in 
a relational database.

In a relational database, you use the JOIN operator to connect data from different 
tables in your query. Joins are inefficient at scale, and DynamoDB is built for 
scale. Rather than reassembling your data at read time with a join, you should
preassemble your data in the exact shape that is needed for a read operation.

'Normalization' is basically the database version of the popular code mantra of 
"Don’t Repeat Yourself" (or, "DRY"). If you have data that is duplicated across 
records in a table, you should split the record out into a separate table and 
refer to that record from your original table.

Normalization is on a spectrum, and you go to increasingly higher 'forms' of 
normalization. This goes from first normal form (1NF) and second normal form (2NF) 
all the way to sixth normal form (6NF), with a few unnumbered forms like elementary 
key normal form (EKNF) in between.

1NF - all column values must be atomic, meaning they have a single value.

2NF - all non-key values must depend on the whole key. Non-key values cannot 
depend on just part of the key.  Second Normal Form applies to relations with 
composite keys, that is, relations with a primary key composed of two or more 
attributes. A relation with a single-attribute primary key is automatically in 
at least 2NF.

3NF - two columns on the table must be independent of each other. All non-key 
attributes depend on only the primary key.

Normalization requires joins, as you need to reassemble your normalized records.
For Dynamo, you need to get comfortable denormalizing your data.

There are two reason for normalization:
1. Saving space by cutting duplication - this is no longer applicable, as storage is
cheap
2. Maintaining data integrity - applies, and it's an application concern in Dynamo.

Due to the lack of joins, you will have multiple entities in a single Dynamo table.
If you want both Customers and CustomerItems in a single join, then you'll have to
design your primary key such that it can be done. Due to this, you wouldn't be able
to give descriptive names to your PK attributes.

In a relation DB, you have the WHERE clause for filtering and this allows for whatever
type of access. A WHERE clause needs to read and discard a large number of records, 
and this is wasted compute. Thus, it is not usable at scale. Filtering with 
DynamoDB is much more limited and, as a result, much more performant. The primary 
keys of your table and your secondary indexes determine how you retrieve data.

The DynamoDB approach requires more planning and work upfront but will provide 
long-term benefits as it scales.

The steps for modeling data in DynamoDB are:
* Understand your application
* Create an entity-relationship diagram ("ERD")
* Write out all of your access patterns
* Model your primary key structure
* Satisfy additional access patterns with secondary indexes and streams

Data modeling in DynamoDB is driven entirely by your access patterns. You will 
not be able to model your data in a generic way that allows for flexible access 
in the future. You must shape your data to fit the access patterns.

When using a relational database, you can usually just ship your ERD straight to 
the database. Your entities become tables, and your relationships are configured 
via foreign keys. You design your data in a way that can accommodate flexible 
query patterns in the future

This is not the case when data modeling in DynamoDB. You design your data to 
handle the specific access patterns you have, rather than designing for 
flexibility in the future.

Talk with your PM, engineering manager, business analyst, and other stakeholders 
in your application. Make sure you know all  the needs you have before you start 
designing your table.

There are two different strategies you can use for building these access patterns:
* API-centric approach - common when implementing a REST API. You list out all the
API endpoints you'll support, as well as the shape you'll return in your response.
* UI-centric approach - common for server-side rendering, or backends-for-frontends.
Look at each of the screens and the URLs that will match those screens. Identify
bits of information you need to assemble to build out the screens. Those become your
access patterns.

Describing your access patterns is the most important step. You can handle almost 
any data model with DynamoDB provided that you design for your access patterns up 
front. The biggest problem users face is failing to account for their 
patterns up front, then finding themselves stuck once their data model has 
solidified.
![Access pattern example table](./images/access-pattern-example-table.png)

When modeling your primary key, first create an entity chart. Copy all the 
entities from your ERD into your table.

As you build out your data model, the rows in your entity chart may change. You 
may remove entities that appear in your ERD because they aren’t tracked as 
separate items in DynamoDB. For example, you may use a list or map attribute type 
to represent related objects on a particular item. This denormalized approach
means there’s not a separate item for each of the related entities.

Additionally, you may need to add entities to your chart as you
design your table. A common example here is with a many-to-many relationship where 
you need to add an item type to represent the relationship between entities. You 
could also add an item type solely to ensure uniqueness on a particular attribute 
for an item type.

After deciding the entities and relationships to model, the second step is to 
decide on a simple or composite primary key. Most complex data models use a 
composite primary key but there are exceptions. In general, a rule of thumb is 
that if you have any access patterns that require retrieving multiple entities 
(e.g., Get all Orders for a User) or entity types (e.g., Get a Sensor and the 
most recent SensorReadings for the Sensor), you will need a composite primary key.

The last step is to start designing the primary key format for each entity type. 
Make sure you satisfy the uniqueness requirements first. If you have some 
additional flexibility in your key design after handling uniqueness, try to solve 
some "fetch many" access patterns you have.

There’s no one-size-fits-all approach to designing your primary key, but there are 
a few principles you should keep in mind:
* Consider what your client will know at read time - the client must know the
primary key at read time or otherwise make costly additional queries to figure it out.
For example, if the URL to fetch a particular user is 
`https://api.mydomain.com/users/alexdebrie`, where `alexdebrie` is the username, 
you can safely include username in the primary key as the username will be 
available on the API request. A common anti-pattern is to add a CreatedAt 
timestamp into their primary key. This will help to ensure the primary key for 
your item is unique, but will that timestamp be available when you need to 
retrieve or update that item? If not, use something that will be available or 
find how you will make this information available to the client.
* Use primary key prefixes to distinguish between entity types - can help identifying
the types of entities. As you’re modeling your entities, keep track of primary key
templates in your entity chart as shown below:
  ![Primary key chart](./images/primary-key-chart.png)

Once you’ve modeled your primary keys, you should see a bunch of access patterns 
fall into place. And that’s great! It’s best to do as much as you can with your 
primary keys. You won’t need to pay for additional throughput, and you won’t need 
to consider eventual consistency issues that come with global secondary indexes.

You won’t always be able to model everything with your primary key. That’s where 
you start thinking about secondary indexes. Secondary indexes are a powerful tool 
for enabling additional read patterns on your DynamoDB table.

New users often want to add a secondary index for each read pattern. This is 
overkill and will cost more. Instead, you can overload your secondary indexes 
just like you overload your primary key. Use generic attribute names like 
`GSI1PK` and `GSI1SK` for your secondary indexes and handle multiple access 
patterns within a single secondary index.

## Single table design 
In Dynamo, you should use as few tables as possible. Preferably one.

With multiple tables, you'd have to join by doing multiple network requests. This
would have to happen in a waterfall manner, thus you have to wait on each request, take
the data from a previous one and feed it into the next. As you scale, it becomes
slower and slower.

You can pre-join your data in Dynamo to avoid multiple requests. An item collection
in DynamoDB refers to all the items in a table or index that share a partition key.

A single table also saves on operational overhead as you don't need alarms for multiple
tables, just the one. Additionally, there's cost savings.

There are 3 main downsides to single-table design in Dynamo:
* The steep learning curve to understand single-table design.
* The inflexibility of adding new access patterns - If your access patterns change 
because you’re adding new objects or accessing multiple objects in different ways, 
you may need to do an ETL process to scan every item in your table and update with 
new attributes. This process isn’t impossible, but it does add friction to your
development process. However, migrations aren’t to be feared.
* The difficulty of exporting your tables for analytics - DynamoDB is designed for 
on-line transactional processing (OLTP). But users also have a need for on-line 
analytics processing (OLAP). DynamoDB is not good at OLAP queries. DynamoDB 
focuses on being ultra-performant at OLTP queries and wants you to use other, 
purpose-built databases for OLAP. To do this, you’ll need to get your data from 
DynamoDB into another system. A well-optimized single-table DynamoDB layout looks 
more like machine code than a simple spreadsheet

When not to use a single-table design? Whenever I need query flexibility and/or 
easier analytics more than I need blazing fast performance. There are two main
occasions where this is needed:
* in new applications where developer agility is more important than application 
performance;
* in applications using GraphQL.

If you’re making a greenfield application at a startup, it’s unlikely you 
absolutely require the scaling capabilities of DynamoDB to start, and you may not 
know how your application will evolve over time.

If your application is fine with 100ms response times, the increased flexibility 
and easier analytics for early-stage use cases might be worth the slower 
performance.


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
