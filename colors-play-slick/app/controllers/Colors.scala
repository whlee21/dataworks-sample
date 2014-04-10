package controllers

import models._
import play.api._
import play.api.Play.current
import play.api.data._
import play.api.data.Forms._
import play.api.db.slick._
import play.api.db.slick.Config.driver.simple._
import play.api.libs.json.Json
import play.api.libs.json.Json._
import play.api.mvc._
import play.api.mvc.BodyParsers._

object Colors extends Controller {

  // JSON read/write
  implicit val colorFormat = Json.format[Color]
  
  // create an instance of the table
  val Colors = TableQuery[ColorsTable]

  def list = DBAction { implicit rs =>
    val colors = Colors.list
    
    Logger.debug(colors.toString)
    
    val colorsJson = toJson(colors)
    Logger.debug(Json.prettyPrint(colorsJson))
    
    Ok(colorsJson)
  }

  val colorForm = Form(
    mapping(
      "id" -> number(),
      "color" -> text()
    )(Color.apply)(Color.unapply)
  )

  def insert = DBAction(parse.json) { implicit rs =>
  	rs.request.body.validate[Color].map { color =>
  	  Logger.debug(color.toString)
   	  Colors.insert(color)
  	  Ok(toJson(color))
  	}.getOrElse(BadRequest("invalid json"))
  }
  
  def delete = DBAction(parse.json) { implicit rs =>
  	rs.request.body.validate[Color].map { color =>
//  	  Colors.delete(color)
  	  Ok(toJson(color))
  	}.getOrElse {
  	  Logger.debug(rs.request.body.toString)
  	  BadRequest("invalid json")
  	}
  }
}