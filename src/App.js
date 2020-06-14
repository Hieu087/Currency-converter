import React, {useEffect, useState} from 'react';
import CurrencyRow from './CurrencyRow.js';
import './App.css';

const EXR_API = 'https://api.exchangeratesapi.io/latest'

function App() {
  const [currencyOptions, setCurrencyOptions] = useState([])
  const [fromCurrency, setFromCurrency] = useState()
  const [toCurrency, setToCurrency] = useState()
  const [exchangeRate, setExchangeRate] = useState()
  const [amount, setAmount] = useState(1)
  const [amountFromCurrency, setAmountFromCurrency] = useState(true)

  let toAmount, fromAmount
  if(amountFromCurrency){
    fromAmount = amount
    toAmount = amount * exchangeRate
  } else {
    toAmount = amount
    fromAmount = amount / exchangeRate
  }

  useEffect(() =>{
    fetch(EXR_API)
      .then(res => res.json())
      .then(data => {
        const firstCurrency = Object.keys(data.rates)[0]
        setCurrencyOptions([data.base, ...Object.keys(data.rates)])
        setFromCurrency(data.base)
        setToCurrency(firstCurrency)
        setExchangeRate(data.rates[firstCurrency])
      })
  }, [])

  useEffect(() => {
    if(fromCurrency != null && toCurrency != null){
      fetch(`${EXR_API}?base=${fromCurrency}&symbols=${toCurrency}`)
      .then(res => res.json())
      .then(data => setExchangeRate(data.rates[toCurrency]))
    }
  }, [fromCurrency, toCurrency])

  function fromAmountChange(e){
    setAmount(e.target.value)
    setAmountFromCurrency(true)
  }

  function toAmountChange(e){
    setAmount(e.target.value)
    setAmountFromCurrency(false)
  }

  return (
    <div className="App">
      <h1>Convert currency</h1>
      <div className="convert-section">
        <CurrencyRow
          currencyOptions  = {currencyOptions}
          selectedCurrency = {fromCurrency}
          onChangeCurrency = {e => setFromCurrency(e.target.value)}
          onChangeAmount = {fromAmountChange}
          amount = {fromAmount}
        />
        <h1>=</h1>
        <CurrencyRow
          currencyOptions  = {currencyOptions}
          selectedCurrency = {toCurrency}
          onChangeCurrency = {e => setToCurrency(e.target.value)}
          onChangeAmount = {toAmountChange}
          amount = {toAmount}
        />
      </div>
    </div>
  );
}

export default App;
