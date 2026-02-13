/* eslint-disable react/prop-types */
'use client';
import React from 'react';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';
import Strike from '@tiptap/extension-strike';
import TextAlign from '@tiptap/extension-text-align';
import Underline from '@tiptap/extension-underline';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { useEffect } from 'react';
import CIcon from '@coreui/icons-react';
import {
  cilAlignCenter,
  cilAlignLeft,
  cilAlignRight,
  cilBold,
  cilItalic,
  cilList,
  cilListNumbered,
  cilMinus,
  cilUnderline,
} from '@coreui/icons';

function decodeHtml(html) {
  const txt = document.createElement('textarea');
  txt.innerHTML = html;
  return txt.value;
}

const RichTextEditor = (prop) => {
  const { value, onChange, placeholder } = prop;
  const editor = useEditor({
    extensions: [
      StarterKit,
      Link.configure({
        openOnClick: false,
      }),
      Image.configure({
        inline: true,
        allowBase64: true,
      }),
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      Underline,
      Strike,
      Placeholder.configure({
        placeholder: placeholder || 'Enter product description here...',
      }),
    ],
    content: value,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: 'form-control border-0 p-3',
        style:
          'min-height: 150px; max-height: 300px; overflow-y: auto; outline: none; box-shadow: none;',
      },
    },
  });

  useEffect(() => {
    if (editor && value) {
      const decoded = decodeHtml(value);
      if (decoded !== editor.getHTML()) {
        editor.commands.setContent(decoded, false, {
          preserveWhitespace: 'full',
        });
      }
    }
  }, [editor, value]);

  if (!editor) {
    return null;
  }

  const ToolbarButton = ({ onClick, disabled, active, children, title }) => (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      title={title}
      className={`btn btn-sm me-1`}
      style={{
        width: '32px',
        height: '32px',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '0',
        backgroundColor: active ? '#1b486d' : '#0c355f',
      }}
    >
      {children}
    </button>
  );

  return (
    <div className="">
      {/* Toolbar */}
      <div className="border-bottom p-2 bg-light">
        <div className="d-flex flex-wrap align-items-center gap-1">
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleBold().run()}
            disabled={!editor.can().chain().focus().toggleBold().run()}
            active={editor.isActive('bold')}
            title="Bold"
          >
            <CIcon className="stock-toggle-icon" icon={cilBold} />
          </ToolbarButton>

          <ToolbarButton
            onClick={() => editor.chain().focus().toggleItalic().run()}
            disabled={!editor.can().chain().focus().toggleItalic().run()}
            active={editor.isActive('italic')}
            title="Italic"
          >
            <CIcon className="stock-toggle-icon" icon={cilItalic} />
          </ToolbarButton>

          <ToolbarButton
            onClick={() => editor.chain().focus().toggleStrike().run()}
            disabled={!editor.can().chain().focus().toggleStrike().run()}
            active={editor.isActive('strike')}
            title="Strikethrough"
          >
            <CIcon className="stock-toggle-icon" icon={cilMinus} />
          </ToolbarButton>

          <ToolbarButton
            onClick={() => editor.chain().focus().toggleUnderline().run()}
            disabled={!editor.can().chain().focus().toggleUnderline().run()}
            active={editor.isActive('underline')}
            title="Underline"
          >
            <CIcon className="stock-toggle-icon" icon={cilUnderline} />
          </ToolbarButton>

          {/* Divider */}
          <div className="vr mx-2"></div>

          <ToolbarButton
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            disabled={!editor.can().chain().focus().toggleBulletList().run()}
            active={editor.isActive('bulletList')}
            title="Bullet List"
          >
            <CIcon className="stock-toggle-icon" icon={cilList} />
          </ToolbarButton>

          <ToolbarButton
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            disabled={!editor.can().chain().focus().toggleOrderedList().run()}
            active={editor.isActive('orderedList')}
            title="Numbered List"
          >
            <CIcon className="stock-toggle-icon" icon={cilListNumbered} />
          </ToolbarButton>

          {/* Divider */}
          <div className="vr mx-2"></div>

          <ToolbarButton
            onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
            active={editor.isActive('heading', { level: 1 })}
            title="Heading 1"
          >
            <span className="fw-bold" style={{ fontSize: '12px' }}>
              H1
            </span>
          </ToolbarButton>

          <ToolbarButton
            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
            active={editor.isActive('heading', { level: 2 })}
            title="Heading 2"
          >
            <span className="fw-bold" style={{ fontSize: '12px' }}>
              H2
            </span>
          </ToolbarButton>

          {/* Divider */}
          <div className="vr mx-2"></div>

          <ToolbarButton
            onClick={() => editor.chain().focus().setTextAlign('left').run()}
            active={editor.isActive({ textAlign: 'left' })}
            title="Align Left"
          >
            <CIcon className="stock-toggle-icon" icon={cilAlignLeft} />
          </ToolbarButton>

          <ToolbarButton
            onClick={() => editor.chain().focus().setTextAlign('center').run()}
            active={editor.isActive({ textAlign: 'center' })}
            title="Align Center"
          >
            <CIcon className="stock-toggle-icon" icon={cilAlignCenter} />
          </ToolbarButton>

          <ToolbarButton
            onClick={() => editor.chain().focus().setTextAlign('right').run()}
            active={editor.isActive({ textAlign: 'right' })}
            title="Align Right"
          >
            <CIcon className="stock-toggle-icon" icon={cilAlignRight} />
          </ToolbarButton>
        </div>
      </div>

      {/* Editor Content */}
      <div style={{ minHeight: '150px', maxHeight: '300px', overflowY: 'auto' }}>
        <EditorContent editor={editor} />
      </div>
    </div>
  );
};

export default RichTextEditor;
