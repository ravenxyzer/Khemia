import { Args } from "@sapphire/framework";
import { ApplyOptions } from "@sapphire/decorators";
import { resolveKey } from "@sapphire/plugin-i18next";
import { Message, User, EmbedBuilder } from "discord.js";

import { ICommand, ICommandOptions } from "../../structures";
import { Colors, Gifs } from "../../libraries";

/**
 * @description Punch Command: Punches someone else.
 */
@ApplyOptions<ICommandOptions>({
    name: "punch",
    description: "Punches someone else.",
    extendedDescription: {
        usage: "",
    },
    requiredClientPermissions: ["SendMessages"],
    runIn: ["GUILD_ANY"],
})
export class PunchCommand extends ICommand {
    public override async messageRun(message: Message, args: Args): Promise<void> {
        const author: User = message.author;
        const target = await args.pick("user");

        await this.punch(message, author, target);
    }

    public override async chatInputRun(interaction: ICommand.ChatInputCommandInteraction): Promise<void> {
        const author: User = interaction.user;
        const target: User = interaction.options.getUser("user");

        await this.punch(interaction, author, target);
    }

    private async punch(
        interaction: Message | ICommand.ChatInputCommandInteraction,
        author: User,
        target: User
    ): Promise<void> {
        const { utils } = this.container;
        await interaction.reply({
            content: await resolveKey(interaction, "CommandResponse:punch:success", {
                author: author.username,
                target: this.toMention(target.id),
            }),
            embeds: [new EmbedBuilder().setImage(utils.randomArray(Gifs.punches)).setColor(Colors.default)],
            allowedMentions: {
                parse: [],
            },
        });
    }

    private toMention(id: string) {
        return `<@${id}>`;
    }

    public registerApplicationCommands(registry: ICommand.Registry): void {
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
