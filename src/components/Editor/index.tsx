import { memo, useEffect, useMemo, useRef, useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

// hight light color for text editor
import hljs from "highlight.js";
import "highlight.js/styles/tokyo-night-dark.css";

import { uploadBannerImage } from "~/api-client";
import { ECompressFormat, ETypeImage } from "~/enums";
import { checkImage, resizeImage } from "~/helper/handleImage";
import { IOptionImage } from "~/interface";

import useDebounce from "~/hooks/useDebounce";
import SpinLoading from "../Loading/SpinLoading";

const initOption: IOptionImage = {
  quality: 100,
  maxHeight: 400,
  maxWidth: 400,
  minHeight: 200,
  minWidth: 200,
  type: ETypeImage.file,
  compressFormat: ECompressFormat.WEBP,
};

interface Props {
  content?: string;
  option?: IOptionImage;
  debounce?: number;
  placeholder?: string;
  getContent: (content: string) => void;
}

//Add class Image Quill Editor
var Image = ReactQuill.Quill.import("formats/image");
Image.className = "quill__image";

ReactQuill.Quill.register(Image, true);

//Font Quill Editor
const FontAttributor = ReactQuill.Quill.import("attributors/class/font");
FontAttributor.whitelist = [
  "sofia",
  "slabo",
  "roboto",
  "inconsolata",
  "ubuntu",
];
ReactQuill.Quill.register(FontAttributor, true);

hljs.configure({
  languages: ["javascript", "html", "css"],
});

// Format header for Quill Editor
const formats: string[] = [
  "header",
  "font",
  "size",
  "bold",
  "italic",
  "underline",
  "strike",
  "blockquote",
  "list",
  "bullet",
  "indent",
  "code-block",
  "background",
  "color",
  "link",
  "image",
  "video",
  "align",
  "float",
];

// Module color for Quill Editor
const colors: string[] = ["blue", "white", "orange", "#A91D3A"];

// Module background color for Quill Editor
const backgroundColors: string[] = ["red"];

const Editor = (props: Props) => {
  const {
    content = "",
    option = initOption,
    debounce = 1000,
    placeholder = "Enter your content...",
    getContent,
  } = props;
  const quillRef = useRef(null);

  const [value, setValue] = useState<string>(content);
  const [loading, setLoading] = useState<boolean>(false);
  const newValue = useDebounce(value, debounce);

  const uploadImage = async () => {
    if (!quillRef.current) return;

    const quill: ReactQuill = quillRef.current;
    const editor = quill.getEditor();
    const position = (quill?.selection?.index as number) || 0;

    // create new imput for form post
    const input = document.createElement("input");

    input.setAttribute("type", "file");
    input.click();

    input.onchange = async () => {
      setLoading(true);
      // setLoadMessage("Hình ảnh đang tải lên...")
      if (!input.files) return;

      const file = input.files[0];

      const isValidImage: boolean = checkImage(file, 500000);

      if (!isValidImage) return;
      const newImage = (await resizeImage(file, option)) as File;
      const source: File = newImage;

      const formData: FormData = new FormData();
      formData.append("image", source);
      const { payload, status } = await uploadBannerImage(formData);

      // onChange(source, url);

      if (status === 201) {
        //add image in quill
        editor.insertEmbed(
          position,
          "image",
          process.env.NEXT_PUBLIC_ENDPOINT_API + payload
        );
        // editor.formatLine(position, position, "align", "center");
        const newPosition: number = position + 1;
        editor.setSelection({ index: newPosition, length: 1 });
        editor.insertText(newPosition, "\n");
      }

      setLoading(false);
    };
  };

  const modules = useMemo(
    () => ({
      syntax: {
        highlight: (text: string) => hljs.highlightAuto(text).value,
      },
      toolbar: {
        container: [
          [{ header: "1" }, { header: "2" }, { font: [] }],
          [{ header: [1, 2, 3, 4, 5, 6, false] }],
          ["bold", "italic", "underline", "strike", "blockquote"],
          [{ color: colors }, { background: backgroundColors }],
          [
            { list: "ordered" },
            { list: "bullet" },
            { indent: "-1" },
            { indent: "+1" },
          ],
          [{ align: [] }],
          ["code-block"],
          ["link", "image"],
          ["clean"],
        ],
        handlers: {
          image: uploadImage,
        },
      },
    }),
    []
  );

  const onChangeContent = (newConten: string) => {
    if (!newConten) return;

    setValue(newConten);
  };

  useEffect(() => {
    getContent(value);
  }, [newValue]);

  return (
    <div className="relative overflow-hidden z-0">
      <ReactQuill
        modules={modules}
        formats={formats}
        ref={quillRef}
        theme="snow"
        value={value}
        onChange={onChangeContent}
        placeholder={placeholder}
      />

      {loading && (
        <div className="absolute top-0 left-0 right-0 bottom-0 flex items-center justify-center bg-black/40 rounded-md">
          <SpinLoading className="text-3xl text-white" />
        </div>
      )}
    </div>
  );
};

export default memo(Editor);
