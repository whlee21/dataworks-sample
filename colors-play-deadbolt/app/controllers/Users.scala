package controllers

import play.api.Logger
import play.api.libs.json.Json
import play.api.mvc.Action
import play.api.mvc.Controller
import play.api.libs.json.JsPath
import play.api.libs.json.Reads
import play.api.libs.functional.syntax._
import models.User
import play.api.mvc.Result
import play.api.mvc.Request
import play.api.mvc.AnyContent
import play.api.mvc.Headers
import play.mvc.Http
import play.api.http.HeaderNames

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

  def readQueryString(request: Request [_]):
	Option[Either[Result, (String, String)]] = {
    
    request.queryString.get("user").map { user =>
      request.queryString.get("password").map { password =>
        Right((user.head, password.head))
      }.getOrElse {
        Left(BadRequest(""))
      }
    }
  }
  
  def readBasicAuthentication(headers: Headers):
	Option[Either[Result, (String, String)]] = {
    
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
  
  def login(id: String) = AuthenticatedAction{ implicit request =>
    val loginBody = request.body
    Logger.debug("loginBody: " + loginBody)
    Ok("ok")
  }
  

}