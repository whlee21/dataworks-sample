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
import securesocial.core.Registry
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

object Users extends Controller {

  // json serializer
  //  implicit val userWrites: Writes[User] = (
  //    (JsPath \ "id").write[Long] and
  //    (JsPath \ "color").write[String]
  //  )(unlift(User.unapply))

  //   json deserializer
  //    implicit val userReads: Reads[User] = (
  //      (JsPath \ "color" \ "id").read[Long] and
  //      (JsPath \ "color" \ "color").read[String]
  //    )(User.apply _)

  private implicit val readsOAuth2Info = Json.reads[OAuth2Info]

  private val providerName = "userpass"
  private val bcryptHasher = PasswordHasher.BCryptHasher

  // create an instance of the table
  val Users = TableQuery[ColorsUserTable]

  // color String을 insert했을 때 
  //  private val usersAutoInc = Users.map(c => (c.color)) returning Users.map(_.id) into {
  //    case (_, id) => id
  //  }

  def readQueryString(request: Request[_]): Option[Either[Result, (String, String)]] = {

    request.queryString.get("user").map { user =>
      request.queryString.get("password").map { password =>
        Right((user.head, password.head))
      }.getOrElse {
        Left(BadRequest(""))
      }
    }
  }

  def readBasicAuthentication(headers: Headers): Option[Either[Result, (String, String)]] = {

    headers.get(Http.HeaderNames.AUTHORIZATION).map { header =>

      val BasicHeader = "Basic (.*)".r

      header match {
        case BasicHeader(base64) => {
          try {
            import org.apache.commons.codec.binary.Base64
            val decodedBytes = Base64.decodeBase64(base64.getBytes)
            val credentials = new String(decodedBytes).split(":", 2)
            credentials match {
              case Array(username, password) => Right(username -> password)
              case _ => Left(BadRequest("Invalid basic authentication"))
            }
          }
        }
        case _ => Left(BadRequest("Bad Authorization header"))
      }
    }
  }

  def authenticate(username: String, password: String) = {
    false
  }

  def AuthenticatedAction(f: Request[AnyContent] => Result): Action[AnyContent] = {
    Action { request =>
      var maybeCredentials = readQueryString(request) orElse
        readBasicAuthentication(request.headers)

      maybeCredentials.map { resultOrCredentials =>

        resultOrCredentials match {
          case Left(errorResult) => errorResult

          case Right(credentials) => {
            val (user, password) = credentials
            if (authenticate(user, password)) {
              f(request)
            } else {
              Unauthorized("Invalid username or password")
            }
          }
        }
      }.getOrElse {
        val authenticate = (HeaderNames.WWW_AUTHENTICATE, "Basic")
        Unauthorized.withHeaders(authenticate)
      }
    }
  }

  def login(id: String) = Action { implicit request =>

    var maybeCredentials = readBasicAuthentication(request.headers)

    maybeCredentials.map { resultOrCredentials =>

      resultOrCredentials match {
        case Left(errorResult) => errorResult

        case Right(credentials) => {
          val (username, password) = credentials
          val email = "admin@example.com"

          Logger.debug("username = " + username + ", password = " + password)

          val hasher = Registry.hashers.get(bcryptHasher).get

          val provider = Registry.providers.get(providerName).get
          val id = if (UsernamePasswordProvider.withUserNameSupport) username else email
          val identityId = new IdentityId(username, providerName)
          val u = SocialUser(identityId, "", "", "", Some(email), None, provider.authMethod, passwordInfo = Some(hasher.hash(password)))
          val filledUser = provider.fillProfile(u)

          UserService.find(filledUser.identityId) map { user =>
            Logger.debug("UserService.find")
            val newSession = Events.fire(new LoginEvent(user)).getOrElse(session)
            Authenticator.create(user).fold(
              error => throw error,
              authenticator => Ok(Json.obj("sessionId" -> authenticator.id))
                .withSession(newSession - SecureSocial.OriginalUrlKey - IdentityProvider.SessionId - OAuth1Provider.CacheKey)
                .withCookies(authenticator.toCookie))
          } getOrElse NotFound(Json.obj("error" -> "user not found"))
        }
      }
    }.getOrElse {
      val authenticate = (HeaderNames.WWW_AUTHENTICATE, "Basic")
      Unauthorized.withHeaders(authenticate)
    }
  }

}