name := "colors-play-hbase"

version := "1.0-SNAPSHOT"

resolvers +=  "Cloudera Repository" at "https://repository.cloudera.com/artifactory/cloudera-repos"

kiteVersion := "0.10.0-cdh5.0.0"

libraryDependencies ++= Seq(
  jdbc,
  cache,
  "org.kitesdk" % "kite-data-hbase" % kiteVersion
)

play.Project.playScalaSettings