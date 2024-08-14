import React from 'react'

function layout({children,params}) {
  return (
      <div>
          <div className='h-20'></div>
        {children}
    </div>
  )
}

export default layout