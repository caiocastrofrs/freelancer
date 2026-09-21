import { model, Schema } from "mongoose";
import validator from "validator";

const deliverySchema = new Schema(
  {
    deliveryDate: { type: Date, required: true },
    amountPaid: { type: Number, required: true },
    details: { type: String, required: true },
    paymentDueDate: { type: Date, required: true },
    paymentStatus: {
      type: String,
      enum: ["pending", "paid"],
      default: "pending",
    },
  },
  { timestamps: true },
);

const projectSchema = new Schema(
  {
    name: { type: String, required: true },
    status: {
      type: String,
      enum: ["inProgress", "completed", "paused"],
      default: "inProgress",
    },
    totalValue: Number,
    startDate: Date,
    estimatedEndDate: Date,
    deliveries: [deliverySchema],
  },
  { timestamps: true },
);

const clientSchema = new Schema(
  {
    name: { type: String, required: true },
    contactPhone: String,
    contactEmail: String,
    status: {
      type: String,
      enum: ["active", "inactive", "hasOngoingProject"],
      default: "inactive",
    },
    totalBilledAllProjects: Number,
    relationshipStartDate: Date,
    projects: [projectSchema],
  },
  { timestamps: true },
);

const tokenSchema = new Schema(
  {
    token: String,
  },
  { timestamps: true },
);

const userSchema = new Schema(
  {
    username: { type: String, required: true, minlength: 5, maxlength: 20 },
    email: {
      type: String,
      required: true,
      validate: {
        validator: (v: string) => validator.isEmail(v),
        message: "Invalid email format",
      },
    },
    password: { type: String, required: true },
    refreshTokens: [tokenSchema],
    clients: [clientSchema],
  },

  { timestamps: true },
);

const User = model("User", userSchema);

export default User;
