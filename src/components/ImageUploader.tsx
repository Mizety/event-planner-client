import { useCallback, useState, memo } from "react";
import Image from "next/image";
import { UploadCloud, X } from "lucide-react";
import { useDropzone } from "react-dropzone";
import { Button } from "@/components/ui/button";

interface ImagePreviewProps {
  url: string;
  onRemove: () => void;
  className?: string;
}

const ImagePreview = memo(
  ({ url, onRemove, className = "w-32" }: ImagePreviewProps) => (
    <div
      className={`relative group aspect-square rounded-lg overflow-hidden border ${className}`}
    >
      <Image
        src={url}
        alt="Uploaded image"
        fill
        sizes="(max-width: 384px) 100vw, 384px"
        className="object-cover"
        priority
      />
      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
        <Button
          variant="destructive"
          size="icon"
          className="h-8 w-8"
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
);

ImagePreview.displayName = "ImagePreview";

interface UploaderProps {
  onImageUrl: (url: string) => void;
  images?: string[];
  imageUrl?: string;
  onRemoveImage?: (url?: string) => void;
  mode?: "single" | "multiple";
  maxImages?: number;
  className?: string;
}

export default function ImageUploader({
  onImageUrl,
  images = [],
  imageUrl,
  onRemoveImage,
  mode = "single",
  maxImages = 10,
  className = "w-full max-w-sm",
}: UploaderProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      if (!file) return;

      if (file.size > 5 * 1024 * 1024) {
        setError("File size must be less than 5MB");
        return;
      }

      if (mode === "multiple" && images.length >= maxImages) {
        setError(`Maximum ${maxImages} images allowed`);
        return;
      }

      setIsUploading(true);
      setError(null);
      const formData = new FormData();
      formData.append("file", file);

      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/images/upload`,
          {
            method: "POST",
            body: formData,
          }
        );

        if (!response.ok) {
          throw new Error("Upload failed");
        }

        const data = await response.json();
        onImageUrl(data.url);
      } catch (error) {
        setError("Upload failed. Please try again.");
        console.error("Upload failed:", error);
      } finally {
        setIsUploading(false);
      }
    },
    [onImageUrl, mode, images.length, maxImages]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".jpeg", ".jpg", ".png", ".gif"],
    },
    maxFiles: 1,
    disabled:
      isUploading ||
      (mode === "single" ? Boolean(imageUrl) : images.length >= maxImages),
    maxSize: 5 * 1024 * 1024,
  });

  const renderUploader = () => (
    <div
      {...getRootProps()}
      className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
        isDragActive
          ? "border-primary bg-primary/5"
          : "border-border hover:border-primary"
      } ${isUploading ? "cursor-not-allowed opacity-60" : "cursor-pointer"}`}
    >
      <div className="mx-auto flex max-w-[420px] flex-col items-center justify-center">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
          <UploadCloud className="h-6 w-6" />
        </div>
        <input {...getInputProps()} />
        <h3 className="mt-4 text-lg font-semibold">Upload an image</h3>
        <p className="mt-2 text-sm text-muted-foreground">
          {isDragActive
            ? "Drop it here"
            : mode === "multiple"
            ? `Drag and drop or click to upload (${images.length}/${maxImages})`
            : "Drag and drop or click to upload"}
        </p>
        {isUploading && (
          <div className="mt-4 text-sm text-muted-foreground">Uploading...</div>
        )}
        {error && <div className="mt-4 text-sm text-destructive">{error}</div>}
      </div>
    </div>
  );

  if (mode === "single") {
    return (
      <div className="space-y-4 ">
        {imageUrl ? (
          <ImagePreview
            url={imageUrl}
            onRemove={() => onRemoveImage?.()}
            className={className}
          />
        ) : (
          renderUploader()
        )}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {images.length > 0 && (
        <div className="flex flex-row flex-wrap  gap-4">
          {images.map((url) => (
            <ImagePreview
              key={url}
              url={url}
              onRemove={() => onRemoveImage?.(url)}
            />
          ))}
        </div>
      )}
      {images.length < maxImages && renderUploader()}
    </div>
  );
}
