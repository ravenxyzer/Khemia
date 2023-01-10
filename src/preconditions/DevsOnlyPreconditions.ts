import { PreconditionOptions, AllFlowsPrecondition, Command } from "@sapphire/framework";
import { ApplyOptions } from "@sapphire/decorators";
import type { Message } from "discord.js";

import { Developers } from "../libraries";

/**
 * @description Developers Only Precondition
 */
@ApplyOptions<PreconditionOptions>({
    name: "DevsOnly",
})
export class DevsOnlyPrecondition extends AllFlowsPrecondition {
    public override async messageRun(message: Message) {
        return Developers.includes(message.author.id)
            ? this.ok()
            : this.error({ message: "⛔・Only development team can run this command!" });
    }

    public override async chatInputRun(interaction: Command.ChatInputInteraction) {
        return Developers.includes(interaction.user.id)
            ? this.ok()
            : this.error({ message: "⛔・Only development team can run this command!" });
    }

    public override async contextMenuRun(interaction: Command.ContextMenuInteraction) {
        return Developers.includes(interaction.user.id)
            ? this.ok()
            : this.error({ message: "⛔・Only development team can run this command!" });
    }
}

declare module "@sapphire/framework" {
    interface Preconditions {
        DevsOnly: never;
    }
}
