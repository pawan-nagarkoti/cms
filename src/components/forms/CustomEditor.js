"use client";

import React from "react";
import { Editor } from "@tinymce/tinymce-react";
import { EDITOR_KEY } from "@/config/constants";

export default function CustomEditor() {
  return (
    <Editor
      apiKey={EDITOR_KEY}
      init={{
        plugins: "anchor autolink charmap codesample emoticons image link lists media searchreplace table visualblocks wordcount",
        toolbar:
          "undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | link image media table | align lineheight | numlist bullist indent outdent | emoticons charmap | removeformat",
      }}
      initialValue="Welcome to TinyMCE!"
    />
  );
}
