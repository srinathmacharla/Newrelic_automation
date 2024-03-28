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
                // Install project dependencies using npm
                sh 'npm install'
            }
        }
        
        stage('Build') {
            steps {
                // Change directory to the TypeScript source directory
                dir('src/newrelic_typescript') {
                    // Build TypeScript files to JavaScript
                    sh 'node main.js'
                }
            }
        }

     
    }
}
