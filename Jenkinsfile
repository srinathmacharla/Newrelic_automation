pipeline {
    agent any
    
    // Define tools used in the pipeline
    tools {
        nodejs '21.0.0'
        terraform 'terraform auto' 
    }

    parameters {
        // Define file parameter for YAML file upload
        file(name: 'file', description: 'Upload YAML file')
    }
    
    stages {
        stage('Checkout SCM') {
            steps {
                checkout scm
            }
        }
        
        stage('Move File') {
            steps {
                script {
                    // Define the target directory
                    def targetDir = "${WORKSPACE}/src/resources"
                    
                    // Create the directory if it doesn't exist
                    sh "mkdir -p ${targetDir}"
                    
                    // Move the uploaded file to the target directory
                    sh "mv ${params.file} ${targetDir}"
                }
            }
        }
        
        stage('Build TypeScript') {
            steps {
                // Add your build steps here for TypeScript
                dir('src/newrelic_typescript') {
                    sh 'node main.js'
                }
            }
        }

        stage('Dashboard apply') {
            steps {
                // Add your Terraform apply steps here
                dir('src/newrelic_terraform') {
                    sh 'terraform apply -auto-approve'
                }
            }
        }
    }
}
