import { Args } from "@sapphire/framework";
import { ApplyOptions } from "@sapphire/decorators";
import { resolveKey } from "@sapphire/plugin-i18next";
import { Message, User } from "discord.js";

import { ICommand } from "../../structures";
import { Gifs, Developers } from "../../libraries";

@ApplyOptions<ICommand.Options>({
    name: "slap",
    description: "Slap someone else.",
    extendedDescription: {
        usage: "slap <user>",
    },
    requiredClientPermissions: ["SendMessages"],
    requiredUserPermissions: ["SendMessages"],
    runIn: ["GUILD_ANY"],
    cooldownFilteredUsers: [Developers[0]],
})
export class PunchCommand extends ICommand {
    public override async messageRun(message: Message, args: Args): Promise<void> {
        await this.slap(message, message.author, await args.pick("user"));
    }

    public override async chatInputRun(interaction: ICommand.ChatInputCommandInteraction): Promise<void> {
        await this.slap(interaction, interaction.user, interaction.options.getUser("user"));
    }

    private async slap(ctx: Message | ICommand.ChatInputCommandInteraction, author: User, target: User): Promise<void> {
        const { utils } = this.container;
        if (author.id !== target.id) {
            await ctx.reply({
                content: await resolveKey(ctx, "CommandResponses:slap:success", {
                    author: author.username,
                    target: utils.toMention(target.id),
                }),
                embeds: [this.utils.embed().setImage(utils.randomArray(Gifs.slaps))],
                allowedMentions: {
                    parse: [],
                },
            });
        } else {
            await ctx.reply({
                content: await resolveKey(ctx, "CommandReponses:slap:error"),
            });
        }
    }

    public registerApplicationCommands(registry: ICommand.Registry): void {
        registry.registerChatInputCommand(
            (builder) =>
                builder
                    .setName(this.name)
                    .setDescription(this.description)
                    .setDescriptionLocalizations({ id: "Tampar orang lain." })
                    .addUserOption((option) =>
                        option
                            .setName("user")
                            .setDescription("Specify a user.")
                            .setDescriptionLocalizations({ id: "Tentukan user!" })
                            .setRequired(true)
                    ),
            { idHints: ["1065548773390041108"] }
        );
    }
}
