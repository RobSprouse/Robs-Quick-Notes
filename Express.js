// [x]: Application front end must connect to an Express.js back end.

// [x]: Application back end must store notes with unique IDs in a JSON file.

// [ ]: Application must be deployed to Heroku.

// COMMENT: Dependencies
import express from "express";
import { readFile, writeFile } from "fs/promises";
import { nanoid } from "nanoid";

const notesJSON = "./db/db.json";
const app = express();
const PORT = process.env.PORT || 3001;

// COMMENT: Middleware for parsing JSON and urlencoded form data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// COMMENT: Middleware for serving all the static files in the public folder
app.use(express.static("public"));

// [x]: * `GET /notes` should return the `notes.html` file.
// COMMENT: GET Route for notes page
app.get("/notes", (req, res) => {
     res.sendFile("./public/notes.html", { root: "." });
});

// [x]: `GET /api/notes` should read the `db.json` file and return all saved notes as JSON.
app.get("/api/notes", (req, res) => {
     res.sendFile(notesJSON, { root: "." });
});

// [x]: `POST /api/notes` should receive a new note to save on the request body, add it to
// the `db.json` file, and then return the new note to the client. You'll need to find a way
// to give each note a unique id when it's saved (look into npm packages that could do this for you).
app.post("/api/notes", async (req, res) => {
     const newNote = req.body;
     newNote.id = nanoid();
     try {
          const notesDb = await readFile(notesJSON, "utf-8");
          const notes = JSON.parse(notesDb);
          notes.push(newNote);
          await writeFile(notesJSON, JSON.stringify(notes, null, 2));
          res.status(201).json({ message: "Note created successfully" });
     } catch (err) {
          console.error(err, "API Failed, please try again.");
          res.status(500).json({ message: "API Failed, please try again." });
     }
});

// [x]:  As a bonus: `DELETE /api/notes/:id` should receive a query parameter containing the id of a note to delete.
// To delete a note, you'll need to read all notes from the `db.json` file, remove the note with the
// given `id` property, and then rewrite the notes to the `db.json` file.
// COMMENT: DELETE Route for deleting a note
app.delete("/api/notes/:id", async (req, res) => {
     const id = req.params.id;
     if (!id) {
          return res.status(400).json({ message: "No ID provided" });
     }
     try {
          const notesDB = await readFile(notesJSON, "utf-8");
          const notes = JSON.parse(notesDB);
          const updatedNotes = notes.filter((note) => note.id !== id);
          if (updatedNotes.length === notes.length) {
               return res.status(404).json({ message: "Note not found!" });
          }
          await writeFile(notesJSON, JSON.stringify(updatedNotes, null, 2));
          res.status(200).json({ message: "Note successfully deleted!" });
     } catch (err) {
          console.error(err, "API Failed, please try again.");
          res.status(500).json({ message: "API Failed, please try again." });
     }
});

// [x]: `GET *` should return the `index.html` file.
// COMMENT: GET Route for homepage (catch all)
app.get("*", (req, res) => {
     res.sendFile("./public/index.html", { root: "." });
});

// COMMENT: GET Route for homepage
app.listen(PORT, () => {
     console.log(`Server listening on port ${PORT}`);
});
