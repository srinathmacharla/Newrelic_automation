pipeline {
    agent any
    tools {
        nodejs '21.0.0'
        terraform 'terraform auto' 
    }
    stages {
        stage('Build TypeScript') {
            steps {
                dir('src') {
                    sh 'node create-dashboards.js'
                }
            }
        }
        stage('Terraform init') {
                steps {
                    dir('src') {
                        sh 'terraform init'
                }
            } 
        }
        stage('Dashboard apply') {
                steps {
                    dir('src') {
                        sh 'terraform apply -auto-approve'
                }
            } 
        }
    }
}
