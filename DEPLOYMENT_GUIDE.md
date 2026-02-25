# Multi-Funds Investment Deployment Guide

## Introduction
This guide provides comprehensive instructions for deploying the Multi-Funds Investment project on AWS, Heroku, and DigitalOcean using Docker. Make sure you have the prerequisites before starting.

## Prerequisites
- Docker installed on your machine
- Access credentials for AWS, Heroku, and DigitalOcean
- Basic knowledge of terminal commands and Docker

## Docker Setup

### Docker Installation
1. Follow the instructions on the official [Docker website](https://docs.docker.com/get-docker/) to install Docker on your local machine.

### Building Docker Images
```bash
docker build -t multi-funds-investment .
```

### Docker-Compose Configuration
Create a `docker-compose.yml` file for multi-container applications. Example:
```yaml
version: '3'
services:
  app:
    image: multi-funds-investment
    ports:
      - "8000:8000"
    environment:
      - ENV_VAR_NAME=value
```

## Deployment on AWS

### Creating AWS Account
- Sign up for an [AWS account](https://aws.amazon.com/).

### Setting Up EC2 Instance
1. Navigate to the EC2 Dashboard.
2. Launch a new instance choosing an appropriate AMI.

### Configuring Security Groups
- Open ports (e.g., 80, 443, 8000) in the security group settings.

### SSH Access
- Access your instance using SSH:
```bash
ssh -i "your-key.pem" ec2-user@your-ec2-instance-public-dns
```

### Deploying Docker Container
1. Pull your Docker image.
2. Run the Docker container:
```bash
docker run -d -p 8000:8000 multi-funds-investment
```

### Setting Up Environment Variables
- Use export command or define in your Docker-Compose file.

## Deployment on Heroku

### Creating Heroku Account
- Sign up for a [Heroku account](https://www.heroku.com/).

### Installing Heroku CLI
- Follow the [Heroku CLI installation guide](https://devcenter.heroku.com/articles/heroku-cli).

### Creating a Heroku App
```bash
heroku create multi-funds-investment
```

### Deploying Docker Container on Heroku
```bash
heroku container:push web --app multi-funds-investment
heroku container:release web --app multi-funds-investment
```

### Configuring Environment Variables
```bash
heroku config:set ENV_VAR_NAME=value --app multi-funds-investment
```

## Deployment on DigitalOcean

### Creating DigitalOcean Account
- Sign up for a [DigitalOcean account](https://www.digitalocean.com/).

### Setting Up Droplet
1. Create a new Droplet (select the Docker image).

### Deploying Docker Container
1. SSH into your droplet.
2. Run the Docker container similarly as in AWS.

### Setting Up Environment Variables
- Set environment variables in the same way as demonstrated above.

## Conclusion
You have successfully deployed the Multi-Funds Investment project on AWS, Heroku, and DigitalOcean using Docker. For more resources, please refer to the respective cloud provider documentation.