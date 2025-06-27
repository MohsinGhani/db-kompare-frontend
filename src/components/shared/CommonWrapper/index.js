import React from 'react'

const CommonWrapper = ({children,className}) => {
  return (
    <div  className={`pt-28 w-full 2xl:px-20 lg:pl-6 px-3 ${className}`}>{children}</div>
  )
}

export default CommonWrapper