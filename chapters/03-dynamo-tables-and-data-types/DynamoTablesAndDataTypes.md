# DynamoDB tables and data types

## DynamoDB Tables
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


## DynamoDB Data Types
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
