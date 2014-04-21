package controllers

import play.api.mvc._
import play.api.i18n.Messages
import securesocial.core._
import play.api.Play
import Play.current
import providers.utils.RoutesHelper
import securesocial.core.LoginEvent
import securesocial.core.AccessDeniedException
import scala.Some
import play.api.http.HeaderNames
import securesocial.controllers.TemplatesPlugin
import play.mvc.Http
import play.api.libs.json.Json

/**
 * A controller to provide the authentication entry point
 */
object JsonProviderController extends Controller with SecureSocial {
  private val logger = play.api.Logger("securesocial.controllers.ProviderController")
  /**
   * The property that specifies the page the user is redirected to if there is no original URL saved in
   * the session.
   */
  val onLoginGoTo = "securesocial.onLoginGoTo"

  /**
   * The root path
   */
  val Root = "/"

  /**
   * The application context
   */
  val ApplicationContext = "application.context"

  /**
   * Returns the url that the user should be redirected to after login
   *
   * @param session
   * @return
   */
  def toUrl(session: Session) = session.get(SecureSocial.OriginalUrlKey).getOrElse(landingUrl)

  /**
   * The url where the user needs to be redirected after succesful authentication.
   *
   * @return
   */
  def landingUrl = Play.configuration.getString(onLoginGoTo).getOrElse(
    Play.configuration.getString(ApplicationContext).getOrElse(Root)
  )

  /**
   * Renders a not authorized page if the Authorization object passed to the action does not allow
   * execution.
   *
   * @see Authorization
   */
  def notAuthorized() = Action { implicit request =>
    import com.typesafe.plugin._
    Forbidden("Not Authorized")
  }

  /**
   * The authentication flow for all providers starts here.
   *
   * @param provider The id of the provider that needs to handle the call
   * @return
   */
  def authenticate(provider: String, redirectTo: Option[String] = None) = handleAuth(provider, redirectTo)
  def authenticateByPost(provider: String, redirectTo: Option[String] = None) = handleAuth(provider, redirectTo)

  private def overrideOriginalUrl(session: Session, redirectTo: Option[String]) = redirectTo match {
    case Some(url) =>
      session + (SecureSocial.OriginalUrlKey -> url)
    case _ =>
      session
  }

  private def handleAuth(provider: String, redirectTo: Option[String]) = UserAwareAction { implicit request =>
    val authenticationFlow = request.user.isEmpty
    val modifiedSession = overrideOriginalUrl(session, redirectTo)

    Registry.providers.get(provider) match {
      case Some(p) => {
        try {
          p.authenticate().fold(result => {
            redirectTo match {
              case Some(url) =>
                val cookies = Cookies(result.header.headers.get(HeaderNames.SET_COOKIE))
                val resultSession = Session.decodeFromCookie(cookies.get(Session.COOKIE_NAME))
                result.withSession(resultSession + (SecureSocial.OriginalUrlKey -> url))
              case _ => result
            }
          }, {
            user =>
              if (authenticationFlow) {
                val saved = UserService.save(user)
                completeAuthentication(saved, modifiedSession)
              } else {
                request.user match {
                  case Some(currentUser) =>
                    UserService.link(currentUser, user)
                    logger.debug(s"[securesocial] linked $currentUser to $user")
                    // improve this, I'm duplicating part of the code in completeAuthentication
                    Redirect(toUrl(modifiedSession)).withSession(modifiedSession -
                      SecureSocial.OriginalUrlKey -
                      IdentityProvider.SessionId -
                      OAuth1Provider.CacheKey)
                  case _ =>
                    Unauthorized
                }
              }
          })
        } catch {
          case ex: AccessDeniedException => {
            Redirect(RoutesHelper.login()).flashing("error" -> Messages("securesocial.login.accessDenied"))
          }

          case other: Throwable => {
            logger.error("Unable to log user in. An exception was thrown", other)
            Redirect(RoutesHelper.login()).flashing("error" -> Messages("securesocial.login.errorLoggingIn"))
          }
        }
      }
      case _ => NotFound
    }
  }

  def completeAuthentication(user: Identity, session: Session)(implicit request: RequestHeader): SimpleResult = {
    if (logger.isDebugEnabled) {
      logger.debug("[securesocial] user logged in : [" + user + "]")
    }
    val withSession = Events.fire(new LoginEvent(user)).getOrElse(session)
    Authenticator.create(user) match {
      case Right(authenticator) => {
//        Redirect(toUrl(withSession)).withSession(withSession -
//          SecureSocial.OriginalUrlKey -
//          IdentityProvider.SessionId -
//          OAuth1Provider.CacheKey).withCookies(authenticator.toCookie)
        
        
//  "Users" : {
//    "user_name" : "admin",
//    "roles" : [
//      "admin",
//      "user"
//    ]
//  }
        val userString = "{\"Users\" : { \"user_name\":\"admin@example.com\", \"roles\":[\"admin\", \"user\"]}}"
        val userJson = Json.parse(userString)
        Ok(userJson).withSession(withSession -
          SecureSocial.OriginalUrlKey -
          IdentityProvider.SessionId -
          OAuth1Provider.CacheKey).withCookies(authenticator.toCookie)
      }
      case Left(error) => {
        // improve this
        throw new RuntimeException("Error creating authenticator")
      }
    }
  }
}