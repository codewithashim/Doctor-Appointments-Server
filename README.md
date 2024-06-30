# API DOC

```
https://documenter.getpostman.com/view/19459280/2sA3duFsdH
```

# System Design And Database Design

```
https://app.eraser.io/workspace/YtRCoOlSgPRDx9AYs8CH?origin=share
```

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

```
yarn dev
```

# Doctor Portal API Setup Guide On Postman

## Prerequisites

1. **Postman**: Ensure you have [Postman](https://www.postman.com/downloads/) installed.
2. **Doctor Portal.postman_collection.json**: Ensure the `Doctor Portal.postman_collection.json` file is present in your project root or accessible location.

## Steps to Import Postman Collection

1. **Open Postman**:

   - Launch the Postman application on your computer.
2. **Import the Collection**:

   - Click on the `Import` button in the top-left corner of the Postman app.
   - You will see different import options. Choose the `Upload Files` option.
   - Navigate to the location where `Doctor Portal.postman_collection.json` is stored and select the file.
   - Click `Open` to import the collection.
3. **Access the Collection**:

   - Once the import is complete, you will see the `Doctor Portal` collection listed in the Collections tab on the left sidebar.
   - Expand the collection to see the available requests.

## Usage

1. **Set Environment Variables**:

   - If your API requires environment variables, ensure you have the correct environment setup in Postman.
   - Click on the `Environments` tab and create or select an environment, then add the necessary variables (e.g., `baseUrl`, `apiKey`, etc.).
2. **Run Requests**:

   - Select the desired request from the `Doctor Portal` collection.
   - Click the `Send` button to execute the request.
   - View the response in the response section below.
3. **Running Tests**:

   - Some requests may have pre-configured tests.
   - After running a request, navigate to the `Tests` tab to see the results of the tests.

## Additional Resources

- [Postman Documentation](https://learning.postman.com/docs/getting-started/introduction/)
- [Postman Learning Center](https://learning.postman.com/)

# **Database Acess If Need** 

```
mongodb+srv://DoctorPortalServer:ZPzS2E7OrwypvEdy@doctorportalserver.4uklp2z.mongodb.net/DoctorPortal?retryWrites=true&w=majority&appName=DoctorPortalServer
```

Open MongoDB Compass and here pest the uri here 

[![1719784585317](image/README/1719784585317.png)]()

![1719784707085](image/README/1719784707085.png)
