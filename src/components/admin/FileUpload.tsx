"use client";

import { useState, useRef } from "react";
import { uploadFile } from "@/lib/actions";
import { Button } from "@/components/ui/Button";
import { Loader2, Upload } from "lucide-react";
import { toast } from "sonner";
import Image from "next/image";

interface FileUploadProps {
  bucket: string;
  path: string;
  currentUrl?: string | null;
  onUpload: (url: string) => void;
  accept?: string;
  label?: string;
}

export function FileUpload({ bucket, path, currentUrl, onUpload, accept = "image/*", label = "Upload" }: FileUploadProps) {
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const result = await uploadFile(bucket, `${path}/${Date.now()}-${file.name}`, file);

    if (result.error) {
      toast.error(result.error);
    } else if (result.url) {
      onUpload(result.url);
      toast.success("Uploaded successfully!");
    }
    setUploading(false);
  };

  return (
    <div className="space-y-3">
      {currentUrl && (
        <div className="relative w-32 h-32 rounded-xl overflow-hidden border">
          {accept.includes("video") ? (
            <video src={currentUrl} className="w-full h-full object-cover" />
          ) : (
            <Image src={currentUrl} alt="Preview" fill className="object-cover" />
          )}
        </div>
      )}
      <input ref={inputRef} type="file" accept={accept} onChange={handleUpload} className="hidden" />
      <Button type="button" variant="outline" size="sm" onClick={() => inputRef.current?.click()} disabled={uploading}>
        {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
        {label}
      </Button>
    </div>
  );
}
