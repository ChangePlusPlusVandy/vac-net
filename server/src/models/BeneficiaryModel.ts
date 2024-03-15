import mongoose from "mongoose";
const { Schema } = mongoose;

export interface IBeneficiary {
  _id: string;
  firstName?: string;
  lastName?: string;
  joinDate?: Date;
  languages?: string[];
  phoneNumber?: string;
  archived?: boolean;
  birthday?: Date;
  priorities?: string[];
  loan?: string; // Existing single loan reference, do not touch this
  associatedLoans?: mongoose.Types.ObjectId[]; // New field for multiple loans
  associatedSessions?: mongoose.Types.ObjectId[]; // New field for multiple sessions
  children?: number; //
  age?: number; // 
  villageOrCity?: string;
  maritalStatus?: string;
  peopleInHousehold?: number; // 
  numFinancialDependents?: number; // 
  currentWeeklyIncomeInUGX?: number;
  currentlyWeeklyIncomeInUSD?: number;
  currentSpendingInUGX?: number; // 
  currentSavingsInUGX?: number; // 
  currentSavingsInUSD?: number;
  locationOfSavings?: string;
  businessDescription?: string;
  ownYourLand?: boolean;
  ownYourHouse?: string; //
  highestEducationLevel?: string; //
  howManyRoomsInHouse?: number; // 
  roofMaterial?: string; //
  wallMaterial?: string; //
  floorMaterial?: string; // 
  lightSource?: string; //
  ownLivestock?: string;
  cows?: number; //
  goats?: number; //
  chickens?: number; //
  turkeys?: number; //
  otherLivestock?: string; //
  bio?: string;
  howManyMealsPerDay?: number; //
  howManyMealsPerWeeksWithChicken?: number;
  howManyMealsPerWeekWithMeat?: number;
  howManyMealsPerWeekWithFish?: number;
  childrenWithShoes?: number; //
  numberInHoseholdNeedMeds?: number;
  contractedMalria?: boolean;
  howManyEmployees?: number; //
  howDoesHusbandHelp?: string;
  electricityAccessInBusiness?: boolean;
}

const BeneficiarySchema = new mongoose.Schema<IBeneficiary>({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  joinDate: {
    type: Date,
    default: () => Date.now(),
    //required: true,
  },
  loan: {
    type: Schema.Types.ObjectId,
    ref: "OutstandingLoan",
  },
  languages: {
    type: [String],
  },
  phoneNumber: {
    type: String,
  },
  archived: {
    type: Boolean,
    default: false,
  },
  birthday: {
    type: Date,
  },
  priorities: {
    type: [String],
  },
  children: {
    type: Number,
  },
  associatedLoans: [
    {
      type: Schema.Types.ObjectId,
      ref: "OutstandingLoan", // Use the correct model name for the Loan model
    },
  ],
  associatedSessions: [
    {
      type: Schema.Types.ObjectId,
      ref: "Session", // Use the correct model name for the Session model
    },
  ],
  age: {
    type: Number,
  },
  villageOrCity: {
    type: String,
  },
  maritalStatus: {
    type: String,
  },
  peopleInHousehold: {
    type: Number,
  },
  numFinancialDependents: {
    type: Number,
  },
  currentWeeklyIncomeInUGX: {
    type: Number,
  },
  currentlyWeeklyIncomeInUSD: {
    type: Number,
  },
  currentSavingsInUGX: {
    type: Number,
  },
  currentSavingsInUSD: {
    type: Number,
  },
  locationOfSavings: {
    type: String,
  },
  businessDescription: {
    type: String,
  },
  ownYourLand: {
    type: Boolean,
  },
  ownYourHouse: {
    type: Boolean,
  },
  highestEducationLevel: {
    type: String,
  },
  howManyRoomsInHouse: {
    type: Number,
  },
  roofMaterial: {
    type: String,
  },
  wallMaterial: {
    type: String,
  },
  floorMaterial: {
    type: String,
  },
  lightSource: {
    type: String,
  },
  ownLivestock: {
    type: Boolean,
  },
  cows: {
    type: Number,
  },
  goats: {
    type: Number,
  },
  chickens: {
    type: Number,
  },
  turkeys: {
    type: Number,
  },
  otherLivestock: {
    type: String,
  },
  bio: {
    type: String,
  },
  howManyMealsPerDay: {
    type: Number,
  },
  howManyMealsPerWeeksWithChicken: {
    type: Number,
  },
  howManyMealsPerWeekWithMeat: {
    type: Number,
  },
  howManyMealsPerWeekWithFish: {
    type: Number,
  },
  childrenWithShoes: {
    type: Number,
  },
  numberInHoseholdNeedMeds: {
    type: Number,
  },
  contractedMalria: {
    type: Boolean,
  },
  howManyEmployees: {
    type: Number,
  },
  howDoesHusbandHelp: {
    type: String,
  },
  electricityAccessInBusiness: {
    type: Boolean,
  },
});

export default mongoose.model<IBeneficiary>("Beneficiary", BeneficiarySchema);
