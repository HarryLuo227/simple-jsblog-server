# Simple-jsBlog-Server

This is a simple practice project of blog backend written in JavaScript with features below:
- Custom logger service to show app log according to the logging level
- Blog features implement
- Unit test of all API endpoints

## Setup

### Prerequisite

***You should have `docker` and `docker compose` installed in your local environment.***

### Procedures

1. Clone project and change current directory to this project root directory.
2. Run below command in terminal to setup app:
   ```Bash
   sudo docker compose up --build -d
   ``` 

> [!TIP]
> If you want to run the test, execute below command after you run up the app:
> ```Bash
> sudo docker exec -it jsblog-app-server npm run test
> ```

## Close and remove

### Procedures

1. Change current directory to this project root directory.
2. Run below command in terminal to remove app:
   ```Bash
   sudo docker compose down
   ```

## Features

### About USER

- User registry
- User login and return jwt token

### About TAG of blog article

- List all tags
- List specific tag details
- Create a new tag
- Update tag details
- Delete a tag

### About ARTICLE of blog

- List all articles (include article's tag)
- List specific article details (include article's tag)
- Create a new article
- Update article details
- Delete a article

> [!NOTE]
> You can run up the app and browse the all APIs detail via http://localhost:3000/api/docs
> ![Simple-Jsblog-Server-APIs](./imgs//simple-jsblog-server-apis.png)
