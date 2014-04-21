name := "colors-play-deadbolt"

version := "1.0-SNAPSHOT"

scalaVersion := "2.10.4"

scalacOptions ++= Seq("-deprecation", "-encoding", "UTF-8", "-feature", "-target:jvm-1.7",
    "-unchecked", "-Ywarn-adapted-args", "-Ywarn-value-discard", "-Xlint"
)

libraryDependencies <+= (scalaVersion)("org.scala-lang" % "scala-compiler" % _)

libraryDependencies ++= Seq(
	jdbc,
  cache,
  "com.typesafe.slick" %% "slick" % "2.0.1",
  "com.typesafe.play" %% "play-slick" % "0.6.0.1",
	"com.h2database" % "h2" % "1.3.170",
  "org.slf4j" % "slf4j-nop" % "1.6.4",
  "me.lessis" %% "base64" % "0.1.0",
  "be.objectify" %% "deadbolt-scala" % "2.2-RC2" exclude("org.scala-stm", "scala-stm_2.10.0"),
  "ws.securesocial" %% "securesocial" % "master-SNAPSHOT"
)

play.Project.playScalaSettings

resolvers ++= Seq(
    Resolver.url("Objectify Play Repository", new URL("http://schaloner.github.com/releases"))(Resolver.ivyStylePatterns),
    Resolver.sonatypeRepo("snapshots")
)

resolvers += "softprops-maven" at "http://dl.bintray.com/content/softprops/maven"
