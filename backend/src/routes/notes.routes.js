const express = require('express');
const notesRouter = express.Router();

const {
  createNoteController,
  getNotesController,
  getNoteController,
  updateNoteController,
  deleteNoteController,
} = require('../controllers/notes.controller');

const { authMiddleware } = require('../middleware/auth.middleware');

/**
 * @route POST /api/notes
 * @desc Create a new note
 * @access Private
 */
notesRouter.post('/', authMiddleware, createNoteController);

/**
 * @route GET /api/notes
 * @desc Get all notes for the authenticated user
 * @access Private
 */
notesRouter.get('/', authMiddleware, getNotesController);

/**
 * @route GET /api/notes/:id
 * @desc Get a single note by id
 * @access Private
 */
notesRouter.get('/:id', authMiddleware, getNoteController);

/**
 * @route PUT /api/notes/:id
 * @desc Update a note by id
 * @access Private
 */
notesRouter.put('/:id', authMiddleware, updateNoteController);

/**
 * @route DELETE /api/notes/:id
 * @desc Delete a note by id
 * @access Private
 */
notesRouter.delete('/:id', authMiddleware, deleteNoteController);

module.exports = notesRouter;
