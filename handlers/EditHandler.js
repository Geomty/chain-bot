const BaseHandler = require("./BaseHandler");

class EditHandler extends BaseHandler {
    constructor(_, editedMessage) {
        super(editedMessage);
    }
    static get event() {
        return "messageUpdate";
    }
    handle(editedMessage) {
        if (this.checkChannel()) return;
        this.shame(`edited their message to a non-${editedMessage.client.config.word}!`);
    }
}

module.exports = EditHandler;
