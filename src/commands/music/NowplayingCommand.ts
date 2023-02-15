import { ApplyOptions } from "@sapphire/decorators";
import { Args } from "@sapphire/framework";
import { resolveKey } from "@sapphire/plugin-i18next";
import { Message } from "discord.js";
import { Queue, Song } from "distube";
import { ICommand } from "../../structures";

@ApplyOptions<ICommand.Options>({
    name: "nowplaying",
    aliases: ["nowplay", "np"],
    description: "Display the song currently playing.",
    extendedDescription: {
        usage: "nowplaying",
    },
    requiredClientPermissions: ["SendMessages"],
    requiredUserPermissions: ["SendMessages"],
    runIn: ["GUILD_ANY"],
})
export class VolumeCommand extends ICommand {
    public async messageRun(message: Message, args: Args): Promise<void> {
        this.nowPlaying(message);
    }

    public async chatInputRun(interaction: ICommand.ChatInputCommandInteraction): Promise<void> {
        this.nowPlaying(interaction);
    }

    private async nowPlaying(ctx: Message | ICommand.ChatInputCommandInteraction): Promise<void> {
        const queue: Queue = this.container.distube.getQueue(ctx);

        if (!queue) {
            await ctx.channel.send(`There is nothing in the queue right now!`);
        }

        const song: Song = queue.songs[0];
        await ctx.channel.send({ content: `Song: ${song.name}` });
    }
}
