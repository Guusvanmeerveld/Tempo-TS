import { ShardingManager } from 'discord.js-light';

import Console from '@utils/console';

const discordToken = process.env.DISCORD;

export default class Manager {
	private manager: ShardingManager;

	constructor() {
		this.manager = new ShardingManager('./dist/bot/start.js', {
			token: discordToken,
		});

		this.manager.on('shardCreate', (shard) => Console.info(`Launched shard ${shard.id}`));
	}

	public start(): void {
		this.manager.spawn();
	}
}
