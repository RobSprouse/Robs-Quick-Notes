// COMMENT: Dependencies
const express = require("express");
const app = express();
const path = require("path");
const PORT = process.env.PORT || 3001;

// COMMENT: Middleware for parsing JSON and urlencoded form data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// COMMENT: Middleware for serving all the static files in the public folder
app.use("/", express.static("public"));

// COMMENT: GET Route for homepage
app.listen(PORT, () => {
     console.log(`Server listening on port http://localhost:${PORT}`);
});

// [ ]: * `GET /notes` should return the `notes.html` file.

// [ ]: `GET *` should return the `index.html` file.

// [ ]: `GET /api/notes` should read the `db.json` file and return all saved notes as JSON.

// [ ]: `POST /api/notes` should receive a new note to save on the request body, add it to
// the `db.json` file, and then return the new note to the client. You'll need to find a way
// to give each note a unique id when it's saved (look into npm packages that could do this for you).

// [ ]:  As a bonus: `DELETE /api/notes/:id` should receive a query parameter containing the id of a note to delete.
// To delete a note, you'll need to read all notes from the `db.json` file, remove the note with the
// given `id` property, and then rewrite the notes to the `db.json` file.

// [ ]: Application front end must connect to an Express.js back end.

// [ ]: Application back end must store notes with unique IDs in a JSON file.

// [ ]: Application must be deployed to Heroku.
