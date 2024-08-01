import React from 'react'

function Price(props) {
  return (
      <div className="flex items-center rounded-full border bg-white/70 p-1 text-xs font-semibold text-black backdrop-blur-md dark:border-neutral-800 dark:bg-black/70 dark:text-white">
          <h3 className="mr-4 line-clamp-2 flex-grow pl-2 leading-none tracking-tight">{props.title}</h3>
          <p className="flex-none rounded-full bg-black p-2 text-white">
              {props.ammount}
              <span className="ml-1  inline @[275px]/label:inline">
                  {props.unit}
              </span>
          </p>
      </div>
  )
}

export default Price