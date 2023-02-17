import { ApplyOptions } from "@sapphire/decorators";
import { resolveKey } from "@sapphire/plugin-i18next";
import { Message, VoiceBasedChannel } from "discord.js";

import { ICommand } from "../../structures";

@ApplyOptions<ICommand.Options>({
    name: "join",
    description: "Join to voice channel.",
    extendedDescription: {
        usage: "join",
    },
    requiredClientPermissions: ["SendMessages", "Speak", "Connect"],
    requiredUserPermissions: ["SendMessages"],
    runIn: ["GUILD_ANY"],
    preconditions: ["InVoiceOnly", "OwnerOnly"],
})
export class JoinCommand extends ICommand {
    public override async messageRun(message: Message): Promise<void> {
        const channel: VoiceBasedChannel = message.member.voice.channel;
        void this.joinVoice(message, channel);
    }

    public override async chatInputRun(interaction: ICommand.ChatInputCommandInteraction): Promise<void> {
        const channel = interaction.guild.members.cache.get(interaction.user.id).voice.channel;
        void this.joinVoice(interaction, channel);
    }

    public override async registerApplicationCommands(registry: ICommand.Registry): Promise<void> {
        registry.registerChatInputCommand((builder) => builder.setName(this.name).setDescription(this.description), {
            idHints: ["1069521446793117766"],
        });
    }

    private async joinVoice(
        ctx: Message | ICommand.ChatInputCommandInteraction,
        channel: VoiceBasedChannel
    ): Promise<void> {
        void this.container.distube.voices.join(channel);

        await ctx.reply({
            embeds: [
                this.utils
                    .embed()
                    .isSuccessEmbed(true)
                    .setDescription(await resolveKey(ctx, "CommandResponses:join:success")),
            ],
        });
    }
}
