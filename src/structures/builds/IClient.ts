import "@sapphire/plugin-i18next/register";
import { container, LogLevel, SapphireClient } from "@sapphire/framework";
import { Time } from "@sapphire/time-utilities";
import { Partials } from "discord.js";
import { InternationalizationContext } from "@sapphire/plugin-i18next";

import { Utils, InviteLink } from "../../libraries";
import language from "../../schemas/LanguageSchema";

/**
 * @description Custom client configurations
 */
export class IClient extends SapphireClient {
    readonly defaultPrefix: string = process.env.DEFAULT_PREFIX || "imp!";
    readonly defaultLanguage: string = process.env.DEFAULT_LANGUAGE || "en-US";
    utils: Utils = new Utils();

    public constructor() {
        super({
            allowedMentions: {
                parse: ["roles", "users"],
            },
            caseInsensitiveCommands: true,
            caseInsensitivePrefixes: true,
            defaultPrefix: process.env.DEFAULT_PREFIX ?? "..",
            defaultCooldown: {
                delay: Time.Second * 3,
            },
            enableLoaderTraceLoggings: false,
            i18n: {
                fetchLanguage: async (context: InternationalizationContext) => {
                    const languageCheck = await language.findOne({
                        userId: context.user.id,
                    });

                    if (!languageCheck) {
                        return process.env.DEFAULT_LANGUAGE ?? "en-US";
                    }

                    return languageCheck.language;
                },
            },
            intents: [
                "AutoModerationConfiguration",
                "AutoModerationExecution",
                "DirectMessageReactions",
                "DirectMessageTyping",
                "DirectMessages",
                "GuildBans",
                "GuildEmojisAndStickers",
                "GuildIntegrations",
                "GuildInvites",
                "GuildMembers",
                "GuildMessageReactions",
                "GuildMessageTyping",
                "GuildMessages",
                "GuildPresences",
                "GuildScheduledEvents",
                "GuildVoiceStates",
                "GuildWebhooks",
                "Guilds",
                "MessageContent",
            ],
            loadDefaultErrorListeners: false,
            loadMessageCommandListeners: true,
            logger: {
                level: LogLevel.Debug,
            },
            partials: [Partials.Channel, Partials.GuildMember, Partials.Message, Partials.Reaction],
            typing: true,
            ws: {
                properties: {
                    browser: "Discord iOS",
                },
            },
        });

        container.utils = this.utils;
    }

    public login(token: string): Promise<string> {
        return super.login(token);
    }

    public destroy(): void {
        return super.destroy();
    }

    generateInviteLink = (): string => {
        return InviteLink;
    };
}
