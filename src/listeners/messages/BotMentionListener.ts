import { Listener, Events } from "@sapphire/framework";
import { ApplyOptions } from "@sapphire/decorators";
import { Message } from "discord.js";

/**
 * @description Message when someone mention this bot.
 */
@ApplyOptions<Listener.Options>({
    name: "BotMention",
    once: false,
    event: Events.MessageCreate,
})
export class BotMentionListener extends Listener {
    public async run(message: Message): Promise<void> {
        const client = this.container.client;
        if (message.content == this.toMention(client.user.id)) {
            message.reply({
                content: "PREFIXNYA: `..`",
            });
        }
    }

    private toMention(id: string): string {
        return `<@${id}>`;
    }
}
