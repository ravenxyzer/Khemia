import { model, Schema } from "mongoose";
import { LanguageInterface } from "../libraries";

/**
 * @description Language Schema for Mongodb
 */
const Name: string = "User-Language";
const LanguageSchema = new Schema<LanguageInterface>({
    userId: { type: String },
    language: { type: String },
});

export = model(Name, LanguageSchema, Name);
