# BlackBox

This project is a full-stack web application with an Expo (React Native) frontend and a Python FastAPI backend. The entire application is containerized using Docker and can be run with Docker Compose.

## Prerequisites

Before you begin, ensure you have the following installed on your system:
- [Docker](https://docs.docker.com/get-docker/)
- [Docker Compose](https://docs.docker.com/compose/install/)
- [Node.js](https://nodejs.org/en/download/) (which includes npm) or [Yarn](https://yarnpkg.com/getting-started/install) or [Bun](https://bun.sh/docs/installation) for frontend development.
- [Python 3](https://www.python.org/downloads/) for backend development.
- [uvicorn](https://www.uvicorn.org/) for running the FastAPI backend.

## Project Overview

The application is structured around three main user roles: Sender, Transporter, and Receiver, each accessible via a dedicated tab in the bottom navigation bar.

-   **Sender:** Manage your outgoing shipments. This is where you can initiate new shipments.
-   **Transporter:** View assigned tasks and transport details.
-   **Receiver:** View incoming shipments.

A floating action button (FAB) on the **Sender** page allows you to create new shipments, taking you to the "Add Shipment" page.

## How to Run the Project

This project can be run using Docker Compose for both frontend and backend, or by running each service independently.

### Option 1: Run with Docker Compose (Recommended for integrated development)

To build the Docker images and start the containers for both the frontend and backend, follow these steps:

1.  Open a terminal or command prompt in the root directory of this project (the same directory where the `docker-compose.yml` file is located).

2.  Run the following command:
    ```bash
    docker-compose up --build
    ```
    - The `--build` flag tells Docker Compose to build the images from the `Dockerfile`s before starting the containers.
    - This process may take some time on the first run as it needs to download base images and dependencies.
    - Keep this terminal open as it will display logs from both services.

### Option 2: Run Frontend and Backend Separately (For frontend-focused development)

If you prefer to run the frontend and backend independently, follow these steps:

#### 1. Start the Backend

1.  Open a terminal or command prompt in the root directory of this project.
2.  Navigate to the `backend` directory:
    ```bash
    cd backend
    ```
3.  (Optional) Create and activate a virtual environment:
    ```bash
    python -m venv venv
    ./venv/Scripts/activate # On Windows
    source venv/bin/activate # On macOS/Linux
    ```
4.  Install backend dependencies:
    ```bash
    pip install -r requirements.txt
    ```
5.  Start the FastAPI backend server:
    ```bash
    uvicorn main:app --host 0.0.0.0 --port 8000 --reload
    ```
    - The backend will be accessible at `http://localhost:8000`.

#### 2. Start the Frontend

1.  Open a **new** terminal or command prompt in the root directory of this project.
2.  Navigate to the `frontend` directory:
    ```bash
    cd frontend
    ```
3.  Install frontend dependencies (if you haven't already):
    ```bash
    npm install # or yarn install or bun install
    ```
4.  Start the Expo development server:
    ```bash
    npm start # or yarn start or bun start
    ```
    - This will launch the Expo development server and provide you with options to open the app in a web browser, emulator, or on your physical device using the Expo Go app.

### 3. Stopping the Application

-   **For Docker Compose:** Go back to the terminal where `docker-compose up` is running and press `Ctrl + C`. To stop and remove containers, run `docker-compose down`.
-   **For Separate Services:** Press `Ctrl + C` in each terminal where the backend and frontend servers are running.

### 4. Accessing the Services

Once the application is running (either via Docker Compose or separately):

-   **Frontend (Expo App):**
    Open your web browser (if running `npm start --web`) or your Expo Go app (if running on device/emulator). The app will load with the **Sender** tab as the default screen.

    The application features three main tabs:
    -   **Sender:** Manage your outgoing shipments. From this page, you can tap the "Send New" floating button to access the **Add Shipment** page.
    -   **Transporter:** View assigned tasks and transport details.
    -   **Receiver:** View incoming shipments.

-   **Backend (FastAPI):**
    The backend API is accessible at `http://localhost:8000`. You can access the auto-generated API documentation (Swagger UI) by navigating to:
    `http://localhost:8000/docs`

    **Note on Frontend-Backend Communication:**
    During separate development, the frontend directly calls the backend at `http://localhost:8000`. When using Docker Compose, internal Docker networking handles the communication, but `localhost:8000` is exposed to your host machine for direct access and testing. If running the Expo app on a physical device or emulator and the backend is in a Docker container, you might need to replace `localhost` with your host machine's actual IP address in the frontend code.

## Project Structure

-   `frontend/`: Contains the Expo (React Native) frontend application and its `Dockerfile`.
    -   `app/(tabs)/sender.tsx`: The main screen for managing outgoing shipments.
    -   `app/(tabs)/transporter.tsx`: The main screen for transporters to view tasks.
    -   `app/(tabs)/incoming.tsx`: The main screen for receivers to view incoming shipments.
    -   `app/add-shipment.tsx`: The page for creating a new shipment, accessible via the "Send New" button on the Sender tab.
-   `backend/`: Contains the Python FastAPI backend application and its `Dockerfile`.
-   `docker-compose.yml`: The Docker Compose file that defines and orchestrates the frontend and backend services.
-   `README.md`: This file.
