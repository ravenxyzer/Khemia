import { Listener, Events, container } from "@sapphire/framework";
import { ApplyOptions } from "@sapphire/decorators";
import { Time } from "@sapphire/time-utilities";
import { ActivityType } from "discord.js";
import mongoose from "mongoose";

import { Presences, Utils } from "../../libraries";

/**
 * @description Khemia Ready Listener
 */
@ApplyOptions<Listener.Options>({
    name: "Ready",
    once: false,
    event: Events.ClientReady,
})
export class ReadyListener extends Listener {
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

        /* Database Connection */
        mongoose
            .connect(process.env.DATABASE_URL)
            .then(() => {
                logger.info(`${client.user.tag} already connected to the database.`);
            })
            .catch((err) => {
                logger.error(err);
            });
    }
}
