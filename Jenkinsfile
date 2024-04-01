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

        stage('Dashboard Creation') {
            steps {
                dir('src/newrelic_terraform') {
                    sh 'terraform plan'
                }
            }
        }

    }
}
