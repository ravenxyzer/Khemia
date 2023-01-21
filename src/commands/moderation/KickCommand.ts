import { Args, Command } from "@sapphire/framework";
import { ApplyOptions } from "@sapphire/decorators";
import { resolveKey } from "@sapphire/plugin-i18next";
import { GuildMember, Message, User } from "discord.js";

@ApplyOptions<Command.Options>({
    name: "kick",
    description: "Kicks someone else",
    requiredClientPermissions: ["KickMembers", "SendMessages"],
    requiredUserPermissions: ["KickMembers", "SendMessages"],
    runIn: ["GUILD_ANY"],
})
export class KickCommand extends Command {
    public override async messageRun(message: Message, args: Args): Promise<void> {}

    public override async chatInputRun(interaction: Command.ChatInputCommandInteraction): Promise<void> {}

    private async kick(interaction: Message | Command.ChatInputCommandInteraction, target: GuildMember): Promise<void> {
        try {
            target.kick();
        } catch {
            interaction.reply({
                content: await resolveKey(interaction, "KickCommand:Failed"),
            });
        }
    }
}
