export function cn(...inputs: (string | undefined | null | false | Record<string, boolean>)[]) {
  return inputs
    .flatMap(input => {
      if (!input) return []
      if (typeof input === 'string') return input
      return Object.entries(input)
        .filter(([, value]) => value)
        .map(([key]) => key)
    })
    .join(" ")
}
