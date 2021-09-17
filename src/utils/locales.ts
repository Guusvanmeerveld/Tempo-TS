import Locale, { localeString } from '@models/locales';
import Bot from 'bot';
import { Guild } from 'discord.js';
import { join } from 'path';

export default class LocaleService {
	client;
	constructor(client: Bot) {
		this.client = client;
	}

	/**
	 * Retrieve a certain locale
	 * @param local - The local to get
	 */
	public getFromLocale(local: localeString): Locale {
		return require(join(process.cwd(), 'src', 'config', 'locales', `${local}.json`));
	}

	public get(guild: Guild | null): Locale {
		const settings = this.client.settings.get(guild?.id);

		return this.getFromLocale(settings.language);
	}
}
