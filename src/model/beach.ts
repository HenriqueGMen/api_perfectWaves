import { IBeach } from "@src/services/repositories/IBeach";
import mongoose, { Model } from "mongoose";

const schema = new mongoose.Schema<IBeach>(
  {
  lat: {type: Number, require: true},
  lng: {type: Number, require: true},
  name: {type: String, require: true},
  position: {type: String, require: true},
  },
  {
    toJSON: {
      transform: (_, ret): void => {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
      }
    }
  }
);

export const Beach: Model<IBeach> = mongoose.model('Beach', schema);