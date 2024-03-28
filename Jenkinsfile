pipeline {
    agent any

    stages {
        stage('Hello') {
            steps {
                echo 'Hello, world!'
            }
        }
        stage('Build') {
            steps {
                nodejs(nodeJSInstallationName: 'Node 6.x', configId: '<config-file-provider-id>') {
                    sh 'npm config ls'
                }
            }
        }
    }
}
