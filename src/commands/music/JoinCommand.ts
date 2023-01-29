import { ApplyOptions } from "@sapphire/decorators";
import { resolveKey } from "@sapphire/plugin-i18next";
import { Message, VoiceBasedChannel } from "discord.js";
import { ICommand } from "../../structures";

/**
 * @description Join Command: Joins to voice channel
 */
@ApplyOptions<ICommand.Options>({
    name: "join",
    description: "Joins to voice channel.",
    extendedDescription: {
        usage: "..join",
    },
    requiredClientPermissions: ["SendMessages", "Speak", "Connect"],
    requiredUserPermissions: ["SendMessages", "Connect"],
    runIn: ["GUILD_ANY"],
    preconditions: ["InVoiceOnly"],
})
export class JoinCommand extends ICommand {
    public override async messageRun(message: Message): Promise<void> {
        const channel: VoiceBasedChannel = message.member.voice.channel;
        this.joinVoice(message, channel);
    }

    public override async chatInputRun(interaction: ICommand.ChatInputCommandInteraction): Promise<void> {
        const channel: VoiceBasedChannel = interaction.guild.members.cache.get(interaction.user.id).voice.channel;
        this.joinVoice(interaction, channel);
    }

    private async joinVoice(
        ctx: Message | ICommand.ChatInputCommandInteraction,
        channel: VoiceBasedChannel
    ): Promise<void> {
        if (!channel) return;
        this.container.distube.voices.join(channel);
        await ctx.reply({
            embeds: [this.utils.embed().setDescription(await resolveKey(ctx, "CommandResponses:join:success"))],
        });
    }
}
