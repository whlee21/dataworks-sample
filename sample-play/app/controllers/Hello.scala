package controllers

import play.api.Logger
import play.api.i18n.Messages
import play.api.mvc.Action
import play.api.mvc.Controller

object Hello extends Controller {

  def hello(x: String) = Action {
    Logger.info("x = " + x)
    Ok(Messages("hello"))
  }
}