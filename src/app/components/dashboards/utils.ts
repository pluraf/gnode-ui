import { DateTime } from 'luxon';

export function formatSensorData(dataPoint: any): String
{
    if (typeof dataPoint === typeof 1)
    {
        return dataPoint.toFixed(2);
    }
    else if (typeof dataPoint === typeof "")
    {
        const date = new Date(dataPoint);
        if (! isNaN(date.getTime())) {
            return  DateTime.fromJSDate(date).toFormat('yyyy-MM-dd HH:mm');;
        }
    }
    return dataPoint;
}