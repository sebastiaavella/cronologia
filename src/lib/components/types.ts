export type TimelineData = {
    events: TimelineEvent[]
    categoriaOrder: string[]
    categoriaColors: Record<string, string>
}

export type TimelineEvent = {
    yearStart: number
    yearEnd: number
    categoria: string
    text: string
    media: string
}
