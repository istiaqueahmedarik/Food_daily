import React from 'react'

function layout({children}) {
  return (
      <div>
          <header className="px-6 py-4 border-b">
              <h1 className="text-2xl font-bold text-foreground">System Logs</h1>
          </header>
          {children}
    </div>
  )
}

export default layout