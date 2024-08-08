const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const matSchema = new Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "auth",
    },
    matrix1: {
      type: [[Number]],
    },
    matrix2: {
      type: [[Number]],
    },
    result: {
      type: [[Number]],
    },
    addOpt: {
      type:Number,
      default:0
    },
    mulOpt: {
      type:Number,
      default:0
    },
    subOpt:{
      type:Number,
      default:0
    }
  },
  {
    timestamps: true,
    versionKey: false,
  }
);
const matModel = new mongoose.model("matrix", matSchema);
module.exports = matModel;
