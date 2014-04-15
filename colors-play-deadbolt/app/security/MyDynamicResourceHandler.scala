package security

import be.objectify.deadbolt.scala.DynamicResourceHandler
import be.objectify.deadbolt.scala.DeadboltHandler
import play.api.mvc.Request

class MyDynamicResourceHandler extends DynamicResourceHandler {
  def isAllowed[A](name: String, meta: String, handler: DeadboltHandler, request: Request[A]) = {
    MyDynamicResourceHandler.handlers(name).isAllowed(name,
      meta,
      handler,
      request)
  }

  def checkPermission[A](permissionValue: String, deadboltHandler: DeadboltHandler, request: Request[A]) = {
    // todo implement this when demonstrating permissions
    false
  }
}

object MyDynamicResourceHandler {
  val handlers: Map[String, DynamicResourceHandler] =
    Map(
      "pureLuck" -> new DynamicResourceHandler() {
        def isAllowed[A](name: String, meta: String, deadboltHandler: DeadboltHandler, request: Request[A]) =
          System.currentTimeMillis() % 2 == 0

        def checkPermission[A](permissionValue: String, deadboltHandler: DeadboltHandler, request: Request[A]) = false
      }
    )
}