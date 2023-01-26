import { ApplyOptions } from "@sapphire/decorators";
import {
    Events,
    UserError,
    MessageCommandDeniedPayload,
    Identifiers,
    ChatInputCommandDeniedPayload,
    Listener,
} from "@sapphire/framework";
import { resolveKey } from "@sapphire/plugin-i18next";
import { Message, EmbedBuilder, InteractionResponse } from "discord.js";

import { IListener } from "../../structures";
import { Colors } from "../../libraries";

@ApplyOptions<Listener.Options>({
    name: "MessageCommandDenied",
    once: false,
    event: Events.MessageCommandDenied,
})
export class MessageCommandDeniedListener extends IListener {
    async run(error: UserError, data: MessageCommandDeniedPayload): Promise<Message> {
        const embed: EmbedBuilder = new EmbedBuilder().setColor(Colors.error);

        switch (error.identifier) {
            case Identifiers.PreconditionCooldown:
                embed.setDescription(await resolveKey(data.message, "CooldownIndentifier:Response"));
                return data.message.reply({ embeds: [embed] });

            case Identifiers.PreconditionClientPermissions || Identifiers.PreconditionClientPermissionsNoPermissions:
                embed.setDescription(await resolveKey(data.message, "ClientPermissionsIndentifier:Response"));
                return data.message.reply({ embeds: [embed] });

            case Identifiers.PreconditionUserPermissions || Identifiers.PreconditionUserPermissionsNoPermissions:
                embed.setDescription(await resolveKey(data.message, "UserPermissionsIndentifier:Response"));
                return data.message.reply({ embeds: [embed] });

            default:
                embed.setDescription(error.message);
                return data.message.reply({ embeds: [embed] });
        }
    }
}

@ApplyOptions<Listener.Options>({
    name: "ChatInputCommandDenied",
    once: false,
    event: Events.ChatInputCommandDenied,
})
export class ChatInputCommandDeniedListener extends Listener {
    async run(error: UserError, data: ChatInputCommandDeniedPayload): Promise<InteractionResponse<boolean>> {
        const embed: EmbedBuilder = new EmbedBuilder().setColor(Colors.error);
        switch (error.identifier) {
            case Identifiers.PreconditionCooldown:
                embed.setDescription(await resolveKey(data.interaction.guild, "CooldownIndentifier:Response"));
                return data.interaction.reply({ embeds: [embed] });

            case Identifiers.PreconditionClientPermissions || Identifiers.PreconditionClientPermissionsNoPermissions:
                embed.setDescription(await resolveKey(data.interaction.guild, "ClientPermissionsIndentifier:Response"));
                return data.interaction.reply({ embeds: [embed] });

            case Identifiers.PreconditionUserPermissions || Identifiers.PreconditionUserPermissionsNoPermissions:
                embed.setDescription(await resolveKey(data.interaction.guild, "UserPermissionsIndentifier:Response"));
                return data.interaction.reply({ embeds: [embed] });

            default:
                embed.setDescription(error.message);
                return data.interaction.reply({ embeds: [embed] });
        }
    }
}
