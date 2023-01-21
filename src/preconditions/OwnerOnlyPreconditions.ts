import { PreconditionOptions, AllFlowsPrecondition, Command } from "@sapphire/framework";
import { ApplyOptions } from "@sapphire/decorators";
import type { Message } from "discord.js";

import { Developers } from "../libraries";

/**
 * @description Owner Only Precondition
 */
@ApplyOptions<PreconditionOptions>({
    name: "OwnerOnly",
})
export class OwnerOnlyPrecondition extends AllFlowsPrecondition {
    public override async messageRun(message: Message) {
        return Developers[0].includes(message.author.id)
            ? this.ok()
            : this.error({ message: "⛔・*Only owner can run this command!" });
    }

    public override async chatInputRun(interaction: Command.ChatInputCommandInteraction) {
        return Developers[0].includes(interaction.user.id)
            ? this.ok()
            : this.error({ message: "⛔・Only owner can run this command!" });
    }

    public override async contextMenuRun(interaction: Command.ContextMenuCommandInteraction) {
        return Developers[0].includes(interaction.user.id)
            ? this.ok()
            : this.error({ message: "⛔・Only owner can run this command!" });
    }
}

declare module "@sapphire/framework" {
    interface Preconditions {
        OwnerOnly: never;
    }
}
