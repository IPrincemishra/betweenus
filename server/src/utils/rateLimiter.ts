const socketEvents = new Map<string, Map<string, number>>()

export const isRateLimited = (
    socketId: string,
    event: string,
    cooldownMs: number
) => {
    const now = Date.now()

    if (!socketEvents.has(socketId)) {
        socketEvents.set(socketId, new Map())
    }

    const events = socketEvents.get(socketId)!

    const previous = events.get(event)

    if (previous && now - previous < cooldownMs) return true

    events.set(event, now)

    return false
}

export const clearSocketLimits = (socketId: string) => {
    socketEvents.delete(socketId)
}

