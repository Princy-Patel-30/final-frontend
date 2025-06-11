import React, { useEffect } from 'react';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import Underline from '@tiptap/extension-underline';
import Link from '@tiptap/extension-link';
import TextAlign from '@tiptap/extension-text-align';

const TiptapEditor = ({ initialContent, onContentChange, placeholder }) => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Link.configure({ openOnClick: false }),
      Placeholder.configure({ placeholder }),
      TextAlign.configure({
        types: ['heading', 'paragraph'],
        alignments: ['left', 'center', 'right', 'justify'],
      }),
    ],
    content: initialContent || '<p></p>',
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      onContentChange(html);
    },
    editorProps: {
      attributes: {
        class: 'min-h-[150px] p-4 focus:outline-none',
      },
    },
  });

  useEffect(() => {
    if (editor && initialContent !== editor.getHTML()) {
      editor.commands.setContent(initialContent || '<p></p>');
    }
  }, [editor, initialContent]);

  useEffect(() => {
    return () => {
      if (editor) {
        editor.destroy();
      }
    };
  }, [editor]);

  if (!editor) return null;

  const setLink = () => {
    const url = prompt('Enter the URL');
    if (url) {
      editor.chain().focus().setLink({ href: url, target: '_blank' }).run();
    } else {
      editor.chain().focus().unsetLink().run();
    }
  };

  const toolbarButtons = [
    {
      label: 'Bold',
      action: () => editor.chain().focus().toggleBold().run(),
      isActive: () => editor.isActive('bold'),
    },
    {
      label: 'Italic',
      action: () => editor.chain().focus().toggleItalic().run(),
      isActive: () => editor.isActive('italic'),
    },
    {
      label: 'Underline',
      action: () => editor.chain().focus().toggleUnderline().run(),
      isActive: () => editor.isActive('underline'),
    },
    {
      label: 'H1',
      action: () => editor.chain().focus().toggleHeading({ level: 1 }).run(),
      isActive: () => editor.isActive('heading', { level: 1 }),
    },
    {
      label: 'H2',
      action: () => editor.chain().focus().toggleHeading({ level: 2 }).run(),
      isActive: () => editor.isActive('heading', { level: 2 }),
    },
    {
      label: 'Bullet List',
      action: () => editor.chain().focus().toggleBulletList().run(),
      isActive: () => editor.isActive('bulletList'),
    },
    {
      label: 'Ordered List',
      action: () => editor.chain().focus().toggleOrderedList().run(),
      isActive: () => editor.isActive('orderedList'),
    },
    {
      label: 'Blockquote',
      action: () => editor.chain().focus().toggleBlockquote().run(),
      isActive: () => editor.isActive('blockquote'),
    },
    {
      label: 'Code Block',
      action: () => editor.chain().focus().toggleCodeBlock().run(),
      isActive: () => editor.isActive('codeBlock'),
    },
    {
      label: 'Link',
      action: setLink,
      isActive: () => editor.isActive('link'),
    },
    {
      label: 'Align Left',
      action: () => editor.chain().focus().setTextAlign('left').run(),
      isActive: () => editor.isActive({ textAlign: 'left' }),
    },
    {
      label: 'Align Center',
      action: () => editor.chain().focus().setTextAlign('center').run(),
      isActive: () => editor.isActive({ textAlign: 'center' }),
    },
    {
      label: 'Align Right',
      action: () => editor.chain().focus().setTextAlign('right').run(),
      isActive: () => editor.isActive({ textAlign: 'right' }),
    },
  ];

  return (
    <div className="space-y-2">
      <style>
        {`
          .tiptap-editor h1 {
            font-size: 1.875rem;
            font-weight: 700;
            margin: 0.5rem 0;
            line-height: 1.2;
          }
          .tiptap-editor h2 {
            font-size: 1.5rem;
            font-weight: 600;
            margin: 0.5rem 0;
            line-height: 1.3;
          }
          .tiptap-editor ul {
            list-style-type: disc;
            padding-left: 1.5rem;
            margin: 0.5rem 0;
          }
          .tiptap-editor ol {
            list-style-type: decimal;
            padding-left: 1.5rem;
            margin: 0.5rem 0;
          }
          .tiptap-editor li {
            margin-bottom: 0.25rem;
          }
          .tiptap-editor blockquote {
            border-left: 4px solid #e5e7eb;
            padding-left: 1rem;
            margin: 0.5rem 0;
            color: #4b5563;
            font-style: italic;
          }
          .tiptap-editor code {
            background-color: #f3f4f6;
            padding: 0.25rem 0.5rem;
            border-radius: 0.25rem;
            font-family: monospace;
          }
          .tiptap-editor pre {
            background-color: #1f2937;
            color: #f9fafb;
            padding: 1rem;
            border-radius: 0.375rem;
            overflow-x: auto;
            margin: 0.5rem 0;
          }
          .tiptap-editor a {
            color: #2563eb;
            text-decoration: underline;
          }
          .tiptap-editor p {
            margin: 0.25rem 0;
            line-height: 1.5;
          }
        `}
      </style>
      <div className="flex flex-wrap gap-2 rounded-t-lg border border-gray-300 bg-gray-100 p-2">
        {toolbarButtons.map((button) => (
          <button
            key={button.label}
            type="button"
            onClick={button.action}
            className={`rounded-md px-3 py-1 text-sm font-medium transition-colors ${
              button.isActive()
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-700 hover:bg-blue-100'
            } border border-gray-200 shadow-sm`}
          >
            {button.label}
          </button>
        ))}
      </div>
      <div className="tiptap-editor rounded-b-lg border border-gray-300 bg-white">
        <EditorContent editor={editor} />
      </div>
    </div>
  );
};

export default TiptapEditor;
