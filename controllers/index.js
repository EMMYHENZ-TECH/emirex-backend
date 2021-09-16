const Dci = require("../models/index");
const User = require("../models/user/User");
const Admin = require("../models/admin/admin");
var smtpTransport = require("nodemailer-smtp-transport");
var bcrypt = require("bcrypt");
require("dotenv").config();

exports.updateProfile = (req, res) => {
  const {
    type,
    occupation,
    phonenumber,
    ResidentialAddress,
    NearestBusStop,
    CityTown,
    State,
  } = req.body;
  if (type === "user") {
    User.findOneAndUpdate(
      { _id: req.params.id },
      {
        occupation,
        phonenumber,
        ResidentialAddress,
        NearestBusStop,
        CityTown,
        State,
      }
    )
      .then((response) => {
        res.status(200).json({
          response,
          status: true,
        });
      })
      .catch((err) => {
        res.status(400).json({
          err,
        });
      });
  }
  if (type === "admin" || type === "superadmin") {
    Admin.findOneAndUpdate(
      { _id: req.params.id },
      {
        occupation,
        phonenumber,
        ResidentialAddress,
        NearestBusStop,
        CityTown,
        State,
      }
    )
      .then((response) => {
        res.status(200).json({
          response,
          status: true,
        });
      })
      .catch((err) => {
        res.status(400).json({
          err,
        });
      });
  }
};
exports.resetpassword = (req, res) => {
  const { email, type } = req.body;
  if (type === "user") {
    User.findOne({ email }).then((user) => {
      if (!user) {
        return res.status(401).json({
          message: `The email address  +
            ${email}
             is not associated with any account. Double-check 
            your email address and try again.`,
        });
      }
      user.generatePasswordReset();
      var os = require("os");


      user.save().then((user) => {
        let link =
          "http://" +
          req.headers.origin +
          req.body.path +"?token="+
          user.resetPasswordToken;

        sendmailtouser = async () => {
          const nodemailer = require("nodemailer");
          let transporter = nodemailer.createTransport(
            smtpTransport({
              host: "mail.dci.ng",
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
            })
          );

          let info = await transporter
            .sendMail({
              from: '"DCI" <info@dci.ng>', // sender address
              to: user.email,
              subject: "Password change request",
              text: `Hi ${user.fullname} \n 
          Please click on the following link ${link} to reset your password. \n\n 
          If you did not request this, please ignore this email and your password will remain unchanged.\n`,
            })
            .then((response) => {
              res.send(response);
            })
            .catch((error) => {
              res.json({
                message: "error occured!",
                message1: error,
              });
            });
        };
        sendmailtouser();
      });
    });
  }
  if (type === "admin" || type === "superadmin") {
    Admin.findOne({ email }).then((user) => {
      if (!user) {
        return res.status(401).json({
          message: `The email address  +
            ${email}
             is not associated with any account. Double-check 
            your email address and try again.`,
        });
      }
      user.generatePasswordReset();
      user.save().then((user) => {
        let link =
          "http://" +
          req.body.host +
          req.body.path +"?token="+
          user.resetPasswordToken;

        sendmailtouser = async () => {
          const nodemailer = require("nodemailer");
          let transporter = nodemailer.createTransport(
            smtpTransport({
              host: "mail.dci.ng",
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
            })
          );

          let info = await transporter
            .sendMail({
              from: '"DCI" <info@dci.ng>', // sender address
              to: user.email,
              subject: "Password change request",
              text: `Hi ${user.fullname} \n 
          Please click on the following link ${link} to reset your password. \n\n 
          If you did not request this, please ignore this email and your password will remain unchanged.\n`,
            })
            .then((response) => {
              res.status(200).json({
                message: "A reset email has been sent to " + user.email + ".",
                response,
              });
            })
            .catch((error) => {
              res.json({
                message: "error occured!",
                message1: error,
              });
            });
        };
        sendmailtouser();
      });
    });
  }
};

exports.reset = (req, res) => {
  User.findOne({
    resetPasswordToken: req.params.token,
    resetPasswordExpires: { $gt: Date.now() },
  })
    .then((user) => {
      if (!user){
        return res
          .status(401)
          .json({ message: "Password reset token is invalid or has expired." });
      }
      else{

        //Redirect user to form with the email address
        res.json(200).json({
            user
        })
      }

    })
    .catch((err) => res.status(500).json({ message: err.message }));
};


exports.resetPasswordChange = (req, res) => {
    User.findOne({resetPasswordToken: req.params.token, resetPasswordExpires: {$gt: Date.now()}})
        .then((user) => {
            const hashPassword =null
            if (!user) return res.status(401).json({message: 'Password reset token is invalid or has expired.'});
            const hash = bcrypt.genSalt(10, function(err, salt) {
                if (err) 
                  return callback(err);
            
                bcrypt.hash(req.body.password, salt, function(err, hash) {
                
                  //Set the new password
                  user.password = hash;
                  user.resetPasswordToken = undefined;
                  user.resetPasswordExpires = undefined;
      
                  // Save
                  user.save((err) => {
                      if (err) return res.status(500).json({message: err.message});
                      res.status(200).json({
                          message:`Successfully  reset password you can now login with new password`
                      })
                  });
                });
              });
        });
};
