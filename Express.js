// COMMENT: Dependencies
import express from "express";
import { readFile, writeFile } from "fs/promises";
import { nanoid } from "nanoid";

// COMMENT: Constant declarations
const notesJSON = "./db/db.json";
const app = express();
const PORT = process.env.PORT || 3001;

// COMMENT: Middleware for parsing JSON, urlencoded form data, and serving static files
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

// COMMENT: GET Route for notes html page
app.get("/notes", (req, res) => {
     res.sendFile("./public/notes.html", { root: "." });
});

// COMMENT: GET Route for retrieving all notes
app.get("/api/notes", (req, res) => {
     res.sendFile(notesJSON, { root: "." });
});

// COMMENT: POST Route for saving a note
app.post("/api/notes", async (req, res) => {
     try {
          const newNoteBody = req.body;
          const newNote = {
               id: nanoid(),
               title: newNoteBody.title,
               text: newNoteBody.text,
          };
          const notesDb = await readFile(notesJSON, "utf-8");
          const notes = JSON.parse(notesDb);
          notes.push(newNote);
          await writeFile(notesJSON, JSON.stringify(notes, null, 2));
          res.status(201).json(newNote);
     } catch (err) {
          console.error(err, "API Failed, please try again.");
          res.status(500).json({ message: "API Failed, please try again." });
     }
});

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
          res.status(200).json({ message: "Deleted" });
     } catch (err) {
          console.error(err, "API Failed, please try again.");
          res.status(500).json({ message: "API Failed, please try again." });
     }
});

// COMMENT: GET Route for homepage (catch all for undefined routes)
app.get("*", (_, res) => {
     res.sendFile("./public/index.html", { root: "." });
});

// COMMENT: Starts server and assigns port
app.listen(PORT, () => {
     console.log(`Server listening on port ${PORT}`);
});
