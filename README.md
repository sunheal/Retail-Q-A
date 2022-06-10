# rpp34-sunheal-QAs

Perform ETL (load csv files to db) and initialize db setups

In PostgreSQL, run the following queries files:

psql db_name < file_path

1. Run schema.sql
2. Run copyData.sql
3. Run setPrimarykeySequence.sql
4. Run createIndex.sql

After load testing APIs using K6, run deleteK6TestData.sql to delete load test data.