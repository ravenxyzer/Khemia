import { SapphireClient } from "@sapphire/framework";
import { InternationalizationContext } from "@sapphire/plugin-i18next";
import { IClient } from "./Config";
import "@sapphire/plugin-i18next/register";
import "dotenv/config";

import language from "./schemas/LanguageSchema";
import discordModals from "discord-modals";
import mongoose from "mongoose";
mongoose.set("strictQuery", false);

/**
 * @description Khemia client
 */
const client = new SapphireClient({
    ...IClient,
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
});

discordModals(client);

client.login(process.env.TOKEN);
