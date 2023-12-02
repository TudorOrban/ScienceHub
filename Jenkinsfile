pipeline {
    agent any

    environment {
        NEXT_PUBLIC_SUPABASE_URL = credentials('supabase-url')
        NEXT_PUBLIC_SUPABASE_ANON_KEY = credentials('supabase-anon-key')
    }

    stages {
        stage('Checkout Code') {
            steps {
                git credentialsId: 'tudororbanjenkinscredentialsid', url: 'https://github.com/TudorOrban/ScienceHub'
            }
        }

        stage('Start Minikube') {
            steps {
                bat 'minikube start'
            }
        }

        stage('Build and Push Next.js Image') {
            steps {
                bat 'docker build --build-arg NEXT_PUBLIC_SUPABASE_URL=%NEXT_PUBLIC_SUPABASE_URL% --build-arg NEXT_PUBLIC_SUPABASE_ANON_KEY=%NEXT_PUBLIC_SUPABASE_ANON_KEY% -t tudoraorban/sciencehub:sciencehub-website .'
                bat 'docker push tudoraorban/sciencehub:sciencehub-website'
            }
        }

        stage('Build Rust Microservice Image') {
            steps {
                bat '& minikube -p minikube docker-env | Invoke-Expression'
                bat 'docker build -t rust-microservice:latest .'
            }
        }

        stage('Deploy to Minikube') {
            steps {
                bat 'kubectl rollout restart deployment nextjs-deployment'
                bat 'kubectl rollout restart deployment rust-microservice-deployment'
            }
        }
    }
}
