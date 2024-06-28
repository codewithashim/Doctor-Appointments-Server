# Doctor Portal Backend Setup Guide

This guide will walk you through setting up the Doctor Portal backend server. Doctor Portal is a platform designed for managing doctor appointments and patient records.

## Prerequisites

Before you begin, ensure you have the following installed:

- Node.js (v18.x or later)
- npm (v9.x.x or later)
- Docker Desktop (for Docker setup)

## Getting Started

### 1. Clone the Repository

Clone the DoctorPortal backend repository from GitHub:

```bash
git clone https://github.com/codewithashim/Doctor-Appointments-Server.git
cd Doctor-Appointments-Server
```

### 2. Install Dependencies

Install npm dependencies:

```bash
yarn install

yarn install ---force (if yarn install is not work then use this)
```

### 3. Configure Environment Variables

Create a `.env` file in the root directory based on `.env.example` and configure your environment variables such as database connection details, JWT secrets, etc.

```

cp .env.example .env

```

copy form the .env.example to

### 5. Build and Run the Server

#### Without Docker

```
yarn dev
```

#### With Docker

Ensure Docker Desktop is running and execute:

```

docker-compose up

```

**DATABASE DESIGN AND SYSTEM DESIGN : https://app.eraser.io/workspace/YtRCoOlSgPRDx9AYs8CH?origin=share**
