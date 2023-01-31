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
        const embed: EmbedBuilder = this.utils.embed().isErrorEmbed(true);

        switch (error.identifier) {
            case Identifiers.PreconditionCooldown:
                embed.setDescription(await resolveKey(data.message, "UserErrorResponses:cooldown"));
                return data.message.reply({ embeds: [embed] });

            case Identifiers.PreconditionClientPermissions || Identifiers.PreconditionClientPermissionsNoPermissions:
                embed.setDescription(await resolveKey(data.message, "UserErrorResponses:clientNoPerms"));
                return data.message.reply({ embeds: [embed] });

            case Identifiers.PreconditionUserPermissions || Identifiers.PreconditionUserPermissionsNoPermissions:
                embed.setDescription(await resolveKey(data.message, "UserErrorResponses:userNoPerms"));
                return data.message.reply({ embeds: [embed] });

            case Identifiers.PreconditionOwnerOnly:
                embed.setDescription(await resolveKey(data.message, "UserErrorResponses:ownerOnly"));
                return data.message.reply({ embeds: [embed] });

            case Identifiers.PreconditionDevsOnly:
                embed.setDescription(await resolveKey(data.message, "UserErrorResponses:devsOnly"));
                return data.message.reply({ embeds: [embed] });

            case Identifiers.PreconditionInVoiceOnly:
                embed.setDescription(await resolveKey(data.message, "UserErrorResponses:inVoiceOnly"));
                return data.message.reply({ embeds: [embed] });

            default:
                embed.setDescription(`🛑・${error.identifier} | ${error.message}`);
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
                embed.setDescription(await resolveKey(data.interaction.guild, "UserErrorResponses:cooldown"));
                return data.interaction.reply({ embeds: [embed] });

            case Identifiers.PreconditionClientPermissions || Identifiers.PreconditionClientPermissionsNoPermissions:
                embed.setDescription(await resolveKey(data.interaction.guild, "UserErrorResponses:clientNoPerms"));
                return data.interaction.reply({ embeds: [embed] });

            case Identifiers.PreconditionUserPermissions || Identifiers.PreconditionUserPermissionsNoPermissions:
                embed.setDescription(await resolveKey(data.interaction.guild, "UserErrorResponses:userNoPerms"));
                return data.interaction.reply({ embeds: [embed] });

            case Identifiers.PreconditionOwnerOnly:
                embed.setDescription(await resolveKey(data.interaction, "UserErrorResponses:ownerOnly"));
                return data.interaction.reply({ embeds: [embed] });

            case Identifiers.PreconditionDevsOnly:
                embed.setDescription(await resolveKey(data.interaction, "UserErrorResponses:devsOnly"));
                return data.interaction.reply({ embeds: [embed] });

            case Identifiers.PreconditionInVoiceOnly:
                embed.setDescription(await resolveKey(data.interaction, "UserErrorResponses:inVoiceOnly"));
                return data.interaction.reply({ embeds: [embed] });

            default:
                embed.setDescription(error.message);
                return data.interaction.reply({ embeds: [embed] });
        }
    }
}
