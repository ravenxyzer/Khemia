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
        const guildUser: GuildMember = message.guild.members.cache.get(user.id);

        if (user.displayAvatarURL() !== guildUser.displayAvatarURL()) {
            await message.reply({
                content: await resolveKey(message, "AvatarCommand:WithCustomAvatar", { user: `<@${user.id}>` }),
                files: [user.displayAvatarURL({ size: 4096 }), guildUser.displayAvatarURL({ size: 4096 })],
            });
        }

        await message.reply({
            content: await resolveKey(message, "AvatarCommand:NoCustomAvatar", { user: `<@${user.id}>` }),
            files: [user.displayAvatarURL({ size: 4096 })],
        });
    }

    public override async chatInputRun(interaction: Command.ChatInputCommandInteraction): Promise<void> {
        const user: User = interaction.options.getUser("user") || interaction.user;
        const guildUser: GuildMember = interaction.guild.members.cache.get(user.id);

        if (user.displayAvatarURL() !== guildUser.displayAvatarURL()) {
            await interaction.reply({
                content: await resolveKey(interaction, "AvatarCommand:WithCustomAvatar", { user }),
                files: [user.displayAvatarURL({ size: 4096 }), guildUser.displayAvatarURL({ size: 4096 })],
                allowedMentions: {
                    parse: ["users"],
                },
            });
        }

        await interaction.reply({
            content: await resolveKey(interaction, "AvatarCommand:NoCustomAvatar", { user }),
            files: [user.displayAvatarURL({ size: 4096 })],
            allowedMentions: {
                parse: ["users"],
            },
        });
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
