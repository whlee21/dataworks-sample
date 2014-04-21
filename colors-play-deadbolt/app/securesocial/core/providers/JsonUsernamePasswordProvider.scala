package securesocial.core.providers

import play.api.mvc._
import org.joda.time.DateTime
import com.typesafe.plugin.use
import play.api.Application
import play.api.Play.current
import play.api.data.Form
import play.api.data.Forms.nonEmptyText
import play.api.data.Forms.tuple
import play.api.mvc.AnyContent
import play.api.mvc.Request
import play.api.mvc.Results
import play.api.mvc.Results._
import play.api.mvc.SimpleResult
import play.api.mvc.SimpleResult._
import securesocial.core.AuthenticationMethod
import securesocial.core.IdentityId
import securesocial.core.IdentityProvider
import securesocial.core.Registry
import securesocial.core.SocialUser
import securesocial.core.UserService
import securesocial.core.providers.utils.GravatarHelper
import securesocial.core.providers.utils.PasswordHasher
import play.api.mvc.Result
import play.api.mvc.Headers
import play.mvc.Http
import play.api.Logger

class JsonUsernamePasswordProvider(application: Application) extends IdentityProvider(application) {
  override def id = JsonUsernamePasswordProvider.JsonUsernamePassword

  def authMethod = AuthenticationMethod.UserPassword

  val InvalidCredentials = "securesocial.login.invalidCredentials"

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
              case _                         => Left(BadRequest("Invalid basic authentication"))
            }
          }
        }
        case _ => Left(BadRequest("Bad Authorization header"))
      }
    }
  }

  def doAuth()(implicit request: Request[AnyContent]): Either[SimpleResult, SocialUser] = {
    var maybeCredentials = readBasicAuthentication(request.headers)
    maybeCredentials match {
      case None => Left(BadRequest(InvalidCredentials))
      case Some(s) =>
        s match {
          case Left(errorResult) => Left(BadRequest(InvalidCredentials))
          case Right(credentials) =>
            val (username, password) = credentials
//            Logger.debug("(username, password) = (%s, %s)".format(username, password))
            val userId = IdentityId(username, id)
            val result = for (
              user <- UserService.find(userId);
              pinfo <- user.passwordInfo;
              hasher <- Registry.hashers.get(pinfo.hasher) if hasher.matches(pinfo, password)
            ) yield Right(SocialUser(user))
            result.getOrElse(
              Left(BadRequest(InvalidCredentials))
            )
        }
    }
  }

  private def badRequest[A](f: Form[(String, String)], msg: Option[String] = None)(implicit request: Request[AnyContent]): SimpleResult = {
    //    Results.BadRequest(use[TemplatesPlugin].getLoginPage(f, msg))
    // by whlee21
    Results.BadRequest("/login")
  }

  def fillProfile(user: SocialUser) = {
    GravatarHelper.avatarFor(user.email.get) match {
      case Some(url) if url != user.avatarUrl => user.copy(avatarUrl = Some(url))
      case _                                  => user
    }
  }
}

object JsonUsernamePasswordProvider {
  val JsonUsernamePassword = "jsonuserpass"
  private val Key = "securesocial.userpass.withUserNameSupport"
  private val SendWelcomeEmailKey = "securesocial.userpass.sendWelcomeEmail"
  private val EnableGravatarKey = "securesocial.userpass.enableGravatarSupport"
  private val Hasher = "securesocial.userpass.hasher"
  private val EnableTokenJob = "securesocial.userpass.enableTokenJob"
  private val SignupSkipLogin = "securesocial.userpass.signupSkipLogin"

  lazy val withUserNameSupport = current.configuration.getBoolean(Key).getOrElse(false)
  lazy val sendWelcomeEmail = current.configuration.getBoolean(SendWelcomeEmailKey).getOrElse(true)
  lazy val enableGravatar = current.configuration.getBoolean(EnableGravatarKey).getOrElse(true)
  lazy val hasher = current.configuration.getString(Hasher).getOrElse(PasswordHasher.BCryptHasher)
  lazy val enableTokenJob = current.configuration.getBoolean(EnableTokenJob).getOrElse(true)
  lazy val signupSkipLogin = current.configuration.getBoolean(SignupSkipLogin).getOrElse(false)
}

/**
 * A token used for reset password and sign up operations
 *
 * @param uuid the token id
 * @param email the user email
 * @param creationTime the creation time
 * @param expirationTime the expiration time
 * @param isSignUp a boolean indicating wether the token was created for a sign up action or not
 */
case class Token(uuid: String, email: String, creationTime: DateTime, expirationTime: DateTime, isSignUp: Boolean) {
  def isExpired = expirationTime.isBeforeNow
}