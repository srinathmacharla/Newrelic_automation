pipeline {
    agent any

    stages {
        stage('Checkout') {
            steps {
                checkout([$class: 'GitSCM', 
                          branches: [[name: '*/main']], 
                          userRemoteConfigs: [[url: 'https://github.com/srinathmacharla/Newrelic_dashboard.git']]])
            }
        }
        stage('Execute Script') {
            steps {
                dir('src/newrelic_typescript') {
                    sh '/src/newrelic_typescript/node main.js' // Replace '/full/path/to/node' with the actual path
                }
            }
        }
    }
}

