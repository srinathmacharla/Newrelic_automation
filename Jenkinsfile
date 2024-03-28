pipeline {
    agent any
    tools {
       nodejs '21.0.0'
    }
    stages {
        stage('Hello') {
            steps {
                echo 'Hello, world!'
            }
        }
        stage('Build') {
            steps {
               sh 'npm version'
            }
        }
        stage('Install dependencies') {
            steps {
                sh 'npm install'
            }
        }
        
        stage('Build TypeScript') {
            steps {
                dir('src/newrelic_typescript') {
                    sh 'node main.js'
                }
            }
        }
        stage('Install Terraform') {
            steps {
                script {
                    // Define the Terraform version you want to install
                    def terraformVersion = "0.15.0"
                    
                    // Download Terraform binary
                    sh "curl -LO https://releases.hashicorp.com/terraform/${terraformVersion}/terraform_${terraformVersion}_darwin_amd64.zip"
                    
                    // Unzip the downloaded file
                    sh "unzip -o terraform_${terraformVersion}_darwin_amd64.zip"
                    
                    // Add execute permission to Terraform binary
                    sh "chmod +x terraform"
                    
                    // Verify installation
                    sh "./terraform version"
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

    }
}




