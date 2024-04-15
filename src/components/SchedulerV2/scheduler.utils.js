    export function dateFormat(format='',dateString=''){
        let date = (dateString != '') ? new Date(dateString) : new Date()
        date.setUTCMinutes(date.getUTCMinutes() + (date.getTimezoneOffset() * -1))
        const options = {
            timeZone: 'UTC',
            month: '2-digit',
            day: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
        }

        const options2 = {
            timeZone: 'UTC',
            month: 'numeric',
            day: 'numeric',
            hour12: true,
            hour: 'numeric',
            minute: 'numeric',
            second: 'numeric',
        }

        const dateTime = date.toLocaleString('en-US', options)
        const [M, D, y, H, I, S] = dateTime.split(/[/:,\s]/).filter(el=>el != "" && el != null)
        const dateTime2 = date.toLocaleString('en-US', options2)
        const [m, d, h1, i, s,A] = dateTime2.split(/[/:,\s]/).filter(el=>el != "" && el != null)
        let lm = date.toLocaleString('en-US',{month:'long'})
        let sm = lm.substring(0,3)
        let a = A.toLowerCase()

        let h = date.toLocaleTimeString('en-US',{timeZone: 'UTC',hour12:true,hour:'2-digit'}).replace(/( AM)|( PM)/g,'')
        let H1 = date.toLocaleTimeString('en-US',{timeZone: 'UTC',hour12:false,hour:'numeric'}).replace(/( AM)|( PM)/g,'')

        const replacements = [
            { pattern: /%M/g, value: M },
            { pattern: /%m/g, value: m },
            { pattern: /%lm/g, value: lm },
            { pattern: /%sm/g, value: sm },
            { pattern: /%d/g, value: d },
            { pattern: /%D/g, value: D },
            { pattern: /%y/g, value: y },
            { pattern: /%h1/g, value: h1 },
            { pattern: /%H1/g, value: H1 },
            { pattern: /%h/g, value: h },
            { pattern: /%H/g, value: H },
            { pattern: /%i/g, value: i },
            { pattern: /%I/g, value: I },
            { pattern: /%s/g, value: s },
            { pattern: /%S/g, value: S },
            { pattern: /%A/g, value: A },
            { pattern: /%a/g, value: a }
        ]
        
        for (const { pattern, value } of replacements) 
            format = format.replace(pattern, value)
        

        return format
    }