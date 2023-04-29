import React, { useState, useEffect } from "react";
import {
  Editor,
  EditorState,
  RichUtils,
  getDefaultKeyBinding,
} from "draft-js";

const MyEditor = () => {
  const [editorState, setEditorState] = useState(EditorState.createEmpty());

  useEffect(() => {
    const savedContent = localStorage.getItem("content");
    if (savedContent) {
      setEditorState(EditorState.createWithContent(JSON.parse(savedContent)));
    }
  }, []);

  const handleChange = (newState) => {
    setEditorState(newState);
  };

  const handleKeyCommand = (command, newState) => {
    const newStateWithStyle = RichUtils.handleKeyCommand(newState, command);
    if (newStateWithStyle) {
      handleChange(newStateWithStyle);
      return "handled";
    }
    return "not-handled";
  };

  const mapKeyToEditorCommand = (e) => {
    if (e.keyCode === 9 /* TAB */) {
      const newEditorState = RichUtils.onTab(
        e,
        editorState,
        4 /* maxDepth */
      );
      if (newEditorState !== editorState) {
        handleChange(newEditorState);
      }
      return;
    }
    return getDefaultKeyBinding(e);
  };

  const toggleInlineStyle = (style) => {
    handleChange(RichUtils.toggleInlineStyle(editorState, style));
  };

  const toggleBlockType = (blockType) => {
    handleChange(RichUtils.toggleBlockType(editorState, blockType));
  };

  const saveContent = () => {
    const contentState = editorState.getCurrentContent();
    localStorage.setItem("content", JSON.stringify(contentState));
  };

  return (
    <div>
      <h1>Title</h1>
      <button onClick={saveContent}>Save</button>
      <div className="editor-container">
        <div className="editor-controls">
          <button onClick={() => toggleInlineStyle("BOLD")}>Bold</button>
          <button onClick={() => toggleInlineStyle("UNDERLINE")}>
            Underline
          </button>
          <button onClick={() => toggleBlockType("header-one")}>
            Heading
          </button>
        </div>
        <div className="editor-wrapper">
          <Editor
            editorState={editorState}
            onChange={handleChange}
            handleKeyCommand={handleKeyCommand}
            keyBindingFn={mapKeyToEditorCommand}
          />
        </div>
      </div>
    </div>
  );
};

export default MyEditor;
