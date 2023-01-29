import "dotenv/config";
import { IClient, IDistube } from "./structures";
import { container } from "@sapphire/framework";

const client = new IClient();
container.distube = new IDistube(client);

client.login(process.env.TOKEN);
