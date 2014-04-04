package models

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
    Logger.debug("save: " + color)
    
    val newColor = Color(newId, color)
    this.colors += newColor
    
    Logger.debug(this.colors.toString)
    
    newColor
  }
  
  def delete(color: Color) {
    Logger.debug("id = " + color.id + ", color = " + color.color )
    this.colors -= color;
  }
}