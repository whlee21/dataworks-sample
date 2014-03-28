#!/bin/bash
#sbt assembly && cp app/target/scala-2.10/simple-app-assembly-0.1-SNAPSHOT.jar . && \
#java -Dspark.executor.memory=128m -cp simple-app-assembly-0.1-SNAPSHOT.jar SimpleApp
java -Dspark.executor.memory=128m -cp app/target/scala-2.10/simple-spark-app-assembly-0.1-SNAPSHOT.jar SimpleApp
