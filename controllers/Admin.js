const Admin = require("../models/admin/admin");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { SECRET_KEY } = require("../config");
const User = require("../models/user/User");
const Dci = require("../models/index");
const smtpTransport = require("nodemailer-smtp-transport");
const securePin = require("secure-pin");
require("dotenv").config();

function percentage(num, per) {
  return (num / 100) * per;
}

var today = new Date();
var dd = String(today.getDate()).padStart(2, "0");
var mm = String(today.getMonth() + 1).padStart(2, "0");
var yyyy = today.getFullYear();
today = dd + "/" + mm + "/" + yyyy;
exports.signup = (req, res, next) => {
  let accesscode;
  function gene() {
    accesscode = securePin.generatePinSync(4);
    if (accesscode.charAt(0) === "0") {
      gene();
    } else {
      return true;
    }
  }
  gene();
  bcrypt.hash(req.body.password, 10).then((hash) => {
    const user = new Admin({
      fullname: req.body.fullname,
      email: req.body.email,
      phonenumber: req.body.phonenumber,
      residentialAddress: req.body.residentialAddress,
      nearestBusStop: req.body.nearestBusStop,
      town: req.body.town,
      State: req.body.State,
      country: req.body.country,
      DateOfBirth: req.body.DateOfBirth,
      idNumber: req.body.idNumber,
      idType: req.body.idType,
      AdminType: req.body.type,
      password: hash,
      accesscode,
      image: req.body.image,
      regNoAdmin: req.body.regNoAdmin,
    });
    user
      .save()
      .then(() => {
        res.status(201).json({
          message: "Admin added successfully!",
          user,
        });
      })
      .catch((error) => {
        res.status(500).json({
          error: error,
        });
      });
  });
};

