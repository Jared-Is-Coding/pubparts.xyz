export const toTitleCase = (text: string) => {
    return text.replace(/([^\W_]+[^\s-]*) */g, (t) => {
        return t.charAt(0).toUpperCase() + t.substring(1).toLowerCase()
    })
}