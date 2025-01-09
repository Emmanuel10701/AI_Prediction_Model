# Step 1: Build the React Frontend
FROM node:14 AS build

# Set the working directory in the container
WORKDIR /app/frontend

# Copy package.json and package-lock.json and install dependencies
COPY frontend/package*.json ./
RUN npm install

# Copy the rest of the frontend files
COPY frontend/ ./

# Build the frontend app
RUN npm run build

# Step 2: Set up the Django Backend
FROM python:3.9 AS backend

# Set the working directory for Django
WORKDIR /ML/backend

# Install dependencies for the Django app
COPY backend/requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

# Copy the Django app files
COPY backend/ ./

# Set environment variables for Django
ENV PYTHONUNBUFFERED=1

# Step 3: Create a multi-stage Dockerfile
# This helps in separating frontend and backend build processes

# Step 4: Set up the final image with both React and Django

# Start with a lightweight image
FROM python:3.9-slim

# Set working directory
WORKDIR /ML

# Install dependencies for the backend
COPY --from=backend /ML/backend /ML/backend
COPY --from=build /ML/frontend/build /ML/frontend/build

# Install additional dependencies for running Django (e.g., Gunicorn for serving Django)
RUN pip install gunicorn

# Expose ports for both frontend and backend (adjust according to your app)
EXPOSE 8000 3000

# Set the command to run both frontend (React) and backend (Django) servers
CMD ["sh", "-c", "cd /ML/backend && gunicorn --bind 0.0.0.0:8000 myapp.wsgi:application & cd /ML/frontend && npm start"]
