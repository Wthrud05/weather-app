import React from 'react'
import {Container} from './Container'
import WeatherIcon from './WeatherIcon'
import WeatherDetails, {WeatherDetailProps} from './WeatherDetails'
import {kelvitToCelsius} from '@/untils/KelvinToCelsius'
import {cn} from '@/untils/cn'
import {useTheme} from 'next-themes'

export interface ForecastWeatherDetailProps extends WeatherDetailProps {
  weatherIcon: string
  date: string
  day: string
  temp: number
  feels_like: number
  temp_min: number
  temp_max: number
  description: string
}

export default function ForecastWeatherDetail(props: ForecastWeatherDetailProps) {
  const {resolvedTheme} = useTheme()

  const {
    weatherIcon = '02d',
    date = '02.08',
    day = 'Thursday',
    temp,
    feels_like,
    temp_min,
    temp_max,
    description,
  } = props

  return (
    <Container className="gap-4">
      <section className="flex gap-4 items-center px-4">
        <div className="flex flex-col items-center gap-1">
          <WeatherIcon iconname={weatherIcon} />
          <p>{date}</p>
          <p className="text-sm">{day}</p>
        </div>

        <div className="flex flex-col px-4">
          <span>{kelvitToCelsius(temp ?? 0)}</span>
          <p className="text-xs space-x-1 whitespace-nowrap">
            <span>Fells like</span>
            <span>{kelvitToCelsius(feels_like ?? 0)}°</span>
          </p>
          <p className={cn(`capitalize ${resolvedTheme === 'dark' ? 'text-white' : 'text-black'}`)}>
            {description}
          </p>
        </div>
      </section>
      <section
        className={cn(
          'overflow-x-auto flex justify-between gap-4 px-4 w-full pr-10',
          'scroll-container',
        )}
      >
        <WeatherDetails {...props} />
      </section>
    </Container>
  )
}
