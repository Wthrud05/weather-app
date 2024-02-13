import {cn} from '@/untils/cn'
import Image from 'next/image'
import React from 'react'

type Props = {}

export default function WeatherIcon(props: React.HTMLProps<HTMLDivElement> & {iconname: string}) {
  return (
    <div {...props} className={cn('relative h-20 w-20')}>
      <Image
        width={100}
        height={100}
        className="absolute w-full h-full"
        src={`https://openweathermap.org/img/wn/${props.iconname}@4x.png`}
        alt="weathericon"
      />
    </div>
  )
}
