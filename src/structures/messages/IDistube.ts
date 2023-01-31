import { DisTube, Queue, Song, Playlist } from "distube";
import { SpotifyPlugin } from "@distube/spotify";
import { SoundCloudPlugin } from "@distube/soundcloud";
import { YtDlpPlugin } from "@distube/yt-dlp";
import { container } from "@sapphire/framework";
import { GuildTextBasedChannel, Message, CommandInteraction } from "discord.js";

import { Emojis } from "../../libraries";
import { IClient, IEmbedBuilder } from "..";
import { resolveKey } from "@sapphire/plugin-i18next";

export class IDistube extends DisTube {
    context: Message | CommandInteraction;

    public constructor(client: IClient) {
        super(client, {
            leaveOnStop: false,
            emitNewSongOnly: true,
            emitAddSongWhenCreatingQueue: false,
            emitAddListWhenCreatingQueue: false,
            plugins: [new SpotifyPlugin({ emitEventsAfterFetching: true }), new SoundCloudPlugin(), new YtDlpPlugin()],
        });

        super.on("playSong", async (queue: Queue, song: Song<unknown>) =>
            queue.textChannel.send({
                embeds: [
                    new IEmbedBuilder()
                        .setDescription(
                            await resolveKey(this.context, "CommandResponses:play:description", {
                                song: container.utils.trimString(song.name, 55),
                                duration: queue.formattedDuration,
                            })
                        )
                        .setFooter({
                            text: container.utils.status(queue),
                            iconURL: container.client.user.displayAvatarURL({ size: 512 }),
                        }),
                ],
            })
        );

        super.on("addSong", (queue: Queue, song: Song<unknown>) =>
            queue.textChannel.send(
                `${Emojis.music.success} | Added ${song.name} - \`${song.formattedDuration}\` to the queue by ${song.user}`
            )
        );

        super.on("addList", (queue: Queue, playlist: Playlist<unknown>) =>
            queue.textChannel.send(
                `${Emojis.music.success} | Added \`${playlist.name}\` playlist (${
                    playlist.songs.length
                } songs) to queue\n${container.utils.status(queue)}`
            )
        );

        super.on("error", (channel: GuildTextBasedChannel, error: Error) => {
            if (channel)
                channel.send(`${Emojis.music.error} | An error encountered: ${error.toString().slice(0, 1974)}`);
            else console.error(error);
        });

        super.on("empty", (queue: Queue) => queue.textChannel.send("Voice channel is empty! Leaving the channel..."));

        super.on("searchNoResult", (message: Message<true>, query: string) =>
            message.channel.send(`${Emojis.music.error} | No result found for \`${query}\`!`)
        );

        super.on("finish", (queue: Queue) => queue.textChannel.send("Finished!"));
    }

    public setContext(ctx: Message | CommandInteraction): Message<boolean> | CommandInteraction {
        return (this.context = ctx);
    }
}
