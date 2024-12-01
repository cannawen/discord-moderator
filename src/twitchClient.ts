import tmi from "tmi.js";
import constants from "./constants";
import { playAudio } from "./helpers";

const client = new tmi.Client({
    channels: [constants.twitch.CHANNEL_NAME],
});

function connect() {
    client.connect();

    client.on("message", (channel, tags, message, self) => {
        const messageUsername = tags["username"];
        if (messageUsername !== constants.twitch.CHANNEL_NAME) {
            playAudio(`${messageUsername} says ${message}`)
        }
    });
}

function disconnect() {
    client.disconnect();
}


export default { connect, disconnect };