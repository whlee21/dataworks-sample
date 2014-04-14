name := "colors-play-hbase"

version := "1.0-SNAPSHOT"

resolvers +=  "Cloudera Repository" at "https://repository.cloudera.com/artifactory/cloudera-repos"

//val kiteVersion = "0.10.0-cdh5.0.0"

val hbaseVersion = "0.96.1.1-cdh5.0.0"

val hadoopVersion = "2.3.0-cdh5.0.0"

libraryDependencies ++= Seq(
  jdbc,
  cache,
  "org.apache.hadoop" % "hadoop-common" % hadoopVersion,
  "org.apache.hbase" % "hbase-common" % hbaseVersion,
  "org.apache.hbase" % "hbase-client" % hbaseVersion,
  "com.google.inject" % "guice" % "3.0",
  "javax.inject" % "javax.inject" % "1"
)

play.Project.playScalaSettings
