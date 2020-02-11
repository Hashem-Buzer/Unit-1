const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const randToken = require("rand-token");

const User = require("./../../../controllers/users");
const Token = require("./../../../controllers/tokens");
const regiteryValidation = require("./../../validation/registryValidation");
const loginValidation = require("./../../validation/loginValidation");
//
const IncomingForm = require("formidable").IncomingForm;
const path = require("path");
const uniqueId = require("uuid");

///////////////////////////////////////////////////////////////////////////////////// SIGN UP SECTION
var refreshTokenYolo;
function signUp(req, res) {
  let { errors, isValid } = regiteryValidation(req.body);
  if (!isValid) {
    // console.log("not valid");
    // console.log(errors);
    res.status(200).json(errors);
  } else {
    // console.log("is valid");
    var { name, username, email, password, ConfirmPassword } = req.body;
    User.find(email)
      .then(data => {
        //console.log(data);
        if (data.rows.length > 0) {
          res
            .status(200)
            .json({ message: "user already exists", success: false });
        } else {
          //if no user with this email we will hash the password,save the
          //user data in the database and generate the authentication token
          var password = req.body.password;
          let hash = bcrypt.hashSync(password, 12);
          var password = hash;
          User.create({
            name: req.body.name,
            username: req.body.username,
            email: req.body.email,
            password: hash
          })
            .then(result => {
              if (result) {
                // res.redirect('/login')
                //console.log(result);
                var payload = {
                  id: result.id,
                  email: result.email,
                  username: result.username,
                  name: result.name
                };
                //console.log(process.env.secretOrkey);
                jwt.sign(
                  payload,
                  process.env.secretOrkey,
                  { expiresIn: 300 },
                  (err, token) => {
                    var refreshToken = randToken.uid(250);
                    var date = new Date();
                    // console.log(refreshToken);
                    //console.log(token);
                    refreshTokenYolo = refreshToken;
                    Token.create(
                      token,
                      new Date(date.getTime() + 5 * 60 * 1000),
                      refreshToken,
                      new Date(date.getTime() + 30 * 24 * 60 * 60 * 1000),
                      result.id
                    );
                    res.cookie("refreshtoken", refreshToken, {
                      maxAge: 9000000000,
                      httpOnly: true
                    });
                    res.cookie("token", token, {
                      maxAge: 60 * 60 * 1000, // keep it  60 * 60 * 1000
                      httpOnly: true
                    });
                    return res.json({
                      payload,
                      success: true,
                      token: "Bearer " + token,
                      refreshToken: refreshTokenYolo
                    });
                    //) res.status(200).send(result);
                  }
                );
              }
            })
            .catch(err => {
              if (err) {
                res.sendStatus(401);
              }
            });
        }
      })
      .catch(err => console.log(err));
  }
}
///////////////////////////////////////////////////////////////////////////////////// LOGIN SECTION
function logIn(req, res) {
  console.log(req.body);
  let { errors, isValid } = loginValidation(req.body);
  if (isValid) {
    var { email, password } = req.body;
    User.find(email)
      .then(data => {
        // console.log(data.rows);
        if (data.rows.length > 0) {
          var pass = data.rows[0].password;
          var password = req.body.password;
          bcrypt.compare(password, pass).then(isMatch => {
            // console.log(isMatch);
            if (isMatch) {
              //return res.send("you logged in successfully");
              var payload = {
                id: data.rows[0].id,
                email: data.rows[0].email,
                username: data.rows[0].username,
                name: data.rows[0].name
              };
              //console.log(process.env.secretOrkey);
              jwt.sign(
                payload,
                process.env.secretOrkey,
                { expiresIn: 300 },
                (err, token) => {
                  var refreshToken = randToken.uid(250);
                  var date = new Date();
                  // console.log(refreshToken);
                  //console.log(token);
                  refreshTokenYolo = refreshToken;
                  Token.create(
                    token,
                    new Date(date.getTime() + 5 * 60 * 1000),
                    refreshToken,
                    new Date(date.getTime() + 30 * 24 * 60 * 60 * 1000),
                    data.rows[0].id
                  );
                  res.cookie("refreshtoken", refreshToken, {
                    maxAge: 30 * 24 * 60 * 60 * 1000,
                    httpOnly: true
                  });
                  res.cookie("token", token, {
                    maxAge: 60 * 60 * 1000, // 60 * 60 * 1000
                    httpOnly: true
                  });

                  return res.json({
                    payload,
                    success: true,
                    token: "Bearer " + token,
                    refreshToken: refreshTokenYolo
                  });
                  //) res.status(200).send(result);
                }
              );
            } else {
              return res.send("wrong password");
            }
          });
        } else {
          res.status(200).json("no user with such email found");
        }
      })
      .catch(err => console.log(err));
  } else {
    res.status(404).json(errors);
  }
}
/////////////////////////////////////////////////////////////////////////////////////first request
function enter(req, res) {
  //console.log(req.cookies.refreshtoken, "we have it");
  var cookieValue = req.cookies.refreshtoken;
  //console.log(cookieValue, "we have it'oot");

  if (cookieValue !== undefined) {
    Token.findRefreshToken(cookieValue)
      .then(data => {
        // console.log("data from refresh token");
        // console.log(data);
        if (data) {
          return res.status(200).json(data);
        }
      })
      .catch(err => console.log(err));
  } else {
    return res.send("no cookie found");
  }
}

