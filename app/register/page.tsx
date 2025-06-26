'use client'

import { useState } from 'react'
import { supabase } from '../lib/supabaseClient'

export default function Register() {
  const [email, setEmail] = useState('')
  const [name, setName] = useState('') // Nombre de usuario
  const [password, setPassword] = useState('')
  const [errorMsg, setErrorMsg] = useState('')
  const [successMsg, setSuccessMsg] = useState('')

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMsg('')
    setSuccessMsg('')

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          username: name, // Se guarda como user_metadata.username
        },
      },
    })

    if (error) {
      setErrorMsg(error.message)
    } else {
      setSuccessMsg('Revisa tu correo para confirmar el registro.')
    }
  }

  return (
    <div style={{ maxWidth: 400, margin: 'auto', padding: 20 }}>
      <h1>Registro</h1>
      <form onSubmit={handleRegister}>
        <label>Nombre de usuario:</label>
        <input
          type="text"
          required
          value={name}
          onChange={e => setName(e.target.value)}
          style={{ width: '100%', marginBottom: 10 }}
        />

        <label>Email:</label>
        <input
          type="email"
          required
          value={email}
          onChange={e => setEmail(e.target.value)}
          style={{ width: '100%', marginBottom: 10 }}
        />

        <label>Contraseña:</label>
        <input
          type="password"
          required
          value={password}
          onChange={e => setPassword(e.target.value)}
          style={{ width: '100%', marginBottom: 10 }}
          minLength={6}
        />

        <button type="submit" style={{ width: '100%' }}>
          Registrarse
        </button>
      </form>

      {errorMsg && <p style={{ color: 'red' }}>{errorMsg}</p>}
      {successMsg && <p style={{ color: 'green' }}>{successMsg}</p>}
    </div>
  )
}
