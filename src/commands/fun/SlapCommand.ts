import { Args } from "@sapphire/framework";
import { ApplyOptions } from "@sapphire/decorators";
import { resolveKey } from "@sapphire/plugin-i18next";
import { Message, User, EmbedBuilder } from "discord.js";

import { ICommand } from "../../structures";
import { Colors, Gifs } from "../../libraries";

@ApplyOptions<ICommand.Options>({
    name: "slap",
    description: "Slaps someone else.",
    extendedDescription: {
        usage: "slap <user>",
    },
    requiredClientPermissions: ["SendMessages"],
    requiredUserPermissions: ["SendMessages"],
    runIn: ["GUILD_ANY"],
})
export class PunchCommand extends ICommand {
    public override async messageRun(message: Message, args: Args): Promise<void> {
        const author: User = message.author;
        const target: User = await args.pick("user");

        await this.slap(message, author, target);
    }

    public override async chatInputRun(interaction: ICommand.ChatInputCommandInteraction): Promise<void> {
        const author: User = interaction.user;
        const target: User = interaction.options.getUser("user");

        await this.slap(interaction, author, target);
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
                    .addUserOption((option) =>
                        option.setName("user").setDescription("Provide a user.").setRequired(true)
                    ),
            { idHints: ["1065548773390041108"] }
        );
    }
}
