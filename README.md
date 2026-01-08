# BlackBox

This project is a web application with a Flutter frontend and a Python FastAPI backend. The entire application is containerized using Docker and can be run with Docker Compose.

## Prerequisites

Before you begin, ensure you have the following installed on your system:
- [Docker](https://docs.docker.com/get-docker/)
- [Docker Compose](https://docs.docker.com/compose/install/)

## How to Run the Project

This project is configured to run entirely within Docker containers, orchestrated by Docker Compose.

### 1. Build and Run the Application

To build the Docker images and start the containers for both the frontend and backend, follow these steps:

1.  Open a terminal or command prompt in the root directory of this project (the same directory where the `docker-compose.yml` file is located).

2.  Run the following command:
    ```bash
    docker-compose up --build
    ```
    - The `--build` flag tells Docker Compose to build the images from the `Dockerfile`s before starting the containers.
    - This process may take some time on the first run as it needs to download base images and build the Flutter application. Subsequent builds will be faster due to Docker's caching.

### 2. Accessing the Services

Once the containers are running, you can access the different parts of the application:

-   **Frontend (Flutter Web App):**
    Open your web browser and navigate to:
    `http://localhost:8080`

-   **Backend (FastAPI):**
    The backend API is accessible at `http://localhost:8000`. You can access the auto-generated API documentation (Swagger UI) by navigating to:
    `http://localhost:8000/docs`

### 3. Stopping the Application

To stop the running application and shut down the containers, follow these steps:

1.  Go back to the terminal where the `docker-compose up` command is running.
2.  Press `Ctrl + C`.

To stop the containers and remove them (along with the networks created), you can run the following command from the project root:
```bash
docker-compose down
```

## Project Structure

-   `frontend/`: Contains the Flutter frontend application and its `Dockerfile`.
-   `backend/`: Contains the Python FastAPI backend application and its `Dockerfile`.
-   `docker-compose.yml`: The Docker Compose file that defines and orchestrates the frontend and backend services.
-   `README.md`: This file.