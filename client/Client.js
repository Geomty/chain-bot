const Discord = require("discord.js");
const fs = require("fs");
const config = require("../config.json");

class Client extends Discord.Client {
    constructor() {
        super();
        this.config = config;
        let requiredProperties = ["token", "channel", "word", "shameChannel", "muteRole"];
        for (const property of requiredProperties) {
            if (!config[property] || !config[property].length) {
                let errorMessage = `Missing property "${property}" in config.json file. Please check README.md for more information.`;
                throw new Error(errorMessage);
                process.exit();
            }
        }
        this.handlers = [];
        this.infractions = {};
        const handlers = fs.readdirSync("./handlers/");
        handlers.splice(handlers.indexOf("BaseHandler.js"), 1);
        for (let i=0;i<handlers.length;i++) {
            this.handlers[i] = require(`../handlers/${handlers[i]}`);
        }
        this.init();
    }
    init() {
        this.once("ready", () => console.log(`I am online!`));
        for (const handler of this.handlers) {
            this.on(handler.event, (...parameters) => new handler(...parameters));
        }
        this.login(this.config.token).then(() => {
            this.user.setActivity(`for non-${config.word}'s`, { type: "WATCHING" });
        });
    }
}

module.exports = Client;
