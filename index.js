#!/usr/bin/env node

import { Command } from 'commander';
import axios from 'axios';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat.js';
import chalk from 'chalk';

dayjs.extend(customParseFormat);

const program = new Command();

const printWelcomeMessage = () => {
  const border = chalk.magenta('========================= Developed by ====================================');
  const belowBorder = chalk.magenta('===========================================================================');
  const name = `
${chalk.cyan.bold('VVV     VV       AA         MM     MM      SSSSSS      HH   HH      IIIIII')}
${chalk.cyan.bold(' VV    VV       A  A        M M  M MM     SS           HH   HH        II')}
${chalk.cyan.bold('  VV  VV       AAAAAA       MM  M  MM      SSSSSS      HHHHHHH        II')}
${chalk.cyan.bold('   VVVV       AA    AA      MM     MM           SS     HH   HH        II')}
${chalk.cyan.bold('    VV       AA      AA     MM     MM      SSSSSS      HH   HH      IIIIII')}
`;

  console.log(border);
  console.log(name);
  console.log(chalk.green.bold('\n Welcome to the Anime Schedule CLI!'));
  console.log(chalk.yellow(' Created by Vamshi Krishna Polisetty'));
  console.log();
  console.log(chalk.white(' Usage: vas get <when> [options]'));
  console.log(chalk.white(' For more info, run: vas --help'));
  console.log(belowBorder);
};

if (process.argv.length <= 2) {
    printWelcomeMessage();
    process.exit(0);
}

program
  .name('vamshi-anime-schedule')
  .description('A CLI tool to fetch and display anime schedules.')
  .version('1.0.0');

const parseUserInputDate = (when) => {
  if (!isNaN(when)) {
    return dayjs().add(parseInt(when, 10), 'day');
  }
  if (dayjs(when, 'YYYYMMDD', true).isValid()) {
    return dayjs(when, 'YYYYMMDD', true);
  }
  const daysOfWeek = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
  if (daysOfWeek.includes(when.toLowerCase())) {
    const today = dayjs();
    let targetDay = daysOfWeek.indexOf(when.toLowerCase());
    let currentDay = today.day();
    let daysToAdd = targetDay - currentDay;
    if (daysToAdd <= 0) {
      daysToAdd += 7;
    }
    return today.add(daysToAdd, 'day');
  }
  return null;
};

program
  .command('get <when>')
  .description('Get the anime schedule for a specific day.')
  .option('-g, --genre <genres>', 'Filter by genre(s), separated by a semicolon (;)')
  .action(async (when, options) => {
    const targetDate = parseUserInputDate(when);

    if (!targetDate) {
      console.error(chalk.red('Invalid date format. Please use a relative offset (e.g., 0), YYYYMMDD format, or a day of the week.'));
      return;
    }

    const dayOfWeek = targetDate.format('dddd').toLowerCase();
    const formattedDate = targetDate.format('YYYY-MM-DD');

    console.log(chalk.blue(`Fetching schedule for ${targetDate.format('dddd, MMMM D, YYYY')}...`));

    try {
      const response = await axios.get(`https://api.jikan.moe/v4/schedules/${dayOfWeek}`);
      const schedule = response.data.data;

      const filteredAnime = schedule.filter(anime => {
        const airedFrom = dayjs(anime.aired.from);
        const airedTo = anime.aired.to ? dayjs(anime.aired.to) : null;
        return targetDate.isSame(airedFrom, 'day') || (targetDate.isAfter(airedFrom) && (!airedTo || targetDate.isBefore(airedTo) || targetDate.isSame(airedTo, 'day')));
      });

      let genreFilteredAnime = filteredAnime;
      if (options.genre) {
        const genres = options.genre.toLowerCase().split(';');
        genreFilteredAnime = filteredAnime.filter(anime => {
          return anime.genres.some(g => genres.includes(g.name.toLowerCase()));
        });
      }

      const uniqueAnime = Array.from(new Map(genreFilteredAnime.map(anime => [anime.mal_id, anime])).values());

      if (uniqueAnime.length === 0) {
        console.log(chalk.yellow(`No anime found for this date matching your criteria.`));
        return;
      }

      console.log(chalk.cyan.underline(`Anime airing on ${formattedDate}:`));
      uniqueAnime.forEach(anime => {
        const score = anime.score ? anime.score : 'N/A';
        const genres = anime.genres.map(g => g.name).join(', ');
        console.log();
        console.log(chalk.bold.green(`- ${anime.title}`));
        if (genres) {
            console.log(chalk.yellow(`  ${genres}`));
        }
        console.log(chalk.magenta(`  Score: ${score}`));
      });

    } catch (error) {
      console.error(chalk.red('Failed to fetch anime schedule. Please try again later.'));
    n    }
  });

program.parse(process.argv);
