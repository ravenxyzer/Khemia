import { model, Schema } from "mongoose";
import { languageDatabaseInterface } from "../../libraries";

const languageModel = model(
    "language",
    new Schema<languageDatabaseInterface>({
        userId: { type: String },
        language: { type: String },
    })
);

export class IDatabase {
    language: typeof languageModel;
    public constructor() {
        this.language = languageModel;
    }
}
