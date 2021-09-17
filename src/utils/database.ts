import { Pool, QueryConfig } from 'pg';

import { GuildSettings } from '@models/settings';
import Console from './console';

export interface RawDBData {
	id: string;
	settings: GuildSettings;
}

export class Database {
	private pool: Pool;

	constructor() {
		this.pool = new Pool({
			connectionString: process.env.DATABASE_URL || 'postgresql://localhost:5432',
			ssl: {
				rejectUnauthorized: false,
			},
		});

		this.pool.on('error', (err) =>
			Console.error('Unexpected error on idle client' + JSON.stringify(err))
		);
	}

	/**
	 * Get every guild from the database
	 * @returns Raw database information
	 */
	public async get(): Promise<Array<RawDBData>> {
		await this.pool.query(
			'CREATE TABLE IF NOT EXISTS guilds(id VARCHAR UNIQUE NOT NULL, settings JSON);'
		);

		const query = await this.pool.query('SELECT * FROM guilds');

		return query.rows;
	}

	/**
	 * Delete a guild from the database
	 * @param id - The guild's id to be removed
	 */
	public delete(id: string): void {
		this.pool.query('DELETE FROM guilds WHERE id = $1', [id]);
	}

	/**
	 * Set new settings in the database for a guild
	 * @param id - The guild's id to be updated / set
	 * @param settings - The new settings
	 */
	public set(id: string, settings: GuildSettings): void {
		const query: QueryConfig = {
			name: 'insert/update-guild',
			text: 'INSERT INTO guilds(id, settings) VALUES($1, $2) ON CONFLICT (id) DO UPDATE SET id = $1, settings = $2',
			values: [id, settings],
		};

		this.pool.query(query);
	}
}
