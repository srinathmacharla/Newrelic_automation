pipeline {
    agent any
    tools {
       nodejs 'NodeJS 21.7.1'
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
