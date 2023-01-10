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
Object.defineProperty(exports, "__esModule", { value: true });
const framework_1 = require("@sapphire/framework");
const decorators_1 = require("@sapphire/decorators");
const plugin_i18next_1 = require("@sapphire/plugin-i18next");
const discord_js_1 = require("discord.js");
const libraries_1 = require("../../libraries");
/**
 * @description About Command: Information about Khemia
 */
let AboutCommand = class AboutCommand extends framework_1.Command {
    messageRun(message) {
        return __awaiter(this, void 0, void 0, function* () {
            yield message.reply({ embeds: [yield this._showResponse(message)] });
        });
    }
    chatInputRun(interaction) {
        return __awaiter(this, void 0, void 0, function* () {
            yield interaction.reply({ embeds: [yield this._showResponse(interaction)] });
        });
    }
    _showResponse(interaction) {
        return __awaiter(this, void 0, void 0, function* () {
            return new discord_js_1.MessageEmbed()
                .setAuthor({
                name: this.container.client.user.username,
                iconURL: this.container.client.user.displayAvatarURL({ dynamic: true, size: 512 }),
            })
                .setDescription(yield (0, plugin_i18next_1.resolveKey)(interaction, "AboutCommand:success", {
                client: this.container.client.user.username,
                owner: (yield interaction.client.users.fetch(libraries_1.Developers[0])).tag,
                guild: (yield interaction.client.guilds.fetch("761550024131215430")).name,
            }))
                .addFields([
                {
                    name: "Genshin Impact ID",
                    value: `[${yield (0, plugin_i18next_1.resolveKey)(interaction, "AboutCommand:join")}](https://discord.gg/sPcbcaKyz7)`,
                },
                {
                    name: "Khemia",
                    value: `[${yield (0, plugin_i18next_1.resolveKey)(interaction, "AboutCommand:invite")}](${libraries_1.InviteLink})`,
                    inline: true,
                },
                {
                    name: "Guilds",
                    value: this.container.client.guilds.cache.size.toLocaleString("en-US"),
                },
                {
                    name: "Users",
                    value: this.container.client.users.cache.size.toLocaleString("en-US"),
                    inline: true,
                },
            ])
                .setImage(libraries_1.Utils.randomArray([
                "https://cdn.discordapp.com/attachments/1055879106090238073/1055882394353279066/bg1.jpg",
                "https://cdn.discordapp.com/attachments/1055879106090238073/1055882503946244196/bg2.jpg",
            ]))
                .setColor(libraries_1.Colors.default);
        });
    }
};
AboutCommand = __decorate([
    (0, decorators_1.ApplyOptions)({
        name: "about",
        description: "Displays an information about this bot.",
        requiredClientPermissions: ["SEND_MESSAGES"],
        runIn: "GUILD_ANY" /* CommandOptionsRunTypeEnum.GuildAny */,
    })
], AboutCommand);
exports.default = AboutCommand;
