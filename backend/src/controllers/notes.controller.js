const noteModel = require('../models/notes.model');

function getUserId(req) {
  return req.user?._id || req.user?.id;
}

/**
 * @name createNoteController
 * @route POST /api/notes
 * @desc Create a new note
 * @access Private
 */
async function createNoteController(req, res) {
  const owner = getUserId(req);
  const { title, content, collaborators, isShared, shareToken } = req.body;

  if (!title || !content) {
    return res.status(400).json({ message: 'Title and content are required' });
  }

  try {
    const noteData = {
      title,
      content,
      owner,
      collaborators: Array.isArray(collaborators) ? collaborators : [],
      isShared: Boolean(isShared),
    };

    if (shareToken) {
      noteData.shareToken = shareToken;
    }

    const note = new noteModel(noteData);
    await note.save();

    res.status(201).json({ message: 'Note created successfully', note });
  } catch (error) {
    console.error('Error in createNoteController:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}

/**
 * @name getNotesController
 * @route GET /api/notes
 * @desc Get all notes for the authenticated user
 * @access Private
 */
async function getNotesController(req, res) {
  const userId = getUserId(req);

  try {
    const notes = await noteModel.find({
      $or: [{ owner: userId }, { collaborators: userId }],
    }).sort({ updatedAt: -1 });

    res.status(200).json({ notes });
  } catch (error) {
    console.error('Error in getNotesController:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}

/**
 * @name getNoteController
 * @route GET /api/notes/:id
 * @desc Get a single note by id
 * @access Private
 */
async function getNoteController(req, res) {
  const userId = getUserId(req);
  const noteId = req.params.id;

  try {
    const note = await noteModel.findById(noteId);

    if (!note) {
      return res.status(404).json({ message: 'Note not found' });
    }

    const isAuthorized = note.owner.equals(userId) || note.collaborators.some((collab) => collab.equals(userId));
    if (!isAuthorized) {
      return res.status(403).json({ message: 'Access denied' });
    }

    res.status(200).json({ note });
  } catch (error) {
    console.error('Error in getNoteController:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}

/**
 * @name updateNoteController
 * @route PUT /api/notes/:id
 * @desc Update a note by id
 * @access Private
 */
async function updateNoteController(req, res) {
  const userId = getUserId(req);
  const noteId = req.params.id;
  const { title, content, collaborators, isShared, shareToken } = req.body;

  try {
    const note = await noteModel.findById(noteId);

    if (!note) {
      return res.status(404).json({ message: 'Note not found' });
    }

    const isAuthorized = note.owner.equals(userId) || note.collaborators.some((collab) => collab.equals(userId));
    if (!isAuthorized) {
      return res.status(403).json({ message: 'Access denied' });
    }

    if (title !== undefined) note.title = title;
    if (content !== undefined) note.content = content;
    if (collaborators !== undefined) note.collaborators = Array.isArray(collaborators) ? collaborators : note.collaborators;
    if (isShared !== undefined) note.isShared = Boolean(isShared);
    if (shareToken !== undefined) note.shareToken = shareToken;

    await note.save();

    res.status(200).json({ message: 'Note updated successfully', note });
  } catch (error) {
    console.error('Error in updateNoteController:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}

/**
 * @name deleteNoteController
 * @route DELETE /api/notes/:id
 * @desc Delete a note by id
 * @access Private
 */
async function deleteNoteController(req, res) {
  const userId = getUserId(req);
  const noteId = req.params.id;

  try {
    const note = await noteModel.findById(noteId);

    if (!note) {
      return res.status(404).json({ message: 'Note not found' });
    }

    if (!note.owner.equals(userId)) {
      return res.status(403).json({ message: 'Only the note owner can delete this note' });
    }

    await noteModel.findByIdAndDelete(noteId);

    res.status(200).json({ message: 'Note deleted successfully' });
  } catch (error) {
    console.error('Error in deleteNoteController:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}

module.exports = {
  createNoteController,
  getNotesController,
  getNoteController,
  updateNoteController,
  deleteNoteController,
};
