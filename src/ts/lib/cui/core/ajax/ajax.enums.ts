export enum AjaxMethod {
  HEAD = 'HEAD',
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT',
  PATCH = 'PATCH',
  DELETE = 'DELETE',
}

export enum AjaxContentType {
  JSON = 'application/json;charset=UTF-8',
  TEXT = 'text/html',
  FORM = 'application/x-www-form-urlencoded;charset=UTF-8',
  FORMDATA = 'multipart/form-data',
  ATOM = 'application/atom+xml',
  JS = 'application/javascript',
  CSS = 'text/css',
  PLAIN = 'text/plain',
  XML = 'application/xml',
  BASE64 = 'application/base64',
}

export enum AjaxHeader {
  ContentType = 'Content-Type',
  Accept = 'Accept',
  AcceptEncoding = 'Accept-Encoding',
  AcceptLanguage = 'Accept-Language',
  CacheControl = 'Cache-Control',
  Connection = 'Connection',
  Host = 'Host',
  Pragma = 'Pragma',
  UserAgent = 'User-Agent',
  Origin = 'Origin',
  Referer = 'Referer',
}

export enum AjaxDataType {
  JSON = 'json',
  TEXT = 'text',
}

export enum AjaxException {
  JSONPARSEERROR = 'json parse error'
}
