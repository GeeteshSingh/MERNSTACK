import React, { useEffect, useState } from 'react'
import jwt from 'jsonwebtoken'
import { useNavigate } from 'react-router-dom'

const Dashboard = () => {
  const navigate = useNavigate()
  const [quote, setQuote] = useState('')
  const [tempQuote, setTempQuote] = useState('')

  async function populateQuote() {
    const req = await fetch('http://localhost:1337/api/quote', {
      headers: {
        'x-access-token': localStorage.getItem('token')
      }
    })
    const data = await req.json()
    if (data.status === 'ok') {
      setQuote(data.quote)
    } else {
      alert(data.error)
    }
    console.log(data)
  }

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      const user = jwt.decode(token)
      if (!user) {
        localStorage.removeItem('token')
        navigate.replace('/login')
      } else {
        populateQuote()
      }
    }
  }, [navigate])

  async function updateQuote(event) {
    event.preventDefault()
    const req = await fetch('http://localhost:1337/api/quote', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-access-token': localStorage.getItem('token')
      },
      body: JSON.stringify({
        quote: tempQuote
      })
    })
    const data = await req.json()
    if (data.status === 'ok') {
      setTempQuote('')
      setQuote(tempQuote)
    } else {
      alert(data.error)
    }
    console.log(data)
  }

  return (
    <div>
      <h1>Your quote of the day: {quote || 'No quote found'}</h1>
      <form onSubmit={updateQuote}>
        <input
          type='text'
          placeholder='Your Quote'
          value={tempQuote}
          onChange={e => setTempQuote(e.target.value)}
        />
        <input type='submit' value='Update Quote' />
      </form>
    </div>
  )
}

export default Dashboard
