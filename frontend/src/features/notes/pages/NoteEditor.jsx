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
import WebSearchPanel from '../components/WebSearchPanel'
import DiagramModal from '../components/DiagramModal'
import Image from '@tiptap/extension-image'
import Placeholder from '@tiptap/extension-placeholder'
import '../styles/editor.css'

function Toolbar({ editor, onDiagramClick }) {
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
      <button onClick={() => {
          console.log('diagram clicked')
          onDiagramClick()
      }}>Diagram</button>
    </div>
  )
}

export default function NoteEditor() {
  const { id } = useParams()
  const { handleGetNote, handleUpdateNote, currentNote } = useNotes()
  const { handleGenerate, handleRewrite,handleGenerateDiagram, loading: aiLoading } = useAI()
  const [title, setTitle] = useState('Untitled')
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(true)

  //web search state
  const [searchQuery, setSearchQuery] = useState('')

  //Diagram state
  const [diagramModalOpen, setDiagramModalOpen] = useState(false)

  const editor = useEditor({
    extensions: [
      StarterKit.configure({ heading: { levels: [1, 2, 3] } }),
      Underline,
      Link.configure({ openOnClick: false }),
      TextStyle,
      Color,
      Highlight.configure({ multicolor: false }),
      Image,
      Placeholder.configure({
        placeholder: 'Start writing your note...',
    }),
    ],
    content: '',
    onUpdate: () => {
      setSaved(false) // any edit marks note as unsaved
    },
    editorProps: {
    handlePaste(view, event) {
        const items = event.clipboardData?.items
        if (!items) return false

        for (const item of items) {
            if (item.type.startsWith('image/')) {
                const file = item.getAsFile()
                const reader = new FileReader()
                reader.onload = (e) => {
                    view.dispatch(view.state.tr.replaceSelectionWith(
                        view.state.schema.nodes.image.create({ src: e.target.result })
                    ))
                }
                reader.readAsDataURL(file)
                return true
            }
        }
        return false
    }   
  }
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
    setSearchQuery(text)
}

  const handleInsertSnippet = (snippet) => {
      if (editor) {
          editor.chain().focus().insertContent(`<p>${snippet}</p>`).run()
          setSaved(false)
      }
  }

  //Diagram
    const handleInsertDiagram = (svg) => {
        if (editor) {
            const base64 = `data:image/svg+xml;base64,${btoa(unescape(encodeURIComponent(svg)))}`
            editor.chain().focus().setImage({ src: base64 }).run()
            setSaved(false)
        }
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

        <div className="flex">
            {/* Editor area */}
            <div className="flex-1 max-w-3xl mx-auto px-6 py-8">
                <Toolbar editor={editor} onDiagramClick={() => setDiagramModalOpen(true)} />
                <EditorContent editor={editor} />
            </div>

            {/* Web Search Panel */}
            <WebSearchPanel
               onInsert={handleInsertSnippet}
               initialQuery={searchQuery}
            />
        </div>

        <SelectionPopup
            editor={editor}
            onRewrite={handleAIRewrite}
            onSearchWeb={handleSearchWeb}
            aiLoading={aiLoading}
        />

        <AIGenerateBar onGenerate={handleAIGenerate} loading={aiLoading} />

        {diagramModalOpen && (
            <DiagramModal
                onClose={() => setDiagramModalOpen(false)}
                onInsert={handleInsertDiagram}
                onGenerate={handleGenerateDiagram}
                loading={aiLoading}
            />
        )}
     </div>
)
}