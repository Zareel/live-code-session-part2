import mongoose from "mongoose";

const collectionSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please provide a collection name"],
      maxLength: [120, "Collection name cannot exceed 120 chars"],
      trim: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Collection", collectionSchema);

// "Collection will be converted in to all lowercase and to plural in the database"
