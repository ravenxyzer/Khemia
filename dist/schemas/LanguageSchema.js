"use strict";
const mongoose_1 = require("mongoose");
/**
 * @description Language Schema for Mongodb
 */
const Name = "User-Language";
const LanguageSchema = new mongoose_1.Schema({
    userId: { type: String },
    language: { type: String },
});
module.exports = (0, mongoose_1.model)(Name, LanguageSchema, Name);
