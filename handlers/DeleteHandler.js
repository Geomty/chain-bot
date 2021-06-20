const BaseHandler = require("./BaseHandler");

class DeleteHandler extends BaseHandler {
    constructor(deletedMessage) {
        super(deletedMessage);
    }
    static get event() {
        return "messageDelete";
    }
    async handle(deletedMessage) {
        if (this.checkChannel()) return;
        if (deletedMessage.client.deletedMessage == deletedMessage.id) return;
        if (deletedMessage.client.framedAuthor == deletedMessage.author.id) return;
        const messages = await deletedMessage.channel.messages.fetch();
        let messagesArray = [];
        for (const message of messages) {
            messagesArray.push(message[0]);
        }
        messagesArray.sort((a, b) => {
            return Math.abs(deletedMessage.id - a) - Math.abs(deletedMessage.id - b);
        });
        let fetchMessage = async id => {
            const message = await deletedMessage.channel.messages.fetch(id);
            return message;
        }
        let messageOne = await fetchMessage(messagesArray[0]);
        let messageTwo = await fetchMessage(messagesArray[1]);
        if (messageOne.author.id == messageTwo.author.id) {
            deletedMessage.client.framedAuthor = messageOne.author.id;
            (messagesArray[0] - messagesArray[1] ? messageOne : messageTwo).delete();
            this.shame(`tried to frame <@!${messageOne.author.id}>!`, false, deletedMessage);
        }
    }
}

module.exports = DeleteHandler;
