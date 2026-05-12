function StatsCard({
    title,
    value,
    icon,
    color
  }) {
  
    return (
  
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-lg hover:scale-[1.02] transition-all duration-300">
  
        <div className="flex items-center justify-between">
  
          <div>
  
            <p className="text-slate-400 text-sm mb-2">
              {title}
            </p>
  
            <h2 className="text-4xl font-bold text-white">
              {value}
            </h2>
  
          </div>
  
          <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl ${color}`}>
  
            {icon}
  
          </div>
  
        </div>
  
      </div>
    )
  }
  
  export default StatsCard