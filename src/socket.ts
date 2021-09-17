import WebSocket from 'ws';

import { updateCommands } from './bot/slash';
import Console from '@utils/console';
import Bot from './bot';

export interface WsMsgData {
	type: 'guilds' | 'update';
	content: any;
	id?: number;
}

interface Message {
	data: string;
	type: string;
	target: WebSocket;
}

export default class Socket extends WebSocket {
	client: Bot;

	constructor(client: Bot) {
		super(process.env.WEBSOCKET_URL ?? '', {
			headers: {
				Authorization: process.env.DISCORD,
			},
		});

		this.client = client;

		this.addEventListener('error', (err) =>
			Console.error(`Failed to connect to local websocket server: ${JSON.stringify(err.message)}`)
		);

		this.addEventListener('open', () =>
			Console.success(`Successfully connected with ${process.env.WEBSOCKET_URL}!`)
		);

		this.addEventListener('close', () =>
			Console.error('Disconnected from local websocket server!')
		);

		this.on('ping', () => {
			this.pong();
			if (process.env.NODE_ENV !== 'production')
				Console.info(
					'Received ping from ' + process.env.WEBSOCKET_URL + ', responding with a pong.'
				);
		});

		this.addEventListener('message', this.handleMsg);
	}

	public msg(msg: WsMsgData): void {
		this.send(JSON.stringify(msg));
	}

	private handleMsg(msg: Message) {
		const data: WsMsgData = JSON.parse(msg.data);
		const content = data.content;

		switch (data.type) {
			case 'guilds':
				this.client.guilds
					.fetch(content)
					.then((guild) => this.msg({ content: guild, type: 'guilds', id: guild.shardID }))
					.catch((err) => this.msg({ content: err, type: 'guilds' }));

				break;
			case 'update':
				updateCommands(this.client);
				break;
			default:
				break;
		}
	}
}
