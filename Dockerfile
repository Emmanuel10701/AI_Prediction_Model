# Step 1: Build the Next.js Frontend
FROM node:16 AS frontend-build

# Set the working directory for the frontend
WORKDIR /app/frontend

# Copy package.json and package-lock.json and install dependencies
COPY frontend/package*.json ./
RUN npm install

# Copy the rest of the frontend files
COPY frontend/ ./

# Build the Next.js app
RUN npm run build

# Step 2: Set up the Django Backend
FROM python:3.9 AS backend-build

# Set the working directory for Django
WORKDIR /app/backend

# Copy the requirements file and install dependencies
COPY backend/requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

# Copy the Django app files
COPY backend/ ./

# Set environment variables for Django
ENV PYTHONUNBUFFERED=1

# Step 3: Create the final image
FROM python:3.9-slim-buster

# Set the working directory
WORKDIR /app

# Copy the backend and frontend build artifacts
COPY --from=backend-build /app/backend /app/backend
COPY --from=frontend-build /app/frontend/.next /app/frontend/.next
COPY --from=frontend-build /app/frontend/public /app/frontend/public
COPY --from=frontend-build /app/frontend/package.json /app/frontend/package.json

# Install Gunicorn for Django and PM2 for Next.js
RUN pip install gunicorn && npm install -g pm2

# Expose ports for both backend and frontend
EXPOSE 8000 3000

# Set the command to run both servers
CMD ["sh", "-c", "cd /app/backend && gunicorn --bind 0.0.0.0:8000 myapp.wsgi:application & cd /app/frontend && pm2 start npm --name 'nextjs' -- start && pm2 logs"]
