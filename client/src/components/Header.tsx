import whiteLogo from "../assets/logo-white-growth99.svg"

const Header = () => {
  return (
    <div className='bg-[#161d1d] py-4 px-6'>
      <div className='flex justify-center items-center'>
        <img 
          src={whiteLogo}
          alt="Growth99 Logo" 
          className="h-8 w-auto"
        />
      </div>
    </div>
  )
}

export default Header