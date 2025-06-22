import { Loader2 } from 'lucide-react'

interface LoaderProps {
    text?: string
}

const Loader = ({text} : LoaderProps) => {
  return (
    <div className="flex items-center justify-center py-12">
        <Loader2 className="animate-spin h-8 w-8 text-gray-500" />
        <span className="ml-2 text-gray-600">{text ? text : "Loading..." }</span>
      </div>
  )
}

export default Loader