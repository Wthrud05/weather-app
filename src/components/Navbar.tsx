'use client'

import React, {useState} from 'react'
import {MdSunny} from 'react-icons/md'
import {MdMyLocation} from 'react-icons/md'
import {SlLocationPin} from 'react-icons/sl'
import SearchBox from './SearchBox'
import axios from 'axios'
import {useAtom} from 'jotai'
import {loadingCityAtom, placeAtom} from '@/app/atom'
import ThemeSwitch from './ThemeSwitch'
import {cn} from '@/untils/cn'
import {useTheme} from 'next-themes'

type Props = {
  location?: string
}

const API_KEY = process.env.NEXT_PUBLIC_WEATHER_API_KEY

export default function Navbar({location}: Props) {
  const [city, setCity] = useState('')
  const [error, setError] = useState('')

  const [suggestions, setSuggestions] = useState<string[]>([])
  const [showSuggestions, setShowSuggestions] = useState<boolean>(false)

  const [place, setPlace] = useAtom(placeAtom)
  const [_, setLoadingCity] = useAtom(loadingCityAtom)
  const {resolvedTheme} = useTheme()

  async function handleInputChange(value: string) {
    setCity(value)
    if (value.length >= 3) {
      try {
        const res = await axios.get(
          `https://api.openweathermap.org/data/2.5/find?q=${value}&appid=${API_KEY}`,
        )
        const suggestions = res.data.list.map((item: any) => item.name)
        setSuggestions(suggestions)
        setError('')
        setShowSuggestions(true)
      } catch (error) {
        setSuggestions([])
        setShowSuggestions(false)
      }
    } else {
      setSuggestions([])
      setShowSuggestions(false)
    }
  }

  function handleSuggestionClick(value: string) {
    setCity(value)
    setShowSuggestions(false)
  }

  function handleSubmitSearch(e: React.FormEvent<HTMLFormElement>) {
    setLoadingCity(true)
    e.preventDefault()
    if (suggestions.length == 0) {
      setError('Location was not found')
      setLoadingCity(false)
    } else {
      setError('')
      setTimeout(() => {
        setLoadingCity(false)
        setPlace(city)
        setShowSuggestions(false)
      }, 500)
    }
  }

  function handleCurrentLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(async (position) => {
        const {latitude, longitude} = position.coords

        try {
          setLoadingCity(true)
          const res = await axios.get(
            `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${API_KEY}`,
          )
          setTimeout(() => {
            setLoadingCity(false)
            setPlace(res.data.name)
          }, 500)
        } catch (error) {
          setLoadingCity(false)
        }
      })
    }
  }

  return (
    <>
      <nav
        className={cn(
          `shadow-sm sticky top-0 left-0 z-50 ${
            resolvedTheme === 'dark' ? 'bg-zinc-950' : 'bg-white'
          }`,
        )}
      >
        <div className="h-[80px] w-full flex justify-between items-center max-w-7xl px-3 mx-auto">
          <div className="flex items-center justify-center gap-2">
            <h2
              className={cn(
                `${resolvedTheme === 'dark' ? 'text-white' : 'text-gray-500'} text-3xl`,
              )}
            >
              Weather
            </h2>
            <MdSunny className="text-3xl mt-1 text-yellow-300" />
          </div>
          <section className="flex gap-2 items-center">
            <ThemeSwitch />
            <MdMyLocation
              title="Your Current Location"
              onClick={handleCurrentLocation}
              className="text-2xl text-gray-400 hover:opacity-80 cursor-pointer"
            />
            <SlLocationPin className="text-2xl" />
            <p
              className={cn(
                `${resolvedTheme === 'dark' ? 'text-white' : 'text-slate-900/80'} text-sm`,
              )}
            >
              {place}
            </p>
            <div className="relative hidden md:flex">
              <SearchBox
                value={city}
                onSubmit={handleSubmitSearch}
                onChange={(e) => handleInputChange(e.target.value)}
              />
              <SuggestionBox {...{showSuggestions, suggestions, handleSuggestionClick, error}} />
            </div>
          </section>
        </div>
      </nav>
      <section className="flex max-w-7xl px-3 md:hidden">
        <div className="relative">
          <SearchBox
            value={city}
            onSubmit={handleSubmitSearch}
            onChange={(e) => handleInputChange(e.target.value)}
          />
          <SuggestionBox {...{showSuggestions, suggestions, handleSuggestionClick, error}} />
        </div>
      </section>
    </>
  )
}

function SuggestionBox({
  showSuggestions,
  suggestions,
  handleSuggestionClick,
  error,
}: {
  showSuggestions: boolean
  suggestions: string[]
  handleSuggestionClick: (item: string) => void
  error: string
}) {
  return (
    <>
      {((showSuggestions && suggestions.length > 1) || error) && (
        <ul className="mb-4 bg-white absolute border top-[44px] left-0 border-gray-300 rounded-md min-w-[200px] flex flex-col gap-1 py-2 px-2">
          {error && suggestions.length < 1 && <li className="text-red-500 p-1">{error}</li>}
          {suggestions.map((item, i) => (
            <li
              key={i}
              className="cursor-pointer p-1 rounded-none hover:bg-gray-200"
              onClick={() => handleSuggestionClick(item)}
            >
              {item}
            </li>
          ))}
        </ul>
      )}
    </>
  )
}
