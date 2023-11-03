// [ ]: Application front end must connect to an Express.js back end.

// [ ]: Application back end must store notes with unique IDs in a JSON file.

// [ ]: Application must be deployed to Heroku.

// COMMENT: Dependencies
import express from "express";
import path from "path";
import fs from "fs";
import { nanoid } from "nanoid";

const app = express();
const PORT = process.env.PORT || 3001;

// COMMENT: Middleware for parsing JSON and urlencoded form data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// COMMENT: Middleware for serving all the static files in the public folder
app.use(express.static("public"));

// COMMENT: GET Route for homepage
app.listen(PORT, () => {
     console.log(`Server listening on port http://localhost:${PORT}`);
});

// [x]: * `GET /notes` should return the `notes.html` file.
// COMMENT: GET Route for notes page
app.get("/notes", (req, res) => {
     res.sendFile("./notes.html", { root: "." });
});

// [x]: `GET /api/notes` should read the `db.json` file and return all saved notes as JSON.
app.get("/api/notes", (req, res) => {
     res.sendFile("./db/db.json", { root: "." });
});

// [ ]: `POST /api/notes` should receive a new note to save on the request body, add it to
// the `db.json` file, and then return the new note to the client. You'll need to find a way
// to give each note a unique id when it's saved (look into npm packages that could do this for you).

// FIXME: This route is working but need to have the response not produce an error
app.post("/api/notes", (req, res) => {
     const newNote = req.body;
     newNote.id = nanoid();
     fs.readFile("./db/db.json", "utf8", (err, notesDb) => {
          if (err) {
               console.error(err);
               return res.sendStatus(500);
          }
          const notes = JSON.parse(notesDb);
          notes.push(newNote);
          fs.writeFile("./db/db.json", JSON.stringify(notes), (err) => {
               if (err) {
                    console.error(err);
                    return res.sendStatus(500);
               }
          });
     });
});

// [ ]:  As a bonus: `DELETE /api/notes/:id` should receive a query parameter containing the id of a note to delete.
// To delete a note, you'll need to read all notes from the `db.json` file, remove the note with the
// given `id` property, and then rewrite the notes to the `db.json` file.

// [ ]: `GET *` should return the `index.html` file.
// BUG: This route is not working, was working before change from ES5 to ES6
// app.get("*", (req, res) => {
//      res.sendFile("./public/index.html", { root: "." });
// });
