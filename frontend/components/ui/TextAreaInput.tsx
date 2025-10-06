import React from "react";

interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
}

export default function TextAreaInput({ label, id, ...props }: TextAreaProps) {
  return (
    <div>
      {label && (
        <label htmlFor={id} className="block text-sm font-medium text-muted-foreground mb-1">
          {label}
        </label>
      )}
      <textarea
        id={id}
        className="
          w-full p-3 bg-muted border border-border rounded-lg 
          focus:outline-none focus:ring-2 focus:ring-primary 
          transition-all duration-300
        "
        {...props}
      />
    </div>
  );
}
