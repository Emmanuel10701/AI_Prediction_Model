pipeline {
    agent any

    environment {
        DOCKER_IMAGE = 'jumaste-image'       // Replace with your desired image name
        DOCKER_TAG = "${env.BRANCH_NAME}-${env.GIT_COMMIT}"  // Use Git commit hash or branch name for tags
        DOCKER_REGISTRY = 'emmanuel10701'    // Replace with your Docker Hub username
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm  // This checks out the source code from GitHub
            }
        }

        stage('Build Docker Image') {
            steps {
                script {
                    sh 'docker build -t $DOCKER_REGISTRY/$DOCKER_IMAGE:$DOCKER_TAG .'  // Build Docker image
                }
            }
        }

        stage('Push Docker Image') {
            steps {
                script {
                    sh 'docker login -u $DOCKER_USERNAME -p $DOCKER_PASSWORD'  // Login to Docker Hub
                    sh 'docker push $DOCKER_REGISTRY/$DOCKER_IMAGE:$DOCKER_TAG'  // Push Docker image to registry
                }
            }
        }

        stage('Deploy') {
            steps {
                script {
                    sh 'docker run -d -p 3000:3000 $DOCKER_REGISTRY/$DOCKER_IMAGE:$DOCKER_TAG'  // Deploy Docker container
                }
            }
        }
    }
}
