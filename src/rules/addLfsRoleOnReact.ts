import { fetchMessage, findMember } from "../helpers";
import client from "../discordClient";
import constants from "../constants";
import { Events } from "discord.js";
import Rule from "../Rule";
import winston from "winston";

export default new Rule({
  description: "tag member with lfs if they react to lfs message",
  start: () => {
    fetchMessage(
      constants.channelIds.LFS,
      constants.messageIds.LFS_REACT_MESSAGE
    );

    client.on(Events.MessageReactionAdd, (reaction, user) => {
      if (reaction.message.id === constants.messageIds.LFS_REACT_MESSAGE) {
        winston.info(`Role - LFS - role added for ${user.displayName}`);
        findMember(user.id).roles.add(constants.roleIds.LFS);
      }
    });

    client.on(Events.MessageReactionRemove, (reaction, user) => {
      if (reaction.message.id === constants.messageIds.LFS_REACT_MESSAGE) {
        winston.info(`Role - LFS - role removed for ${user.displayName}`);
        findMember(user.id).roles.remove(constants.roleIds.LFS);
      }
    });
  },
});
