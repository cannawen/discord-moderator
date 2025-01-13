import constants from "../../constants";
import obsClient from "../../obsClient";
import { playAudio } from "../../helpers";
import Rule from "../../Rule";
import winston from "winston";

export default new Rule({
    description:
        "Change OBS scene",
    utterance: (utterance, memberId) => {
        let regex = utterance.match(/^scene (.+)$/i)
        if (regex) {
            if (memberId === constants.discord.memberIds.CANNA) {
                winston.info(`OBS - Canna - processing scene change to ${regex[1]}`);
                obsClient
                    .changeScene(regex[1].toLowerCase())
                    .then(() => playAudio("success.mp3"))
                    .catch(() => playAudio("error.mp3"));
            }
        }
    },
});
