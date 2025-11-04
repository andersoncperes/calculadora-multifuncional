import React, { useState, useEffect } from 'react'
import Calculator from './Calculator.jsx'

export default function App(){
  const [dark, setDark] = useState(false)
  useEffect(()=>{
    document.documentElement.classList.toggle('dark', dark)
  },[dark])

  return (
    <div className='min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors'>
      <header className='fixed top-0 left-0 w-full bg-white/80 dark:bg-gray-800/80 backdrop-blur border-b z-50'>
        <div className='max-w-6xl mx-auto px-4 py-3 flex items-center justify-between'>
          <div className='flex items-center gap-3'>
            <div className='w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white font-bold'>C</div>
            <div>
              <div className='text-sm font-semibold'>Calculadora Multifuncional</div>
              <div className='text-xs text-gray-500 dark:text-gray-400'>Conversões · Juros · Ferramentas</div>
            </div>
          </div>
          <div className='flex items-center gap-3'>
            <nav className='hidden md:flex gap-6 text-sm'><a className='hover:text-primary' href='#'>Início</a><a className='hover:text-primary' href='#'>Conversões</a></nav>
            <button onClick={()=>setDark(d=>!d)} className='p-2 rounded-md bg-gray-100 dark:bg-gray-700'>{dark? '☀️':'🌙'}</button>
          </div>
        </div>
      </header>
      <main className='pt-28 pb-16 flex justify-center px-4'>
        <div className='max-w-6xl w-full'>
          <Calculator />
        </div>
      </main>
      <footer className='bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 py-6 text-center'>
        <div className='text-sm text-gray-600 dark:text-gray-300'>© {new Date().getFullYear()} Calculadora Multifuncional</div>
      </footer>
    </div>
  )
}
