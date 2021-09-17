import { Client, Collection, Intents } from 'discord.js-light';
import WebSocket from 'ws';

import { Command } from '@models/command';
import Console from '@utils/console';
import Settings from '@utils/settings';
import Locales from '@utils/locales';
import Queue from '@utils/queue';

import * as commands from '../commands';
import Socket from '../socket';

import Request from '@utils/requests/';

export default class Bot extends Client {
	public settings: Settings;
	public queue: Queue;
	public commands: Collection<string, Command>;
	public locales: Locales;

	public socket?: WebSocket;

	public request = new Request();

	constructor() {
		super({
			intents: Intents.FLAGS.GUILDS,
		});

		if (process.env.WEBSOCKET_URL) this.socket = new Socket(this);
		this.settings = new Settings();
		this.locales = new Locales(this);
		this.queue = new Queue();

		this.commands = new Collection();

		Object.values(commands).forEach((Command) => {
			this.commands.set(Command.name.toLocaleLowerCase(), new Command(this));
		});
	}

	public start(token?: string): void {
		console.time('connect-discord');
		Console.info('Starting the bot');

		this.on('ready', () => {
			if (!this.user) return;
			const lang = this.locales.getFromLocale('en-US');
			const activity = lang.bot.activity.name.replace('{username}', this.user.username);

			this.user.setActivity(activity, {
				type: lang.bot.activity.type,
			});
		});

		this.login(token)
			.then(() => Console.success('Connected with Discord!'))
			.catch((e) => {
				Console.error('Failed to connect with Discord!');

				console.log(e);
			})
			.finally(() => console.timeEnd('connect-discord'));
	}
}
