pipeline {
    agent any
    tools {
        nodejs '21.0.0'
        terraform 'terraform auto' 
    }
    stages {

        
        stage('Build TypeScript') {
            steps {
                dir('src') {
                    sh 'node main.js'
                }
            }
        }

        stage('Dashboard apply') {
            steps {
                dir('src') {
                    sh 'terraform apply'
                }
            } 
        }
    }
}
