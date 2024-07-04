import React, { useState } from 'react'
import "./styles.css"
function FileInput({accept, id, fileHandle, text}) {
    const [fileSelected,  setFileSelected] = useState("")
    const onChange = (e) => {
        if(e.target.files[0]){

            setFileSelected(e.target.files[0].name)
            fileHandle(e.target.files[0])
        }
    }
  return (
    <>
    <label htmlFor={id} className={`custom-input ${!fileSelected ? "label-input" : "active"}`}>{fileSelected ? `${fileSelected} Selected`: text}</label>
    <input type='file' accept={accept}  id={id} style={{display: "none"}} onChange={onChange}/>
    </>
  )
}

export default FileInput