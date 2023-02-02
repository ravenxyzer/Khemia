import { EmbedBuilder } from "discord.js";
import { Colors } from "../../libraries";

export class IEmbedBuilder extends EmbedBuilder {
    public constructor() {
        super();
        this.setColor(Colors.default);
    }

    isErrorEmbed(value: boolean): this {
        if (value) {
            this.setColor(Colors.error);
        }

        return this;
    }

    isSuccessEmbed(value: boolean): this {
        if (value) {
            this.setColor(Colors.success);
        }

        return this;
    }
}
