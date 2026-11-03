import { ImagePlus, X } from "lucide-react"
import { useEffect, useRef, useState } from "react"

import { Badge } from "..//ui/badge"

import { cn } from "../../lib/utils"
import { imageUrl } from "../../redux/base/baseAPI"
import { Button } from "../ui/button"

interface ImagesUploadProps {
  files: File[]
  onChange: (files: File[]) => void
  maxImages?: number
  existingImages?: string[]
  onRemoveExisting?: (index: number) => void
  itemSize?: number // width & height in px
}

export default function ImagesUpload({
  files,
  onChange,
  maxImages = 5,
  existingImages = [],
  onRemoveExisting,
  itemSize = 140,
}: ImagesUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [previews, setPreviews] = useState<string[]>([])

  /* Generate previews */
  useEffect(() => {
    Promise.all(
      files.map(
        file =>
          new Promise<string>(resolve => {
            const reader = new FileReader()
            reader.onload = () => resolve(reader.result as string)
            reader.readAsDataURL(file)
          })
      )
    ).then(setPreviews)
  }, [files])

  const totalImages = existingImages.length + files.length
  const canAddMore = totalImages < maxImages

  const handleAddImages = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return

    const remaining = maxImages - totalImages
    const newFiles = Array.from(e.target.files).slice(0, remaining)
    onChange([...files, ...newFiles])

    if (fileInputRef.current) fileInputRef.current.value = ""
  }



  const boxStyle = {
    width: itemSize,
    height: itemSize,
  }

  return (
    <div className="space-y-2">
      <p className="text-sm text-muted-foreground">
        Product Images ({totalImages}/{maxImages})
      </p>

      <div className="flex flex-wrap gap-3">
        {/* Existing Images */}
        {existingImages.map((img, index) => (
          <div
            key={`existing-${index}`}
            style={boxStyle}
            className="relative rounded-lg overflow-hidden border"
          >
            <img
              src={`${imageUrl}${img}`}
              alt="existing"
              className="h-full w-full object-cover"
            />

            {onRemoveExisting && (
              <Button
                onClick={() => onRemoveExisting(index)}
                className="absolute top-1 right-1 rounded-full bg-red-600!"
              >
                <X size={14} />
              </Button>
            )}

            <Badge className="absolute bottom-1 left-1 text-xs">
              Existing
            </Badge>
          </div>
        ))}

        {/* New Image Previews */}
        {previews.map((src, index) => (
          <div
            key={`new-${index}`}
            style={boxStyle}
            className="relative rounded-lg overflow-hidden border border-primary"
          >
            <img
              src={src}
              alt="preview"
              className="h-full w-full object-cover"
            />

            {/* <Button
              onClick={() => removeFile(index)}
              size="sm"
              className="absolute top-1 right-1 rounded-full bg-red-600!"
            >
              <X size={14} />
            </Button> */}

            <Badge variant="secondary" className="absolute bottom-1 left-1 text-xs">
              New
            </Badge>
          </div>
        ))}

        {/* Add Image */}
        {canAddMore && (
          <label
            style={boxStyle}
            className={cn(
              "flex cursor-pointer flex-col items-center justify-center rounded-lg border border-dashed w-full",
              "bg-muted/30 hover:bg-muted transition"
            )}
          >
            <ImagePlus className="h-8 w-8 text-muted-foreground" />
            <span className="text-xs text-muted-foreground mt-1">
              Add Image
            </span>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={handleAddImages}
            />
          </label>
        )}
      </div>

      {!canAddMore && (
        <p className="text-xs text-warning">
          Maximum {maxImages} images allowed
        </p>
      )}
    </div>
  )
}
