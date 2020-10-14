const { Command } = require('discord.js-commando');
const BotData = require("../../BotData.js");
const discord = require("discord.js");
const db = require("quick.db");

module.exports = class RankCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'rank',
			group: 'simple',
			memberName: 'rank',
			description: 'Shows you your chat level!',
		});
	}

	run(message, args) {
        if (message.guild === null){
            message.reply(DMMessage);
            return;
        }
        let RankUser = message.guild.member(message.mentions.users.first());
        if (RankUser){   
            let MentionedUsersLevel = db.get(`{Level}_${message.mentions.users.first().id}`); if (MentionedUsersLevel == null)MentionedUsersLevel = "0";//TODO replace with new array db sets
            let MentionedUsersXP = db.get(`{xp}_${message.mentions.users.first().id}`); if (MentionedUsersXP == null)MentionedUsersXP = "0";//TODO same here
            let users = message.mentions.users.first();

            const MentionedUserRank = new discord.MessageEmbed()
                .setColor(0x668d3c)
                .setThumbnail(users.displayAvatarURL())
                .setTitle("Rank")
                .setDescription(`
                    **User:** ${RankUser}
                    **Level:** ${MentionedUsersLevel}
                    **XP:** ${MentionedUsersXP}
                `)
            message.channel.send(MentionedUserRank);
        }else{
            let Level = db.get(`{Level}_${message.author.id}`); if (Level == null)Level = "0";
            let XP = db.get(`{xp}_${message.author.id}`); if (XP == null)XP = "0";
            
            const UserRank = new discord.MessageEmbed()
                .setColor(0x668d3c)
                .setThumbnail(message.author.avatarURL())
                .setTitle("Rank")
                .setDescription(`
                    **User:** ${message.author}
                    **Level:** ${Level}
                    **XP:** ${XP}
                `)
            message.channel.send(UserRank);
        }
	}
};