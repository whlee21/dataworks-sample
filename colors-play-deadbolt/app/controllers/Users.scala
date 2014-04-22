package controllers

import models._
import play.api._
import play.api.Play.current
import play.api.data.Forms._
import play.api.db.slick._
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
import play.mvc.Http
import play.api.http.HeaderNames
import play.api.mvc.Session
import securesocial.core.SocialUser
import securesocial.core.IdentityId
import securesocial.core.OAuth2Info
import securesocial.core.UserService
import securesocial.core.Events
import securesocial.core.LoginEvent
import securesocial.core.Authenticator
import securesocial.core.SecureSocial
import securesocial.core.IdentityProvider
import securesocial.core.OAuth1Provider
import securesocial.core.providers.UsernamePasswordProvider
import securesocial.core.AuthenticationMethod
import securesocial.views.html.provider
import securesocial.core.providers.utils.PasswordHasher
import securesocial.core.Registry
import securesocial.core.Identity
import securesocial.core.AccessDeniedException
import securesocial.core.providers.utils.RoutesHelper
import play.api.i18n.Messages
import securesocial.core.LogoutEvent

object Users extends Controller {

  //  val onLogoutGoTo = "securesocial.onLogoutGoTo"

  //  def login(provider: String) = Action { implicit request =>
  //    JsonProviderController.authenticate(provider)
  //  }

  def logout = Action { implicit request =>
    //    val to = Play.configuration.getString(onLogoutGoTo).getOrElse(RoutesHelper.login().absoluteURL(IdentityProvider.sslEnabled))
    val user = for (
      authenticator <- SecureSocial.authenticatorFromRequest;
      user <- UserService.find(authenticator.identityId)
    ) yield {
      Authenticator.delete(authenticator.id)
      user
    }
    val result = Ok(Json.toJson("")).discardingCookies(Authenticator.discardingCookie)
    user match {
      case Some(u) => result.withSession(Events.fire(new LogoutEvent(u)).getOrElse(session))
      case None    => result
    }
  }
}