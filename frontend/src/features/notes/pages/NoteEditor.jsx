import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Underline from '@tiptap/extension-underline'
import Link from '@tiptap/extension-link'
import { Color } from '@tiptap/extension-color'
import { TextStyle } from '@tiptap/extension-text-style'
import Highlight from '@tiptap/extension-highlight'
import { useEffect, useState, useCallback } from 'react'
import { useParams } from 'react-router-dom'
import { useNotes } from '../hooks/useNotes'
import { toast } from 'react-toastify'
import '../styles/editor.css'

function Toolbar({ editor, onSave, saving }) {
  if (!editor) return null

  return (
    <div style={{ display: 'flex', gap: '8px', marginBottom: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
      <button onClick={() => editor.chain().focus().toggleBold().run()}>Bold</button>
      <button onClick={() => editor.chain().focus().toggleItalic().run()}>Italic</button>
      <button onClick={() => editor.chain().focus().toggleUnderline().run()}>Underline</button>
      <button onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}>H1</button>
      <button onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}>H2</button>
      <button onClick={() => editor.chain().focus().toggleBulletList().run()}>Bullet List</button>
      <button onClick={() => editor.chain().focus().toggleOrderedList().run()}>Numbered List</button>
      <button onClick={() => editor.chain().focus().toggleCodeBlock().run()}>Code</button>
      <button onClick={() => editor.chain().focus().toggleHighlight().run()}>Highlight</button>
      <input
        type="color"
        onInput={(e) => editor.chain().focus().setColor(e.target.value).run()}
        title="Text color"
      />
      <button onClick={() => {
        const url = window.prompt('Enter URL')
        if (url) editor.chain().focus().setLink({ href: url }).run()
      }}>Link</button>
      <button onClick={() => editor.chain().focus().unsetLink().run()}>Unlink</button>

      {/* Save button */}
      <button onClick={onSave} disabled={saving} style={{ marginLeft: 'auto' }}>
        {saving ? 'Saving...' : 'Save'}
      </button>
    </div>
  )
}

export default function NoteEditor() {
  const { id } = useParams()
  const { handleGetNote, handleUpdateNote, currentNote } = useNotes()
  const [title, setTitle] = useState('Untitled')
  const [saving, setSaving] = useState(false)

  const editor = useEditor({
    extensions: [
      StarterKit.configure({ heading: { levels: [1, 2, 3] } }),
      Underline,
      Link.configure({ openOnClick: false }),
      TextStyle,
      Color,
      Highlight.configure({ multicolor: false }),
    ],
    content: '',
  })

  // Load note on mount
  useEffect(() => {
    if (id) handleGetNote(id)
  }, [id])

  // Once note loads, populate editor and title
  useEffect(() => {
    if (currentNote && editor) {
      setTitle(currentNote.title || 'Untitled')
      // only set content if editor is empty (avoid overwriting while typing)
      if (currentNote.content && Object.keys(currentNote.content).length > 0) {
        editor.commands.setContent(currentNote.content)
      }
    }
  }, [currentNote, editor])

  // Save function
  const handleSave = useCallback(async () => {
    if (!id || !editor) return
    setSaving(true)
    await handleUpdateNote(id, {
      title,
      content: editor.getJSON()
    })
    toast.success('Note saved')
    setSaving(false)
  }, [id, editor, title, handleUpdateNote])

  // Ctrl+S
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault()
        handleSave()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handleSave])

  return (
    <div>
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Untitled"
        style={{ fontSize: '1.5rem', fontWeight: 'bold', border: 'none', outline: 'none', marginBottom: '8px', width: '100%' }}
      />
      <Toolbar editor={editor} onSave={handleSave} saving={saving} />
      <EditorContent editor={editor} />
    </div>
  )
}