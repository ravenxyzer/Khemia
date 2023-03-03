import { Args } from "@sapphire/framework";
import { ApplyOptions } from "@sapphire/decorators";
import { resolveKey } from "@sapphire/plugin-i18next";
import { Message, User } from "discord.js";

import { ICommand } from "../../structures";
import { Gifs, Developers } from "../../libraries";

@ApplyOptions<ICommand.Options>({
    name: "punch",
    description: "Punch someone else.",
    extendedDescription: {
        usage: "punch <user>",
    },
    requiredClientPermissions: ["SendMessages"],
    requiredUserPermissions: ["SendMessages"],
    runIn: ["GUILD_ANY"],
    cooldownFilteredUsers: [Developers[0]],
})
export class PunchCommand extends ICommand {
    public override async messageRun(message: Message, args: Args): Promise<void> {
        await this.punch(message, message.author, await args.pick("user"));
    }

    public override async chatInputRun(interaction: ICommand.ChatInputCommandInteraction): Promise<void> {
        await this.punch(interaction, interaction.user, interaction.options.getUser("user"));
    }

    private async punch(
        ctx: Message | ICommand.ChatInputCommandInteraction,
        author: User,
        target: User
    ): Promise<void> {
        const { utils } = this.container;
        if (target.id !== author.id) {
            await ctx.reply({
                content: await resolveKey(ctx, "CommandResponses:punch:success", {
                    author: author.username,
                    target: utils.toMention(target.id),
                }),
                embeds: [this.utils.embed().setImage(utils.randomArray(Gifs.punches))],
                allowedMentions: {
                    parse: [],
                },
            });
        } else {
            await ctx.reply({
                content: await resolveKey(ctx, "CommandResponses:punch:error"),
            });
        }
    }

    public registerApplicationCommands(registry: ICommand.Registry): void {
        registry.registerChatInputCommand(
            (builder) =>
                builder
                    .setName(this.name)
                    .setDescription(this.description)
                    .setDescriptionLocalizations({ id: "Pukul orang lain." })
                    .addUserOption((option) =>
                        option
                            .setName("user")
                            .setDescription("Specify a user!")
                            .setDescriptionLocalizations({ id: "Tentukan user!" })
                            .setRequired(true)
                    ),
            { idHints: ["1065548771771043850"] }
        );
    }
}
