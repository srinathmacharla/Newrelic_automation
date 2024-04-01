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
        
        stage('build terraform') {
            steps {
                // Add the directory containing Terraform executable to PATH
                script {
                    def tfHome = tool 'terraform'
                    env.PATH = "${tfHome}:${env.PATH}"
                }
                dir('src/newrelic_terraform') {
                    sh 'terraform init'
                }
            }
        }

    }
}
