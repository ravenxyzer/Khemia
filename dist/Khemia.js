"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const framework_1 = require("@sapphire/framework");
const Config_1 = require("./Config");
require("@sapphire/plugin-i18next/register");
require("dotenv/config");
const LanguageSchema_1 = __importDefault(require("./schemas/LanguageSchema"));
const discord_modals_1 = __importDefault(require("discord-modals"));
const mongoose_1 = __importDefault(require("mongoose"));
mongoose_1.default.set("strictQuery", false);
/**
 * @description Khemia client
 */
const client = new framework_1.SapphireClient(Object.assign(Object.assign({}, Config_1.IClient), { i18n: {
        fetchLanguage: (context) => __awaiter(void 0, void 0, void 0, function* () {
            var _a;
            const languageCheck = yield LanguageSchema_1.default.findOne({
                userId: context.user.id,
            });
            if (!languageCheck) {
                return (_a = process.env.DEFAULT_LANGUAGE) !== null && _a !== void 0 ? _a : "en-US";
            }
            return languageCheck.language;
        }),
    } }));
(0, discord_modals_1.default)(client);
client.login(process.env.TOKEN);
