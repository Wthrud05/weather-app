'use client'

import {Container} from '@/components/Container'
import ForecastWeatherDetail from '@/components/ForecastWeatherDetail'
import Navbar from '@/components/Navbar'
import WeatherDetails from '@/components/WeatherDetails'
import WeatherIcon from '@/components/WeatherIcon'
import {kelvitToCelsius} from '@/untils/KelvinToCelsius'
import {cn} from '@/untils/cn'
import {getDayOrNightIcon} from '@/untils/getDayOrNightIcon'
import {metersToKilometers} from '@/untils/metersToKilometers'
import axios from 'axios'
import {format, fromUnixTime, parseISO} from 'date-fns'
import {useAtom} from 'jotai'
import {useQuery} from 'react-query'
import {loadingCityAtom, placeAtom} from './atom'
import {useEffect} from 'react'
import {useTheme} from 'next-themes'

interface WeatherDetail {
  dt: number
  main: {
    temp: number
    feels_like: number
    temp_min: number
    temp_max: number
    pressure: number
    sea_level: number
    grnd_level: number
    humidity: number
    temp_kf: number
  }
  weather: {
    id: number
    main: string
    description: string
    icon: string
  }[]
  clouds: {
    all: number
  }
  wind: {
    speed: number
    deg: number
    gust: number
  }
  visibility: number
  pop: number
  sys: {
    pod: string
  }
  dt_txt: string
}

interface WeatherData {
  cod: string
  message: number
  cnt: number
  list: WeatherDetail[]
  city: {
    id: number
    name: string
    coord: {
      lat: number
      lon: number
    }
    country: string
    population: number
    timezone: number
    sunrise: number
    sunset: number
  }
}

