export function object_is_empty(obj) {
    for (const key in obj) {
        return false
    }
    return true
}