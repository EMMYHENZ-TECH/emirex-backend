const { model, Schema } = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const crypto = require("crypto-extra");

const UserSchema = new Schema(
  {
    fullname: {
      type: String,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    messageofknow: {
      type: String,
    },
    password: {
      type: String,
      required: true,
    },
    phonenumber: {
      type: Number,
    },
    emailverified: {
      type: Boolean,
      default: false,
    },
    occupation: {
      type: String,
    },
    gender: {
      type: String,
    },
    accesscode: {
      type: String,
    },
    verified: {
      type: Boolean,
      default: false,
    },
    upToDate: {
      type: Boolean,
      default: false,
    },
    MaritalStatus: {
      type: String,
    },
    DateOfBirth: {
      type: String,
    },
    ResidentialAddress: {
      type: String,
    },
    NearestBusStop: {
      type: String,
    },
    CityTown: {
      type: String,
    },
    State: {
      type: String,
    },
    Nationality: {
      type: String,
    },
    image: {
      type: Object,
    },
    stateOfOrigin: {
      type: String,
    },
    lga: {
      type: String,
    },
    nameOfOrgnisation: {
      type: String,
    },
    identificationNo: {
      type: String,
    },
    identificationMeans: {
      type: String,
    },
    referralsName: {
      type: String,
    },
    referralsId: {
      type: String,
    },
    referralsEarning: {
      type: Number,
      default: 0,
    },
    referralsUsers: [
      {
        type: Object,
      },
    ],
    paid: {
      type: String,
      default: false,
    },
    approved: {
      type: String,
      default: false,
    },
    activeplan: {
      type: Boolean,
      default: false,
    },
    investmentStartDate: {
      type: String,
    },
    investmentNextPayDate: {
      type: String,
      default: "not set",
    },
    requestinvestment: {
      type: Boolean,
      default: false,
    },
    planDetails: {
      type: Object,
    },
    savingBalance: {
      type: Number,
      default: 0,
    },
    savingDets: {
      type: Object,
      default: {},
    },
    LoanActive: {
      type: Boolean,
      default: false,
    },
    LoanRequest: {
      type: Boolean,
      default: false,
    },
    loandets: {
      type: Object,
    },
    loandocs: {
      type: Object,
    },
    loangrant: {
      type: Object,
    },
    investmentReturnsPercentage: {
      type: Number,
      default: 0,
    },
    amountToRepay: {
      type: Number,
      default: 0,
    },
    amountToRepayBalance: {
      type: Number,
      default: 0,
    },
    LoanDateData: {
      type: Object,
    },
    investmentReturnsBalance: {
      type: String,
      default: 0,
    },
    AddSaveRequest: {
      type: Boolean,
      default: false,
    },
    SavingsActive: {
      type: Boolean,
      default: false,
    },
    idimage: {
      type: String,
      trim: true,
    },
    transferDets: {
      type: Object,
      default: {},
    },
    repayLoanRequest: {
      type: Boolean,
      default: false,
    },
    repayLoanRequestDets: {
      type: Object,
      default: 0,
    },
    investmentMonths: {
      type: Number,
      default: 0,
    },
    resetPasswordToken: {
      type: String,
      required: false,
    },
    resetPasswordExpires: {
      type: Date,
      required: false,
    },
    approvedUser: {
      type: Boolean,
      default: false,
    },
    investmentCount: {
      type: Number,
      default: 0,
    },
    role: {
      type: String,
      default: "user",
    },
    declinedAccount: {
      type: String,
      default: "no",
    },
    declinedInvestment: {
      type: String,
      default: "no",
    },
    declinedSavings: {
      type: String,
      default: "no",
    },
    declinedLoan: {
      type: String,
      default: "no",
    },
    investor: {
      type: Boolean,
      default: false,
    },
    Loan: {
      type: Boolean,
      default: false,
    },
    Save: {
      type: Boolean,
      default: false,
    },
    LastInvestmentPayDay: {
      type: String,
    },
    notifications: [
      {
        type: Object,
      },
    ],
    orders: [
      {
        type: Object,
      },
    ],
    shopPayments: [
      {
        type: Object,
      },
    ],
    newshopPayment:{
      type:Boolean
    }
  },
  { timestamp: true }
);

UserSchema.methods.generatePasswordReset = function () {
  this.resetPasswordToken = crypto.randomString().toString("hex");
  this.resetPasswordExpires = Date.now() + 3600000; //expires in an hour
};

// UserSchema.plugin(uniqueValidator);
module.exports = model("User", UserSchema);
