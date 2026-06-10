/* eslint-disable react/react-in-jsx-scope */
/* eslint-disable no-control-regex */
/* eslint-disable no-useless-escape */
/* eslint-disable react/prop-types */
import { CTooltip } from '@coreui/react';
import data from '@emoji-mart/data';
import Picker from '@emoji-mart/react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { styleMap } from 'src/constants/socialStyles';

// Reusable Social Media Text Editor Component
const SocialMediaTextEditor = ({ value, onChange, placeholder, networkId }) => {
  const [copiedStyle, setCopiedStyle] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const textareaRef = useRef(null);
  const emojiButtonRef = useRef(null);
  const emojiPickerRef = useRef(null);

  // Create a global reverse mapping for all styles
  const globalReverseMap = Object.values(styleMap).reduce((acc, mapping) => {
    Object.entries(mapping).forEach(([normal, styled]) => {
      const cleanStyled = styled.replace(/[\u0335\u0336\u0332]/g, '').normalize('NFC');
      acc[cleanStyled] = normal;
      acc[styled.normalize('NFC')] = normal;
    });
    return acc;
  }, {});

  const transformText = useCallback((text, style) => {
    if (!styleMap[style]) return text;
    const mapping = styleMap[style];
    const isUppercaseStyle = ['circledDark', 'squared', 'squaredDark'].includes(style);
    const inputText = isUppercaseStyle ? text.toUpperCase() : text;
    return [...inputText].map((char) => mapping[char] || char).join('');
  }, []);

  const resetToNormal = useCallback(
    (text) => {
      let normalized = text.normalize('NFC');
      const combiningChars = /[\u0335\u0336\u0332]/g;
      normalized = normalized.replace(combiningChars, '');
      let changed = true;
      let iteration = 0;
      while (changed && iteration < 5) {
        changed = false;
        const newText = [...normalized]
          .map((char) => {
            const normalChar = globalReverseMap[char];
            if (normalChar && normalChar !== char) {
              changed = true;
              return normalChar;
            }
            return char;
          })
          .join('');
        normalized = newText;
        iteration++;
      }
      return normalized;
    },
    [globalReverseMap],
  );

  const isTextStyled = useCallback(
    (text, style) => {
      const normalized = resetToNormal(text);
      const styled = transformText(normalized, style);
      return text === styled;
    },
    [resetToNormal, transformText],
  );

  const copyToClipboard = async (text, styleName) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedStyle(styleName);
      setTimeout(() => setCopiedStyle(''), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  // WhatsApp markdown equivalents for styles that support it
  const waWrapperMap = {
    bold: '*',
    italic: '_',
    strikethrough: '~',
  };

  // Returns true if text has any non-Latin characters (Arabic, Urdu, etc.)
  const hasNonLatin = (text) => [...text].some((char) => char.codePointAt(0) > 0x024f);

  const applyStyle = useCallback(
    (style) => {
      const textarea = textareaRef.current;
      if (!textarea) return;

      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;

      if (start === end) {
        setErrorMessage('Please select some text to apply the style.');
        setTimeout(() => setErrorMessage(''), 3000);
        return;
      }

      const selectedText = value.slice(start, end);
      const normalizedText = resetToNormal(selectedText);

      // ── Auto-detect non-Latin → use WhatsApp wrapper instead ──
      if (hasNonLatin(normalizedText) && waWrapperMap[style]) {
        const wrapper = waWrapperMap[style];
        const isWrapped = selectedText.startsWith(wrapper) && selectedText.endsWith(wrapper);

        const result = isWrapped
          ? selectedText.slice(wrapper.length, selectedText.length - wrapper.length) // unwrap
          : wrapper + selectedText + wrapper; // wrap

        onChange(value.slice(0, start) + result + value.slice(end));
        setErrorMessage('');
        return;
      }

      // ── Original Latin/Unicode path ──
      const isAlreadyStyled = isTextStyled(selectedText, style);
      const finalText = isAlreadyStyled ? normalizedText : transformText(normalizedText, style);

      onChange(value.slice(0, start) + finalText + value.slice(end));
      copyToClipboard(finalText, isAlreadyStyled ? 'normal' : style);
      setErrorMessage('');
    },
    [value, onChange, resetToNormal, transformText, isTextStyled, copyToClipboard],
  );

  const insertEmoji = useCallback(
    (emoji) => {
      const textarea = textareaRef.current;
      if (!textarea) return;
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const newText = value.slice(0, start) + emoji?.native + value.slice(end);
      onChange(newText);

      // Move cursor after the inserted emoji
      setTimeout(() => {
        textarea.selectionStart = textarea.selectionEnd = start + emoji.length;
        textarea.focus();
      }, 0);

      setShowEmojiPicker(false);
    },
    [value, onChange],
  );

  // Close emoji picker when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        emojiPickerRef.current &&
        !emojiPickerRef.current.contains(event.target) &&
        emojiButtonRef.current &&
        !emojiButtonRef.current.contains(event.target)
      ) {
        setShowEmojiPicker(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const ToolbarButton = ({ onClick, children, title }) => (
    <CTooltip content={title}>
      <button
        type="button"
        onClick={onClick}
        title={title}
        className="btn btn-sm me-1"
        style={{
          width: '32px',
          height: '32px',
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '0',
        }}
      >
        {children}
      </button>
    </CTooltip>
  );

  function isGsm7(text) {
    const gsm7Regex =
      /^[\x00-\x7F€£¥èéùìòÇ\nØø\rÅåΔ_ΦΓΛΩΠΨΣΘΞÆæßÉ !"#$%&'()*+,\-./0-9:;<=>?@A-Z\[\\\]^_`a-z{|}~]*$/;
    return gsm7Regex.test(text);
  }

  function calculateSmsParts(text = '') {
    const length = [...text].length;
    const gsm = isGsm7(text);

    if (gsm) {
      if (length <= 160) return { parts: 1, perPart: 160, encoding: 'GSM-7' };
      return {
        parts: Math.ceil(length / 153),
        perPart: 153,
        encoding: 'GSM-7',
      };
    }

    // UCS-2 (emoji, styled text, unicode)
    if (length <= 70) return { parts: 1, perPart: 70, encoding: 'UCS-2' };
    return {
      parts: Math.ceil(length / 67),
      perPart: 67,
      encoding: 'UCS-2',
    };
  }

  const { parts, encoding } = calculateSmsParts(value || '');
  const charCount = [...(value || '')].length;

  return (
    <div className="w-full">
      <div className="p-2 fs-6 text-white">
        Please select the text that you want to edit and press on the corresponding font style
        button.
      </div>
      {networkId === 1 && (
        <div className="p-2 mb-2 bg-info bg-opacity-10 border border-info rounded">
          <div className="d-flex align-items-start gap-2">
            <span className="fs-5">💡</span>
            <div className="flex-grow-1">
              <div className="d-flex justify-content-between align-items-center mb-1">
                <p className="mb-0 fw-semibold text-info">SMS Tip - Keep it Short & Save!</p>
                <span className="badge bg-info">
                  {charCount} chars · {parts} SMS · {encoding}
                </span>
              </div>
              <p className="mb-0 small text-muted">
                This message will be sent as <strong>{parts} SMS</strong> using{' '}
                <strong>{encoding}</strong> encoding.
              </p>
            </div>
          </div>
        </div>
      )}
      <div className="border-b bg-light rounded p-2 position-relative">
        <div className="d-flex flex-row flex-wrap items-center gap-1">
          <ToolbarButton onClick={() => applyStyle('bold')} title="Bold">
            <p className="fs-5">𝐁</p>
          </ToolbarButton>
          <ToolbarButton onClick={() => applyStyle('italic')} title="Italic">
            <p className="fs-5">𝐼</p>
          </ToolbarButton>
          <ToolbarButton onClick={() => applyStyle('underline')} title="Underline">
            <p className="fs-5">
              <u>U</u>
            </p>
          </ToolbarButton>
          <div className="w-px h-6 bg-gray-400 mx-2"></div>
          <ToolbarButton onClick={() => applyStyle('strikethrough')} title="Strikethrough">
            <p className="fs-5">
              <s>S</s>
            </p>
          </ToolbarButton>
          <ToolbarButton onClick={() => applyStyle('cursive')} title="Cursive">
            <p className="fs-5">𝒯</p>
          </ToolbarButton>
          <ToolbarButton onClick={() => applyStyle('doublestruck')} title="Double Struck">
            <p className="fs-5">𝕋</p>
          </ToolbarButton>
          <div className="w-px h-6 bg-gray-400 mx-2"></div>
          <ToolbarButton onClick={() => applyStyle('circled')} title="Circled">
            <p className="fs-5">Ⓣ</p>
          </ToolbarButton>
          <ToolbarButton onClick={() => applyStyle('circledDark')} title="Circled Dark">
            <p className="fs-5">🅣</p>
          </ToolbarButton>
          <ToolbarButton onClick={() => applyStyle('squared')} title="Squared">
            <p className="fs-5">🅃</p>
          </ToolbarButton>
          <ToolbarButton onClick={() => applyStyle('squaredDark')} title="Squared Dark">
            <p className="fs-5">🆃</p>
          </ToolbarButton>
          <div className="w-px h-6 bg-gray-400 mx-2"></div>
          <div className="position-relative d-inline-block">
            <ToolbarButton
              ref={emojiButtonRef}
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
              title="Emoji Picker"
            >
              <p className="fs-5">😊</p>
            </ToolbarButton>

            <ToolbarButton onClick={() => onChange('')} title="Clear Text">
              <p className="fs-5">X</p>
            </ToolbarButton>

            {showEmojiPicker && (
              <div
                ref={emojiPickerRef}
                className="position-absolute end-0 mt-2 zindex-dropdown rounded"
              >
                <Picker data={data} onEmojiSelect={insertEmoji} previewPosition="none" />
              </div>
            )}
          </div>
        </div>

        {copiedStyle && (
          <div className="mt-2 text-xs text-green-600 font-medium">
            ✓ {copiedStyle} text copied to clipboard!
          </div>
        )}
        {errorMessage && (
          <div className="mt-2 text-xs text-red-600 font-medium">{errorMessage}</div>
        )}
      </div>
      <textarea
        ref={textareaRef}
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        className="form-control border-0 p-3"
        style={{
          minHeight: '250px',
          maxHeight: '600px',
          overflowY: 'auto',
        }}
        required
        placeholder={placeholder || 'Type your social media post here...'}
      />
    </div>
  );
};

export default SocialMediaTextEditor;
