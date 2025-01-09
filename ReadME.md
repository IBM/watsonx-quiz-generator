# WatsonX Quiz Generator 🚀

This is a full-stack application that consists of a FastAPI backend and a Next.js frontend, running in containers using Docker Compose or Podman Compose.

## 📥 Prerequisites

Ensure you have the following installed:

### For Docker Users

- Docker (version 20+ recommended)
- Docker Compose

### For Podman Users

- Podman (version 4+ recommended)
- Podman Compose (podman-compose)

```bash
sudo apt install podman-compose  # Ubuntu/Debian
brew install podman-compose      # macOS
```

## 🚀 Running the Application

### 1️⃣ Clone or Download the Repository

```bash
git clone <your-repo-url>
cd <your-repo-folder>
```

### 2️⃣ Run with Docker

```bash
docker-compose up -d
```

This will start both the backend and frontend containers in detached mode (`-d`).

### 3️⃣ Run with Podman

```bash
podman compose up -d
```

**⚠️ Note:** Podman runs rootless by default, so ensure your user has the necessary permissions.

## ⚡ Stopping the Application

To stop and remove running containers:

```bash
docker-compose down  # If using Docker
podman compose down  # If using Podman
```

## 🛠 Troubleshooting

### Common Issues

1. **Docker Daemon Not Running**

   - Ensure Docker is running:

     ```bash
     docker info
     ```

2. **Podman Rootless Mode Issues**

   - If using Podman rootless, run:

     ```bash
     podman system migrate
     ```

3. **Port Conflicts**

   - Check if ports 3000 (frontend) or 8000 (backend) are in use:

     ```bash
     lsof -i :3000
     lsof -i :8000

     ```
