import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getFirstTwoCharacters(name: string) {
  const splitedName = name.toUpperCase().split(" ")
  if (splitedName.length > 1) {
    return splitedName
      .slice(0, 2)
      .map((ele) => ele.charAt(0))
      .join("")
  }

  return name.toLowerCase().split("").slice(0, 2).join("")
}
