const BaseHandler = require("./BaseHandler");

class ReactionHandler extends BaseHandler {
    constructor(reaction) {
        super(reaction);
    }
    static get event() {
        return "messageReactionAdd";
    }
    handle(reaction) {
        this.message.channel = reaction.channel = reaction.message.channel;
        this.message.author = reaction.author = reaction.users.cache.first();
        this.message.guild = reaction.guild = reaction.channel.guild;
        if (this.checkChannel()) return;
        this.shame("added a reaction!", false);
        reaction.remove();
    }
}

module.exports = ReactionHandler;
