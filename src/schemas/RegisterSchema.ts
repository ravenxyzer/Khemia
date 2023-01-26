import { model, Schema } from "mongoose";
import { RegisterInterface } from "../libraries/typings/Interfaces";

/**
 * @description Register Schema for Mongodb
 */
const Name: string = "User-Register";
const RegisterSchema = new Schema<RegisterInterface>({
    userId: { type: String },
    uid: { type: String },
    cookie: { type: String },
});

export = model(Name, RegisterSchema, Name);
