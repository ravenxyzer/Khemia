"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
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
const plugin_subcommands_1 = require("@sapphire/plugin-subcommands");
const decorators_1 = require("@sapphire/decorators");
const discord_js_1 = require("discord.js");
const plugin_i18next_1 = require("@sapphire/plugin-i18next");
const libraries_1 = require("../../libraries");
const LanguageSchema_1 = __importDefault(require("../../schemas/LanguageSchema"));
require("dotenv/config");
/**
 * @description Language Command: Per user bot language configuration
 */
let LanguageCommand = class LanguageCommand extends plugin_subcommands_1.Subcommand {
    messageRun(message) {
        return __awaiter(this, void 0, void 0, function* () {
            yield message.reply({ content: yield (0, plugin_i18next_1.resolveKey)(message, "LanguageCommand:handler") });
        });
    }
    showList(interaction) {
        return __awaiter(this, void 0, void 0, function* () {
            yield interaction.reply({
                embeds: [
                    new discord_js_1.MessageEmbed()
                        .setAuthor({
                        name: `${this.container.client.user.username}'s Language List`,
                        iconURL: this.container.client.user.displayAvatarURL({ size: 512, dynamic: true }),
                    })
                        .setDescription(yield (0, plugin_i18next_1.resolveKey)(interaction, "LanguageCommand:list"))
                        .setColor(libraries_1.Colors.default),
                ],
            });
        });
    }
    updateLanguage(interaction) {
        return __awaiter(this, void 0, void 0, function* () {
            const language = interaction.options.getString("language");
            const languageCheck = yield LanguageSchema_1.default.findOne({
                userId: interaction.user.id,
            });
            if (!languageCheck) {
                if (language == process.env.DEFAULT_LANGUAGE) {
                    yield interaction.reply({ content: yield (0, plugin_i18next_1.resolveKey)(interaction, "LanguageCommand:error") });
                }
                else {
                    yield new LanguageSchema_1.default({
                        userId: interaction.user.id,
                        language,
                    }).save();
                    yield interaction.reply({
                        content: yield (0, plugin_i18next_1.resolveKey)(interaction, "LanguageCommand:update", { language }),
                    });
                }
            }
            else {
                if (languageCheck.language == language) {
                    yield interaction.reply({ content: yield (0, plugin_i18next_1.resolveKey)(interaction, "LanguageCommand:error") });
                }
                else {
                    languageCheck.language = language;
                    languageCheck.save();
                    yield interaction.reply({
                        content: yield (0, plugin_i18next_1.resolveKey)(interaction, "LanguageCommand:update", { language }),
                    });
                }
            }
        });
    }
    resetLanguage(interaction) {
        return __awaiter(this, void 0, void 0, function* () {
            const languageCheck = yield LanguageSchema_1.default.findOne({
                userId: interaction.user.id,
            });
            if (!languageCheck) {
                yield interaction.reply({ content: yield (0, plugin_i18next_1.resolveKey)(interaction, "LanguageCommand:isDefault") });
            }
            else {
                yield interaction.reply({ content: yield (0, plugin_i18next_1.resolveKey)(interaction, "LanguageCommand:reset") });
                yield LanguageSchema_1.default.findOneAndDelete({
                    userId: interaction.user.id,
                });
            }
        });
    }
    registerApplicationCommands(registry) {
        registry.registerChatInputCommand((builder) => builder
            .setName(this.name)
            .setDescription(this.description)
            .addSubcommand((subcommand) => subcommand.setName("list").setDescription("Displays available languages for this bot."))
            .addSubcommand((subcommand) => subcommand
            .setName("update")
            .setDescription("Updates the language to the provided one.")
            .addStringOption((option) => option
            .setName("language")
            .setDescription("Provide your language.")
            .setRequired(true)
            .addChoices({ name: "English US (en-US)", value: "en-US" }, { name: "Indonesia (id-ID)", value: "id-ID" })))
            .addSubcommand((subcommand) => subcommand.setName("reset").setDescription("Resets the language to the default one.")), { idHints: ["1056492429857009724"] });
    }
};
LanguageCommand = __decorate([
    (0, decorators_1.ApplyOptions)({
        name: "language",
        description: "Language configuration for this bot.",
        subcommands: [
            { name: "list", chatInputRun: "showList" },
            { name: "update", chatInputRun: "updateLanguage" },
            { name: "reset", chatInputRun: "resetLanguage" },
        ],
    })
], LanguageCommand);
exports.default = LanguageCommand;
