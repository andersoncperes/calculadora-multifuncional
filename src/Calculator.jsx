import React, { useState } from 'react'

const formatNumber = (n, d=4) => {
  if (!isFinite(n)) return '—'
  return Number(n.toFixed(d)).toLocaleString('pt-BR')
}

export default function Calculator(){
  const [tab, setTab] = useState('currency')
  const [value, setValue] = useState('')
  const [fromUnit, setFromUnit] = useState('m')
  const [toUnit, setToUnit] = useState('cm')
  const [currencyFrom, setCurrencyFrom] = useState('USD')
  const [currencyTo, setCurrencyTo] = useState('BRL')
  const [rate, setRate] = useState('')
  const [time, setTime] = useState('')
  const [result, setResult] = useState('')

  const measures = {
    m:1, cm:0.01, mm:0.001, km:1000,
    in:0.0254, ft:0.3048, yd:0.9144, mi:1609.344,
    g:0.001, kg:1, mg:0.000001, ton:1000,
    l:1, ml:0.001
  }

  const currencies = {
    USD:1, BRL:5.6, EUR:0.93, GBP:0.78, JPY:150
  }

  const clearAll = ()=>{
    setValue(''); setRate(''); setTime(''); setResult('')
  }

  const convertMeasure = ()=>{
    const v = parseFloat(value.replace(',','.'))
    if (isNaN(v)) return setResult('Digite um número válido')
    if(!measures[fromUnit] || !measures[toUnit]) return setResult('Unidade inválida')
    const inMeters = v * measures[fromUnit]
    const converted = inMeters / measures[toUnit]
    setResult(`${formatNumber(converted,4)} ${toUnit}`)
  }

  const convertCurrency = ()=>{
    const v = parseFloat(value.replace(',','.'))
    if (isNaN(v)) return setResult('Digite um número válido')
    const base = v / currencies[currencyFrom]
    const converted = base * currencies[currencyTo]
    try {
      const fmt = new Intl.NumberFormat('pt-BR',{style:'currency', currency: currencyTo})
      setResult(fmt.format(Number(converted.toFixed(2))))
    } catch {
      setResult(`${currencyTo} ${formatNumber(converted,2)}`)
    }
  }

  const calcSimple = ()=>{
    const P = parseFloat(value.replace(',','.'))
    const i = parseFloat(rate.replace(',','.'))
    const t = parseFloat(time.replace(',','.'))
    if ([P,i,t].some(x=>isNaN(x))) return setResult('Preencha capital, taxa e tempo')
    const interest = P * (i/100) * t
    const total = P + interest
    setResult(`Juros: ${formatNumber(interest,2)} — Total: ${formatNumber(total,2)}`)
  }

  const calcCompound = ()=>{
    const P = parseFloat(value.replace(',','.'))
    const i = parseFloat(rate.replace(',','.'))
    const t = parseFloat(time.replace(',','.'))
    if ([P,i,t].some(x=>isNaN(x))) return setResult('Preencha capital, taxa e tempo')
    const total = P * Math.pow(1 + i/100, t)
    const interest = total - P
    setResult(`Juros: ${formatNumber(interest,2)} — Total: ${formatNumber(total,2)}`)
  }

  const handleCalculate = ()=>{
    setResult('')
    if (tab==='measure') convertMeasure()
    else if(tab==='currency') convertCurrency()
    else if(tab==='simple') calcSimple()
    else if(tab==='compound') calcCompound()
  }

  return (
    <div className='grid lg:grid-cols-3 gap-8'>
      <section className='lg:col-span-2 card'>
        <div className='flex gap-3 flex-wrap mb-6'>
          <button onClick={()=>{setTab('currency'); setResult('')}} className={`px-3 py-2 rounded-full ${tab==='currency'?'bg-primary text-white':'bg-gray-100 dark:bg-gray-700'}`}>Moedas</button>
          <button onClick={()=>{setTab('measure'); setResult('')}} className={`px-3 py-2 rounded-full ${tab==='measure'?'bg-primary text-white':'bg-gray-100 dark:bg-gray-700'}`}>Medidas</button>
          <button onClick={()=>{setTab('simple'); setResult('')}} className={`px-3 py-2 rounded-full ${tab==='simple'?'bg-primary text-white':'bg-gray-100 dark:bg-gray-700'}`}>Juros Simples</button>
          <button onClick={()=>{setTab('compound'); setResult('')}} className={`px-3 py-2 rounded-full ${tab==='compound'?'bg-primary text-white':'bg-gray-100 dark:bg-gray-700'}`}>Juros Compostos</button>
        </div>

        <div className='space-y-4'>
          <label className='block text-sm text-gray-600 dark:text-gray-300'>Valor</label>
          <input value={value} onChange={e=>setValue(e.target.value)} placeholder='Digite o valor' inputMode='decimal' className='w-full rounded-2xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 px-4 py-3'/>
          
          {tab==='measure' && (
            <div className='grid grid-cols-2 gap-3'>
              <select value={fromUnit} onChange={e=>setFromUnit(e.target.value)} className='rounded-2xl border px-4 py-3 bg-white dark:bg-gray-900'>
                {Object.keys(measures).map(u=> <option key={u} value={u}>{u}</option>)}
              </select>
              <select value={toUnit} onChange={e=>setToUnit(e.target.value)} className='rounded-2xl border px-4 py-3 bg-white dark:bg-gray-900'>
                {Object.keys(measures).map(u=> <option key={u} value={u}>{u}</option>)}
              </select>
            </div>
          )}

          {tab==='currency' && (
            <div className='grid grid-cols-2 gap-3'>
              <select value={currencyFrom} onChange={e=>setCurrencyFrom(e.target.value)} className='rounded-2xl border px-4 py-3 bg-white dark:bg-gray-900'>
                {Object.keys(currencies).map(c=> <option key={c} value={c}>{c}</option>)}
              </select>
              <select value={currencyTo} onChange={e=>setCurrencyTo(e.target.value)} className='rounded-2xl border px-4 py-3 bg-white dark:bg-gray-900'>
                {Object.keys(currencies).map(c=> <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          )}

          {(tab==='simple' || tab==='compound') && (
            <div className='grid grid-cols-2 gap-3'>
              <input placeholder='Taxa (%)' value={rate} onChange={e=>setRate(e.target.value)} className='rounded-2xl border px-4 py-3 bg-gray-50 dark:bg-gray-900'/>
              <input placeholder='Tempo (períodos)' value={time} onChange={e=>setTime(e.target.value)} className='rounded-2xl border px-4 py-3 bg-gray-50 dark:bg-gray-900'/>
            </div>
          )}

          <div className='flex gap-3'>
            <button onClick={handleCalculate} className='flex-1 btn btn-primary'>Calcular</button>
            <button onClick={clearAll} className='flex-1 btn btn-ghost'>Limpar</button>
          </div>

          <div className='pt-2'>
            <div className='min-h-[56px] flex items-center justify-center rounded-xl bg-gray-100 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-4 text-center'>
              {result ? <span className='text-lg font-semibold text-emerald-600 dark:text-emerald-400'>{result}</span> : <span className='text-sm text-gray-500 dark:text-gray-400'>O resultado aparecerá aqui</span>}
            </div>
          </div>
        </div>
      </section>

      <aside className='space-y-6'>
        <div className='card'>
          <h3 className='text-sm font-semibold mb-2'>Dica rápida</h3>
          <p className='text-sm text-gray-600 dark:text-gray-300'>Escolha a aba, digite o valor e clique Calcular. Use Limpar para resetar.</p>
        </div>

        <div className='card h-40 flex items-center justify-center text-sm text-gray-500 dark:text-gray-400'>Espaço reservado para anúncio (Google AdSense)</div>
      </aside>
    </div>
  );
}