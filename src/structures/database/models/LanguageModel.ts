import { model, Schema } from "mongoose";

import { LanguageModelTypes } from "../../../libraries";

export const languageModel = model(
    "language",
    new Schema<LanguageModelTypes>({
        userId: { type: String },
        language: { type: String },
    })
);
