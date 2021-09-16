const { Schema, model } = require("mongoose");

const orderSchema = new Schema({
  orders: [
    {
      order: {
        type: Number,
        default: 0,
      },
      dateOfOrder: {
        type: Date,
        default: Date.now,
      },
      total: {
        type: Number,
      },
      status: {
        type: String,
        enum: ["being prepared","recieved","cancel","onHold"],
        default: "being prepared",
      },
      items: [
        {
          type: Object,
        },
      ],
    },
  ],
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

module.exports = model("Orders", orderSchema);
