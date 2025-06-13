import mongoose, { Schema, type Document, type Model } from "mongoose";
import type { Person } from "../schemas/person.schema";

export interface PersonDocument extends Document, Omit<Person, "_id"> {
  _id: string;
}

interface PersonModel extends Model<PersonDocument> {
  findByEmail(email: string): Promise<PersonDocument | null>;
  findActive(): Promise<PersonDocument[]>;
  findByAge(minAge: number, maxAge: number): Promise<PersonDocument[]>;
  search(query: string): Promise<PersonDocument[]>;
  getStatistics(): Promise<{
    total: number;
    active: number;
    inactive: number;
    averageAge: number;
  }>;
}

const personSchema = new Schema<PersonDocument>(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
      maxlength: 50,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
      maxlength: 50,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    age: {
      type: Number,
      required: true,
      min: 0,
      max: 150,
    },
    phone: {
      type: String,
      trim: true,
    },
    address: {
      type: String,
      maxlength: 200,
    },
    department: {
      type: String,
      maxlength: 50,
      index: true,
    },
    position: {
      type: String,
      maxlength: 50,
    },
    salary: {
      type: Number,
      min: 0,
    },
    hireDate: {
      type: String, // ISO date string
    },
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

personSchema.virtual("fullName").get(function () {
  return `${this.firstName} ${this.lastName}`;
});

personSchema.index({ firstName: "text", lastName: "text", email: "text" });
personSchema.index({ email: 1, isActive: 1 });

personSchema.statics.findByEmail = function (email: string) {
  return this.findOne({ email: email.toLowerCase() });
};

personSchema.statics.findActive = function () {
  return this.find({ isActive: true }).sort({ createdAt: -1 });
};

personSchema.statics.findByAge = function (minAge: number, maxAge: number) {
  return this.find({
    age: { $gte: minAge, $lte: maxAge },
    isActive: true,
  }).sort({ age: 1 });
};

personSchema.statics.search = function (query: string) {
  return this.find({
    $or: [
      { firstName: { $regex: query, $options: "i" } },
      { lastName: { $regex: query, $options: "i" } },
      { email: { $regex: query, $options: "i" } },
    ],
    isActive: true,
  }).sort({ createdAt: -1 });
};

personSchema.statics.getStatistics = async function () {
  const [stats] = await this.aggregate([
    {
      $group: {
        _id: null,
        total: { $sum: 1 },
        active: { $sum: { $cond: ["$isActive", 1, 0] } },
        inactive: { $sum: { $cond: ["$isActive", 0, 1] } },
        averageAge: { $avg: "$age" },
      },
    },
  ]);

  return stats || { total: 0, active: 0, inactive: 0, averageAge: 0 };
};

personSchema.pre("save", function (next) {
  if (this.isModified("email")) {
    this.email = this.email.toLowerCase();
  }
  next();
});

export const PersonModel =
  (mongoose.models.Person as PersonModel) || mongoose.model<PersonDocument, PersonModel>("Person", personSchema);
