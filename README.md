# Retail Q&A | Back-end services for e-commerce site
I worked with another software engineer to rebuild back-end API service from a monolithic to service-oriented microservices to support our existing e-commerce application in this project. The service I built was scaled to meet the demands of production traffic which is 1000rps with < 1s response time with 0% error rate. 

## Technologies used

Backend Development:  Node.js, Express, Postgres, NGINX
</br>
Deployment: Docker, AWS EC2
</br>
Testing: Jest, SuperTest, K6, Loader.io, New Relic

---
## Table of Contents
  - <a href='#system-design'>System Design</a>
  - <a href='#usage'>Usage</a>
  - <a href='#installation'>Installation</a>
  - <a href='#other-services'>Other Services</a>

---
## System Design
  ### Database Design
  ![overview_schema_design](https://user-images.githubusercontent.com/91859887/194092129-9732087d-683f-4546-a28c-d2587701220d.png)

  ### Architecture
  ![Architecture](https://user-images.githubusercontent.com/84343573/184517126-bd7eb432-7719-462c-a325-9b558d8b4039.png)

  
  ### Stress Test Results via Loader.io
  <img width="1154" alt="load tests 1" src="https://user-images.githubusercontent.com/91859887/194101176-56a2dab7-3798-4ba8-9438-d3b866d3b014.png">
  <img width="1131" alt="load tests 2" src="https://user-images.githubusercontent.com/91859887/194101564-4133e03c-9520-4ee5-ab1f-d6c6d4f12192.png">
  <img width="1153" alt="load tests 3" src="https://user-images.githubusercontent.com/91859887/194101721-563030c5-586a-433b-9fd1-a7be74a7e38c.png">

---
## Usage
  ### List all questions
  Returns a list of all questions about products of the retail website.

  `GET /qa/questions`

  Response: `Status: 200 OK`
  <img width="1154" alt="GET /qa/questions" src="https://user-images.githubusercontent.com/91859887/194102731-8ffc792a-ac1c-4b8d-af67-43ec00fb3991.png">

  ### Get a list of answers to a specific question
  Return a list of answers to a specific question of a product

  `GET /qa/questions/:question_id/answers`

  *Query Parameters*

  | Parameter	 | Type      | Description                                               |
  | ---------- | :-------: | --------------------------------------------------------- |
  | question_id |  integer  | Required ID of the question for which data should be returned |

  Response: `Status: 200 OK`
  <img alt="GET /qa/questions/:question_id/answers" src="https://user-images.githubusercontent.com/91859887/194103728-4ce813e1-d559-4b91-9101-0e47b75b5506.png">
 
  ### Get a single product's styles
  Return all styles of single product

  `GET /products/:product_id/styles`

  *Query Parameters*

  | Parameter	 | Type      | Description                                               |
  | ---------- | :-------: | --------------------------------------------------------- |
  | product_id |  integer  | Required ID of the product for which data should be returned |

  Response: `Status: 200 OK`
  ```json
  {
    "product_id": "1",
    "results": [
  	{
      "style_id": 1,
      "name": "Forest Green & Black",
      "original_price": "140",
      "sale_price": "0",
      "default?": true,
      "photos": [
            {
              "thumbnail_url": "urlplaceholder/style_1_photo_number_thumbnail.jpg",
              "url": "urlplaceholder/style_1_photo_number.jpg"
            },
            {
              "thumbnail_url": "urlplaceholder/style_1_photo_number_thumbnail.jpg",
              "url": "urlplaceholder/style_1_photo_number.jpg"
           }
  			  // ...
        ],
      "skus": {
                "37": {
                      "quantity": 8,
                      "size": "XS"
                },
                "38": {
                      "quantity": 16,
                      "size": "S"
                },
                "39": {
                      "quantity": 17,
                      "size": "M"
                },
                //...
            }
       },
      // ...
  }
  ```

  ### Get related products of a single product
  Return all related products' id of single product

  `GET /products/:product_id/related`

  *Query Parameters*

  | Parameter	 | Type      | Description                                               |
  | ---------- | :-------: | --------------------------------------------------------- |
  | product_id |  integer  | Required ID of the product for which data should be returned |

  Response: `Status: 200 OK`
  ```json
  [2,3,5,6]
  ```

---
## Installation
  1. In the terminal inside, run `npm run start` to start server
  2. Test by typing `http://localhost:5000/products` in the Postman to see the response.

---
## Other Services
Please reference Product Overviews API Services that make up the Project Atelier API:
  - <a href='https://github.com/rpp34-sdc-blade/xinxin-overview'>Product Overviews</a> by Xinxin Li
 

  
Perform ETL (load csv files to db) and initialize db setups

In PostgreSQL, run the following queries files:

psql db_name < file_path

1. Run schema.sql
2. Run copyData.sql (if deployed to cloud, run copyData-AWS-EC2.sql instead)
3. Run setPrimarykeySequence.sql
4. Run createIndex.sql

5. After load testing APIs using K6, run deleteK6TestData.sql to delete load test data.
