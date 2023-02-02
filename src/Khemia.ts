import "dotenv/config";
import { IClient, IDistube } from "./structures";
import { container } from "@sapphire/framework";
import mongoose from "mongoose";
mongoose.set("strictQuery", true);

const client = new IClient();
container.distube = new IDistube(client);

client.login(process.env.TOKEN);
