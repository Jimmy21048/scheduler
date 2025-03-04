import { useEffect, useRef, useState } from 'react'
import './App.css'

export default function App() {
    const[period, setPeriod] = useState(0)
    const[startDay, setStartDay] = useState(0)
    const week = ['Monday','Tuesday','Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
    const[days, setDays] = useState([])
    let tempDays
    const[startTime, setStartTime] = useState('00:00')
    const[endTime, setEndTime] = useState('00:00')
    const[timeRange, setTimeRange] = useState("00:20")
    const[trigger, setTrigger] = useState(false)
    const[sessionCount, setSessionCount] = useState(0)

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
        let count = 0
        
        
        while(minuteEnd - minuteStart >= minuteRange) {
            count ++
            newDate.setHours(startHours, startMinutes + minuteRange); 
            minuteStart +=minuteRange
            startHours = newDate.getHours()
            startMinutes = newDate.getMinutes()
           
            console.log(startHours, startMinutes)
        }

        setSessionCount(count)
    }, [period, startDay, startTime, endTime, timeRange])
    console.log(sessionCount)
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
                <div className='period-box' style={{ width : `${period * 150}px`, height: '90vh' }}>
                    <div className='p-b-header'>
                    {
                        days.map((day) => {
                            return <div key={day} className='h-day' style={{ width: `${100 / period}%` }}>
                                <p>{day}</p>
                                <p>{startTime}</p>
                            </div>
                        })
                    }
                    </div>
                    <div className='p-b-body'>
                        <div className='b-left' style={{ width: `${100 / period}%` }}>
                        {/* {
                            days.map((day) => {
                                return <div key={day} className='h-day' style={{ height: `${100 / period}%` }}>
                                    <p>{day}</p>
                                </div>
                            })
                        } */}
                        </div>
                        <div className='b-right'></div>
                    </div>
                </div>
            }
        </div>
    </div>
  )
}