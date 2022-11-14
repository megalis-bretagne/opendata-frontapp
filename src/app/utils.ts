export function object_is_empty(obj) {
    for (const _ in obj) {
        return false
    }
    return true
}