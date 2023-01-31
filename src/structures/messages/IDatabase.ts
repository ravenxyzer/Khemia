import { model, Schema } from "mongoose";
import { languageDatabaseType, languageModelType } from "../../libraries";

const languageModel = model(
    "language",
    new Schema<languageDatabaseType>({
        userId: { type: String },
        language: { type: String },
    })
);

export class IDatabase {
    language: languageModelType;
    public constructor() {
        this.language = languageModel;
    }
}
