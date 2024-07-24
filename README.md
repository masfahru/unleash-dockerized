# Unleash Dockerized

A Docker container solution for [Unleash](https://getunleash.io/), a feature toggle system, utilizing Node.js clustering for enhanced performance and scalability.

## Description

This project provides a Docker image for Unleash, powered by a Node.js cluster to ensure better performance and scalability. It's designed to be easy to deploy and scalable, fitting into your CI/CD pipeline seamlessly.

## Installation

To get started with `unleash-dockerized`, you'll need Docker installed on your system. Once Docker is set up, you can build the Docker image using the following command:

```bash
docker buildx build -t unleash-dockerized .
```

## Usage

After building the image, copy `.env.example` to `.env` and modify `.env` file with your database credentials and other configurations. Then, you can run the Docker container using the following command:

```bash
docker run --name unleash -p {port}:{port} --env-file ./.env unleash-dockerized
```

Change `{port}` to the port you want to expose the Unleash server on. For example, to expose the server on port 4242, you can run:

```bash
docker run --name unleash -p 4242:4242 --env-file ./.env unleash-dockerized
```

This command will start the Unleash server and expose it on port 4242 of your host machine.

## Contributing

Contributions are what make the open-source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

## License

This project is licensed under the MIT License - see the LICENSE file for details.
