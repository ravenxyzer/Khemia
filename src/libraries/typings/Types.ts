import { Model, Schema, DefaultSchemaOptions } from "mongoose";
import { languageDatabaseType } from "..";

export type languageModelType = Model<
    languageDatabaseType,
    {},
    {},
    {},
    Schema<
        languageDatabaseType,
        Model<languageDatabaseType, any, any, any, any>,
        {},
        {},
        {},
        {},
        DefaultSchemaOptions,
        languageDatabaseType
    >
>;
