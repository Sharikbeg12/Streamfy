import { LoaderIcon } from "lucide-react"


const PageLoader = () => {
  return (
    <div className="min-h-screen flex items-centre justify-center">
        <LoaderIcon className="animate-spin size-10 text-primary"/>
      
    </div>
  )
}

export default PageLoader
