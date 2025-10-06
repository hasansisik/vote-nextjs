"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Eye, EyeOff } from "lucide-react"
import { useState } from "react"

interface PasswordInputProps {
  id: string
  name: string
  label: string
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  placeholder?: string
  className?: string
  required?: boolean
  autoComplete?: string
  onKeyPress?: (e: React.KeyboardEvent) => void
  showPassword?: boolean
  setShowPassword?: (show: boolean) => void
  error?: string
  success?: string
}

export function PasswordInput({ 
  id, 
  name,
  label, 
  value, 
  onChange, 
  placeholder,
  className = "",
  required = false,
  autoComplete = "new-password",
  onKeyPress,
  showPassword: externalShowPassword,
  setShowPassword: externalSetShowPassword,
  error,
  success
}: PasswordInputProps) {
  const [internalShowPassword, setInternalShowPassword] = useState(false)
  
  const showPassword = externalShowPassword !== undefined ? externalShowPassword : internalShowPassword
  const setShowPassword = externalSetShowPassword || setInternalShowPassword

  return (
    <div className="grid gap-2">
      <Label htmlFor={id} className="block text-sm font-medium text-gray-700">
        {label}
      </Label>
      <div className="relative">
        <Input
          id={id}
          name={name}
          type={showPassword ? "text" : "password"}
          value={value}
          onChange={onChange}
          onKeyPress={onKeyPress}
          placeholder={placeholder}
          className={`pr-10 bg-white ${className}`}
          required={required}
          autoComplete={autoComplete}
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
        >
          {showPassword ? (
            <EyeOff className="h-4 w-4" />
          ) : (
            <Eye className="h-4 w-4" />
          )}
        </button>
      </div>
      {error && (
        <p className="text-xs text-orange-500">
          {error}
        </p>
      )}
      {success && !error && (
        <p className="text-xs text-green-500">
          {success}
        </p>
      )}
    </div>
  )
}
