const { Command } = require('discord.js-commando');
const BotData = require("../../BotData.js");
const discord = require("discord.js");
const db = require("quick.db");

module.exports = class UnmuteCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'unmute',
			group: 'admin',
			memberName: 'unmute',
			description: 'Unmutes a user!',
		});
	}

	run(message, args) {
		if (message.guild === null){
            message.reply(DMMessage);
            return;
		}
		if (!message.member.hasPermission("MANAGE_MESSAGES")){
			const PermissionErrorMessage = new discord.MessageEmbed()
				.setColor("#FF0000")
				.setDescription(`${PermissionError}`)
			message.channel.send(PermissionErrorMessage).then(message => {
				message.delete({timeout: 10000})
			});
			return;
		}
		let UnmutedUser = message.guild.member(message.mentions.users.first());
        if(!UnmutedUser) {
			const NullUserMessage = new discord.MessageEmbed()
				.setColor()
				.setDescription(NullUser)
			message.channel.send(NullUserMessage).then(message => {
				message.delete({timeout: 10000});
			});
			return;
		}
		if (UnmutedUser.hasPermission("MANAGE_MESSAGES")){
			const StaffUserMessage = new discord.MessageEmbed()
				.setColor("#FF0000")
				.setDescription(StaffUser)
			message.channel.send(StaffUserMessage).then(message => {
				message.delete({timeout: 10000})
			});
            return;
		}
		let words = args.split(' ');
		let reason = words.slice(1).join(' ');
        if (!reason){
			const NoReasonWarning = new discord.MessageEmbed()
				.setColor()
				.setDescription(`:warning: Please supply a reason for the unmute!`)
			message.channel.send(NoReasonWarning).then(message => {
                message.delete({timeout: 10000});
			});
			return;
		}

		var UnmuteNumber = db.add(`{UnmuteNumber}_${message.mentions.users.first().id}`, 1);
		db.push(`{UnmuteReason}_${message.mentions.users.first().id}`, `**Unmute ${UnmuteNumber}:** ${words.slice(1).join(' ')}`);
		let users = message.mentions.users.first();

		let MuteRole = message.guild.roles.cache.get(MuteRoleID);
		UnmutedUser.roles.remove(MuteRole).then(function(){
			UnmutedUser.send(`You have been unmuted on ${message.guild.name} because, ${reason}.`);
		});

		const ChatUnmuteMessage = new discord.MessageEmbed()
			.setColor("0xFFA500")
			.setTimestamp()
			.setThumbnail(users.displayAvatarURL())
			.setTitle("Unmute")
			.setDescription(`
				**Moderator:** ${message.author}
				**User:** ${UnmutedUser}
				**Reason:** ${reason}
			`)
		message.channel.send(ChatUnmuteMessage);

		const UnmuteLogMessage = new discord.MessageEmbed()
			.setColor("0xFFA500")
			.setTimestamp()
			.setThumbnail(users.displayAvatarURL())
			.setTitle("Unmute")
			.setDescription(`
				**Moderator:** ${message.author}
				**Unmuted User:** ${UnmutedUser}
				**User ID:** ${message.mentions.users.first().id}
				**Reason:** ${reason}
			`)
		let LogChannel = message.guild.channels.cache.get(LogChannelID);
		LogChannel.send(UnmuteLogMessage);
	}
};