export default function Home() {
  const [place, setPlace] = useAtom(placeAtom)
  const [loadingCity, setLoadingCity] = useAtom(loadingCityAtom)
  const {resolvedTheme} = useTheme()

  const {isLoading, error, data, refetch} = useQuery<WeatherData>('repoData', async () => {
    const {data} = await axios.get(
      `https://api.openweathermap.org/data/2.5/forecast?q=${place}&appid=${process.env.NEXT_PUBLIC_WEATHER_API_KEY}&cnt=56`,
    )
    return data
  })

  useEffect(() => {
    refetch()
  }, [place, refetch])

  const uniqueDates = [
    ...new Set(data?.list.map((entry) => new Date(entry.dt * 1000).toISOString().split('T')[0])),
  ]

  const firstDataForEachDate = uniqueDates.map((date) => {
    return data?.list.find((entry) => {
      const entryDate = new Date(entry.dt * 1000).toISOString().split('T')[0]
      const entryTime = new Date(entry.dt * 1000).getHours()
      return entryDate === date && entryTime >= 6
    })
  })

  const firstData = data?.list[0]

  if (isLoading)
    return (
      <div className="flex items-center min-h-screen justify-center">
        <p className="animate-bounce">Loading...</p>
      </div>
    )

  return (
    <div
      className={cn(
        `flex flex-col gap-4 ${
          resolvedTheme === 'dark' ? 'bg-zinc-900' : 'bg-gray-100'
        } min-h-screen`,
      )}
    >
      <Navbar location={data?.city.name} />
      <main className="px-3 max-w-7xl mx-auto flex flex-col gap-9 w-full pb-10 pt-4">
        {loadingCity ? (
          <WeatherSkeletonComponent />
        ) : (
          <>
            <section className="space-y-4">
              <div className="space-y-2">
                <h2 className="flex gap-1 text-2xl items-end">
                  <p>{format(parseISO(firstData?.dt_txt ?? ''), 'EEEE')}</p>
                  <p className="text-lg">
                    ({format(parseISO(firstData?.dt_txt ?? ''), 'dd.MM.yyyy')})
                  </p>
                </h2>
                <Container className="gap-10 px-6 items-center">
                  <div className="flex flex-col px-4">
                    <span className="text-5xl">{kelvitToCelsius(firstData?.main.temp ?? 0)}°</span>
                    <p className="text-xs space-x-1 whitespace-nowrap">
                      <span>Feels like</span>
                      <span>{kelvitToCelsius(firstData?.main.feels_like ?? 0)}°</span>
                    </p>
                    <p className="text-xs space-x-2">
                      <span>{kelvitToCelsius(firstData?.main.temp_min ?? 0)}°↓</span>
                      <span>{kelvitToCelsius(firstData?.main.temp_max ?? 0)}°↑</span>
                    </p>
                  </div>
                  <div
                    className={cn(
                      'flex gap-10 sm:gap-16 overflow-x-auto w-full justify-between pr-3',
                      'scroll-container',
                    )}
                  >
                    {data?.list.map((item, i) => (
                      <div
                        className="flex flex-col justify-between gap-2 items-center text-xs font-semibold"
                        key={i}
                      >
                        <p className="whitespace-nowrap">
                          {format(parseISO(item.dt_txt), 'h:mm a')}
                        </p>
                        <WeatherIcon
                          iconname={getDayOrNightIcon(item.weather[0].icon, item.dt_txt)}
                        />
                        <p>{kelvitToCelsius(item.main.temp ?? 0)}°</p>
                      </div>
                    ))}
                  </div>
                </Container>
              </div>
              <div className="flex gap-4">
                <Container className="w-fit justify-center flex-col px-4 items-center">
                  <p className="capitalize text-center">{firstData?.weather[0].description}</p>
                  <WeatherIcon
                    iconname={getDayOrNightIcon(
                      firstData?.weather[0].icon ?? '0',
                      firstData?.dt_txt ?? '',
                    )}
                  />
                </Container>
                <Container
                  className={cn(
                    `${
                      resolvedTheme === 'dark' ? 'bg-orange-400/80' : 'bg-yellow-300/80'
                    } px-6 gap-4 justify-between overflow-x-auto`,
                    'scroll-container',
                  )}
                >
                  <WeatherDetails
                    visibility={metersToKilometers(firstData?.visibility ?? 10000)}
                    humidity={`${firstData?.main.humidity}%`}
                    windSpeed={`${firstData?.wind.speed.toFixed(0)} m/s`}
                    airPressure={`${firstData?.main.pressure} hPa`}
                    sunrise={format(fromUnixTime(data?.city.sunrise ?? 1707369071), 'hh:mm')}
                    sunset={format(fromUnixTime(data?.city.sunset ?? 1707401776), 'hh:mm')}
                  />
                </Container>
              </div>
            </section>

            <section className="flex w-full flex-col gap-4">
              <p className="text-2xl">Forcast (7 days)</p>
              {firstDataForEachDate.map((date, i) => {
                const dtTxt = date ? date.dt_txt : ''
                const parsedDate = dtTxt ? parseISO(dtTxt) : null
                const formattedDate = parsedDate ? format(parsedDate, 'dd.MM') : ''
                const formattedDay = parsedDate ? format(parsedDate, 'EEEE') : ''

                return (
                  <ForecastWeatherDetail
                    key={i}
                    description={date?.weather[0].description ?? ''}
                    weatherIcon={date?.weather[0].icon ?? '01d'}
                    date={formattedDate}
                    day={formattedDay}
                    feels_like={date?.main.feels_like ?? 0}
                    temp={date?.main.temp ?? 0}
                    temp_max={date?.main.temp_max ?? 0}
                    temp_min={date?.main.temp_min ?? 0}
                    airPressure={`${date?.main.pressure} hPa`}
                    humidity={`${date?.main.humidity}%`}
                    sunrise={format(fromUnixTime(data?.city.sunrise ?? 1707369071), 'h:mm')}
                    sunset={format(fromUnixTime(data?.city.sunset ?? 1707401776), 'h:mm')}
                    visibility={`${metersToKilometers(date?.visibility ?? 10000)}km`}
                    windSpeed={`${date?.wind.speed} m/s`}
                  />
                )
              })}
            </section>
          </>
        )}
      </main>
    </div>
  )
}

const WeatherSkeletonComponent = () => {
  return (
    <section className="space-y-8 ">
      <div className="space-y-2 animate-pulse">
        <div className="flex gap-1 text-2xl items-end ">
          <div className="h-6 w-24 bg-gray-300 rounded"></div>
          <div className="h-6 w-24 bg-gray-300 rounded"></div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((index) => (
            <div key={index} className="flex flex-col items-center space-y-2">
              <div className="h-6 w-16 bg-gray-300 rounded"></div>
              <div className="h-6 w-6 bg-gray-300 rounded-full"></div>
              <div className="h-6 w-16 bg-gray-300 rounded"></div>
            </div>
          ))}
        </div>
      </div>
      <div className="flex flex-col gap-4 animate-pulse">
        <p className="text-2xl h-8 w-36 bg-gray-300 rounded"></p>
        {[1, 2, 3, 4, 5, 6, 7].map((index) => (
          <div key={index} className="grid grid-cols-2 md:grid-cols-4 gap-4 ">
            <div className="h-8 w-28 bg-gray-300 rounded"></div>
            <div className="h-10 w-10 bg-gray-300 rounded-full"></div>
            <div className="h-8 w-28 bg-gray-300 rounded"></div>
            <div className="h-8 w-28 bg-gray-300 rounded"></div>
          </div>
        ))}
      </div>
    </section>
  )
}
