name := "colors-play-slick"

version := "1.0-SNAPSHOT"

scalaVersion := "2.10.4"

scalacOptions += "-deprecation"

libraryDependencies <+= (scalaVersion)("org.scala-lang" % "scala-compiler" % _)

libraryDependencies ++= Seq(
	jdbc,
  cache,
  "com.typesafe.slick" %% "slick" % "2.0.1",
  "com.typesafe.play" %% "play-slick" % "0.6.0.1",
	"com.h2database" % "h2" % "1.3.170",
  "org.slf4j" % "slf4j-nop" % "1.6.4"
)

play.Project.playScalaSettings
