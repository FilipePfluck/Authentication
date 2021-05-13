import { FormEvent, useContext, useState } from "react"
import { useAuth } from "../contexts/AuthContext"

import styles from '../styles/Home.module.scss'

export default function Home() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const { signIn } = useAuth()

  async function handleSubmit(event: FormEvent){
    event.preventDefault()

    const data = {
      email,
      password
    }

    await signIn(data)
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <input type="email" value={email} onChange={e => setEmail(e.target.value)}/>
      <input type="password" value={password} onChange={e => setPassword(e.target.value)}/>
      <button type="submit">Entrar</button>
    </form>
  )
}
