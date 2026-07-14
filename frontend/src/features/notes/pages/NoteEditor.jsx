import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Underline from '@tiptap/extension-underline'
import Link from '@tiptap/extension-link'
import { Color } from '@tiptap/extension-color'
import { TextStyle } from '@tiptap/extension-text-style'
import Highlight from '@tiptap/extension-highlight'
import { useEffect, useState, useCallback } from 'react'
import { useParams } from 'react-router-dom'
import { 
  Bold, Italic, Underline as UnderlineIcon, Heading1, Heading2, 
  List, ListOrdered, Code, Highlighter, Link as LinkIcon, 
  Unlink, GitFork
} from 'lucide-react'
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
import { marked } from 'marked'
import '../styles/editor.css'
import { useSocket } from '../hooks/useSocket'
import { useAuth } from '../../auth/hooks/useAuth'

function Toolbar({ editor, onDiagramClick }) {
  if (!editor) return null

  const btnClass = (active) => 
    `p-2 rounded-lg transition ${active 
      ? 'bg-indigo-50 text-indigo-600' 
      : 'text-slate-500 hover:bg-slate-100 hover:text-slate-700'
    }`

  return (
    <div className="flex items-center gap-1 mb-4 p-2 bg-white border border-slate-200 rounded-xl flex-wrap">
      
      <button title="Bold" className={btnClass(editor.isActive('bold'))}
        onClick={() => editor.chain().focus().toggleBold().run()}>
        <Bold size={16} />
      </button>

      <button title="Italic" className={btnClass(editor.isActive('italic'))}
        onClick={() => editor.chain().focus().toggleItalic().run()}>
        <Italic size={16} />
      </button>

      <button title="Underline" className={btnClass(editor.isActive('underline'))}
        onClick={() => editor.chain().focus().toggleUnderline().run()}>
        <UnderlineIcon size={16} />
      </button>

      <button title="Heading 1" className={btnClass(editor.isActive('heading', { level: 1 }))}
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}>
        <Heading1 size={16} />
      </button>

      <button title="Heading 2" className={btnClass(editor.isActive('heading', { level: 2 }))}
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}>
        <Heading2 size={16} />
      </button>

      <button title="Bullet List" className={btnClass(editor.isActive('bulletList'))}
        onClick={() => editor.chain().focus().toggleBulletList().run()}>
        <List size={16} />
      </button>

      <button title="Numbered List" className={btnClass(editor.isActive('orderedList'))}
        onClick={() => editor.chain().focus().toggleOrderedList().run()}>
        <ListOrdered size={16} />
      </button>

      <button title="Code Block" className={btnClass(editor.isActive('codeBlock'))}
        onClick={() => editor.chain().focus().toggleCodeBlock().run()}>
        <Code size={16} />
      </button>

      <button title="Highlight" className={btnClass(editor.isActive('highlight'))}
        onClick={() => editor.chain().focus().toggleHighlight().run()}>
        <Highlighter size={16} />
      </button>

      <button title="Add Link" className={btnClass(editor.isActive('link'))}
        onClick={() => {
          const url = window.prompt('Enter URL')
          if (url) editor.chain().focus().setLink({ href: url }).run()
        }}>
        <LinkIcon size={16} />
      </button>

      <button title="Remove Link" className={btnClass(false)}
        onClick={() => editor.chain().focus().unsetLink().run()}>
        <Unlink size={16} />
      </button>

      <button title="Generate Diagram" className={btnClass(false)} onClick={onDiagramClick}>
        <GitFork size={16} />
      </button>

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
    onUpdate: ({ editor }) => {
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
  
  // Socket for real-time collaboration
  const { user } = useAuth()
  const { emitUpdate } = useSocket(id, user, editor)
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
        const html = marked(text)
        editor.chain().focus().insertContent(html).run()
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

  //Watches editor changes:
  useEffect(() => {
    if (!editor) return
    const handler = () => {
        emitUpdate(editor.getJSON())
    }
    editor.on('update', handler)
    return () => editor.off('update', handler)
  }, [editor, emitUpdate])

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