import { Message } from 'discord.js-light';

import { Command, Requirement } from '@models/command';
import { Play } from './play';
import Bot from '../bot';

export class PlaySkip implements Command {
	name = 'playskip';
	description = 'Skip and play a new song.';
	usage = 'playskip [name of song / link to song]';
	aliases = ['ps'];
	requirements: Requirement[] = ['ROLE', 'VOICE'];

	client;
	private player;
	constructor(client: Bot) {
		this.client = client;
		this.player = new Play(client);
	}

	run(msg: Message, args: Array<string>): void {
		this.player.run(msg, args, true);
	}
}
