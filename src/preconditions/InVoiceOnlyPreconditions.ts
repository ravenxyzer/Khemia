import { PreconditionOptions, Precondition, Result, UserError } from "@sapphire/framework";
import { ApplyOptions } from "@sapphire/decorators";
import type { Guild, GuildMember, Message } from "discord.js";

import { ICommand } from "../structures";

/**
 * @description Developers Only Precondition
 */
@ApplyOptions<PreconditionOptions>({
    name: "InVoiceOnly",
})
export class InVoiceOnlyPrecondition extends Precondition {
    public override async messageRun(message: Message): Promise<Result<unknown, UserError>> {
        const status: boolean = message.member.voice.channelId ? true : false;
        return status
            ? this.ok()
            : this.error({
                  identifier: "preconditionInVoiceOnly",
              });
    }

    public override async chatInputRun(
        interaction: ICommand.ChatInputCommandInteraction
    ): Promise<Result<unknown, UserError>> {
        const member: GuildMember = interaction.guild.members.cache.get(interaction.user.id);

        const status: boolean = member.voice.channelId ? true : false;
        return status
            ? this.ok()
            : this.error({
                  identifier: "preconditionInVoiceOnly",
              });
    }
}
