# BlackBox

This project is a full-stack web application with an Expo (React Native) frontend and a Python FastAPI backend. The application is containerized using **Distroless** images for enhanced security and minimized footprint.

## Prerequisites

Before you begin, ensure you have the following installed on your system:
- [Docker](https://docs.docker.com/get-docker/)
- [Docker Compose](https://docs.docker.com/compose/install/)
- [Bun](https://bun.sh/) (Recommended for frontend speed) or [Node.js](https://nodejs.org/).
- [Python 3.11+](https://www.python.org/downloads/) for local backend development.

### Mobile Development Tools
To test the mobile app on a physical device, download the **Expo Go** app:
- **Android:** [Get it on Google Play](https://play.google.com/store/apps/details?id=host.exp.exponent)
- **iOS:** [Download on the App Store](https://apps.apple.com/us/app/expo-go/id982107779)

## Project Overview

The application is structured around three main user roles: Sender, Transporter, and Receiver, each accessible via a dedicated tab in the bottom navigation bar.

-   **Sender:** Manage your outgoing shipments. This is where you can initiate new shipments via the "Send New" button.
-   **Transporter:** View assigned tasks and transport details.
-   **Receiver:** View incoming shipments.

## Architecture & Docker Strategy

This project uses a **Production-Grade** containerization strategy:

1.  **Frontend (Web):** Built using `expo export` and served statically using `bun x serve`. It runs as a Single Page Application (SPA).
2.  **Backend (API):** Built using a multi-stage Docker process. The final image is based on Google's **Distroless** Python image, containing only the application and necessary runtime dependencies (no shell, no package managers) for maximum security.

## How to Run the Project

### Option 1: Run with Docker Compose (Production Preview)

**Note:** This mode runs the **optimized, static build** of the application. Hot-reloading is disabled. If you make code changes, you must rebuild the containers.

1.  Open a terminal in the root directory.
2.  Run the following command:
    ```bash
    docker-compose up --build -d
    cd frontend
    npm run start / bun web 
    ```
3.  Access the application:
    -   **Frontend:** `http://localhost:3000` (Served via Bun)
    -   **Backend:** `http://localhost:8000` (Served via Uvicorn/Distroless)

*To stop the application, press `Ctrl + C`.*

### Option 2: Run Separately (For Local Development)

Use this method if you are actively writing code and need **Hot Reloading**.

#### 1. Start the Backend

1.  Navigate to the `backend` directory:
    ```bash
    cd backend
    ```
2.  Create and activate a virtual environment (recommended):
    ```bash
    python -m venv venv
    # Windows:
    .\venv\Scripts\activate
    # macOS/Linux:
    source venv/bin/activate
    ```
3.  Install dependencies:
    ```bash
    pip install -r requirements.txt
    ```
4.  Start the server with reload enabled:
    ```bash
    uvicorn main:app --host 0.0.0.0 --port 8000 --reload
    ```
    - API Docs: `http://localhost:8000/docs`

#### 2. Start the Frontend

1.  Open a new terminal and navigate to the `frontend` directory:
    ```bash
    cd frontend
    ```
2.  Install dependencies:
    ```bash
    bun install  # or npm install
    ```
3.  Start the Expo development server:
    ```bash
    bun start    # or npm start
    ```
4.  **Launch on Device:**
    -   Press `w` to open in the web browser.
    -   Scan the QR code printed in the terminal using the **Expo Go** app on your Android or iOS device.

## Configuration & Networking

-   **API URL:** The frontend automatically attempts to detect the host IP address using `expo-constants` to communicate with the backend.
-   **Docker Networking:** In Docker Compose, the services communicate via internal networking, but ports `3000` and `8000` are exposed to your host machine for access.

## DEMO Vimeo Link
https://vimeo.com/1152638130?fl=ip&fe=ec

## Project Structure

-   `frontend/`: Expo/React Native application.
    -   `Dockerfile`: Uses `oven/bun` to build and serve static files.
    -   `app/(tabs)/`: Main screens (Sender, Transporter, Receiver).
    -   `app/add-shipment.tsx`: Form for creating shipments and calculating price estimates.
-   `backend/`: FastAPI application.
    -   `Dockerfile`: Multi-stage build using `python:slim` (builder) and `gcr.io/distroless/python3` (runtime).
-   `docker-compose.yml`: Orchestrates the services. **Volumes are disabled** to ensure the Distroless environment is used correctly.

## Troubleshooting

-   **"Command not found" inside Docker:**
    Because the backend uses **Distroless** images, there is no `/bin/sh` or `bash`. You cannot `docker exec` into the backend container to run shell commands. This is a security feature.
-   **Frontend 404 on Refresh:**
    The Docker container uses `bun x serve -s`. The `-s` flag ensures that refreshing a sub-route (e.g., `/sender`) redirects to `index.html` correctly, allowing React Navigation to handle the route.