"use client";
import React, { useEffect, useState } from "react";
import Spinner from "../_global/spinner";
import { useCreatePost } from "@/services/postServices";
import { Image } from "lucide-react";
import toast from "react-hot-toast";
import { useCreateStory } from "@/services/storyServices";

const NewStory = () => {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [content, setContent] = useState<string>("");
  const { mutate, isPending, isSuccess } = useCreateStory();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files ? e.target.files[0] : null;
    if (selectedFile) {
      setFile(selectedFile);
      setPreviewUrl(URL.createObjectURL(selectedFile));
    } else {
      setPreviewUrl(null);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!file) {
      alert("Lütfen bir dosya seçin!");
      return;
    }

    const formData = new FormData();
    formData.append("content", content);
    formData.append("image", file);
    mutate(formData);
  };

  useEffect(() => {
    isSuccess && toast.success("Hikaye Yayınlandı");
  }, [isSuccess]);

  return (
    <section>
      <form onSubmit={handleSubmit} className="flex flex-col gap-y-5">
        <input
          type="file"
          id="file"
          accept="image/*,video/*"
          onChange={handleFileChange}
          className="hidden"
          required
        />

        <label
          htmlFor="file"
          className="cursor-pointer bg-background border border-primary  rounded-full text-center flex justify-center gap-x-2 items-center p-3"
        >
          <Image />
          Görsel veya Video seç
        </label>

        {previewUrl && (
          <div className="flex justify-center items-center mt-4">
            {file?.type.startsWith("image/") ? (
              <img
                src={previewUrl}
                alt="Önizleme"
                className="max-w-full max-h-64 rounded border border-accent"
              />
            ) : file?.type.startsWith("video/") ? (
              <video
                src={previewUrl}
                controls
                className="max-w-full max-h-64 rounded border border-accent"
              />
            ) : null}
          </div>
        )}

        <div>
          <textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Açıklama"
            className="p-2 bg-background border-accent border focus:outline-none w-full"
            required
          ></textarea>
        </div>

        <button
          className="bg-primary rounded p-1 font-semibold h-[40px]"
          type="submit"
          disabled={isPending}
        >
          {isPending ? <Spinner size={10} color="secondary" /> : "Yayınla"}
        </button>
      </form>
    </section>
  );
};

export default NewStory;
