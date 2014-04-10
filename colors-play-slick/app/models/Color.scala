package models

import play.api.Logger

import play.api.db.slick.Config.driver.simple._

case class Color(id: Int, color: String)

/*
 * Table mapping
 */
class ColorsTable(tag: Tag) extends Table[Color](tag, "COLOR") {
  def id = column[Int]("id", O.PrimaryKey, O.AutoInc)
  def color = column[String]("color", O.NotNull)
  
  def * = (id, color) <> (Color.tupled, Color.unapply _)
}