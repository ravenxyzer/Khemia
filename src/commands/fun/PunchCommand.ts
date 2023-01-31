import { Args } from "@sapphire/framework";
import { ApplyOptions } from "@sapphire/decorators";
import { resolveKey } from "@sapphire/plugin-i18next";
import { Message, User } from "discord.js";

import { ICommand } from "../../structures";
import { Gifs } from "../../libraries";

@ApplyOptions<ICommand.Options>({
    name: "punch",
    description: "Punches someone else.",
    extendedDescription: {
        usage: "punch <user>",
    },
    requiredClientPermissions: ["SendMessages"],
    requiredUserPermissions: ["SendMessages"],
    runIn: ["GUILD_ANY"],
})
export class PunchCommand extends ICommand {
    public override async messageRun(message: Message, args: Args): Promise<void> {
        const author: User = message.author;
        const target = await args.pick("user");

        await this.punch(message, author, target);
    }

    public override async chatInputRun(ctx: ICommand.ChatInputCommandInteraction): Promise<void> {
        const author: User = ctx.user;
        const target: User = ctx.options.getUser("user");

        await this.punch(ctx, author, target);
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
                    .addUserOption((option) =>
                        option.setName("user").setDescription("Provide a user.").setRequired(true)
                    ),
            { idHints: ["1065548771771043850"] }
        );
    }
}
