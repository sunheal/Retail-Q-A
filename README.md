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
  - <a href='#db-initialization-and-etl-quaries-in-postgres'>DB Initialization and ETL Quaries in Postgres</a>
  - <a href='#installation'>Installation</a>
  - <a href='#other-services'>Other Services</a>

---
## System Design
  ### Database Design
  ![overview_schema_design](https://user-images.githubusercontent.com/91859887/194092129-9732087d-683f-4546-a28c-d2587701220d.png)

  ### Architecture
  ![Architecture](https://user-images.githubusercontent.com/84343573/184517126-bd7eb432-7719-462c-a325-9b558d8b4039.png)

  
  ### Stress Test Results via Loader.io
  <img width="1100" alt="load tests 1" src="https://user-images.githubusercontent.com/91859887/194101176-56a2dab7-3798-4ba8-9438-d3b866d3b014.png">
  <img width="1100" alt="load tests 2" src="https://user-images.githubusercontent.com/91859887/194101564-4133e03c-9520-4ee5-ab1f-d6c6d4f12192.png">
  <img width="1100" alt="load tests 3" src="https://user-images.githubusercontent.com/91859887/194101721-563030c5-586a-433b-9fd1-a7be74a7e38c.png">

---
## Usage
  ### List questions
  Retrieves a list of questions for a particular product. This list does not include any reported questions

  `GET /qa/questions`
  
  *Query Parameters*

  | Parameter	 | Type      | Description                                               |
  | ---------- | :-------: | --------------------------------------------------------- |
  | product_id |  integer  | Required ID of the question for which data should be returned |
  | page |  integer  | Selects the page of results to return. Default 1. |
  | count |  integer  | Specifies how many results per page to return. Default 5 |

  Response: `Status: 200 OK`
  
  <img alt="GET /qa/questions" src="https://user-images.githubusercontent.com/91859887/194102731-8ffc792a-ac1c-4b8d-af67-43ec00fb3991.png">

  
  ### Answers List
  Returns answers for a given question. This list does not include any reported answers

  `GET /qa/questions/:question_id/answers`

  *Query Parameters*

  | Parameter	 | Type      | Description                                               |
  | ---------- | :-------: | --------------------------------------------------------- |
  | question_id |  integer  | Required ID of the question for which answers are needed |

  Response: `Status: 200 OK`
  
  <img alt="GET /qa/questions/:question_id/answers" src="https://user-images.githubusercontent.com/91859887/194103728-4ce813e1-d559-4b91-9101-0e47b75b5506.png">
 
  
  ### Add a Question
  Adds a question for the given product

  `POST /qa/questions`

  *Query Parameters*

  | Parameter	 | Type      | Description                                               |
  | ---------- | :-------: | --------------------------------------------------------- |
  | body |  text  | Text of question being asked |
  | name |  text  | Username for question asker |
  | email |  text  | Email address for question asker |
  | product_id |  integer  | Required ID of the Product for which the question is posted |

  Response: `Status: 201 Created`

  
  ### Mark Question as Helpful
  Updates a question to show it was found helpful

  `PUT /qa/questions/:question_id/helpful`

  *Query Parameters*

  | Parameter	 | Type      | Description                                               |
  | ---------- | :-------: | --------------------------------------------------------- |
  | question_id |  integer  | Required ID of the question to update |

  Response: `Status: 204 NO CONTENT`
  
  
  ### Report Question
  Updates a question to show it was reported. Note, this action does not delete the question, but the question will not be returned in the above GET request

  `PUT /qa/questions/:question_id/report`

  *Query Parameters*

  | Parameter	 | Type      | Description                                               |
  | ---------- | :-------: | --------------------------------------------------------- |
  | question_id |  integer  | Required ID of the question to update |

  Response: `Status: 204 NO CONTENT`
  
  
  ### Mark Answer as Helpful
  Updates an answer to show it was found helpful

  `PUT /qa/answers/:answer_id/helpful`

  *Query Parameters*

  | Parameter	 | Type      | Description                                               |
  | ---------- | :-------: | --------------------------------------------------------- |
  | answer_id |  integer  | Required ID of the answer to update |

  Response: `Status: 204 NO CONTENT`
  
  
  ### Report Answer
  Updates an answer to show it has been reported. Note, this action does not delete the answer, but the answer will not be returned in the above GET request

  `PUT /qa/answers/:answer_id/helpful`

  *Query Parameters*

  | Parameter	 | Type      | Description                                               |
  | ---------- | :-------: | --------------------------------------------------------- |
  | answer_id |  integer  | Required ID of the answer to update |

  Response: `Status: 204 NO CONTENT`


---
## DB Initialization and ETL Quaries in Postgres
  1. Run schema.sql
  2. Run copyData.sql (if deployed to cloud, run copyData-AWS-EC2.sql instead)
  3. Run setPrimarykeySequence.sql
  4. Run createIndex.sql
  5. After load testing APIs using K6, run deleteK6TestData.sql to delete load test data.

---
## Installation
  1. In the terminal inside, run `npm run start` to start server
  2. Test by typing `http://localhost:3000/qa/questions` in the Postman to see the response.

---
## Other Services
Please reference Product Overviews API Services that make up the other part of the e-commerce app API:
  - <a href='https://github.com/rpp34-sdc-blade/xinxin-overview'>Product Overviews</a> by Xinxin Li
 
