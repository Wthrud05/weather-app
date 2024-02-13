import {cn} from '@/untils/cn'
import {useTheme} from 'next-themes'
import React from 'react'
import {FiDroplet} from 'react-icons/fi'
import {ImMeter} from 'react-icons/im'
import {LuEye, LuSunrise, LuSunset} from 'react-icons/lu'
import {MdAir} from 'react-icons/md'

export interface WeatherDetailProps {
  visibility: string
  humidity: string
  windSpeed: string
  airPressure: string
  sunrise: string
  sunset: string
}

export default function WeatherDetails(props: WeatherDetailProps) {
  const {
    visibility = '25km',
    humidity = '61%',
    windSpeed = '7 m/s',
    airPressure = '1012 hPa',
    sunrise = '6:20',
    sunset = '18:48',
  } = props

  return (
    <>
      <SingleWeatherDetail info="Visability" icon={<LuEye />} value={visibility} />
      <SingleWeatherDetail info="Humidity" icon={<FiDroplet />} value={humidity} />
      <SingleWeatherDetail info="Wind Speed" icon={<MdAir />} value={windSpeed} />
      <SingleWeatherDetail info="Air Pressure" icon={<ImMeter />} value={airPressure} />
      <SingleWeatherDetail info="Sunrise" icon={<LuSunrise />} value={sunrise} />
      <SingleWeatherDetail info="Sunset" icon={<LuSunset />} value={sunset} />
    </>
  )
}

export interface singleWeatherDetailProps {
  info: string
  icon: React.ReactNode
  value: string
}

function SingleWeatherDetail(props: singleWeatherDetailProps) {
  const {resolvedTheme} = useTheme()

  return (
    <div className="flex flex-col justify-between gap-2 items-center text-xs text-black/80">
      <p
        className={cn(
          `whitespace-nowrap ${resolvedTheme === 'dark' ? 'text-white' : 'text-black'}`,
        )}
      >
        {props.info}
      </p>
      <div className={cn(`text-3xl ${resolvedTheme === 'dark' ? 'text-white' : 'text-black'}`)}>
        {props.icon}
      </div>
      <p className={cn(`${resolvedTheme === 'dark' ? 'text-white' : 'text-black'}`)}>
        {props.value}
      </p>
    </div>
  )
}
