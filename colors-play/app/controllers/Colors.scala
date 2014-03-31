package controllers

import scala.math.BigDecimal.long2bigDecimal

import models.Color
import play.api.Logger
import play.api.libs.functional.syntax.functionalCanBuildApplicative
import play.api.libs.functional.syntax.toFunctionalBuilderOps
import play.api.libs.json.JsNumber
import play.api.libs.json.JsPath
import play.api.libs.json.JsString
import play.api.libs.json.Json
import play.api.libs.json.Json.toJsFieldJsValueWrapper
import play.api.libs.json.Reads
import play.api.libs.json.Writes
import play.api.mvc.Action
import play.api.mvc.Controller

object Colors extends Controller {

  implicit object ColorWrites extends Writes[Color] {
    def writes(c: Color) = Json.obj(
      "id" -> JsNumber(c.id),
      "color" -> JsString(c.color))
  }
  
  def list() = Action {
    val colors = Color.findAll
    Logger.debug(colors.toString)
    
    val colorsJson = Json.obj("colors" -> Json.toJson(colors))
    Logger.debug(Json.prettyPrint(colorsJson))
    
    Ok(colorsJson)
  }

  def save() = Action(parse.json) { request =>
    val colorJson = request.body
    Logger.debug(Json.prettyPrint(colorJson))
    
    val color = (colorJson \ "color" \ "color").as[String]
    Logger.debug(color.toString)
    
    try {
      Color.save(color)
      Ok("Saved")
    } catch {
      case e: IllegalArgumentException =>
        BadRequest("Color not found")
    }
  }
}