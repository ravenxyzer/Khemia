import { Args } from "@sapphire/framework";
import { ApplyOptions } from "@sapphire/decorators";
import { resolveKey } from "@sapphire/plugin-i18next";
import { Message, User, GuildMember } from "discord.js";

import { ICommand } from "../../structures";
import { Developers } from "../../libraries";

@ApplyOptions<ICommand.Options>({
    name: "avatar",
    aliases: ["av"],
    description: "Displays the user avatar.",
    extendedDescription: {
        usage: "avatar <user>",
    },
    requiredClientPermissions: ["SendMessages"],
    requiredUserPermissions: ["SendMessages"],
    runIn: ["GUILD_ANY"],
    cooldownFilteredUsers: [Developers[0]],
})
export class AvatarCommand extends ICommand {
    public override async messageRun(message: Message, args: Args): Promise<void> {
        const user: User = args.finished ? message.author : await args.pick("user");
        this.showAvatar(message, user);
    }

    public override async chatInputRun(interaction: ICommand.ChatInputCommandInteraction): Promise<void> {
        const user: User = interaction.options.getUser("user") || interaction.user;
        this.showAvatar(interaction, user);
    }

    private async showAvatar(ctx: Message | ICommand.ChatInputCommandInteraction, user: User): Promise<void> {
        const userInGuild: GuildMember = ctx.guild.members.cache.get(user.id);

        if (user.displayAvatarURL() !== userInGuild.displayAvatarURL()) {
            await ctx.reply({
                content: await resolveKey(ctx, "CommandResponses:avatar:success", { user: this.toMention(user.id) }),
                files: [user.displayAvatarURL({ size: 4096 }), userInGuild.displayAvatarURL({ size: 4096 })],
                allowedMentions: {
                    parse: ["users"],
                },
            });
        } else {
            await ctx.reply({
                content: await resolveKey(ctx, "CommandResponses:avatar:success", { user: this.toMention(user.id) }),
                files: [user.displayAvatarURL({ size: 4096 })],
                allowedMentions: {
                    parse: ["users"],
                },
            });
        }
    }

    private toMention(id: string): string {
        return `<@${id}>`;
    }

    public registerApplicationCommands(registry: ICommand.Registry): void {
        registry.registerChatInputCommand(
            (builder) =>
                builder
                    .setName(this.name)
                    .setDescription(this.description)
                    .setDescriptionLocalizations({ id: "Menampilkan avatar user." })
                    .addUserOption((option) =>
                        option
                            .setName("user")
                            .setDescription("Specify a user!")
                            .setDescriptionLocalizations({ id: "Tentukan user!" })
                            .setRequired(false)
                    ),
            { idHints: ["1065203077856112660"] }
        );
    }
}
