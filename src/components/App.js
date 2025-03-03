import { useEffect, useState } from 'react'
import './App.css'

export default function App() {
    const[period, setPeriod] = useState(0)
    const[startDay, setStartDay] = useState(0)
    const week = ['Monday','Tuesday','Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
    const[days, setDays] = useState([])
    let tempDays
    const[startTime, setStartTime] = useState('00: 00 am')
    const[timeRange, setTimeRange] = useState(20)

    useEffect(() => {
        tempDays = (week.slice(startDay, ).concat(week.slice(0, startDay)).slice(0, period))
        setDays(tempDays)
        setStartTime(startTime)
    }, [period, startDay, startTime])

    const handleStartDay = (e) => {
        setStartDay(e.target.value)        
    }
    console.log(typeof(startTime))
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
                <input type='number' onChange={(e) => setStartTime(e.target.value)} />
            </label>
        </div>
        <div className='work-space'>
            {
                period > 0 &&
                <div className='period-box' style={{ width : `${period * 150}px`, height: '80vh' }}>
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
                </div>
            }
        </div>
    </div>
  )
}