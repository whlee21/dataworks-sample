/*** SimpleApp.scala ***/
import org.apache.spark.{SparkConf, SparkContext}
import org.apache.spark.SparkContext._
import org.apache.spark._

object SimpleApp {
  def main(args: Array[String]) {
    val master = "spark://hvm01.ibcf.test:7077"
    val appName = "Simple App"
    val sparkHome = System.getenv("SPARK_HOME")
//    val jars = SparkContext.jarOfClass(this.getClass)
    val jars = List("app/target/scala-2.10/simple-app-assembly-0.1-SNAPSHOT.jar")
    val environment = Map("spark.executor.memory" -> "64m")
    val sc = new SparkContext(master, appName, sparkHome, jars, environment)

    val logFile = "hdfs://hvm01.ibcf.test:8020/user/whlee21/emacs" // Should be some file on your system
    val logData = sc.textFile(logFile, 2).cache()
    val numAs = logData.filter(line => line.contains("a")).count()
    val numBs = logData.filter(line => line.contains("b")).count()
    println("Lines with a: %s, Lines with b: %s".format(numAs, numBs))
  }
}
