name := "sample-spark-parquet"

version := "0.1"

// sbt-avro settings
seq( sbtavro.SbtAvro.avroSettings : _*)

javaSource in avroConfig := new File(sourceManaged.value + "/main/java")

version in avroConfig := "1.7.5"

// sbteclipse settings
EclipseKeys.eclipseOutput := Some(".target")

EclipseKeys.executionEnvironment := Some(EclipseExecutionEnvironment.JavaSE17)

EclipseKeys.createSrc := EclipseCreateSrc.Default + EclipseCreateSrc.Managed

EclipseKeys.relativizeLibs := false

EclipseKeys.withSource := true

resolvers ++= Seq(
  "Akka Repository" at "http://repo.akka.io/releases",
  "Cloudera Repository" at "https://repository.cloudera.com/artifactory/cloudera-repos"
)

libraryDependencies ++= Seq(
    "org.apache.spark" % "spark-assembly_2.10" % "0.9.0-cdh5.0.0-beta-2",
    "org.apache.spark" % "spark-core_2.10" % "0.9.0-cdh5.0.0-beta-2" % "provided",
    "org.apache.hadoop" % "hadoop-client" % "2.2.0-cdh5.0.0-beta-2" % "provided",
    "org.apache.avro" % "avro" % "1.7.5",
    "com.twitter" % "parquet-avro" % "1.3.2"
)
