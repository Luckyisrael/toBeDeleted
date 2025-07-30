import dayjs from "dayjs"


export const inspectingDateFormat = (date: Date) => {
    return `${dayjs(date).format("dddd, MMMM D YYYY")}`
}

export const inspectingTimeFormat = (date: Date) => {
    return `${dayjs(date).format("h:mm A")}`
}


export const convertToISOFormat = (date: string) => {
   return dayjs(date).toISOString();
}
