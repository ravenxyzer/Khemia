import { Args, Command } from "@sapphire/framework";
import { ApplyOptions } from "@sapphire/decorators";
import { resolveKey } from "@sapphire/plugin-i18next";
import { Message, User, MessageEmbed } from "discord.js";

import { Colors, Gifs, Utils } from "../../libraries";

/**
 * @description Punch Command: Punches someone else.
 */
@ApplyOptions<Command.Options>({
    name: "punch",
    description: "Punches someone else.",
    requiredClientPermissions: ["SEND_MESSAGES"],
})
export class PunchCommand extends Command {
    public override async messageRun(message: Message, args: Args): Promise<void> {
        const author: User = message.author;
        const target: User = (await args.pick("user")) ?? undefined;

        if (!target) {
            message.reply({ content: await resolveKey(message, "PunchCommand:NoTarget") });
        }

        await this.punch(message, author, target);
    }

    public override async chatInputRun(interaction: Command.ChatInputInteraction): Promise<void> {
        const author: User = interaction.user;
        const target: User = interaction.options.getUser("user");

        await this.punch(interaction, author, target);
    }

    private async punch(
        interaction: Message | Command.ChatInputInteraction,
        author: User,
        target: User
    ): Promise<void> {
        await interaction.reply({
            content: await resolveKey(interaction, "PunchCommand:PunchSuccess", {
                author: author.username,
                target: this.toMention(target.id),
            }),
            embeds: [new MessageEmbed().setImage(Utils.randomArray(Gifs.punches)).setColor(Colors.default)],
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
            { idHints: ["1065548771771043850"] }
        );
    }
}
