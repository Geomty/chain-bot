const BaseHandler = require("./BaseHandler");

class MessageHandler extends BaseHandler {
    constructor(message) {
        super(message);
    }
    static get event() {
        return "message";
    }
    async handle(message) {
        if (this.checkChannel()) return;
        if (message.content != message.client.config.word) this.shame(`sent a non-${message.client.config.word}!`);
        else if (message.client.oldMessage && message.author.id == message.client.oldMessage.author.id) this.shame(`sent ${message.client.config.word} twice in a row!`);
        else if (message.attachments.find(att => att.url.length) || message.embeds.length || message.activity) this.shame(`sent an attachment!`);
        else message.client.oldMessage = message;
    }
}

module.exports = MessageHandler;
