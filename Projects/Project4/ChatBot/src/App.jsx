import { useState } from 'react'
import './App.css'
import axios from "axios"

const data = {
  "model": "gpt-3.5-turbo",
  "messages": [{"role": "user", "content": "Say this is a test!"}],
  "temperature": 0.7
}
const headers = {
  "Content-Type": "application/json",
  Authorization: "Bearer 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"
 }

async function fetchData(){

  const res = await axios.get("http://api.openai.com/v1/chat/completions",
   data,{headers : headers }
   );
  console.log(res);
}
fetchData();

function App() {
  

  return (
    <>
      
    </>
  )
}

export default App
