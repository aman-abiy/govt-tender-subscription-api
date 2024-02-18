
export const extendDateTime = (initialDate: Date, extendBy: {hours?: number, minutes?: number, seconds?: number}) : Date => {
    let newDate: Date = initialDate;

    let _hour : number = initialDate.getHours() + extendBy.hours
    let _minutes : number = initialDate.getMinutes() + extendBy.minutes
    let _seconds : number = initialDate.getSeconds() + extendBy.seconds

    newDate.setHours(_hour)
    newDate.setMinutes(_minutes)
    newDate.setSeconds(_seconds)

    return newDate;
}

export const getStartEndDate = () => {
    let date = new Date()

    // set time to midnight
    date.setUTCHours(0, 0, 0, 0)

    var dateToday = date.toISOString().split('T')[0]
    var timeToday = date.toISOString().split('T')[1].split('.')[0]
    var endDate = `${dateToday} ${timeToday}`

    // move date to yestarday
    date.setDate(date.getDate() - 1);

    var dateYestarday = date.toISOString().split('T')[0]
    var timeYesterday = date.toISOString().split('T')[1].split('.')[0]
    var startDate = `${dateYestarday} ${timeYesterday}`

    return {
        startDate,
        endDate,
        today: dateToday
    }
}