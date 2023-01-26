import { Subcommand } from "@sapphire/plugin-subcommands";
import { IDisTube } from "../Config";
import { Utils, MusicConfig } from "..";
import * as Preconditions from "../../preconditions";

declare module "@sapphire/framework" {
    interface Preconditions {
        DevsOnly: never;
        OwnerOnly: never;
    }

    const enum Identifiers {
        DevsOnly = "preconditionDeveloperOnly",
        OwnerOnly = "preconditionOwnerOnly",
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
        database: Database;
    }
}
