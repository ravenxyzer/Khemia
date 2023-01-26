import { Events } from "@sapphire/framework";
import { ApplyOptions } from "@sapphire/decorators";
import { Message, EmbedBuilder } from "discord.js";
import { Colors } from "../../libraries";
import { resolveKey } from "@sapphire/plugin-i18next";

import { IListener } from "../../structures";
/**
 * @description Message when someone mention this bot.
 */
@ApplyOptions<IListener.Options>({
    name: "BotMention",
    once: false,
    event: Events.MessageCreate,
})
export class BotMentionListener extends IListener {
    public async run(message: Message): Promise<void> {
        const client = this.container.client;
        const owner = client.users.cache.get("387886389800337409");
        if (message.content == this.toMention(client.user.id)) {
            message.reply({
                embeds: [
                    new EmbedBuilder().setColor(Colors.default).setDescription(
                        await resolveKey(message, "ListenerResponses:botMention:description", {
                            owner: owner.tag,
                            guild: `[Genshin Impact ID](https://discord.gg/sPcbcaKyz7)`,
                        })
                    ),
                ],
            });
        }
    }

    private toMention(id: string): string {
        return `<@${id}>`;
    }
}
