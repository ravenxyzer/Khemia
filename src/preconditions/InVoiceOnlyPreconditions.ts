import { PreconditionOptions, Precondition, Result, UserError } from "@sapphire/framework";
import { ApplyOptions } from "@sapphire/decorators";
import type { Message, User } from "discord.js";

import { ICommand } from "../structures";

/**
 * @description Developers Only Precondition
 */
@ApplyOptions<PreconditionOptions>({
    name: "InVoiceOnly",
})
export class InVoiceOnlyPrecondition extends Precondition {
    public override async messageRun(message: Message): Promise<Result<unknown, UserError>> {
        let status: boolean = true;
        if (!message.member.voice.channelId) {
            status = false;
        }

        return status
            ? this.ok()
            : this.error({
                  identifier: "preconditionInVoiceOnly",
              });
    }

    public override async chatInputRun(
        interaction: ICommand.ChatInputCommandInteraction
    ): Promise<Result<unknown, UserError>> {
        let status: boolean = true;
        if (!interaction.guild.members.cache.get(interaction.id).voice.channel) {
            status = false;
        }

        return status
            ? this.ok()
            : this.error({
                  identifier: "preconditionInVoiceOnly",
              });
    }
}
