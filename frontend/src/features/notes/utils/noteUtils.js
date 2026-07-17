
export function getPreview(content) {
    try {
        const firstNode = content?.content?.find(node => node.content?.length > 0)
        const text = firstNode?.content?.map(n => n.text || '').join('') || ''
        return text.replace(/#{1,6}\s/g, '').replace(/\*\*/g, '').replace(/\*/g, '').trim() || 'No content yet'
    } catch {
        return 'No content yet'
    }
}