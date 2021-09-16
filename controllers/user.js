const bcrypt = require("bcrypt");
const User = require("../models/user/User");
const nodeMailer = require("nodemailer");
const securePin = require("secure-pin");
const jwt = require("jsonwebtoken");
const sgMail = require("@sendgrid/mail");
const { SEND_GRID_API_KEY } = require("../config");
require("dotenv").config();
const { SECRET_KEY } = require("../config");
const { response } = require("express");
var smtpTransport = require('nodemailer-smtp-transport');
exports.alluser = (req, res, next) => {
  User.find({}, (err, user) => {
    res.send(user);
  });
};
// exports.signup = (req, res, next) => {
//   console.log(req.body)
//   console.log(hash)
//   console.log(securePin.generatePinSync(4))
//   bcrypt.hash(req.body.password, 10).then((hash) => {
//     const user = new User({
//       email: req.body.email,
//       password: hash,
//       messageofknow: req.body.messageofknow,
//     });
//     user
//       .save()
//       .then((resp) => {
//         res.status(201).json({
//           message: "Account Created!",
//           user:{_id:resp._id},
//         });
//       })
//       .catch((error) => {
//         res.status(500).json({
//           error: error,
//           message:"an unknown error occured"
//         });
//       });
//   });
// };
exports.signup=(req,res)=>{
  function gene() {
    let accesscode = securePin.generatePinSync(4);
    if(accesscode.charAt(0)==='0'){
      gene()
    }
    else{
      return accesscode
    }
  }
  let accesscode=gene()
  const {email, password, messageofknow} = req.body
  User.findOne({ email }, (err, user) => {
      if (err) {
          res.status(400).json({
              message: 'an error occured',
              error: err
          })
      }
      if (user) {
          res.status(403).json({
              message: `email already exist`,
          })
      }
      if (!user) {
          const hash = bcrypt.hashSync(password, 10);
          const newUser = new User({
              accesscode,email,messageofknow, password: hash,role:"user"
          })
          newUser.save()
              .then((newuser) => {
                  res.status(201).json({
                      message: 'account created successfully',
                      user:{
                          id:newuser._id
                      }
                  })
              })
              .catch(err => {
                  res.status(400).json(err)
              })
      }
  })
}
exports.updatePersonalDetails = (req, res, next) => {
  const { fullname, phonenumber, occupation, gender } = req.body;

  User.findByIdAndUpdate(
    req.params.id,
    { fullname, phonenumber, occupation, gender },
    (err, user) => {
      if (err) return next(err);
      res.status(200).send({
        user,
        message: "Update Successful",
      });
    }
  );
};

exports.verify = async (req, res, next) => {
  let accesscode;
  function gene() {
    accesscode = securePin.generatePinSync(4);
    if(accesscode.charAt(0)==='0'){
      gene()
    }
    else{
      return true
    }
  }
  gene()
  const nodemailer = require("nodemailer");
  let transporter = nodemailer.createTransport(smtpTransport({
    host: "emirexmagnet.com",
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.NODEMAILER_USERNAME, // generated ethereal user
      pass: process.env.NODEMAILER_PASSWORD, // generated ethereal password
    },
    connectionTimeout: 5 * 60 * 1000, // 5 min

    tls: {
      // do not fail on invalid certs
      rejectUnauthorized: false,
    },
  }));

  let info = await transporter
    .sendMail({
      from: '"Emirex Magnet" <Hello@emirexmagnet.com>', // sender address
      to: req.body.email, // list of receivers
      subject: "Hello ✔", // Subject line
      text: "Hello world?", // plain text body
      html: `<h1>Your Emirex verification code </h1>:<h2>${accesscode}</h2><br/>`, // html body
    })
    .then((response) => {
      User.findOneAndUpdate({email:req.body.email,},{accesscode},(err,user)=>{
        if(err) res.status(404).json(err)
        res.status(200).json({ message: "Sent",user,accesscode });
      })
    })
    .catch((error) => {
        res.json({
          message: "error occured!",
          message1: error,
        });

    });
  
};
exports.getverified = (req, res, next) => {
  const { email, accesscode } = req.body;
  User.findOne({ email }, (err, user) => {
    if (err) res.send(err);
    if (user.accesscode) {
      if (user.accesscode === accesscode) {
        user.verified = true;
        user.emailverified = true;
        user
          .save()
          .then((response) => {
            res.json({
              status: true,
              message: "Verification successful",
              user,
            });
          })
          .catch((err) => {
            res.send({
              message: "Incorrect verification code",
            });
          });
      } else {
        res.json({
          message: "Incorrect verification code",
        });
      }
    } else {
      res.json({
        status: false,
        message: "An Error Occured",
        success: false,
      });
    }
  });
};

