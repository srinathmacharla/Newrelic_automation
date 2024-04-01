pipeline {
    agent any
    tools {
        nodejs '21.0.0'
        terraform 'terraform auto' 
    }

        parameters {
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
                    
                    
                    // Move the uploaded file to the target directory
                    sh "mv ${params.file} ${targetDir}"
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
        

        stage('Dashboard apply') {
            steps {
                dir('src/newrelic_terraform') {
                    sh 'terraform apply -auto-approve'
                }
            }
        }

    }
}
