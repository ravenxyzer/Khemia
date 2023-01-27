import { Events, container } from "@sapphire/framework";
import { ApplyOptions } from "@sapphire/decorators";
import { Time } from "@sapphire/time-utilities";
import { ActivityType } from "discord.js";

import { IListener } from "../../structures";
import { Presences } from "../../libraries";

/**
 * @description Khemia Ready Listener
 */
@ApplyOptions<IListener.Options>({
    name: "Ready",
    once: false,
    event: Events.ClientReady,
})
export class ReadyListener extends IListener {
    public async run(): Promise<void> {
        const { logger, client, utils } = container;
        logger.info(`Logged in as ${client.user.tag}`);

        const randomizePresence = (): void => {
            client.user.setPresence({
                activities: [
                    {
                        name: utils.randomArray(Presences),
                        type: ActivityType.Watching,
                    },
                ],
                status: "online",
            });
        };

        void randomizePresence();
        setInterval(randomizePresence, Time.Minute * 1);
    }
}
