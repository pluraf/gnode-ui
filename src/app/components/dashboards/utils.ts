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


export function createPlaceholderBlob(width: number, height: number): string
{
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;

    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Cannot get canvas context');

    ctx.fillStyle = "#cccccc";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    return canvas.toDataURL('image/jpeg');
  }