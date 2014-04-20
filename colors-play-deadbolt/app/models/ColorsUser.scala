package models

import play.api.db.slick.Config.driver.simple._

case class ColorsUser(id:Long, email:String, password:String)

/*
 * Table mapping
 */
class ColorsUserTable(tag: Tag) extends Table[ColorsUser](tag, "USER") {
  def id = column[Long]("id", O.PrimaryKey, O.AutoInc)
  def email = column[String]("email", O.NotNull)
  def password = column[String]("password", O.NotNull)
  def creationTime = column[String]("create_time", O.NotNull)
  
  def * = (id, email, password) <> (ColorsUser.tupled, ColorsUser.unapply _)
  
  def idx = index("idx_email", (email), unique = true) 
}