package controllers

import scala.language.implicitConversions

import org.apache.hadoop.hbase.HBaseConfiguration
import org.apache.hadoop.hbase.HColumnDescriptor
import org.apache.hadoop.hbase.HTableDescriptor
import org.apache.hadoop.hbase.TableName
import org.apache.hadoop.hbase.client.HBaseAdmin
import org.apache.hadoop.hbase.client.HTable
import org.apache.hadoop.hbase.client.Scan
import org.apache.hadoop.hbase.util.Bytes

import models.Color
import play.api.Logger
import play.api.libs.functional.syntax.functionalCanBuildApplicative
import play.api.libs.functional.syntax.toFunctionalBuilderOps
import play.api.libs.functional.syntax.unlift
import play.api.libs.json.JsPath
import play.api.libs.json.Json
import play.api.libs.json.Json.toJsFieldJsValueWrapper
import play.api.libs.json.Reads
import play.api.libs.json.Writes
import play.api.mvc.Action
import play.api.mvc.Controller

object Colors extends Controller {

  // Reads/Writes를 작성하는 방법은 두가지가 있다.
  // object로 선언하거나 val로 선언하거나...
//  implicit object ColorWrites extends Writes[Color] {
//    def writes(c: Color) = Json.obj(
//      "id" -> JsNumber(c.id),
//      "color" -> JsString(c.color))
//  }
  
  implicit val colorWrites: Writes[Color] = (
    (JsPath \ "id").write[Long] and
    (JsPath \ "color").write[String]
  )(unlift(Color.unapply))
  
  implicit val colorReads: Reads[Color] = (
    (JsPath \ "color" \ "id").read[Long] and
    (JsPath \ "color" \ "color").read[String]
  )(Color.apply _)
  
  

  
  def list = Action {
    val colors = Color.findAll
    Logger.debug(colors.toString)
    
    val colorsJson = Json.obj("colors" -> Json.toJson(colors))
    Logger.debug(Json.prettyPrint(colorsJson))
    
    Ok(colorsJson)
  }

  def create = Action(parse.json) { request =>

    try {
      val colorJson = request.body
      Logger.debug(Json.prettyPrint(colorJson))

      val color = (colorJson \ "color" \ "color").as[String]
      Logger.debug(color.toString)

      val newColor = Color.save(color)
      Created(Json.toJson(newColor))
    } catch {
      case e: IllegalArgumentException =>
        BadRequest("Color not found")
    }
  }
  
  def delete = Action(parse.json) { request =>
    try {
      val colorJson = request.body
      Logger.debug("delete\n" + Json.prettyPrint(colorJson))

      val color = colorJson.as[Color]
      
      Logger.debug("color: " + color)
      Color.delete(color)
      Ok(colorJson)
    } catch {
      case e: IllegalArgumentException =>
        BadRequest("Color not found")
    }
  }
}