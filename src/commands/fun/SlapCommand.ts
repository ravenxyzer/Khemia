import { Args, Command } from "@sapphire/framework";
import { ApplyOptions } from "@sapphire/decorators";
import { resolveKey } from "@sapphire/plugin-i18next";
import { Message, User, MessageEmbed } from "discord.js";

import { Colors, Gifs, Utils } from "../../libraries";

/**
 * @description Slap Command: Slaps someone else.
 */
@ApplyOptions<Command.Options>({
    name: "slap",
    description: "Slaps someone else.",
    requiredClientPermissions: ["SEND_MESSAGES"],
})
export class PunchCommand extends Command {
    public override async messageRun(message: Message, args: Args): Promise<void> {
        const author: User = message.author;
        const target: User = (await args.pick("user")) ?? undefined;

        if (!target) {
            message.reply({ content: await resolveKey(message, "SlapCommand:NoTarget") });
        }

        await this.slap(message, author, target);
    }

    public override async chatInputRun(interaction: Command.ChatInputInteraction): Promise<void> {
        const author: User = interaction.user;
        const target: User = interaction.options.getUser("user");

        await this.slap(interaction, author, target);
    }

    private async slap(interaction: Message | Command.ChatInputInteraction, author: User, target: User): Promise<void> {
        await interaction.reply({
            content: await resolveKey(interaction, "SlapCommand:SlapSuccess", {
                author: author.username,
                target: this.toMention(target.id),
            }),
            embeds: [new MessageEmbed().setImage(Utils.randomArray(Gifs.slaps)).setColor(Colors.default)],
            allowedMentions: {
                parse: [],
            },
        });
    }

    private toMention(id: string) {
        return `<@${id}>`;
    }

    public registerApplicationCommands(registry: Command.Registry): void {
        registry.registerChatInputCommand(
            (builder) =>
                builder
                    .setName(this.name)
                    .setDescription(this.description)
                    .addUserOption((option) =>
                        option.setName("user").setDescription("Provide a user.").setRequired(true)
                    ),
            { idHints: ["1065548773390041108"] }
        );
    }
}
