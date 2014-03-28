package controllers

import play.mvc.Http
import play.api._
import play.api.mvc._
import play.api.Logger
import play.api.http.HeaderNames
import scala.Left
import scala.Right
import play.api.i18n.Messages

object Application extends Controller {

  def hello(x: String) = Action { request =>
    Ok(Messages("hello"))
  }
}
