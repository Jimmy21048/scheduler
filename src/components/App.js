import { useEffect, useRef, useState } from 'react'
import './App.css'

export default function App() {
    const[period, setPeriod] = useState(0)
    const[startDay, setStartDay] = useState(0)
    const week = ['Mon','Tue','Wed', 'Thur', 'Fri', 'Sat', 'Sun']
    const[days, setDays] = useState([])
    let tempDays
    const[startTime, setStartTime] = useState('00:00')
    const[endTime, setEndTime] = useState('00:00')
    const[timeRange, setTimeRange] = useState("00:20")
    const[trigger, setTrigger] = useState(false)
    const[sessionCount, setSessionCount] = useState(0)
    const[timeFrame, setTimeFrame] = useState([])

    useEffect(() => {
        tempDays = (week.slice(startDay, ).concat(week.slice(0, startDay)).slice(0, period))
        setDays(tempDays)
        setStartTime(startTime)
        setEndTime(endTime)
        setTimeRange(timeRange)

        let [startHours, startMinutes] = startTime.split(':').map(Number)
        let [endHours, endMinutes] = endTime.split(':').map(Number)
        let [rangeHours, rangeMinutes] = timeRange.split(':').map(Number)
        let minuteStart = (startHours * 60) + startMinutes
        let minuteEnd = (endHours * 60) + endMinutes
        let minuteRange = (rangeHours * 60) + rangeMinutes
        let newDate = new Date();
        const tempEndHours = new Date()
        let count = 0
        const timeFrameArray = []
        
        
        while(minuteEnd - minuteStart >= minuteRange) {
            if(count == 0 ) {
                newDate.setHours(startHours, startMinutes); 
                tempEndHours.setHours(startHours, startMinutes + (minuteRange))
                startHours = newDate.getHours()
                startMinutes = newDate.getMinutes()
                endHours = tempEndHours.getHours()
                endMinutes = tempEndHours.getMinutes()
            } else {
                newDate.setHours(startHours, startMinutes + minuteRange); 
                tempEndHours.setHours(startHours, startMinutes + (minuteRange * 2))
                minuteStart +=minuteRange
                startHours = newDate.getHours()
                startMinutes = newDate.getMinutes()
                endHours = tempEndHours.getHours()
                endMinutes = tempEndHours.getMinutes()
            }
            count ++
            // setTimeFrame(prev => prev.push(`${startHours}: ${startMinutes} - ${endHours}: ${endMinutes}`))
            timeFrameArray.push(`${String(startHours).padStart(2, "0")}:${String(startMinutes).padStart(2, "0")} - ${String(endHours).padStart(2, "0")}:${String(endMinutes).padStart(2, "0")}`)
        }
        
        setTimeFrame(timeFrameArray)
        setSessionCount(count)
    }, [period, startDay, startTime, endTime, timeRange])
    console.log(timeFrame)
    const handleStartDay = (e) => {
        setStartDay(e.target.value)        
    }
    
  return (
    <div className='container'>
        <div className='side-panel'>
            <label>Period (days)
                <input type='number' max={7} value={period} onChange={(e) => setPeriod(e.target.value)} />
            </label>
            <label>Start Day
                <select onChange={(e) => handleStartDay(e)}>
                    <option value={0}>Monday</option>
                    <option value={1}>Tuesday</option>
                    <option value={2}>Wednesday</option>
                    <option value={3}>Thurday</option>
                    <option value={4}>Friday</option>
                    <option value={5}>Saturday</option>
                    <option value={6}>Sunday</option>
                </select>
            </label>
            <label>Start Time
                <input type='time' onChange={(e) => setStartTime(e.target.value)} />
            </label>
            <label>Time Range (minutes)
                <input type='time' value={timeRange} onChange={(e) => setTimeRange(e.target.value)} />
            </label>
            <label>End Time
                <input type='time' onChange={(e) => setEndTime(e.target.value)} />
            </label>
        </div>
        <div className='work-space'>
            {
                period > 0 &&
                <div className='period-box' style={{ width : `${(period - 1) * 120}px`, height: `${80 * period + 70}px` }}>
                    <div className='p-b-header'>
                    <div className='h-day' style={{ minWidth: `${100}px`, width: '100px' }}></div>
                    {
                        timeFrame.slice(0, -1).map((item, index) => {
                            return <div key={index} className='h-day' style={{ width: `${100 / period}%` }}>
                                <p>{item}</p>
                            </div>
                        })
                    }
                    </div>
                    <div className='p-b-body' style={{ height: `${period * 80}px` }}>
                        <div className='b-left' style={{ width: `${100}px` }}>
                        {
                            days.map((day) => {
                                return <div key={day} className='h-day' style={{ height: `${80}px`, width: '100px' }}>
                                    <p>{day}</p>
                                </div>
                            })
                        }
                        </div>
                        <div className='b-right'></div>
                    </div>
                </div>
            }
        </div>
    </div>
  )
}