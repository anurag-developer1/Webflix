//This component displays the information about the movie or series by accepting the relevant data through props.
import {SvgIcon} from '../SvgIcon/SvgIcon';
import { getIconByName, IconName } from '../../utils/getIconByName';
import Rating from '../Rating/Rating'
function Info(props) {
    return (
        <div
      className={`mb-1 flex gap-1 text-[11px] font-light leading-[14px] opacity-75 min-[370px]:gap-1.5  sm:text-[13px] sm:leading-4 text-light`}
    >
      {props.year && (
        <>
          <p>{props.year}</p>

          <p className="-translate-y-1/4 select-none font-semibold opacity-60">.</p>
        </>
      )}

      <div className="flex items-center gap-1">
        <SvgIcon
          className={`h-2.5 w-2.5  fill-light`}
        >
          {getIconByName(props.icon)}
        </SvgIcon>

        <p>{props.icon === IconName.MOVIE ? 'Movie' :props.icon === IconName.TV ? 'series' : ''}</p>
      </div>

      {props.language && (
        <>
          <p className="-translate-y-1/4 select-none font-semibold opacity-60">.</p>
          <p>{props.language.toUpperCase()}</p>{' '}
        </>
      )}

      {props.rating && (
        <>
          <p className="-translate-y-1/4 select-none font-semibold opacity-60">.</p>

          <Rating average={props.rating}  />
        </>
      )}
    </div>
    )
}

export default Info;
