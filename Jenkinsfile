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
        
        stage('Copy YAML File') {
            steps {
                script {
                    def jenkinsWorkspace = env.WORKSPACE
                    def sourceFilePath = "${jenkinsWorkspace}/file.yaml"
                    def targetFilePath = "${jenkinsWorkspace}/newrelic/src/resources/file.yaml"
                    sh "cp ${sourceFilePath} ${targetFilePath}"
                }
            }
        }
    }
}
