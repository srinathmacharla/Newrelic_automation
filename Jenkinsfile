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
