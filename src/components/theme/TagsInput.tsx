// src/components/theme/TagsInput.tsx
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { XIcon } from "lucide-react";
import { useState } from "react";

interface TagsInputProps {
  value: string[];
  onChange: (value: string[]) => void;
}

export function TagsInput({ value, onChange }: TagsInputProps) {
  const [inputValue, setInputValue] = useState("");

  const safeValue = Array.isArray(value) ? value : [];

  const addTag = () => {
    const newTag = inputValue.trim();
    if (newTag && !safeValue.includes(newTag)) {
      onChange([...safeValue, newTag]);
    }
    setInputValue("");
  };

  const removeTag = (tagToRemove: string) => {
    onChange(safeValue.filter((tag) => tag !== tagToRemove));
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addTag();
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-2">
        {safeValue.map((tag) => (
          <Badge
            key={tag}
            variant="secondary"
            className="flex items-center gap-1 px-2 py-1"
          >
            {tag}
            <div
              className="flex cursor-pointer items-center justify-center"
              onClick={(e) => {
                e.stopPropagation();
                removeTag(tag);
              }}
            >
              <XIcon
                size={12}
                className="text-muted-foreground hover:text-black"
              />
            </div>
          </Badge>
        ))}
      </div>

      <Input
        placeholder="Add a tag and press Enter"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={handleKeyDown}
      />
    </div>
  );
}
