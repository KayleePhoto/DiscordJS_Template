module.exports = {
    // Creates function "getMember"
    getMember: function(message, toFind = '') {
        // Sets the tofind to all lower case
        toFind = toFind.toLowerCase();

        // Searchs the server for a member base on toFind VAR
        let target = message.guild.members.get(toFind);

        // If no member its a mention, set target as the first mention
        if(!target && message.mentions.members)
            target = message.mentions.members.first();
            
        // If no target and toFind,
        // Sets target to find member, by lowercase display name, that includes the to find
        // If that fails, is searchs for the user tag in lower case, that includes toFind
        if(!target && toFind){
            target = message.guild.members.find(member => {
                return message.displayName.toLowerCase().includes(toFind) ||
                member.user.tag.toLowerCase().includes(toFind)
            });
        }

        // if no target, set target as message author
        if(!target)
            target = message.member;

        // returns back to target, if checks pass
        return target;
    },

    // Creates a date for en-US
    formatDate: function(date) {
        return new Intl.DateTimeFormat('en-US').format(date);
    },

    // Creates an async function to make a "verification" message to reply to
    promptMessage: async function (message, author, time, validReactions) {
        // Sets time equal to the Multiplication AO of 1000
        time *= 1000;
        
        // For constant named reaction of vaildReactions, for reaction of required ID
        for (const reaction of validReactions) await message.react(reaction);

        // Creates a filter, so it only detects the message author input
        const filter = (reaction, user) => validReactions.includes(reaction.emoji.name) && user.id === author.id;

        // Returns a message, that awaits reaction for desired reaction(s), before becoming invaild
        return message
            .awaitReactions(filter, { max: 1, time: time})
            .then(collected => collected.first() && collected.first().emoji.name);
    }
}