import { ApplyOptions } from "@sapphire/decorators";
import { resolveKey } from "@sapphire/plugin-i18next";
import { Message } from "discord.js";

import { ICommand } from "../../structures";
import { Developers } from "../../libraries";

@ApplyOptions<ICommand.Options>({
    name: "ping",
    description: "Check the bot's latency.",
    extendedDescription: {
        usage: "ping",
    },
    requiredClientPermissions: ["SendMessages"],
    requiredUserPermissions: ["SendMessages"],
    runIn: ["GUILD_ANY"],
    cooldownFilteredUsers: [Developers[0]],
})
export class PunchCommand extends ICommand {
    public async messageRun(message: Message): Promise<void> {
        void this.ping(message);
    }

    public async chatInputRun(interaction: ICommand.ChatInputCommandInteraction): Promise<void> {
        void this.ping(interaction);
    }

    private async ping(ctx: Message | ICommand.ChatInputCommandInteraction): Promise<void> {
        const ms = Math.round(this.container.client.ws.ping);
        await ctx.reply({
            embeds: [
                this.utils.embed().setDescription(
                    await resolveKey(ctx, "CommandResponses:ping:success", {
                        client: this.container.client.user.username,
                        ms: ms.toLocaleString("us"),
                    })
                ),
            ],
        });
    }

    public registerApplicationCommands(registry: ICommand.Registry): void {
        registry.registerChatInputCommand(
            (builder) =>
                builder
                    .setName(this.name)
                    .setDescription(this.description)
                    .setDescriptionLocalizations({ id: "Periksa latensi bot." }),
            { idHints: ["107833561794924967"] }
        );
    }
}
