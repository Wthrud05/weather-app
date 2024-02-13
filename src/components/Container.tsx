import {cn} from '@/untils/cn'
import {useTheme} from 'next-themes'
import React from 'react'

export const Container = (props: React.HTMLProps<HTMLDivElement>) => {
  const {resolvedTheme} = useTheme()

  return (
    <div
      {...props}
      className={cn(
        `w-full ${
          resolvedTheme === 'dark' ? 'bg-zinc-950 border-gray-600' : 'bg-white border-white'
        } border  rounded-xl flex py-4 shadow-sm`,
        props.className,
      )}
    />
  )
}
