pipeline {
    agent any
    tools {
       nodejs '10.5.0'
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
    }
}
