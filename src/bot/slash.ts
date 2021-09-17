import { config } from 'dotenv';
config();

import { SlashCommand } from '@models/requests';
import { Command } from '@models/command';
import Console from '@utils/console';

import * as commands from '../commands';
import Bot from '.';

export const updateCommands = (client: Bot): void => {
	const localCommands: Array<Command> = Object.values(commands).map(
		(Command) => new Command(client)
	);

	const slashCommands: Array<SlashCommand> = [];

	localCommands.forEach((command) => {
		const name = command.name.replace(/\s/g, '');

		slashCommands.push({
			description: command.description,
			options: command.options,
			name,
		});
	});

	client.request.discord
		.bulkUpdateCommands(slashCommands)
		.then(() => Console.success(`Successfully updated ${slashCommands.length} commands!`))
		.catch((err) => Console.error(`Failed to update commands: ${err}`));
};
