# rpp34-sunheal-QAs

Perform ETL (load csv files to db) and initialize db setups

In PostgreSQL, run the following queries files:

psql db_name < file_path

1. Run schema.sql
2. Run copyData.sql (if deployed to cloud, run copyData-AWS-EC2.sql instead)
3. Run setPrimarykeySequence.sql
4. Run createIndex.sql

5. After load testing APIs using K6, run deleteK6TestData.sql to delete load test data.