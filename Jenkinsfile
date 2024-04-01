pipeline {
    agent any
    tools {
        nodejs '21.0.0'
        terraform 'terraform auto' 
    }
    stages {

        
        stage('Build TypeScript') {
            steps {
                dir('src/newrelic_typescript') {
                    sh 'node main.js'
                }
            }
        }
        
        stage('build terraform') {
            steps {
                dir('src/newrelic_terraform') {
                    sh 'terraform init'
                }
            }
        }

        stage('Dashboard plan') {
            steps {
                dir('src/newrelic_terraform') {
                    sh 'terraform plan'
                }
            }
        }

        stage('Dashboard apply') {
            steps {
                dir('src/newrelic_terraform') {
                    sh 'terraform apply -auto-approve'
                }
            }
        }

    }
}
