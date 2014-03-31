package models

import play.api.libs.json.Writes
import play.api.libs.json.Json
import play.api.Logger

case class Color(id: Long, color: String)

object Color {
  var colors = Set(
    Color(1, "red"), Color(2, "blue"), Color(3, "yellow"))

  def findAll = this.colors.toList.sortBy(_.id)

  def findById(id: Long) = this.colors.find(_.id == id)

  def newId = {
    val lastId = this.colors.toList.sortBy(_.id).last.id
    lastId + 1
  }

  def save(color: String) = {
    Logger.debug(color)
    this.colors += Color(newId, color)
    Logger.debug(this.colors.toString)
  }
}