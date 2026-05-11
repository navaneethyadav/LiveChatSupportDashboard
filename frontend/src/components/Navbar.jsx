function Navbar() {
    return (
      <div className="h-20 bg-slate-900 border-b border-slate-800 flex items-center justify-between px-8">
  
        <div>
          <h2 className="text-2xl font-bold">
            Dashboard
          </h2>
  
          <p className="text-slate-400 text-sm">
            Monitor support operations
          </p>
        </div>
  
        <div className="flex items-center gap-4">
  
          <div className="w-10 h-10 rounded-full bg-cyan-500 flex items-center justify-center font-bold">
            N
          </div>
  
        </div>
  
      </div>
    )
  }
  
  export default Navbar