////////////////////////////////////////////////////////////////////////////logout request
function logOut(req, res) {
  console.log(
    "***************************logged out*****************************"
  );
  var user_id = req.body.id;
  Token.deleteIT(user_id)
    .then(result => {
      res.clearCookie("refreshtoken");
      res.clearCookie("token");
      res.status(200).json(result);
    })
    .catch(err => console.log(err));
}
//////////////////////////////////////////////////////////////////////// refresh token request
function refreshToken(req, res) {
  // console.log(req.cookies);
  var refreshTokenFormCookies = req.cookies.refreshtoken;
  if (!refreshTokenFormCookies) {
    return res.send("You Dont have a refresh token , you need to login");
  }

  Token.findRefreshToken(refreshTokenFormCookies)
    .then(result => {
      console.log("results *******************", result);
      var expirydate = result.refresh_token_expires_at;

      // console.log("user_id", result.user_id);
      var newDate = new Date();
      var comparison = expirydate.getTime() > newDate.getTime() ? true : false;
      // console.log(comparison);
      if (comparison) {
        User.findById(result.user_id)
          .then(data => {
            // console.log(data.rows);
            if (data.rows.length > 0) {
              // res.send("you logged in successfully");
              var payload = {
                id: data.rows[0].id,
                email: data.rows[0].email
              };
              // console.log(payload);
              //console.log(process.env.secretOrkey);
              jwt.sign(
                payload,
                process.env.secretOrkey,
                { expiresIn: 300 },
                (err, token) => {
                  var refreshToken = randToken.uid(250);
                  var date = new Date();
                  // console.log(refreshToken);
                  //console.log(token);
                  Token.update(
                    token,
                    new Date(date.getTime() + 5 * 60 * 1000),
                    refreshToken,
                    new Date(date.getTime() + 30 * 24 * 60 * 60 * 1000),
                    data.rows[0].id
                  );
                  res.cookie("refreshtoken", refreshToken, {
                    maxAge: 9000000000,
                    httpOnly: true
                  });
                  res.cookie("token", token, {
                    maxAge: 60 * 60 * 1000, // keep it 60 * 60 * 1000
                    httpOnly: true
                  });
                  return res.json({
                    payload,
                    success: true,
                    token: "Bearer " + token
                  });
                  //) res.status(200).send(result);
                }
              );
            } else {
              res.status(400).json("no user with such id found");
            }
          })
          .catch(err => res.send(err));
      } else {
        res
          .status(400)
          .json({ message: "invalid refresh token please login again" });
      }
    })
    .catch(err => console.log(err));
}

/// malik's

function getAll(req, res) {
  User.getAll()
    .then(result => {
      res.send(result.rows);
    })
    .catch(err => {
      res.send(err);
    });
}
function getUserByName(req, res) {
  var username = req.body.username;
  User.getUserByName(username)
    .then(result => {
      res.send(result.rows);
    })
    .catch(err => {
      res.send(err);
    });
}

function findById(req, res) {
  var user_id = req.body.user_id;
  User.findById(user_id)
    .then(result => {
      delete result.rows[0]["password"];
      res.send(result.rows);
    })
    .catch(err => {
      res.send(err);
    });
}

// function findByIdandUpdateUser(req, res) {
//   var user_id = req.body.user_id;
//   User.findById(user_id)
//     .then(result => {
//       res.send(result.rows);
//     })
//     .catch(err => {
//       res.send(err);
//     });
// }

//

function UpdateProfilePhoto(req, res) {
  const form = new IncomingForm();
  var user_id;
  var link;
  form.parse(req, function (err, fields, files) {
    user_id = fields.user_id;
    if (err) {
      res.send(err);
    }
    res.end();
  });

  form.on("fileBegin", function (name, file) {
    var id = uniqueId();
    file.path = "folders/uploaded/" + id + "." + file.name.split(".")[1];

    link = id + "." + file.name.split(".")[1];
  });

  form.on("end", (err, data) => {
    var userObj = { photo: link, user_id: user_id };

    User.updatePhoto(userObj)
      .then(data => {
        if (data) {
        }
      })
      .catch(err => {
        if (err) {
          console.error(err);
        }
      });
  });
}

//
function updatePass(req, res) {
  var user_id = req.body.user_id;
  var password = req.body.password;
  let hash = bcrypt.hashSync(password, 12);
  var obj = { user_id, password: hash };
  User.update(obj)
    .then(data => {
      res.json(data);
    })
    .catch(err => {
      res.send(" something wrong happened");
    });
}

function updateProfile(req, res) {
  User.updateProfile(req)
    .then(data => {
      res.json("Profile Updated !!");
    })
    .catch(err => {
      res.send("err");
    });
}

//

module.exports.signUp = signUp;
module.exports.logIn = logIn;
module.exports.enter = enter;
module.exports.logOut = logOut;
module.exports.refreshToken = refreshToken;
//
module.exports.getUserByName = getUserByName;
module.exports.getAll = getAll;
module.exports.findById = findById;
module.exports.UpdateProfilePhoto = UpdateProfilePhoto;
module.exports.updatePass = updatePass;
module.exports.updateProfile = updateProfile;
// module.exports.findByIdandUpdateUser = findByIdandUpdateUser;
