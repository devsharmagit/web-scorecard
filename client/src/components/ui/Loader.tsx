interface LoaderProps {
    text?: string
}

const Loader = ({text} : LoaderProps) => {
  return (
    <div className="flex flex-col gap-2  items-center justify-center py-12">
        <img className="h-[72px] w-[72px] object-center object-cover" src='/loader.gif' />
        <p className="text-sm font-semibold text-center">
        {text ? text :  "We’re on it! Thanks for requesting your website scorecard, please check back in a few minutes."}  
        </p>
      </div>
  )
}

export default Loader