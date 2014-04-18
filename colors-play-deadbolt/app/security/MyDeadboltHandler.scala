package security

import be.objectify.deadbolt.core.models.Subject
import be.objectify.deadbolt.scala.DeadboltHandler
import be.objectify.deadbolt.scala.DynamicResourceHandler
import models.User
import play.api.mvc.Request
import play.api.mvc.Result
import play.api.mvc.Results
import scala.concurrent.Future
import play.api.mvc.SimpleResult
import play.api.mvc.RequestHeader
import play.api.mvc.Security

class MyDeadboltHandler(dynamicResourceHandler: Option[DynamicResourceHandler] = None) extends DeadboltHandler {

  def beforeAuthCheck[A](request: Request[A]) = None

  override def getDynamicResourceHandler[A](request: Request[A]): Option[DynamicResourceHandler] = {
    if (dynamicResourceHandler.isDefined) dynamicResourceHandler
    else Some(new MyDynamicResourceHandler())
  }

  private def username(request: RequestHeader) = request.session.get(Security.username)
  
  override def getSubject[A](request: Request[A]): Option[Subject] = {
    val session = username(request)
    session match {
      case Some(session) => Some(new User(username(request).get))
      case None => None
    }
  }

  def onAuthFailure[A](request: Request[A]): Future[SimpleResult] = {
    Future.successful(Results.Forbidden(views.html.accessFailed()))
  }
}