"use client";
import React, { useEffect, useRef } from "react";
import EditorJS from "@editorjs/editorjs";

// Plugins for Editor.js
import Header from "@editorjs/header";
import List from "@editorjs/list";
import Table from "@editorjs/table";
import ImageTool from "@editorjs/image";
import CodeTool from "@editorjs/code";
import Embed from "@editorjs/embed";
import Checklist from "@editorjs/checklist";
import Quote from "@editorjs/quote";

const CustomEditor = ({ onChange, label = "", data }) => {
  const editorInstance = useRef(null);
  const editorContainer = useRef(null);

  useEffect(() => {
    if (!editorInstance.current && editorContainer.current) {
      editorInstance.current = new EditorJS({
        holder: editorContainer.current,
        autofocus: true,
        placeholder: "Enter your long description",
        data: typeof data === "string" ? JSON?.parse(data) : data || {},
        tools: {
          header: {
            class: Header,
            inlineToolbar: true,
            config: {
              placeholder: "Enter a header",
              levels: [1, 2, 3, 4],
              defaultLevel: 2,
            },
          },
          list: {
            class: List,
            inlineToolbar: true,
          },
          table: {
            class: Table,
            inlineToolbar: true,
          },
          image: {
            class: ImageTool,
            config: {
              uploader: {
                uploadByFile(file) {
                  return new Promise((resolve, reject) => {
                    const reader = new FileReader();
                    reader.readAsDataURL(file);
                    reader.onload = () => {
                      resolve({
                        success: 1,
                        file: {
                          url: reader.result, // ✅ Base64 Data URL
                        },
                      });
                    };
                    reader.onerror = (error) => reject(error);
                  });
                },
              },
            },
          },
          code: CodeTool,
          embed: Embed,
          checklist: {
            class: Checklist,
            inlineToolbar: true,
          },
          quote: {
            class: Quote,
            inlineToolbar: true,
            config: {
              quotePlaceholder: "Enter a quote",
              captionPlaceholder: "Author",
            },
          },
        },
        onChange: async () => {
          if (editorInstance.current) {
            const data = await editorInstance.current.save();
            onChange(data);
          }
        },
      });
    }

    return () => {
      if (editorInstance.current) {
        try {
          editorInstance.current.destroy();
        } catch (error) {
          console.error("Error destroying Editor.js instance:", error);
        }
        editorInstance.current = null;
      }
    };
  }, []);

  return (
    <>
      {label && <label className="text-sm font-medium text-gray-700">{label}</label>}
      <div ref={editorContainer} className="border p-3 rounded mt-4"></div>
    </>
  );
};

export default CustomEditor;
