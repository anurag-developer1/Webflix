import { useState } from "react"

function Rating(props) {
  
    return (
        <div className="flex justify-between gap-5">
      {props.title && <p className="font-light">{props.title}</p>}

      <div className="flex items-center gap-1">
        <p className="font-light">
          {(Math.round(props.average * 10) / 10).toFixed(1)}
        </p>

        <div
  className={`h-2 w-2 rounded-full ${
     (props.average === 0 || !props.average)
      ? 'bg-light'
      : props.average > 7.4
      ? 'bg-[#3B931C]'
      : props.average > 4.9 && props.average < 7.5
      ? 'bg-[#fff832]'
      : props.average < 5
      ? 'bg-[#E84545]'
      : ''
  }`}
></div>
      </div>
    </div>
    )
}

export default Rating
