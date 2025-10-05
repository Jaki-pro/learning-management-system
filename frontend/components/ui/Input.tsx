interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export default function Input({ label, id, ...props }: InputProps) {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-muted-foreground mb-1">
        {label}
      </label>
      <input
        id={id}
        className="
          w-full p-3 bg-muted border border-border rounded-lg 
          focus:outline-none focus:ring-2 focus:ring-primary 
          transition-all duration-300"
        {...props}
      />
    </div>
  );
}