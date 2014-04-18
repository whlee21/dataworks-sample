package models

import be.objectify.deadbolt.core.models.Subject
import play.libs.Scala

class User(val userName: String) extends Subject {
  def getRoles: java.util.List[SecurityRole] = {
    // Scala.asJava: Scala의 Collection(List 등)를 Java의 Collection(List 등)형으로 변환함
    // Scala.asScala: Scala.asJava와 반대
    Scala.asJava(List(new SecurityRole("admin"), new SecurityRole("user")))
  }

  def getPermissions: java.util.List[UserPermission] = {
    Scala.asJava(List(new UserPermission("printers.edit")))
  }

  def getIdentifier: String = userName
}

object User {
  val users = Set(new User("admin"), new User("user"))
  
//  def getRoles(val userName: String): Array[String] = {
//    this.users.find(_.id == id)
//    null
//  }
}