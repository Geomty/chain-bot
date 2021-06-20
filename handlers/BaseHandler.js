class BaseHandler {
    constructor(message) {
        this.message = message;
        this.handle(message);
    }
    checkChannel() {
        if (this.message.channel.id != this.message.client.config.channel) return true;
        return false;
    }
    shame(smh, shouldDelete = true, otherMessage) {
        if (shouldDelete) this.message.delete();
        this.message.client.deletedMessage = this.message.id;
        if (otherMessage) this.message = otherMessage;
        this.message.client.channels.cache.get(this.message.client.config.shameChannel).send(`<@!${this.message.author.id}> ${smh}`);
        this.manageInfractions();
    }
    manageInfractions() {
        this.counter = this.message.client.infractions[this.message.author.id] || 0;
        let roles = this.message.guild.members.cache.get(this.message.author.id).roles;
        let interval;
        let infractions = [];
        infractions[3] = 1000*60*15;
        infractions[5] = 1000*60*60;
        infractions[7] = 1000*60*60*6;
        infractions[9] = 1000*60*60*24;

        if (!this.counter) {
            this.changeCounter(1);
            interval = this.createInterval(interval);
        } else this.changeCounter(this.counter + 1);

        if (infractions[this.counter]) {
            clearInterval(interval);
            roles.add(this.message.client.config.muteRole, "Auto-mute by chain-bot");
            this.message.client.channels.cache.get(this.message.client.config.shameChannel).send(`<@!${this.message.author.id}> has been automatically muted for repeat infractions.`);

            setTimeout(() => {
                roles.remove(this.message.client.config.muteRole, "Auto-unmute by chain-bot");
                this.message.client.channels.cache.get(this.message.client.config.shameChannel).send(`<@!${this.message.author.id}> has been automatically unmuted.`);
                interval = this.createInterval(interval);
            }, infractions[this.counter]);
        }
    }
    changeCounter(number) {
        this.counter = this.message.client.infractions[this.message.author.id] = number;
    }
    createInterval(interval) {
        return setInterval(() => {
            if (this.counter) this.changeCounter(this.counter - 1);
            else clearInterval(interval);
        }, 1000*60*60*2);
    }
}

module.exports = BaseHandler;
