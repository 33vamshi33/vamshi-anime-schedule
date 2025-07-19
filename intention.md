A comprehensive prompt designed to guide any advanced LLM to build the `vamshi-anime-schedule` CLI tool exactly as you've envisioned.

This prompt is structured to be a complete blueprint, leaving no room for ambiguity. It covers the project's purpose, technical stack, command-line interface design, core logic for handling API limitations, and the expected output format.

---

### LLM Prompt: Build a Sophisticated Node.js CLI for Anime Schedules

**Project Goal:**

Create a publishable Node.js Command-Line Interface (CLI) tool named `vamshi-anime-schedule`. This tool will allow users to fetch and display the TV anime schedule for a specific day. The CLI must be intelligent enough to work around the limitations of the public Jikan API by performing date-based filtering on its own.

**Core Technical Stack:**

*   **Language:** JavaScript (using modern ES Module syntax: `import`/`export`)
*   **Platform:** Node.js
*   **CLI Framework:** `commander.js`
*   **HTTP Client:** `axios`
*   **Date/Time Manipulation:** `dayjs`
*   **Terminal Styling:** `chalk`

**Key Functionality & Requirements:**

1.  **Package Name & Command:**
    *   The npm package name must be `vamshi-anime-schedule`.
    *   The executable command registered in `package.json` must be `vas`.

2.  **API Integration (The Core Challenge):**
    *   The tool must use the **Jikan API's schedule endpoint**: `https://api.jikan.moe/v4/schedules/{day}`.
    *   **Crucial Logic:** You must acknowledge that this endpoint only accepts a day of the week (e.g., "monday"). The CLI's main feature is to overcome this. The implementation must follow this sequence:
        1.  Parse the user's date input (e.g., `2024-05-06`) to determine its corresponding day of the week (e.g., "monday").
        2.  Fetch the *entire* schedule for that day of the week from the Jikan API.
        3.  **Client-Side Filtering:** Iterate through the fetched list of anime. For each anime, inspect its `aired` object, which contains `from` and `to` date-time strings.
        4.  Filter out any anime where the user's target date does not fall within the `aired.from` and `aired.to` range. An anime is considered "airing" on the target date if `targetDate >= from` and (`to` is `null` OR `targetDate <= to`).

3.  **Command-Line Interface Design:**

    The primary command should be `vas get`. It must accept a single argument and an optional flag.

    *   **Command:** `vas get <when>`
    *   **Argument `<when>`:** This is a mandatory argument specifying the target day. It must handle three distinct input formats:
        *   **Relative Offset:** A number string like `"0"`, `"-1"`, or `"2"`. `"0"` is today, `"-1"` is yesterday, etc.
        *   **Specific Date:** A date string in `YYYYMMDD` format, like `"20240506"`.
        *   **Day of the Week:** A string like `"monday"`, `"tuesday"`, etc. This should resolve to the *next* upcoming instance of that day.
    *   **Option `-g, --genre <genres>`:**
        *   This is an optional flag for filtering results by genre.
        *   It accepts a single string containing one or more genres, separated by a **semicolon** (`;`). Example: `"Isekai;Supernatural;Action"`.
        *   The genre matching should be case-insensitive.
        *   If an anime has at least one of the specified genres, it should be included in the final list.

4.  **Date Parsing and Handling:**
    *   Use the `dayjs` library for all date operations. You will need the `customParseFormat` plugin to handle the `YYYYMMDD` format.
    *   Create a dedicated function, `parseUserInputDate(when)`, that takes the user's `<when>` string and robustly returns a valid `dayjs` object or `null` if the format is invalid.

5.  **Output and Styling:**
    *   Use the `chalk` library to make the output clear and visually appealing.
    *   **Loading State:** Before printing results, display a message like: `Fetching schedule for Monday, May 6, 2024...` (use a blue color).
    *   **Results Header:** Display a clear header for the results: `Anime airing on 2024-05-06:` (use a cyan, underlined color).
    *   **Anime Entry Format:** Each anime in the list should be formatted as follows:
        ```
        - [Anime Title]      (in bold green)
          [Genre 1, Genre 2] (in yellow)
          Score: [X.XX]      (in magenta)
        ```
        (Add a newline after each entry for readability).
    *   **No Results:** If no anime match the criteria for a given day, print a helpful message like `No anime found for this date matching your criteria.` (in yellow).
    *   **Error Handling:** If the API call fails or the user input is invalid, print a clear error message to the console (in red).

**Final Deliverable:**

Provide the complete, single-file code for `index.js` that implements all the functionalities described above. The code should be well-commented, especially the date parsing and client-side filtering logic, as this is the most critical part of the project. Include the final `package.json` file configured with the correct name, version, description, type (`module`), and the `bin` entry for the `vas` command.