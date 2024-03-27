pipeline {
    agent any

    stages {
        stage('Checkout') {
            steps {
                // Checkout the repository from GitHub
                checkout([$class: 'GitSCM', 
                          branches: [[name: '*/main']], 
                          userRemoteConfigs: [[url: 'https://github.com/srinathmacharla/Newrelic_dashboard.git']]])
            }
        }
        stage('Execute Script') {
            steps {
                // Navigate to the directory containing the main.js file
                dir('src/newrelic_typescript') {
                    // Execute the main.js file using node
                    sh 'node main.js'
                }
            }
        }
    }
}
