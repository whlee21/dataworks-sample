import play.Project._

name := "sample-play"

version := "0.1"

libraryDependencies ++= Seq(
  jdbc,
  anorm,
  cache
)

playScalaSettings

lazy val samplePlay = project.in(file("."))
                        .aggregate(myLibrary)
                        .dependsOn(myLibrary)

lazy val myLibrary = project
