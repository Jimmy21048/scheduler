import { useEffect, useRef, useState } from 'react'
import './App.css'
import html2canvas from "html2canvas"
import { jsPDF } from "jspdf"

export default function App() {
    const[period, setPeriod] = useState(0)
    const[startDay, setStartDay] = useState(0)
    const week = ['Mon','Tue','Wed', 'Thur', 'Fri', 'Sat', 'Sun']
    const[days, setDays] = useState([])
    let tempDays
    const[startTime, setStartTime] = useState('00:00')
    const[endTime, setEndTime] = useState('00:00')
    const[timeRange, setTimeRange] = useState("00:20")
    const[sessionCount, setSessionCount] = useState(0)
    const[timeFrame, setTimeFrame] = useState([])
    const[elements, setElements] = useState([])
    const[designLayout, setDesignLayout] = useState(true)

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
            if(count === 0 ) {
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

            timeFrameArray.push(`${String(startHours).padStart(2, "0")}:${String(startMinutes).padStart(2, "0")} - ${String(endHours).padStart(2, "0")}:${String(endMinutes).padStart(2, "0")}`)
        }
        
        setTimeFrame(timeFrameArray)
        setSessionCount(count)

        handleRenderBlocks()
    }, [period, startDay, startTime, endTime, timeRange,])
    
    const handleRenderBlocks = () => {
        let elementCount = []
        for(let i = 0; i < (period ) * (sessionCount - 1); i ++) {
            elementCount.push('')
        }
        setElements(elementCount)
    }


    const handleChangeText = (e, index) => {
        let tempArr = elements
        tempArr[index] = e.target.value
        setElements(tempArr)
    }

    const handleViewResult = () => {
        setDesignLayout(prev => !prev)
    }

    const handleDownloadPdf = () => {
        const divToPrint = document.getElementById('toPrint')

        html2canvas(divToPrint).then((canvas) => {
            const imgData = canvas.toDataURL("image/png");
            const pdf = new jsPDF("p", "mm", "a4");
            
            const imgWidth = 210; // A4 size width in mm
            const imgHeight = (canvas.height * imgWidth) / canvas.width;

            pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);
            pdf.save("scheduled.pdf");
        })
    }
  return (
    <div className='container'>
        <div className='side-panel'>
            <h1>Scheduler</h1>
            <label>Period (days)
                <input type='number' max={7} value={period} onChange={(e) => setPeriod(e.target.value)} />
            </label>
            <label>Start Day
                <select onChange={(e) => setStartDay(e.target.value)}>
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
            <label>Time Range
                <input type='time' value={timeRange} onChange={(e) => setTimeRange(e.target.value)} />
            </label>
            <label>End Time
                <input type='time' onChange={(e) => setEndTime(e.target.value)} />
            </label>
            <button className='btn-render' onClick={handleRenderBlocks}>Correct blocks</button>
            <button className='btn-render' onClick={handleViewResult}>{ designLayout ? 'View Result' : 'Design View' }</button>
            <button className='btn-render' onClick={handleDownloadPdf}>Download</button>
        </div>
        <div className='work-space'>
            {
                period > 0 &&
                <div id='toPrint' className='period-box' style={{ width : `${(period) * 150 + 90}px`, height: `${(60 * (sessionCount - 1)) + 50}px`, minWidth: '100px' }}>
                    <div className='p-b-header'>
                    <div className='h-day' style={{ minWidth: `${90}px`, width: '90px', height: '50px' }}></div>
                        {
                            days.map((day) => {
                                return <div key={day} className='h-day' style={{ width: `150px`, minWidth: '100px', height: '50px' }}>
                                    <p>{day}</p>
                                </div>
                            })
                        }
                    </div>
                    <div className='p-b-body' style={{ height: `${(sessionCount - 1) * 60}px`, width: '100%' }}>
                        <div className='b-left'>
                            {
                                timeFrame.slice(0, -1).map((item, index) => {
                                    return <div key={index} className='h-day' style={{ height: `${60}px`, width: '90px' }} >
                                        <p>{item}</p>
                                    </div>
                                })
                            }
                        </div>
                        <div className='b-right' style={{ width: `${period * 150}px`, height: `100%`, "--sess-count": `${(sessionCount - 1) * 40}px` }}>
                        {
                            elements.map((element, index) => {
                                return <div key={index} className='block' style={{ width: `${100 / period}%` }} >
                                    {
                                        designLayout ? 
                                            <textarea defaultValue={element} onChange={(e) => handleChangeText(e, index)} 
                                            placeholder='text here...' 
                                            style={{ width: '100%', height: '100%' }} /> :
                                            <div className='block-text'>
                                                {element}
                                            </div>
                                    }
                                </div>
                            })
                        }
                        </div>
                    </div>
                </div>
            }
        </div>
    </div>
)}