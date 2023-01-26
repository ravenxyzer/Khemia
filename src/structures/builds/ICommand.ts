import { Subcommand, SubcommandOptions } from "@sapphire/plugin-subcommands";
import { MessageUtils } from "../../libraries";

export interface ICommandExtendedDescription {
    usage: string;
    examples?: string[];
}

export interface ICommandOptions extends SubcommandOptions {
    description: string;
    extendedDescription?: ICommandExtendedDescription;
}

export abstract class ICommand extends Subcommand {
    extendedDescription: ICommandExtendedDescription;
    utils: MessageUtils;

    constructor(context: Subcommand.Context, options: ICommandOptions) {
        super(context, { ...options });

        this.extendedDescription = options.extendedDescription;
        this.utils = new MessageUtils();
    }
}

export declare namespace ICommand {
    type Options = ICommandOptions;
    type JSON = Subcommand.JSON;
    type Context = Subcommand.Context;
    type RunInTypes = Subcommand.RunInTypes;
    type ChatInputCommandInteraction = Subcommand.ChatInputCommandInteraction;
    type ContextMenuCommandInteraction = Subcommand.ContextMenuCommandInteraction;
    type AutocompleteInteraction = Subcommand.AutocompleteInteraction;
    type Registry = Subcommand.Registry;
}
