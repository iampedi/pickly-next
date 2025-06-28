// src/app/(panel)/components/FileUploader.tsx
"use client";

import { Button } from "@/components/ui/button";
import { uploadFiles } from "@/lib/uploadthing";
import {
  FileUpload,
  FileUploadDropzone,
  FileUploadItem,
  FileUploadItemDelete,
  FileUploadItemMetadata,
  FileUploadItemPreview,
  FileUploadItemProgress,
  FileUploadList,
  type FileUploadProps,
  FileUploadTrigger,
} from "@/components/theme/file-upload";
import { Upload, X } from "lucide-react";
import * as React from "react";
import { toast } from "sonner";
import { UploadThingError } from "uploadthing/server";
import { cn } from "@/lib/utils";

export function FileUploader({
  className,
  onUploaded,
  setLoading,
}: {
  className?: string;
  onUploaded?: (url: string) => void;
  setLoading?: (loading: boolean) => void;
}) {
  const [isUploading, setIsUploading] = React.useState(false);
  const [files, setFiles] = React.useState<File[]>([]);

  const onUpload: NonNullable<FileUploadProps["onUpload"]> = React.useCallback(
    async (files, { onProgress }) => {
      try {
        setIsUploading(true);
        setLoading?.(true);

        const res = await uploadFiles("imageUploader", {
          files,
          onUploadProgress: ({
            file,
            progress,
          }: {
            file: File;
            progress: number;
          }) => {
            onProgress(file, progress);
          },
        });

        if (res.length > 0 && onUploaded) {
          onUploaded(res[0].ufsUrl); // یا res[0].url برای نسخه‌های قدیمی‌تر
        }

        toast.success("Files uploaded successfully.");
      } catch (error) {
        setIsUploading(false);
        setLoading?.(false);

        if (error instanceof UploadThingError) {
          const errorMessage =
            error.data && "error" in error.data
              ? error.data.error
              : "Upload failed";
          toast.error(errorMessage);
          return;
        }

        toast.error(
          error instanceof Error ? error.message : "An unknown error occurred",
        );
      } finally {
        setIsUploading(false);
        setLoading?.(false);
      }
    },
    [onUploaded, setLoading],
  );

  const onFileReject = React.useCallback((file: File, message: string) => {
    toast(message, {
      description: `"${file.name.length > 20 ? `${file.name.slice(0, 20)}...` : file.name}" has been rejected`,
    });
  }, []);

  return (
    <FileUpload
      accept="image/*"
      maxFiles={2}
      maxSize={4 * 1024 * 1024}
      className={cn(className, "w-full")}
      onAccept={(files) => setFiles(files)}
      onUpload={onUpload}
      onFileReject={onFileReject}
      multiple
      disabled={isUploading}
    >
      <FileUploadDropzone>
        <div className="flex flex-col items-center gap-1 text-center">
          <div className="flex items-center justify-center rounded-full border p-2.5">
            <Upload className="text-muted-foreground size-6" />
          </div>
          <p className="text-sm font-medium">Drag & drop images here</p>
          <p className="text-muted-foreground text-xs">
            Or click to browse (max 2 files, up to 4MB each)
          </p>
        </div>
        <FileUploadTrigger asChild>
          <Button variant="outline" size="sm" className="mt-2 w-fit">
            Browse files
          </Button>
        </FileUploadTrigger>
      </FileUploadDropzone>
      <FileUploadList>
        {files.map((file, index) => (
          <FileUploadItem key={index} value={file}>
            <div className="flex w-full items-center gap-2">
              <FileUploadItemPreview />
              <FileUploadItemMetadata />
              <FileUploadItemDelete asChild>
                <Button variant="ghost" size="icon" className="size-7">
                  <X />
                </Button>
              </FileUploadItemDelete>
            </div>
            <FileUploadItemProgress />
          </FileUploadItem>
        ))}
      </FileUploadList>
    </FileUpload>
  );
}
