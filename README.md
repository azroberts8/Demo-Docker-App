# Demo Node MySQL Docker App
![Docker](https://img.shields.io/badge/docker-%230db7ed.svg?style=for-the-badge&logo=docker&logoColor=white) ![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white) ![MySQL](https://img.shields.io/badge/mysql-4479A1.svg?style=for-the-badge&logo=mysql&logoColor=white)  
This repo serves as a demonstration of how to use Docker and Docker Compose to bundle and deploy a basic Node.js application that uses MySQL as its database.

### Quick Start
**Build Node App Docker Image**
```bash
docker build -t demoapp ./src
```
This uses the `Dockerfile` located in `/src` to build a new Docker image called `demoapp`. This Dockerfile uses the Docker `node` image as it's base, copies our node project into the image, and installs the project's dependencies within the image. We now have a portable Docker image for our demo node app that can be launched on any system with Docker.

**Create Directory For Database To Persist**
```bash
mkdir ./sql-data
```
Since containers are [stateless](https://www.techtarget.com/whatis/definition/stateless-app), when we shut it down we will lose any data that was modified while it was running. In order to save data between container restarts we need to mount a directory from our host machine into the container where our stateful files will exist. Essentially, all files relevant to our database will live here.

**Launch Docker Infrastructure**
```bash
docker compose up -d
```
This uses the `compose.yml` file to create 2 Docker containers - one from the official mysql Docker image and the other from the image we just generated earlier. Our `compose.yml` specifies that both of the containers are on the same Docker network so our Node application is able to make requests to the database using the container name as its hostname. Port 3000 is exposed on our application container so we can access this from our host machine at `http://localhost:3000/`.  
We have also specified database credentials in the compose file for both setting up the MySQL datbase as well as connecting to it within our Node app. In production **DO NOT** commit these credentials to your repository. These credentials can optionally be saved in a `.env` file that is included in your `.gitignore` to avoid publicly leaking them.