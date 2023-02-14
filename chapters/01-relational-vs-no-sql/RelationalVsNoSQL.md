# Relational DB comparison with NoSQL

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

## ACID
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

## Scaling
SQL by default relies on vertical scaling. To enable horizontal scaling
you have to re-work your model, need additional investments into infra.

NoSQL by default relies on horizontal scaling.

## Interaction APIs
SQL uses SQL (Structured Query Language) for interaction.

NoSQL uses object-based APIs for interaction. So you use partition keys
or primary keys to look up any data stored.