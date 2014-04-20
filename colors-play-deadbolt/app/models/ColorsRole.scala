package models

import play.api.db.slick.Config.driver.simple._

case class ColorsRole(role:String)

/*
 * Table mapping
 */
//class ColorsRoleTable(tag: Tag) extends Table[ColorsRole](tag, "ROLE") {
//  def role = column[String]("role", O.NotNull)
//
//  def * = (role) <> (ColorsRole.tupled, ColorsRole.unapply _) 
//}