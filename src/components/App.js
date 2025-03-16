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
    const[elements, setElements] = useState([])
    const[prevElements, setPrevElements] = useState([])
    const[designLayout, setDesignLayout] = useState(true)
    const[trigger, setTrigger] = useState(false)
    const[sessions, setSessions] = useState(0)
    const[prevTime, setPrevTime] = useState([])
    const[time, setTime] = useState([])
    const tempTime = useRef([])
    const blocker = document.getElementById("blocker")

    useEffect(() => {
        tempDays = (week.slice(startDay, ).concat(week.slice(0, startDay)).slice(0, period))
        setDays(tempDays)
        
        tempTime.current = prevTime
        tempTime.current = tempTime.current.slice(0, sessions)

        
        for(let i = 0; i < sessions; i++) {
            if(tempTime.current[i] === undefined) {
                tempTime.current.push('')
            }
        }
        for(let i = 0; i < tempTime.current.length; i++) {
            if(time[i]) {
                if(time[i].length > 0) {
                    tempTime.current[i] = time[i]
                }
            }
        }
        setTime(tempTime.current)

        handleRenderBlocks()
    }, [period, sessions, trigger, startDay])
    
    const handleRenderBlocks = () => {
        let elementCount = prevElements
        elementCount = elementCount.slice(0, (sessions * period))

        for(let i = 0; i < (period  * sessions); i ++) {
            if(elementCount[i] === undefined) {
                elementCount.push('')
            } 
        }

        console.log(elementCount, elements)
        for(let i = 0; i < elementCount.length; i++) {
                if(elements[i]) {
                    if(elements[i].length > 0) {
                        elementCount[i] = elements[i]
                    }
                }
        }
        
        setElements(elementCount)
    }


    const handleChangeText = (e, index) => {
        let tempArr = elements
        tempArr[index] = e.target.value
        setElements(tempArr)
        setTrigger(!trigger)
    }
    const handleChangeTime = (e, index) => {
        let tempArr = time
        tempArr[index] = e.target.value
        setTime(tempArr)
        setTrigger(!trigger)
    }

    const handleAddSession = (e) => {
        if(e.target.value === 0 || e.target.value === '') {
            setPrevTime(time)
            setPrevElements(elements)
        }
        setSessions(e.target.value)
        setTrigger(!trigger)
        blocker.click()
    }


    const handleViewResult = () => {
        handleRenderBlocks()
        setDesignLayout(prev => !prev)
    }

    const handleDownloadPdf = () => {
        handleRenderBlocks()
        const divToPrint = document.getElementById('toPrint')

        html2canvas(divToPrint).then((canvas) => {
            const imgData = canvas.toDataURL("image/jpeg", 1.0);

            // Create a download link
            const link = document.createElement("a");
            link.href = imgData;
            link.download = "screenshot.jpg";
        
            // Trigger the download
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        })
    }

  return (
    <div className='container'>
        <div className='side-panel'>
            <h1>Scheduler</h1>
            <label>Period (days)
                <input type='number' max={7} value={period} onChange={(e) => setPeriod(e.target.value > 7 ? 7 : e.target.value)} />
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
            <label>NO. of Sessions
                <input type='number' max={7} value={sessions} onInput={(e) => handleAddSession(e)} />
            </label>
            <button id='blocker' className='btn-render' onClick={handleRenderBlocks}>Update Blocks</button>
            <button className='btn-render' onClick={handleViewResult}>{ designLayout ? 'Results View' : 'Design View' }</button>
            <button className='btn-render' onClick={handleDownloadPdf}>Download</button>
        </div>
        <div className='work-space'>
            {
                period > 0 &&
                <div id='toPrint' className='period-box' style={{ width : `${(period) * 150 + 90}px`, height: `${(60 * (sessions)) + 50}px`, minWidth: '100px', '--period-count': period }}>
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
                    <div className='p-b-body' style={{ height: `${(sessions) * 60}px`, width: '100%' }}>
                        <div className='b-left'>
                            {
                                time.map((item, index) => {
                                    return <div key={index} className='h-day' style={{ height: `${60}px`, width: '90px' }} >
                                    {
                                        designLayout ? 
                                            <textarea defaultValue={item} onChange={(e) => handleChangeTime(e, index)} 
                                            placeholder='time ...' 
                                            style={{ width: '100%', height: '100%' }} /> :
                                            <div className='block-time'>
                                                {item}
                                            </div>
                                    }
                                    </div>
                                })
                            }
                        </div>
                        <div className='b-right' style={{ width: `${period * 150}px`, height: `100%`, "--sess-count": `${(sessions) * 40}px` }}>
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