import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Underline from '@tiptap/extension-underline'
import Link from '@tiptap/extension-link'
import { Color } from '@tiptap/extension-color'
import { TextStyle } from '@tiptap/extension-text-style'
import Highlight from '@tiptap/extension-highlight'
import { useEffect, useState, useCallback } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { 
  Bold, Italic, Underline as UnderlineIcon, Heading1, Heading2, 
  List, ListOrdered, Code, Highlighter, Link as LinkIcon, 
  Unlink, GitFork
} from 'lucide-react'
import { useNotes } from '../hooks/useNotes'
import { useAI } from '../hooks/useAi'
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
import ShareModal from '../components/ShareModal'
import ConfirmDialog from '../components/ConfirmDialog'
import LinkDialog from '../components/LinkDialog'
import { usePdfRag } from '../hooks/usePdfRag'
import { common, createLowlight } from 'lowlight'
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight'

function Toolbar({ editor, onDiagramClick, onLinkClick }) {
  const [, refreshToolbar] = useState(0)

  useEffect(() => {
    if (!editor) return

    const updateToolbar = () => refreshToolbar((value) => value + 1)
    editor.on('transaction', updateToolbar)
    editor.on('selectionUpdate', updateToolbar)

    return () => {
      editor.off('transaction', updateToolbar)
      editor.off('selectionUpdate', updateToolbar)
    }
  }, [editor])

  if (!editor) return null

  const btnClass = (active) => 
    `p-2 rounded-lg transition shrink-0 ${active 
      ? 'bg-indigo-50 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-300' 
      : 'text-slate-500 hover:bg-slate-100 hover:text-slate-700 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-100'
    }`

  return (
    <div onMouseDown={(event) => event.preventDefault()} className="editor-toolbar mb-4 flex flex-wrap items-center gap-1 overflow-x-auto rounded-xl border border-slate-200 bg-white p-2 transition-colors duration-300 dark:border-slate-800 dark:bg-slate-900">
      
      <button type="button" title="Bold" aria-pressed={editor.isActive('bold')} className={btnClass(editor.isActive('bold'))}
        onClick={() => editor.chain().focus().toggleBold().run()}>
        <Bold size={16} />
      </button>

      <button type="button" title="Italic" aria-pressed={editor.isActive('italic')} className={btnClass(editor.isActive('italic'))}
        onClick={() => editor.chain().focus().toggleItalic().run()}>
        <Italic size={16} />
      </button>

      <button type="button" title="Underline" aria-pressed={editor.isActive('underline')} className={btnClass(editor.isActive('underline'))}
        onClick={() => editor.chain().focus().toggleUnderline().run()}>
        <UnderlineIcon size={16} />
      </button>

      <button type="button" title="Heading 1" aria-pressed={editor.isActive('heading', { level: 1 })} className={btnClass(editor.isActive('heading', { level: 1 }))}
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}>
        <Heading1 size={16} />
      </button>

      <button type="button" title="Heading 2" aria-pressed={editor.isActive('heading', { level: 2 })} className={btnClass(editor.isActive('heading', { level: 2 }))}
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}>
        <Heading2 size={16} />
      </button>

      <button type="button" title="Bullet List" aria-pressed={editor.isActive('bulletList')} className={btnClass(editor.isActive('bulletList'))}
        onClick={() => editor.chain().focus().toggleBulletList().run()}>
        <List size={16} />
      </button>

      <button type="button" title="Numbered List" aria-pressed={editor.isActive('orderedList')} className={btnClass(editor.isActive('orderedList'))}
        onClick={() => editor.chain().focus().toggleOrderedList().run()}>
        <ListOrdered size={16} />
      </button>

      <button type="button" title="Code Block" aria-pressed={editor.isActive('codeBlock')} className={btnClass(editor.isActive('codeBlock'))}
        onClick={() => editor.chain().focus().toggleCodeBlock().run()}>
        <Code size={16} />
      </button>

      <button type="button" title="Highlight" aria-pressed={editor.isActive('highlight')} className={btnClass(editor.isActive('highlight'))}
        onClick={() => editor.chain().focus().toggleHighlight().run()}>
        <Highlighter size={16} />
      </button>

      <button type="button" title="Add Link" aria-pressed={editor.isActive('link')} className={btnClass(editor.isActive('link'))}
        onClick={onLinkClick}>
        <LinkIcon size={16} />
      </button>

      <button type="button" title="Remove Link" aria-pressed="false" className={btnClass(false)}
        onClick={() => editor.chain().focus().unsetLink().run()}>
        <Unlink size={16} />
      </button>

      <button type="button" title="Generate Diagram" aria-pressed="false" className={btnClass(false)} onClick={onDiagramClick}>
        <GitFork size={16} />
      </button>

          </div>
        )
}
export default function NoteEditor() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { handleGetNote, handleUpdateNote, currentNote } = useNotes()
  const { handleGenerate, handleRewrite,handleGenerateDiagram, loading: aiLoading } = useAI()
  const [title, setTitle] = useState('Untitled')
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(true)
  const lowlight = createLowlight(common)

  //web search state
  const [searchQuery, setSearchQuery] = useState('')

  //Diagram state
  const [diagramModalOpen, setDiagramModalOpen] = useState(false)

  // Share modal state
  const [shareModalOpen, setShareModalOpen] = useState(false)

  // Leave editor confirmation state
  const [leaveConfirmOpen, setLeaveConfirmOpen] = useState(false)

  // Link dialog state
  const [linkDialogOpen, setLinkDialogOpen] = useState(false)
  const [linkUrl, setLinkUrl] = useState('')

  // Note Owner check
  const [isSharedNote, setIsSharedNote] = useState(false)
  const [noteOwner, setNoteOwner] = useState(null)

  const editor = useEditor({
    extensions: [
      StarterKit.configure({ 
      heading: { levels: [1, 2, 3] },
      codeBlock: false, // disable default codeBlock
    }),
    CodeBlockLowlight.configure({
        lowlight,
      defaultLanguage: 'javascript',
    }),
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
  //Pdf
  const {
    pdfStatus, fileName, chunkCount, checkingExisting,
    uploading, asking, answer, sources,
    handleUploadPdf, handleAskQuestion, handlePdfStatusUpdate, clearAnswer,
  } = usePdfRag(id)

  const { user } = useAuth()
  const { emitUpdate } = useSocket(id, user, editor, { onPdfStatus: handlePdfStatusUpdate })
  
  
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

      // check if this is a shared note
      const ownerId = currentNote.owner?._id || currentNote.owner
      if (String(ownerId) !== String(user?.id)) {
        setIsSharedNote(true)
        setNoteOwner(currentNote.owner?.name)
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

  const handleOpenLinkDialog = () => {
    setLinkUrl(editor?.getAttributes('link').href || '')
    setLinkDialogOpen(true)
  }

  const handleApplyLink = (url) => {
    if (!editor || !url) return
    editor.chain().focus().setLink({ href: url }).run()
    setLinkDialogOpen(false)
    setSaved(false)
  }

  const handleBackNavigation = () => {
    if (!saved) {
      setLeaveConfirmOpen(true)
      return
    }

    navigate('/dashboard')
  }

  const confirmLeaveEditor = () => {
    setLeaveConfirmOpen(false)
    navigate('/dashboard')
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
    //PDF
    const handleInsertPdfAnswer = (answerText) => {
      if (editor) {
        editor.chain().focus().insertContent(`<p>${answerText}</p>`).run()
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
    <div className="min-h-screen bg-slate-50 text-slate-900 transition-colors duration-300 dark:bg-slate-950 dark:text-white">
        <EditorTopBar
          title={title}
          setTitle={handleTitleChange}
          saving={saving}
          saved={saved}
          onSave={handleSave}
          onShareClick={() => setShareModalOpen(true)}
          onBackClick={handleBackNavigation}
        />

        {isSharedNote && noteOwner && (
            <div className="border-b border-indigo-100 bg-indigo-50 px-4 py-2 transition-colors duration-300 dark:border-indigo-900/40 dark:bg-indigo-900/20 sm:px-6">
                <span className="text-xs font-medium text-indigo-600 dark:text-indigo-300">
                    Shared document — originally created by {noteOwner}
                </span>
            </div>
        )}

        <div className="flex flex-col gap-6 px-4 py-4 sm:px-6 sm:py-8 lg:flex-row">
            {/* Editor area */}
            <div className="editor-workspace mx-auto flex w-full max-w-3xl flex-1 flex-col lg:min-h-0">
              <Toolbar 
                  editor={editor} 
                  onDiagramClick={() => setDiagramModalOpen(true)} 
                onLinkClick={handleOpenLinkDialog}
              /> 
               <div className="editor-document-scroll w-full min-h-0 flex-1 rounded-2xl border border-slate-200 bg-white shadow-sm transition-colors duration-300 dark:border-slate-800 dark:bg-slate-900">
                    <EditorContent editor={editor} />
                </div>
            </div>

            {/* Web Search Panel */}
            <div className="w-full lg:w-auto lg:min-w-[320px]">
                <WebSearchPanel
                   onInsert={handleInsertSnippet}
                   initialQuery={searchQuery}
                />
            </div>
        </div>

        <SelectionPopup
            editor={editor}
            onRewrite={handleAIRewrite}
            onSearchWeb={handleSearchWeb}
            aiLoading={aiLoading}
        />

        <AIGenerateBar
          onGenerate={handleAIGenerate}
          loading={aiLoading}
          isPro={user?.plan === 'pro'}
          pdfStatus={pdfStatus}
          fileName={fileName}
          checkingExisting={checkingExisting}
          uploading={uploading}
          asking={asking}
          answer={answer}
          onUploadPdf={handleUploadPdf}
          onAskPdf={handleAskQuestion}
          onInsertAnswer={handleInsertPdfAnswer}
          onDismissAnswer={clearAnswer} 
        />

        {diagramModalOpen && (
            <DiagramModal
                onClose={() => setDiagramModalOpen(false)}
                onInsert={handleInsertDiagram}
                onGenerate={handleGenerateDiagram}
                loading={aiLoading}
            />
        )}

        {shareModalOpen && (
            <ShareModal
                noteId={id}
                onClose={() => setShareModalOpen(false)}
            />
        )}

        {leaveConfirmOpen && (
            <ConfirmDialog
                title="Leave editor?"
                message="You have unsaved changes. If you leave now, they will be lost."
                confirmText="Leave without saving"
                danger
                onConfirm={confirmLeaveEditor}
                onCancel={() => setLeaveConfirmOpen(false)}
            />
        )}

        {linkDialogOpen && (
          <LinkDialog
            initialUrl={linkUrl}
            onApply={handleApplyLink}
            onClose={() => setLinkDialogOpen(false)}
          />
        )}
     </div>
)
}