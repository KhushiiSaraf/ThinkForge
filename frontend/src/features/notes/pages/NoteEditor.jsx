import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Underline from '@tiptap/extension-underline'
import Link from '@tiptap/extension-link'
import { Color } from '@tiptap/extension-color'
import {TextStyle} from '@tiptap/extension-text-style'
import Highlight from '@tiptap/extension-highlight'
import '../styles/editor.css'

function Toolbar({ editor }) {
  if (!editor) return null

  return (
    <div style={{ display: 'flex', gap: '8px', marginBottom: '8px', flexWrap: 'wrap' }}>
      <button onClick={() => editor.chain().focus().toggleBold().run()}>Bold</button>
      <button onClick={() => editor.chain().focus().toggleItalic().run()}>Italic</button>
      <button onClick={() => editor.chain().focus().toggleUnderline().run()}>Underline</button>
      <button onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}>H1</button>
      <button onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}>H2</button>
      <button onClick={() => editor.chain().focus().toggleBulletList().run()}>Bullet List</button>
      <button onClick={() => editor.chain().focus().toggleOrderedList().run()}>Numbered List</button>
      <button onClick={() => editor.chain().focus().toggleCodeBlock().run()}>Code</button>
      <button onClick={() => editor.chain().focus().toggleHighlight().run()}>Highlight</button>

      {/* Text color */}
      <input
        type="color"
        onInput={(e) => editor.chain().focus().setColor(e.target.value).run()}
        title="Text color"
      />

      {/* Link */}
      <button onClick={() => {
        const url = window.prompt('Enter URL')
        if (url) editor.chain().focus().setLink({ href: url }).run()
      }}>Link</button>

      <button onClick={() => editor.chain().focus().unsetLink().run()}>Unlink</button>
    </div>
  )
}

export default function NoteEditor() {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({ heading: { levels: [1, 2, 3] } }),
      Underline,
      Link.configure({ openOnClick: false }),
      TextStyle,
      Color,
      Highlight.configure({ multicolor: false }),
    ],
    content: '<p>Start writing...</p>',
  })

  return (
    <div>
      <Toolbar editor={editor} />
      <EditorContent editor={editor} />
    </div>
  )
}