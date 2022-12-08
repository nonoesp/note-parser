export const months = [
    'january', 'february', 'march', 'april',
    'may', 'june', 'july', 'august',
    'september', 'october', 'november', 'december',
    'jan', 'feb', 'mar', 'apr', 'may', 'jun',
    'jul', 'aug', 'sep', 'oct', 'nov', 'dec',
]

export function plainTextToHtml(text: string) {
    return text ?
    text.split('\n').map((s) => `<p>${s}</p>`).join(``) :
    ``
}

export function getLineWeight(line: Line): LineItem {
    const weightItems = line.items.filter((i) => i.type == `WEIGHT`);
    if (weightItems.length) {
        return weightItems.pop()
    }
}

export function getLineExpense(line: Line): LineItem {
    const weightItems = line.items.filter((i) => i.type == `MONEY`);
    if (weightItems.length) {
        return weightItems.pop()
    }
}

export function getLineYear(line: Line): LineItem {
    const weightItems = line.items.filter((i) => i.type == `YEAR`);
    if (weightItems.length) {
        return weightItems.pop()
    }
}

export function getLineMonth(line: Line): LineItem {
    const weightItems = line.items.filter((i) => i.type == `MONTH`);
    if (weightItems.length) {
        return weightItems.pop()
    }
}

export function getLineDay(line: Line): LineItem {
    const weightItems = line.items.filter((i) => i.type == `DAY`);
    if (weightItems.length) {
        return weightItems.pop()
    }
}

export function getLineDate(line, format = `yyyy.mm.dd`) {
    // TODO: Support different formats
    return `${line.date.year}.${line.date.month.toString().padStart(2, `0`)}.${line.date.day.toString().padStart(2, `0`)}`
}

export function getLineSummary(line: Line): string {

    switch (line.type) {
        case `YEAR`: {
            const i = getLineYear(line)
            return `${i.value}`
            break
        }
        case `MONTH`: {
            // return getLineDate(line)
            const i = getLineMonth(line)
            let monthLetters = months[i.value as number + 11].split(``)
            monthLetters[0] = monthLetters[0].toUpperCase()
            return `${monthLetters.join(``)}`
            break
        }
        case `DAY`: {
            return getLineDate(line)
            // const i = getLineDay(line)
            // return `${i.value}`
            break
        }
        case `WEIGHT`: {
            const i = getLineWeight(line)
            return `${i.value} ${i.unit}`
            break
        }
        case `EXPENSE`: {
            const i = getLineExpense(line)
            return `${(i.value as number).toFixed(2)} ${i.unit}`
            break
        }
    }

    return ``

}

export function getExpenses(lines: Line[]) {
    return getLinesByType(lines, `EXPENSE`)
}

export function getWeights(lines: Line[]) {
    return getLinesByType(lines, `WEIGHT`)
}

export function getLinesByType(lines: Line[], type = `UNDEFINED`) {
    return lines.filter((l: Line) => l.type == type)
}

// Types

export interface Line {
    type?: `WEIGHT` | `EXPENSE` | `YEAR` | `DAY` | `MONTH` | `BREAK` | `UNDEFINED`
    items?: LineItem[]
    text?: string
    date?: LineDate
}

export interface LineItem {
    type?: `WEIGHT` | `MONEY` | `TAG` | `MENTION` | `YEAR` | `DAY` | `MONTH`
    value?: number | string
    unit?: string
}

interface LineDate {
    year: number
    month: number
    day: number
}

// Parser

function getCurrentLineDate(): LineDate {
    const date = new Date();
    return {
        year: date.getFullYear(),
        month: date.getMonth(),
        day: date.getUTCDate(),
    }
}

export function parseNote(text): Line[] {

    text = text.split(`</p><p>`).join(`\n`).replace(`<p>`, ``).replace(`</p>`, ``);

    if (!text) return []

    let date: LineDate = getCurrentLineDate()

    let lines: Line[] = text
    .split('\n')
    // .filter((line: string) => {
    //     return line != ''
    // })
    .map((s: string) => {

        s = s.trim()

        const line: Line = {};
        line.text = s
        line.items = []

        // BREAK
        if (s == ``) {
            line.text = `break`
            line.type = `BREAK`
        }

        // YEAR
        const year = s.match(new RegExp(/^(19|20)\d{2}$/))
        if (year) {
            const item: LineItem = {}
            item.type = `YEAR`
            item.value = parseInt(year[0])
            line.items.push(item)

            if (!line.type) {
                line.type = `YEAR`
            }

            date = {
                year: item.value,
                month: 1,
                day: 1,
            }
        }

        // MONTH
        // TODO: Only match if trimmed string starts with month
        const month = s.match(new RegExp(`^${months.map((m) => `${m}$`).join('|')}`, 'i'))
        if (month) {
            const item: LineItem = {}
            item.type = `MONTH`
            item.value = months.indexOf(month[0].toLowerCase()) % 12 + 1
            line.items.push(item)

            if (!line.type) {
                line.type = `MONTH`
            }

            date.month = item.value
            date.day = 1
        }

        // DAY
        // https://stackoverflow.com/a/41635672
        const day = s.match(new RegExp(/\b(0?[1-9]|[12][0-9]|3[01])$\b/))
        if (day) {
            const item: LineItem = {}
            item.type = `DAY`
            item.value = parseInt(day[0])
            line.items.push(item)

            if (!line.type) {
                line.type = `DAY`
            }

            date.day = item.value
        }        

        // KG
        const weight = s.match(new RegExp(/\S+kg/g))
        weight && weight.forEach((match) => {
            const item: LineItem = {}
            item.type = `WEIGHT`
            item.unit = `kg`
            item.value = parseFloat(match.replace(item.unit, ''))
            line.items.push(item)

            if (!line.type) {
                line.type = `WEIGHT`
            }
        })

        // EUR/n
        const eurDivided = s.match(new RegExp(/\S+€(\/\d+)+/g))
        eurDivided && eurDivided.forEach((match) => {
            s = s.replace(match, ``)
            const item: LineItem = {}
            item.type = `MONEY`
            item.unit = `€`

            const numerator = parseFloat(match.replace(item.unit, ''))
            const denominator = parseInt(match.split(`/`)[1])

            item.value = numerator/denominator
            line.items.push(item)

            console.log(match);
            console.log(`${numerator} / ${denominator} = ${item.value}`);

            if (!line.type) {
                line.type = `EXPENSE`
            }
        })

        // EUR
        const eur = s.match(new RegExp(/\S+€/g))
        eur && eur.forEach((match) => {
            const item: LineItem = {}
            item.type = `MONEY`
            item.unit = `€`
            item.value = parseFloat(match.replace(item.unit, ''))
            line.items.push(item)

            if (!line.type) {
                line.type = `EXPENSE`
            }
        })

        // TAG
        const tag = s.match(new RegExp(/#\S+/g))
        tag && tag.forEach((match) => {
            const item: LineItem = {}
            item.type = `TAG`
            item.unit = `#`
            item.value = match.replace(item.unit, '')
            line.items.push(item)
        })

        // MENTION
        const mention = s.match(new RegExp(/@\S+/g))
        mention && mention.forEach((match) => {
            const item: LineItem = {}
            item.type = `MENTION`
            item.unit = `@`
            item.value = match.replace(item.unit, '')
            line.items.push(item)
        })

        if (!line.type) {
            line.type = `UNDEFINED`
        }

        line.date = Object.assign({}, date)

        return line
    })

    console.log(lines);
    return lines
}

