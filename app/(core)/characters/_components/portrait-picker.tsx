"use client";

import { useRef } from "react";
import Image from "next/image";
import { toast } from "sonner";
import { UploadIcon, UserIcon, XIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { PresetPortrait } from "@/lib/characters/portraits";

const MAX_BYTES = 500 * 1024;
const ALLOWED = ["image/png", "image/jpeg", "image/webp"];

export function PortraitPicker({
  value,
  onChange,
  presets,
}: {
  value: string | null;
  onChange: (value: string | null) => void;
  presets: PresetPortrait[];
}) {
  const fileRef = useRef<HTMLInputElement>(null);

  function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    if (!ALLOWED.includes(file.type)) {
      toast.error("Use PNG, JPEG, or WebP");
      return;
    }
    if (file.size > MAX_BYTES) {
      toast.error(
        `Image too large (${(file.size / 1024).toFixed(0)} KB). Max 500 KB.`,
      );
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result;
      if (typeof result === "string") onChange(result);
    };
    reader.onerror = () => toast.error("Could not read file");
    reader.readAsDataURL(file);
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-start gap-3">
        <div className="size-20 shrink-0 overflow-hidden rounded-lg border bg-muted">
          {value ? (
            <PortraitImage src={value} alt="Selected portrait" />
          ) : (
            <div className="flex size-full items-center justify-center text-muted-foreground">
              <UserIcon className="size-8" />
            </div>
          )}
        </div>
        <div className="flex flex-1 flex-col gap-2">
          <div className="flex items-center gap-2">
            <input
              ref={fileRef}
              type="file"
              accept={ALLOWED.join(",")}
              onChange={onFile}
              className="hidden"
            />
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => fileRef.current?.click()}
            >
              <UploadIcon className="size-4" />
              Upload
            </Button>
            {value && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => onChange(null)}
              >
                <XIcon className="size-4" />
                Clear
              </Button>
            )}
          </div>
          <p className="text-xs text-muted-foreground">
            PNG, JPEG, or WebP. Max 500 KB. Or pick a preset below.
          </p>
        </div>
      </div>

      {presets.length > 0 && (
        <div className="grid gap-2 grid-cols-6 max-w-xl">
          {presets.map((p) => {
            const selected = value === p.url;
            return (
              <button
                key={p.url}
                type="button"
                onClick={() => onChange(p.url)}
                title={p.label}
                className={cn(
                  "aspect-square overflow-hidden rounded-md border transition-all",
                  selected
                    ? "ring-2 ring-primary ring-offset-2 ring-offset-background"
                    : "hover:opacity-80",
                )}
              >
                <PortraitImage src={p.url} alt={p.label} />
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

function PortraitImage({ src, alt }: { src: string; alt: string }) {
  const isData = src.startsWith("data:");
  if (isData) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={src} alt={alt} className="size-full object-cover" />;
  }
  return (
    <Image
      src={src}
      alt={alt}
      width={200}
      height={200}
      className="size-full object-cover"
    />
  );
}
