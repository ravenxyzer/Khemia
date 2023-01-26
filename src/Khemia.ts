import "dotenv/config";
import { container, SapphireClient } from "@sapphire/framework";
import { GuildTextBasedChannel, Message } from "discord.js";
import { Queue, Song, Playlist } from "distube";

import { IClient } from "./structures/builds/IClient";
import { Emojis, Utils } from "./libraries";

/**
 * @description Mongoose set query
 */
import mongoose from "mongoose";
mongoose.set("strictQuery", true);

/**
 * @description Distube client
 */

/**
 * @description Khemia login
 */
new IClient().login(process.env.TOKEN);
