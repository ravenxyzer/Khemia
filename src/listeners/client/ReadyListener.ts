import { Listener, Events } from "@sapphire/framework";
import { ApplyOptions } from "@sapphire/decorators";
import { Time } from "@sapphire/time-utilities";
import mongoose from "mongoose";

import { Presences, Utils } from "../../libraries";

/**
 * @description Khemia Ready Listener
 */
@ApplyOptions<Listener.Options>({
    name: "ready",
    once: false,
    event: Events.ClientReady,
})
export class ReadyListener extends Listener {
    public async run(): Promise<void> {
        const logger = this.container.logger;
        const database = process.env.MONGO_URI;

        logger.info(`Logged in as ${this.container.client.user.tag}`);

        const randomizePresence = (): void => {
            this.container.client.user.setPresence({
                activities: [
                    {
                        name: Utils.randomArray(Presences),
                        type: "WATCHING",
                    },
                ],
                status: "online",
            });
        };

        void randomizePresence();
        setInterval(randomizePresence, Time.Minute * 1);

        /* Database Connection */
        if (!database) return;
        mongoose
            .connect(database)
            .then(() => {
                logger.info(`${this.container.client.user.tag} already connected to the database.`);
            })
            .catch((err) => {
                logger.error(err);
            });
    }
}
