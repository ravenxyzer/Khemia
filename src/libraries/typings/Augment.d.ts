import { Subcommand } from "@sapphire/plugin-subcommands";
import { PrismaClient } from "@prisma/client";
import { DisTube } from "distube";

import { Utils, MusicConfig } from "..";
import * as Preconditions from "../../preconditions";

declare module "@sapphire/framework" {
    interface Preconditions {
        DevsOnly: never;
        OwnerOnly: never;
        InVoiceOnly: never;
    }

    const enum Identifiers {
        PreconditionDevsOnly = "preconditionDeveloperOnly",
        PreconditionOwnerOnly = "preconditionOwnerOnly",
        PreconditionInVoiceOnly = "preconditionInVoiceOnly",
    }
}

declare module "discord.js" {
    interface Client {
        readonly defaultPrefix: string;
        readonly defaultLanguage: string;

        fetchPrefix(ctx: Message | CommandInteraction): Promise<string>;
        fetchLanguage(message: InternationalizationContext | CommandInteraction): Promise<string>;
        generateInviteLink(): string;
    }
}

declare module "@sapphire/pieces" {
    interface Container {
        utils: Utils;
        database: PrismaClient;
        distube: DisTube;
    }
}