exports.login = (req, res) => {
  const { email, password } = req.body;
  Admin.findOne({ email }, (err, user) => {
    if (err) {
      return res.status(500).json({
        message: "login error",
        status: false,
      });
    }
    if (!user) {
      return res.status(404).json({
        message: "admin does not exist",
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
    const token = jwt.sign({ id: user._id, role: user.role }, SECRET_KEY, {
      expiresIn: "86400s",
    });
    res.status(200).json({
      user,
      message: "Authenticated",
      token,
    });
  });
};

exports.AdminDashboard = (req, res) => {
  Admin.findById({ _id: req.params.id }, (err, user) => {
    if (err) {
      res.status(400).json({
        message: "error occured or user not found",
        status: false,
      });
    } else {
      res.json({
        message: "successfully found user",
        status: true,
        user,
      });
    }
  });
};

exports.AllAdmins = (req, res) => {
  Admin.find({ AdminType: "admin" }).then((response) => {
    res.send(response);
  });
};
exports.Pending = (req, res) => {
  User.find({ requestinvestment: true, activeplan: false }).then((response) => {
    res.send(response);
  });
};
exports.AllInvestors = (req, res) => {
  User.find({ investor: true }).then((response) => {
    res.send(response);
  });
};
exports.AllInvestorsActive = (req, res) => {
  User.find({ activeplan: true }).then((response) => {
    res.send(response);
  });
};
exports.AllInvestorsdeclined = (req, res) => {
  User.find({ declinedInvestment: "declined" }).then((response) => {
    res.send(response);
  });
};
exports.Pending = (req, res) => {
  User.find({ requestinvestment: true, declinedInvestment: "no" }).then(
    (response) => {
      res.send(response);
    }
  );
};
function addMonths(date, months) {
  var d = date.getDate();
  date.setMonth(date.getMonth() + +months);
  if (date.getDate() != d) {
    date.setDate(0);
  }
  return date;
}
function userExistChecker(userRefId) {
  User.findOne({ accesscode: userRefId }, (err, user) => {
    if (!user) {
      return false;
    }
    if (user) {
      return false;
    }
  });
}
exports.verifyinvestor = (req, res) => {
  Admin.findById({ _id: req.body.id }, (err, admin) => {
    if (err) {
      res.status(400).json({
        message: "error occured or admin not found",
        status: false,
      });
    } else {
      const d = new Date();
      const year = d.getFullYear();
      const month = d.getMonth();
      const day = d.getDate();

      User.findById({ _id: req.body.user._id }, (err, user) => {
        let interval = parseInt(user.planDetails.interval);
        console.log(user.referralsId)
        if (user.investmentCount >= 1) {
          (user.investmentCount = user.investmentCount + 1),
            (user.activeplan = true),
            (user.LastInvestmentPayDay = today),
            (user.requestinvestment = false),
            (user.investmentReturnsBalance = user.planDetails.TotalROI),
            (user.investmentReturnsPercentage = parseInt(
              user.planDetails.percentage
            )),
            (user.investmentStartDate = new Date()),
            (user.investmentNextPayDate = addMonths(
              new Date(year, month, day),
              interval
            ).toString());
          user.save((err, data) => {
            if (err) res.send(err);
            res.send(data);
          });
        } else if (
          user.investmentCount < 1 &&
          user.referralsId
        ) {
          user.investmentCount = user.investmentCount + 1;
          // Admin.find({ accesscode: user.referralsId }, (err, users) => {
          //   if (err) return res.status(404).json(err);
          //   if (users.length >= 1) {
          //     Admin.findOne(
          //       { accesscode: user.referralsId },
          //       (err, reffereduser) => {
          //         if (err) {
          //           return res.status(404).json({
          //             message: `Wrong refferal code ,please contact the user on ${user.email}
          //          to collect correct refferral code and edit the users account to add 
          //          correct code and proceed`,
          //             err,
          //           });
          //         }
          //         user.activeplan = true;
          //         user.LastInvestmentPayDay = today;
          //         user.requestinvestment = false;
          //         user.investmentReturnsBalance = user.planDetails.TotalROI;
          //         user.investmentReturnsPercentage =
          //           user.planDetails.percentage;
          //         user.investmentStartDate = new Date();
          //         user.investmentNextPayDate = addMonths(
          //           new Date(year, month, day),
          //           interval
          //         ).toString();
          //         const amount = parseInt(user.planDetails.dataPrice);
                  
          //         const ammountForRefer = percentage(amount, 10);
          //         reffereduser.referralsEarning =
          //           reffereduser.referralsEarning + ammountForRefer;
          //         const { _id, email, fullname, phonenumber } = user;
          //         reffereduser.referralsUsers.push({
          //           _id,
          //           email,
          //           fullname,
          //           phonenumber,
          //         });
          //         reffereduser.save();
          //       }
          //     );
          //     user.save((err, data) => {
          //       if (err) res.send(err);
          //       res.json({ data, message: "activated" });
          //     });
          //   } else {
          //   }
          // });
          User.find({ accesscode: user.referralsId }, (err, users) => {
            if (err) return res.status(404).json(err);
            if (users.length >= 1) {
              User.findOne(
                { accesscode: user.referralsId },
                (err, reffereduser) => {
                  if (err) {
                    return res.status(404).json({
                      message: `Wrong refferal code ,please contact the user on ${user.email}
                   to collect correct refferral code and edit the users account to add 
                   correct code and proceed`,
                      err,
                    });
                  }
                  user.activeplan = true;
                  user.LastInvestmentPayDay = today;
                  user.requestinvestment = false;
                  user.investmentReturnsBalance = user.planDetails.TotalROI;
                  user.investmentReturnsPercentage =
                    user.planDetails.percentage;
                  user.investmentStartDate = new Date();
                  user.investmentNextPayDate = addMonths(
                    new Date(year, month, day),
                    interval
                  ).toString();
                  const amount = parseInt(user.planDetails.dataPrice);
                  const ammountForRefer = percentage(amount, 10);
                  reffereduser.referralsEarning =
                    reffereduser.referralsEarning + ammountForRefer;
                  const { _id, email, fullname, phonenumber } = user;
                  reffereduser.referralsUsers.push({
                    _id,
                    email,
                    fullname,
                    phonenumber,
                  });
                  console.log('froon he')
                  reffereduser.save();
                }
              );
              user.save((err, data) => {
                if (err) res.send(err);
                res.send(data);
              });
            } else {
            }
          });
        } else {
          user.investmentCount = user.investmentCount + 1;
          // user.investmentCount = user.investmentCount + 1,
          (user.activeplan = true),
            (user.LastInvestmentPayDay = today),
            (user.requestinvestment = false),
            (user.investmentReturnsBalance = user.planDetails.TotalROI),
            (user.investmentReturnsPercentage = user.planDetails.percentage),
            (user.investmentStartDate = new Date()),
            (user.investmentNextPayDate = addMonths(
              new Date(year, month, day),
              interval
            ).toString());
            console.log('last')
          user.save((err, data) => {
            if (err) res.send(err);
            res.send(data);
          });
        }
      }).catch((err) => {
        res.send(err);
      });
    }
  });
};

exports.PendingLoaner = (req, res) => {
  User.find({ LoanRequest: true, declinedLoan: "no" }).then((response) => {
    res.send(response);
  });
};
exports.verifyloaner = (req, res) => {
  Admin.findById({ _id: req.params.id }, (err, admin) => {
    if (err) {
      res.status(400).json({
        message: "error occured or admin not found",
        status: false,
      });
    } else {
      User.findOneAndUpdate(
        { _id: req.body.user._id },
        { LoanActive: true, declineLoaner: "no", LoanRequest: false }
      )
        .then((response) => {
          res.send(response);
        })
        .catch((err) => {
          res.send(err);
        });
    }
  });
};
exports.PendingSaveAdd = (req, res) => {
  User.find({ AddSaveRequest: true, declineSaver: "no" }).then((response) => {
    res.send(response);
  });
};
exports.savingsIsActive = (req, res) => {
  User.find({ SavingsActive: true }).then((response) => {
    res.send(response);
  });
};
exports.verifysavings = (req, res) => {
  Admin.findById({ _id: req.body.admin._id }, (err, admin) => {
    if (err) {
      res.status(400).json({
        message: "error occured or admin not found",
        status: false,
      });
    } else {
      const { amount } = req.body;
      User.findOneAndUpdate(
        { _id: req.body.user._id },
        { SavingsActive: true, AddSaveRequest: false }
      )
        .then((response) => {
          response.savingBalance = response.savingBalance + amount;
          response.SavingsActive = true;
          user.save((response1) => {
            res.json({
              response,
              response1,
              message: "Account Activated Successfully",
            });
          });
        })
        .catch((err) => {
          res.send(err);
        });
    }
  });
};

exports.PayLoan = (req, res) => {
  User.find({ repayLoanRequest: true }).then((response) => {
    res.send(response);
  });
};
exports.verifypayloan = (req, res) => {
  const { amount } = req.body;
  User.findById({ _id: req.params.id })
    .then((user) => {
      user.amountToRepayBalance = user.amountToRepayBalance - parseInt(amount);
      user.repayLoanRequest = false;
      user.save((response1) => {
        res.json({
          user,
          response1,
        });
      });
    })
    .catch((err) => {
      res.send(err);
    });
};
exports.stirequest = (req, res) => {
  User.find({ AddSaveRequest: true }).then((response) => {
    res.send(response);
  });
};
exports.verifysti = (req, res) => {
  const { amount } = req.body;
  User.findById({ _id: req.params.id })
    .then((user) => {
      user.AddSaveRequest = false;
      user.SavingsActive = false;
      user.savingBalance = user.savingBalance + parseInt(amount);
      user.save((response1) => {
        res.json({
          user,
          response1,
          amount,
        });
      });
    })
    .catch((err) => {
      res.send(err);
    });
};

exports.newUsers = (req, res) => {
  User.find({ approvedUser: false, declinedAccount: "no" }).then((response) => {
    res.send(response);
  });
};
exports.UsersActive = (req, res) => {
  User.find({ approvedUser: true }).then((response) => {
    res.send(response);
  });
};
exports.UsersDeclined = (req, res) => {
  User.find({ declinedAccount: "declined" }).then((response) => {
    res.send(response);
  });
};

exports.approveNewUser = (req, res) => {
  const { email } = req.body;
  User.findOneAndUpdate({ _id: req.params.id }, { approvedUser: true })
    .then((response) => {
      const sendmail = async () => {
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
            to: req.body.email, // list of receivers
            subject: "Account Activated Successfully", // Subject line
            text: "", // plain text body
            html: `<h1>You DCI Account Has Been Successfully Activated You Can Now Login</h1>`, // html body
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
      sendmail();
    })
    .catch((err) => {
      res.send(err);
    });
};

exports.disapproveAccount = (req, res) => {
  const { email } = req.body;
  User.findOneAndUpdate({ _id: req.params.id }, { declinedAccount: "declined" })
    .then((response) => {
      const sendmail = async () => {
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
            to: req.body.email, // list of receivers
            subject: "Account Activated Failure", // Subject line
            text: "", // plain text body
            html: `<h1>You DCI Account Was Not Successfully Approved</h1>`, // html body
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
      sendmail();
    })
    .catch((err) => {
      res.send(err);
    });
};

exports.declineInvestor = (req, res) => {
  Admin.findById({ _id: req.body.id }, (err, admin) => {
    if (err) {
      res.status(400).json({
        message: "error occured or admin not found",
        status: false,
      });
    } else {
      User.findOneAndUpdate(
        { _id: req.params.id },
        {
          activeplan: false,
          declinedInvestment: "declined",
          requestinvestment: false,
        },
        (err, user) => {
          if (err) res.status(400).json({ error: err });
          else {
            res.status(200).json({ user });
          }
        }
      );
    }
  });
};

exports.declineLoaner = (req, res) => {
  Admin.findById({ _id: req.body.id }, (err, admin) => {
    if (err) {
      res.status(400).json({
        message: "error occured or admin not found",
        status: false,
      });
    } else {
      User.findOneAndUpdate(
        { _id: req.params.id },
        {
          LoanActive: false,
          declinedLoan: "declined",
          LoanRequest: false,
        },
        (err, user) => {
          if (err) res.status(400).json({ error: err });
          else {
            res.status(200).json({ user });
          }
        }
      );
    }
  });
};
exports.declineSaver = (req, res) => {
  Admin.findById({ _id: req.body.id }, (err, admin) => {
    if (err) {
      res.status(400).json({
        message: "error occured or admin not found",
        status: false,
      });
    } else {
      User.findOneAndUpdate(
        { _id: req.params.id },
        {
          SavingsActive: false,
          declinedSavings: "declined",
          AddSaveRequest: false,
        },
        (err, user) => {
          if (err) res.status(400).json({ error: err });
          else {
            res.status(200).json({ user });
          }
        }
      );
    }
  });
};

exports.AllLoan = (req, res) => {
  User.find({ Loan: true }).then((response) => {
    res.send(response);
  });
};
exports.AllSave = (req, res) => {
  User.find({ Save: true }).then((response) => {
    res.send(response);
  });
};
exports.AllPendingLoan = (req, res) => {
  User.find({ declinedLoan: "no", LoanRequest: true }).then((response) => {
    res.send(response);
  });
};
exports.AllPendingSave = (req, res) => {
  User.find({ AddSaveRequest: true, declinedSavings: "no" }).then(
    (response) => {
      res.send(response);
    }
  );
};

exports.AllActiveLoan = (req, res) => {
  User.find({ LoanActive: true }).then((response) => {
    res.send(response);
  });
};
exports.AllActiveSave = (req, res) => {
  User.find({ SavingsActive: true }).then((response) => {
    res.send(response);
  });
};
exports.AllDeclinedLoan = (req, res) => {
  User.find({ declinedLoan: "declined" }).then((response) => {
    res.send(response);
  });
};
exports.AllDeclinedSave = (req, res) => {
  User.find({ declinedSavings: "declined" }).then((response) => {
    res.send(response);
  });
};

exports.payActiveInvestor = (req, res) => {
  User.findOne({ _id: req.body.userId }).then((response) => {
    if (parseInt(response.investmentReturnsBalance) > 0) {
      response.investmentReturnsBalance =parseInt(response.investmentReturnsBalance) - parseInt(response.planDetails.mReturns)
      if (parseInt(response.investmentReturnsBalance) <= 0) {
        response.activeplan = false;
        response.requestinvestment = false;
      }
    }
    if (parseInt(response.investmentReturnsBalance) <= 0) {
      response.activeplan = false;
      response.requestinvestment = false;
    }
    response.save() 
    .then(()=>{
      res.send('success')
    })
  });
};

exports.activateNewLoanRepay = (req, res) => {
  Admin.findOne({ _id: req.params.id }).then((resp) => {
    User.findOne({ _id: req.body.userId }).then((response) => {
      response.amountToRepayBalance =
        response.amountToRepayBalance -
        parseInt(response.repayLoanRequestDets.amount);
      response.repayLoanRequest = false;
      response.repayLoanRequestDets = {};
      if (response.amountToRepayBalance <= 0) {
        response.LoanActive = false;
        response.LoanRequest = false;
        response.repayLoanRequest = false;
      }
  
      response.save((err, data) => {
        if (err) res.send(err);
        res.send(data);
      });
    });
  });
};
