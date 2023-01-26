import { Command } from "@sapphire/framework";
import type { Message } from "discord.js";

/**
 * @description Language Schema interface
 */
export interface LanguageInterface {
    guildId?: string;
    userId?: string;
    language?: string;
}

/**
 * @description Register Schema interface
 */
export interface RegisterInterface {
    userId?: string;
    uid?: string;
    cookie?: string;
}

/**
 * @description Set Response function interface
 */
type ContextType = "command" | "listener";
export interface ResponseInterface {
    name: string;
    context: ContextType;
    key: string;
    interactionType: Message | Command.ChatInputCommandInteraction;
}
