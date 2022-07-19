let ErrorType = {
  GENERAL_ERROR: {
    id: 1,
    httpCode: 600,
    message: "A General Error Has Occurred",
    isShowStackTrace: true,
    }
    ,
  USERNAME_ALREADY_EXISTS: {
      id: 2,
      httpCode: 601,
      message: "This username already exists. Please consider another one",
      isShowStackTrace: true,
  } 
  ,
  WRONG_USERNAME_OR_PASSWORD:{
    id: 3,
    httpCode: 602,
    message: "Wrong Username or password.",
    isShowStackTrace: true,
  }
  ,
  INSUFFICIENT_PRIVILEGES:{
    id: 4,
    httpCode: 603,
    message: "You don't have premission to perform this operation.",
    isShowStackTrace: true,
  }
  ,
  WRONG_FIELD_LENGTHS:{
    id: 5,
    httpCode: 604,
    message: "You didn't filled all the parameters with the correct field lengths.",
    isShowStackTrace: true,
  }
}

module.exports = ErrorType