import { useEffect, useState } from 'react'
import './App.css'
import html2canvas from "html2canvas"
import { jsPDF } from "jspdf"
import Flatpickr from "react-flatpickr";
import "flatpickr/dist/flatpickr.min.css";

export default function App() {
    const[period, setPeriod] = useState(0)
    const[startDay, setStartDay] = useState(0)
    const week = ['Mon','Tue','Wed', 'Thur', 'Fri', 'Sat', 'Sun']
    const[days, setDays] = useState([])
    let tempDays
    const[startTime, setStartTime] = useState('08:00')
    const[endTime, setEndTime] = useState('19:00')
    const[timeRange, setTimeRange] = useState("02:00")
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
        for(let i = 0; i < elementCount.length; i++) {
            if(elements.length > 0) {
                if(elements[i]) {
                    if(elements[i].length > 0) {
                        elementCount[i] = elements[i]
                    }
                }
            }
        }
        setElements(elementCount)
    }


    const handleChangeText = (e, index) => {
        let tempArr = elements
        tempArr[index] = e.target.value
        setElements(tempArr)
    }

    const handleViewResult = () => {
        handleRenderBlocks()
        setDesignLayout(prev => !prev)
    }

    const handleDownloadPdf = () => {
        handleRenderBlocks()
        const divToPrint = document.getElementById('toPrint')

        html2canvas(divToPrint).then((canvas) => {
            // const imgData = canvas.toDataURL("image/png");
            // const pdf = new jsPDF("p", "mm", "a4");
            
            // const imgWidth = 200;
            // const imgHeight = (canvas.height * imgWidth) / canvas.width;

            // pdf.addImage(imgData, "PNG", 5, 20, imgWidth, imgHeight);
            // pdf.save("scheduled.pdf");
            const imgData = canvas.toDataURL("image/png");
            const pdf = new jsPDF("p", "mm", "a4");
        
            // Get the actual width and height of the div in pixels
            const divWidth = divToPrint.offsetWidth;
            const divHeight = divToPrint.offsetHeight;
        
            // Convert pixels to mm (assuming 96 dpi, 1 inch = 25.4 mm)
            const pxToMm = 25.4 / 96; // Conversion factor
            const imgWidth = divWidth * pxToMm > 200 ? 200 : (divWidth * pxToMm);
            const imgHeight = divHeight * pxToMm;
        
            pdf.addImage(imgData, "PNG", 5, 10, imgWidth, imgHeight); // Adding a margin of 10mm
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
                <select onChange={(e) => {setStartDay(e.target.value); handleRenderBlocks()}} onFocus={handleRenderBlocks} onBlur={handleRenderBlocks} >
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
                <Flatpickr
                    value={startTime}
                    onChange={(selectedDates, dateStr) => {setStartTime(dateStr); handleRenderBlocks()}}
                    onBlur={handleRenderBlocks}
                    onFocus={handleRenderBlocks}
                    options={{
                    enableTime: true,
                    noCalendar: true,
                    dateFormat: "H:i",
                    time_24hr: true,
                    }}
                />
            </label>
            <label>Session Period
                <Flatpickr
                    value={timeRange}
                    onChange={(selectedDates, dateStr) => {setTimeRange(dateStr); handleRenderBlocks()}}
                    onBlur={handleRenderBlocks}
                    onFocus={handleRenderBlocks}
                    options={{
                    enableTime: true,
                    noCalendar: true,
                    dateFormat: "H:i",
                    time_24hr: true,
                    }}
                />
            </label>
            <label>End Time
                <Flatpickr
                    value={endTime}
                    onChange={(selectedDates, dateStr) => {setEndTime(dateStr); handleRenderBlocks()}}
                    onBlur={handleRenderBlocks}
                    onFocus={handleRenderBlocks}
                    options={{
                    enableTime: true,
                    noCalendar: true,
                    dateFormat: "H:i",
                    time_24hr: true,
                    }}
                />
            </label>
            <button className='btn-render' onClick={handleRenderBlocks}>Update Blocks</button>
            <button className='btn-render' onClick={handleViewResult}>{ designLayout ? 'Results View' : 'Design View' }</button>
            <button className='btn-render' onClick={handleDownloadPdf}>Download</button>
        </div>
        <div className='work-space'>
        {
            period < 1 && <div className='no-events'>No Events set</div>
        }
            {
                period > 0 &&
                <div id='toPrint' className='period-box' style={{ width : `${(period) * 150 + 90}px`, height: `${(60 * (sessionCount - 1)) + 50}px`, minWidth: '100px', '--period-count': period }}>
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