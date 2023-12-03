import {FC} from "react"
import { PageProps } from '../../../.next/types/app/issues/new/page';

interface pageProps{
    params: {id: number}
}

const issues:FC<pageProps> = ({params}) => {
  return (
    <>
    <div>issues no: {params.id}</div>
    <button className="bg-blue-500 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded focus:outline-none focus:shadow-outline transform transition hover:scale-105 duration-300 ease-in-out">Submit</button>
    </>
  )
}

export default issues