pipeline {
    agent any
    tools {
        // Use a compatible Node.js version (e.g., LTS version)
        nodejs '14.17.6'
        // Specify the Terraform tool version
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
