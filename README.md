# vamshi-anime-schedule

A sophisticated Node.js command-line interface (CLI) tool to fetch and display the TV anime schedule for a specific day.

## Description

`vamshi-anime-schedule` is a CLI tool that allows users to fetch and display the TV anime schedule for a specific day. It intelligently works around the limitations of the public Jikan API by performing date-based filtering on its own.

## Installation

```bash
npm install -g vamshi-anime-schedule
```

## Usage

```bash
vas get <when> [options]
```

## Commands

### `get <when>`

Fetches the anime schedule for a given day.

The `<when>` argument is mandatory and can be in one of three formats:

*   **Relative Offset:** A number string like `"0"`, `"-1"`, or `"2"`. `"0"` represents today, `"-1"` represents yesterday, and so on.
*   **Specific Date:** A date string in `YYYYMMDD` format, like `"20240506"`.
*   **Day of the Week:** A string like `"monday"`, `"tuesday"`, etc. This will resolve to the *next* upcoming instance of that day.

## Options

### `-g, --genre <genres>`

Filter results by genre. The flag accepts a single string containing one or more genres, separated by a semicolon (`;`). The genre matching is case-insensitive.

Example: `"Isekai;Supernatural;Action"`

## Examples

### Get today's schedule

```bash
vas get 0
```

### Get yesterday's schedule

```bash
vas get -1
```

### Get the schedule for a specific date

```bash
vas get 20240506
```

### Get the schedule for the next Monday

```bash
vas get monday
```

### Get the schedule for today and filter by genre

```bash
vas get 0 --genre "Action;Adventure"
```

## API

This tool uses the [Jikan API](https://api.jikan.moe/v4/schedules/{day}) to fetch the anime schedule.

## Dependencies

*   [axios](https://www.npmjs.com/package/axios)
*   [chalk](https://www.npmjs.com/package/chalk)
*   [commander](https://www.npmjs.com/package/commander)
*   [dayjs](https://www.npmjs.com/package/dayjs)

## License

ISC
