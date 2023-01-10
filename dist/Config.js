"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IClient = void 0;
const time_utilities_1 = require("@sapphire/time-utilities");
require("@sapphire/plugin-i18next/register");
/**
 * @description Khemia client configuration.
 */
exports.IClient = {
    allowedMentions: {
        parse: ["users", "roles"],
    },
    caseInsensitiveCommands: true,
    caseInsensitivePrefixes: true,
    defaultPrefix: "..",
    defaultCooldown: {
        delay: time_utilities_1.Time.Second * 3,
    },
    enableLoaderTraceLoggings: false,
    intents: [
        "DIRECT_MESSAGES",
        "DIRECT_MESSAGE_REACTIONS",
        "DIRECT_MESSAGE_TYPING",
        "GUILDS",
        "GUILD_BANS",
        "GUILD_EMOJIS_AND_STICKERS",
        "GUILD_INTEGRATIONS",
        "GUILD_INVITES",
        "GUILD_MEMBERS",
        "GUILD_MESSAGES",
        "GUILD_MESSAGE_REACTIONS",
        "GUILD_MESSAGE_TYPING",
        "GUILD_PRESENCES",
        "GUILD_SCHEDULED_EVENTS",
        "GUILD_VOICE_STATES",
        "GUILD_WEBHOOKS",
    ],
    loadDefaultErrorListeners: false,
    loadMessageCommandListeners: true,
    logger: {
        level: 20 /* LogLevel.Debug */,
    },
    partials: ["CHANNEL", "GUILD_MEMBER", "MESSAGE", "REACTION", "USER"],
    typing: true,
    ws: {
        properties: {
            browser: "Discord iOS",
        },
    },
};
