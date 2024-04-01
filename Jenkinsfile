pipeline {
    agent any
    tools {
        nodejs '21.0.0'
        terraform 'terraform auto' 
    }
    stages {
        stage('Read Uploaded File') {
            steps {
                script {
                    // Read uploaded file
                    def fileContents = readFileFromWorkspace('src/resources/file.yaml')
                    
                    // Do something with the file contents
                    echo "Contents of uploaded file: ${fileContents}"
                }
            }
        }
        
        stage('Build TypeScript') {
            steps {
                dir('src/newrelic_typescript') {
                    sh 'node main.js'
                }
            }
        }
    }
}
