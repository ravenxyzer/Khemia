import { ApplyOptions } from "@sapphire/decorators";
import { Args } from "@sapphire/framework";
import { GuildMember, GuildTextBasedChannel, Message, VoiceBasedChannel } from "discord.js";

import { ICommand } from "../../structures";

@ApplyOptions<ICommand.Options>({
    name: "play",
    aliases: ["p"],
    description: "Plays your favorite music.",
    extendedDescription: {
        usage: "play <song>",
    },
    requiredClientPermissions: ["SendMessages", "Speak", "Connect"],
    requiredUserPermissions: ["SendMessages"],
    runIn: ["GUILD_ANY"],
    preconditions: ["InVoiceOnly"],
})
export class PlayCommand extends ICommand {
    public override async messageRun(message: Message, args: Args): Promise<void> {
        const song: string = await args.rest("string");

        void this.play(message, song, message.member);
    }

    public override async chatInputRun(interaction: ICommand.ChatInputCommandInteraction): Promise<void> {
        const song: string = interaction.options.getString("song");
        const member: GuildMember = interaction.guild.members.cache.get(interaction.user.id);

        void this.play(interaction, song, member);
        await interaction.reply({ content: "✅・Successfully added the song!", ephemeral: true });
    }

    public override async registerApplicationCommands(registry: ICommand.Registry): Promise<void> {
        registry.registerChatInputCommand(
            (builder) =>
                builder
                    .setName(this.name)
                    .setDescription(this.description)
                    .addStringOption((option) =>
                        option.setName("song").setDescription("Provide your song.").setRequired(true)
                    ),
            { idHints: ["1069531943470895155"] }
        );
    }

    private async play(
        ctx: Message | ICommand.ChatInputCommandInteraction,
        song: string,
        member: GuildMember
    ): Promise<void> {
        const textChannel = ctx.channel as GuildTextBasedChannel;
        void this.container.distube.setContext(ctx);
        void this.container.distube.play(member.voice.channel, song, { member, textChannel });
    }
}