exports.login = (req, res, next) => {
  const { email, password } = req.body;
  User.findOne({ email }, (err, user) => {
    if (err) {
      return res.status(500).json({
        message: "login error",
        status: false,
      });
    }
    if (!user) {
      return res.status(404).json({
        message: "user does not exist",
        status: false,
      });
    }
    const passwordIsValid = bcrypt.compareSync(password, user.password);
    if (!passwordIsValid) {
      return res.status(403).json({
        message: "login invalid",
        status: false,
      });
    }
    const token = jwt.sign({ id: user._id, role:user.role}, SECRET_KEY, { expiresIn: "1h" });

    res.status(200).json({
      user,
      message: "Authenticated",
      token,
    });
  });
};
exports.dashboarduser = (req, res, next) => {
  User.findOne({ _id: req.params.id })
    .then((user) => {
      jwt.verify(req.token, SECRET_KEY, (err, authData) => {
        if (err) {
          res.sendStatus(403);
        } else {
          res.json({
            message: "successfully access protected route",
            authData,
            user,
          });
        }
      });
    })
    .catch((err) => {
      res.send(err);
    });
};
exports.updateDetails1 = (req, res, next) => {
  const {
    MaritalStatus,
    DateOfBirth,
    ResidentialAddress,
    NearestBusStop,
    CityTown,
    State,
    Nationality,
  } = req.body;
  User.findByIdAndUpdate(
    { _id: req.params.id },
    {
      MaritalStatus,
      DateOfBirth,
      ResidentialAddress,
      NearestBusStop,
      CityTown,
      State,
      Nationality,
    },
    (err, user) => {
      if (err) throw next(err);
      res.json({
        message: "updated successfull",
        user,
        status: true,
      });
    }
  );
};
exports.updateDetails2 = (req, res, next) => {
  const {
    referralsId,
    referralsName,
    identificationMeans,
    identificationNo,
    nameOfOrgnisation,
    lga,
    stateOfOrigin,
    idimage,
  } = req.body;
  User.findByIdAndUpdate(
    { _id: req.params.id },
    {
      referralsId,
      referralsName,
      identificationMeans,
      identificationNo,
      nameOfOrgnisation,
      lga,
      stateOfOrigin,
      idimage,
    },
    (err, user) => {
      if (err) throw next(err);
      res.json({
        message: "updated successfull",
        user,
        status: true,
      });
    }
  );
};
exports.uploadimage = (req, res, next) => {
  User.findByIdAndUpdate(
    { _id: req.params.id },
    { image: req.file, upToDate: true },
    (err, user) => {
      if (err) throw next(err);
      res.json({
        message: "updated successfull",
        user,
        file: req.file,
        status: true,
      });
    }
  );
};

exports.updateEmail = (req, res, next) => {
  User.findById({ _id: req.params.id }, (err, user) => {
    const passwordIsValid = bcrypt.compareSync(
      req.body.password,
      user.password
    );
    if (!passwordIsValid) {
      return res.status(403).json({
        message: "incorrect password",
        status: false,
      });
    } else {
      user.email = req.body.email;
      user.save().then((response) => {
        res.json({
          status: true,
          message: "email changed",
          response,
          user,
        });
      });
    }
  });
};
exports.deleteaccount = (req, res, next) => {
  User.findOneAndDelete(req.params.id, (err) => {
    if (err) return next(err);
    res.send("Deleted successfully!");
  });
};

