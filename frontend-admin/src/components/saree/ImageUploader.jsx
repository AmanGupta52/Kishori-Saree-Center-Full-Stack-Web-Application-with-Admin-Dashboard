import React, { useCallback, useRef, useState } from 'react';

const MAX_IMAGES = 8;
const MAX_SIZE_MB = 5;
const ACCEPTED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/avif'];

/**
 * Local (pre-submit) image picker for creating a saree.
 * Holds File objects + object-URL previews in memory; nothing is uploaded
 * to Cloudinary until the parent form submits (multipart POST /admin/sarees).
 *
 * Props:
 *  - files: Array<{ file: File, previewUrl: string, isMain: boolean }>
 *  - onChange: (files) => void
 *  - uploading: boolean — true while the parent form's submit request is in flight
 *  - uploadProgress: number 0-100 — overall progress reported by the parent's axios call
 */
export default function ImageUploader({ files, onChange, uploading = false, uploadProgress = 0 }) {
  const [error, setError] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef(null);

  const addFiles = useCallback(
    (fileList) => {
      setError('');
      const incoming = Array.from(fileList);

      const valid = [];
      for (const file of incoming) {
        if (!ACCEPTED_TYPES.includes(file.type)) {
          setError(`${file.name}: unsupported format. Use JPEG, PNG, WEBP, or AVIF.`);
          continue;
        }
        if (file.size > MAX_SIZE_MB * 1024 * 1024) {
          setError(`${file.name}: exceeds ${MAX_SIZE_MB}MB limit.`);
          continue;
        }
        valid.push(file);
      }

      if (files.length + valid.length > MAX_IMAGES) {
        setError(`You can upload up to ${MAX_IMAGES} images per saree.`);
        valid.length = Math.max(0, MAX_IMAGES - files.length);
      }

      const additions = valid.map((file) => ({
        file,
        previewUrl: URL.createObjectURL(file),
        isMain: false,
      }));

      const next = [...files, ...additions];
      if (next.length > 0 && !next.some((f) => f.isMain)) {
        next[0].isMain = true;
      }
      onChange(next);
    },
    [files, onChange]
  );

  const handleInputChange = (e) => {
    if (e.target.files?.length) addFiles(e.target.files);
    e.target.value = ''; // allow re-selecting the same file
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files?.length) addFiles(e.dataTransfer.files);
  };

  const removeFile = (index) => {
    const target = files[index];
    URL.revokeObjectURL(target.previewUrl);
    const next = files.filter((_, i) => i !== index);
    if (target.isMain && next.length > 0) next[0].isMain = true;
    onChange(next);
  };

  const setMain = (index) => {
    onChange(files.map((f, i) => ({ ...f, isMain: i === index })));
  };

  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-ink/80">
        Saree Images <span className="text-ink/40">(first image or the one you mark becomes the cover)</span>
      </label>

      <div
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        className={`flex cursor-pointer flex-col items-center justify-center rounded-card border-2 border-dashed px-6 py-8 text-center transition-colors ${
          isDragging ? 'border-wine bg-zari-light/20' : 'border-border bg-silk/40 hover:border-zari'
        }`}
      >
        <p className="text-sm font-medium text-ink/70">Click to upload or drag images here</p>
        <p className="mt-1 text-xs text-ink/40">
          JPEG, PNG, WEBP, or AVIF · up to {MAX_SIZE_MB}MB each · max {MAX_IMAGES} images
        </p>
        <input
          ref={inputRef}
          type="file"
          multiple
          accept={ACCEPTED_TYPES.join(',')}
          className="hidden"
          onChange={handleInputChange}
        />
      </div>

      {error && <p className="mt-2 text-sm text-rust">{error}</p>}

      {files.length > 0 && (
        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {files.map((item, index) => (
            <div
              key={item.previewUrl}
              className={`relative overflow-hidden rounded-card border bg-white ${
                item.isMain ? 'border-zari ring-2 ring-zari' : 'border-border'
              }`}
            >
              <img src={item.previewUrl} alt={`Saree preview ${index + 1}`} className="h-28 w-full object-cover" />

              {item.isMain && (
                <span className="absolute left-1.5 top-1.5 rounded bg-zari px-1.5 py-0.5 text-[10px] font-semibold uppercase text-white">
                  Main
                </span>
              )}

              <div className="flex items-center justify-between gap-1 px-1.5 py-1.5">
                {!item.isMain && (
                  <button
                    type="button"
                    onClick={() => setMain(index)}
                    className="text-[11px] text-wine hover:underline"
                  >
                    Set as main
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => removeFile(index)}
                  className="ml-auto text-[11px] text-rust hover:underline"
                >
                  Remove
                </button>
              </div>

              {uploading && (
                <div className="absolute inset-0 flex items-center justify-center bg-ink/50 text-xs font-medium text-white">
                  Uploading…
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {uploading && (
        <div className="mt-3">
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-border">
            <div
              className="h-full bg-zari transition-all"
              style={{ width: `${uploadProgress}%` }}
            />
          </div>
          <p className="mt-1 text-xs text-ink/50">Uploading to Cloudinary… {uploadProgress}%</p>
        </div>
      )}
    </div>
  );
}
