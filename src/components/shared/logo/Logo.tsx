import * as React from "react"
import Image from "next/image"
import { cn } from "@/lib/utils"

interface LogoProps {
  variant?: "full" | "single"
  className?: string
}

export function Logo({ variant = "full", className }: LogoProps) {
  const isSingle = variant === "single"
  const src = isSingle ? "/logo/logo_fav.png" : "/logo/logo.png"

  return (
    <div className={cn("relative flex items-center justify-center select-none", className)}>
      <Image
        src={src}
        alt="BeatX Logo"
        width={isSingle ? 36 : 140}
        height={isSingle ? 36 : 40}
        className="object-contain"
        priority
      />
    </div>
  )
}