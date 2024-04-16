pipeline {
    agent any
    tools {
        nodejs '21.0.0'
        terraform 'terraform auto' 
    }
    stages {
        stage('Install Dependencies') {
            steps {
                dir('src/newrelic_typescript') {
                    // Install the 'js-yaml' module
                    sh 'npm install js-yaml'
                }
            }
        }
        
        stage('Build TypeScript') {
            steps {
                dir('src/newrelic_typescript') {
                    sh 'node main.js'
                }
            }
        }

        stage('Dashboard init') {
            steps {
                dir('src/newrelic_terraform') {
                    sh 'terraform apply'
                }
            } 
        }

        stage('Dashboard apply') {
            steps {
                dir('src/newrelic_terraform') {
                    sh 'terraform apply'
                }
            } 
        }
    }
}
