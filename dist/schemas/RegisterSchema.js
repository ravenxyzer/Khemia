"use strict";
const mongoose_1 = require("mongoose");
/**
 * @description Register Schema for Mongodb
 */
const Name = "User-Register";
const RegisterSchema = new mongoose_1.Schema({
    userId: { type: String },
    uid: { type: String },
    cookie: { type: String },
});
module.exports = (0, mongoose_1.model)(Name, RegisterSchema, Name);
