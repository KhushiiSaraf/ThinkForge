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
import { useAI } from '../hooks/useAI'
import { toast } from 'react-toastify'
import EditorTopBar from '../components/EditorTopBar'
import AIGenerateBar from '../components/AIGenerateBar'
import SelectionPopup from '../components/SelectionPopup'
import '../styles/editor.css'

function Toolbar({ editor }) {
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
    </div>
  )
}

export default function NoteEditor() {
  const { id } = useParams()
  const { handleGetNote, handleUpdateNote, currentNote } = useNotes()
  const { handleGenerate, handleRewrite, loading: aiLoading } = useAI()
  const [title, setTitle] = useState('Untitled')
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(true)

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
    onUpdate: () => {
      setSaved(false) // any edit marks note as unsaved
    },
  })

  // Load note on mount
  useEffect(() => {
    if (id) handleGetNote(id)
  }, [id])

  // Once note loads, populate editor and title
  useEffect(() => {
    if (currentNote && editor) {
      setTitle(currentNote.title || 'Untitled')
      if (currentNote.content && Object.keys(currentNote.content).length > 0) {
        editor.commands.setContent(currentNote.content)
      }
      setSaved(true)
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
    setSaved(true)
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

  // Title change also marks unsaved
  const handleTitleChange = (newTitle) => {
    setTitle(newTitle)
    setSaved(false)
  }

  // AI Generate — inserts text at current cursor position
  const handleAIGenerate = async (prompt) => {
    const text = await handleGenerate(prompt)
    if (text && editor) {
      editor.chain().focus().insertContent(`<p>${text}</p>`).run()
      setSaved(false)
    } else {
      toast.error('AI generation failed')
    }
  }

  // AI Rewrite — replaces selected text with rewritten text
  const handleAIRewrite = async (selectedText, instruction, from, to) => {
    const text = await handleRewrite(selectedText, instruction)
    if (text && editor) {
        editor.chain().focus().deleteRange({ from, to }).insertContentAt(from, `${text}`).run()
        setSaved(false)
    } else {
        toast.error('Rewrite failed')
    }
  }
  //web search
  const handleSearchWeb = (text) => {
    console.log('search web for:', text) // we will wire this in Phase 3
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <EditorTopBar
        title={title}
        setTitle={handleTitleChange}
        saving={saving}
        saved={saved}
        onSave={handleSave}
      />

      <SelectionPopup
      editor={editor}
      onRewrite={handleAIRewrite}
      onSearchWeb={handleSearchWeb}
      aiLoading={aiLoading}
      />

      <div className="max-w-3xl mx-auto px-6 py-8">
        <Toolbar editor={editor} />
        <EditorContent editor={editor} />
      </div>

      <AIGenerateBar onGenerate={handleAIGenerate} loading={aiLoading} />
    </div>
  )
}