package controllers

import models._
import play.api._
import play.api.Play.current
import play.api.data.Forms._
import play.api.db.slick._
import play.api.db.slick.Session
import play.api.db.slick.Config.driver.simple._
import play.api.libs.functional.syntax._
import play.api.libs.json.JsPath
import play.api.libs.json.Json
import play.api.libs.json.Json._
import play.api.libs.json.Reads
import play.api.libs.json.Writes
import play.api.mvc._
import play.api.mvc.BodyParsers._
import scala.slick.driver.JdbcProfile
import be.objectify.deadbolt.scala.DeadboltActions
import security.MyDeadboltHandler
import securesocial.core.SecureSocial
import scala.concurrent.Future
import play.api.libs.concurrent.Akka

object Colors extends Controller with DeadboltActions with SecureSocial {

  // json serializer
  implicit val colorWrites: Writes[Color] = (
    (JsPath \ "id").write[Long] and
    (JsPath \ "color").write[String]
  )(unlift(Color.unapply))
  
  // json deserializer
  implicit val colorReads: Reads[Color] = (
    (JsPath \ "color" \ "id").read[Long] and
    (JsPath \ "color" \ "color").read[String]
  )(Color.apply _)

  implicit val slickExecutionContext =
    Akka.system.dispatchers.lookup("play.akka.actor.slick-context")
  
  // create an instance of the table
  val Colors = TableQuery[ColorsTable]

  // color String을 insert했을 때 
  private val colorsAutoInc = Colors.map(c => (c.color)) returning Colors.map(_.id) into {
    case (_, id) => id
  }

  def list = SecuredAction(ajaxCall = true) { implicit request =>
    DB withSession { implicit s: play.api.db.slick.Session =>
      val colors = Colors.list
      Logger.debug(colors.toString)

      val colorsJson = Json.obj("colors" -> Json.toJson(colors))
      Logger.debug(Json.prettyPrint(colorsJson))

      Ok(colorsJson)
    }
  }

  /*
  def insert = SubjectPresent(new MyDeadboltHandler) {
    DBAction(parse.json) { implicit rs =>
      try {
        val colorJson = rs.request.body
        Logger.debug(Json.prettyPrint(colorJson))

        // json 구조에서 color string값을 꺼내온다.
        val colorVal = (colorJson \ "color" \ "color").as[String]
        Logger.debug(colorVal.toString)

        // 
        val newId = colorsAutoInc.insert(colorVal)
        val newColor = new Color(newId, colorVal)

        // DB에 새로 insert된 객체값을 json으로 return
        Created(Json.toJson(newColor))
      } catch {
        case e: IllegalArgumentException =>
          BadRequest("IllegalArgumentException")
      }
    }
  }
  */

  def insert = SecuredAction(ajaxCall = true) {
    implicit request =>
      DB withSession {
        implicit s: play.api.db.slick.Session =>
          try {
            Logger.debug("request.body = " + request.body.asJson.get)
            //            val colorJson = request.body.asJson.get
            request.body.asJson match {
              case None => BadRequest(Json.toJson("can't insert empty value..."))
              case Some(colorJson) => {
                Logger.debug(Json.prettyPrint(colorJson))
                val colorVal = (colorJson \ "color" \ "color").as[String]
                val newId = colorsAutoInc.insert(colorVal)
                val newColor = Color(newId, colorVal)
                Created(Json.toJson(newColor))
              }
            }
          } catch {
            case e: IllegalArgumentException =>
              BadRequest(Json.toJson(e.getMessage))
          }
      }
  }

  //  def delete = Restrict(Array("admin"), new MyDeadboltHandler) {
  //    DBAction(parse.json) { implicit rs =>
  //      try {
  //        val colorJson = rs.request.body
  //        Logger.debug("delete\n" + Json.prettyPrint(colorJson))
  //
  //        val color = colorJson.as[Color]
  //        Logger.debug("color: " + color)
  //
  //        Colors.filter(_.id === color.id).delete
  //
  //        Ok(colorJson)
  //      } catch {
  //        case e: IllegalArgumentException =>
  //          BadRequest("Color not found")
  //      }
  //    }
  //  }

  def delete = SecuredAction(ajaxCall = true) {
    implicit request =>
      DB withSession {
        implicit s: play.api.db.slick.Session =>
          try {
            val colorJson = request.body.asJson.get
            Logger.debug("delete\n" + Json.prettyPrint(colorJson))

            val color = colorJson.as[Color]
            Logger.debug("color: " + color)

            Colors.filter(_.id === color.id).delete

            NoContent
          } catch {
            case e: IllegalArgumentException =>
              BadRequest(Json.toJson(e.getMessage))
          }
      }
  }

}