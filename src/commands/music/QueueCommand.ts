import { ApplyOptions } from "@sapphire/decorators";
import { Args } from "@sapphire/framework";
import { resolveKey } from "@sapphire/plugin-i18next";
import { Message } from "discord.js";
import { ICommand } from "../../structures";

@ApplyOptions<ICommand.Options>({
    name: "queue",
    aliases: ["q"],
    description: "Displays the queue of songs currently playing.",
    extendedDescription: {
        usage: "queue",
    },
    requiredClientPermissions: ["SendMessages", "Speak", "Connect"],
    requiredUserPermissions: ["SendMessages"],
    runIn: ["GUILD_ANY"],
})
export class QueueCommand extends ICommand {
    public override async messageRun(message: Message, args: Args): Promise<void> {
        this.queue(message);
    }

    public override async chatInputRun(interaction: ICommand.ChatInputCommandInteraction): Promise<void> {
        this.queue(interaction);
    }

    public override async registerApplicationCommands(registry: ICommand.Registry): Promise<void> {
        registry.registerChatInputCommand((builder) => builder.setName(this.name).setDescription(this.description), {
            idHints: ["1070529828165533777"],
        });
    }

    private async queue(ctx: Message | ICommand.ChatInputCommandInteraction): Promise<void> {
        const queue = this.container.distube.getQueue(ctx);

        if (!queue) {
            await ctx.reply({ content: await resolveKey(ctx, "CommandResponses:queue:error") });
        }
        const text: string = await resolveKey(ctx, "CommandResponses:queue:description");
        const songs = queue.songs
            .map(
                (song, i) =>
                    `${i === 0 ? text : `${i}.`} ${this.container.utils.trimString(song.name, 35)} - \`${
                        song.formattedDuration
                    }\``
            )
            .join("\n");

        ctx.reply({
            embeds: [
                this.utils
                    .embed()
                    .setTitle(await resolveKey(ctx, "CommandResponses:queue:title"))
                    .setDescription(songs),
            ],
        });
    }
}
