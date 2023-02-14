# DynamoDB Capacity
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