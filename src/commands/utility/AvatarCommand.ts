import { Args, Command } from "@sapphire/framework";
import { ApplyOptions } from "@sapphire/decorators";
import { resolveKey } from "@sapphire/plugin-i18next";
import { Message, User, GuildMember } from "discord.js";
/**
 * @description Avatar Command: Displays the user avatar.
 */
@ApplyOptions<Command.Options>({
    name: "avatar",
    description: "Displays the user avatar.",
    requiredClientPermissions: ["SendMessages"],
})
export class AvatarCommand extends Command {
    public override async messageRun(message: Message, args: Args): Promise<void> {
        const user: User = args.finished ? message.author : await args.pick("user");
        this.showAvatar(message, user);
    }

    public override async chatInputRun(interaction: Command.ChatInputCommandInteraction): Promise<void> {
        const user: User = interaction.options.getUser("user") || interaction.user;
        this.showAvatar(interaction, user);
    }

    private async showAvatar(ctx: Message | Command.ChatInputCommandInteraction, user: User): Promise<void> {
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

    public registerApplicationCommands(registry: Command.Registry): void {
        registry.registerChatInputCommand(
            (builder) =>
                builder
                    .setName(this.name)
                    .setDescription(this.description)
                    .addUserOption((option) => option.setName("user").setDescription("Provide a user!")),
            { idHints: ["1065203077856112660"] }
        );
    }
}
