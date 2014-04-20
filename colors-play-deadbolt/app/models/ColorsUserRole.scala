package models

import play.api.db.slick.Config.driver.simple._

case class ColorsUserRole(userid: Long, role: String)

class ColorsUserRoleTable(tag: Tag) extends Table[ColorsUserRole](tag, "USER_ROLE") {
  def userid = column[Long]("userid", O.NotNull)
  def role = column[String]("role", O.NotNull)

  def * = (userid, role) <> (ColorsUserRole.tupled, ColorsUserRole.unapply _)
}