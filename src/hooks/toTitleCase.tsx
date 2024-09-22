/**
 * A function to convert a string to Title Case
 * 
 * @param text - a string
 * 
 * @returns the modified string
 */
export default (text: string) => {
    return text.replace(/([^\W_]+[^\s-]*) */g, (t) => {
        return t.charAt(0).toUpperCase() + t.substring(1).toLowerCase()
    })
}