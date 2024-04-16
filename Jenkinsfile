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
                    // Run main.js script
                    sh 'node main.js'
                }
            }
        }

        stage('Dashboard apply') {
            steps {
                dir('src/newrelic_terraform') {
                    // Apply Terraform configuration
                    sh 'terraform apply -auto-approve'
                }
            }
        }
    }
}
