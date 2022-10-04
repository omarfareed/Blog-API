# Blog API application

## to try the api follow ![this link](https://omar-blog-api.onrender.com/post)

## For Swagger documentation for more api details see ![this link](https://app.swaggerhub.com/apis/FAREEDOMAR159_1/swagger-blog_app_open_api_1_0_0/1.0.0)

## Description

this is a simple api as your blog for posts

## functionality

- create new user (signup)
- login
- create post
- see all posts
- see posts for specific users
- delete post

## How to install?

### Clone the repo in your local machine

```bash
git clone git@github.com:omarfareed/Blog-API.git
```

### Create your env variables

- create a `.env` file
- add the following parameters inside
  - MONGO_URL
  - JWT_SECRET
  - JWT_EXPIRES_IN
  - JWT_COOKIE_EXPIRES_IN

### run the following commands

```bash
sudo docker build -t blog-api:1.0.0 .
sudo docker run -p 3000:3000 blog-api:1.0.0
```
