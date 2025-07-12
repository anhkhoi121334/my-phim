import React, { useRef } from "react";

const PriceSlider = ({ min, max, value, onChange }) => {
  const trackRef = useRef();

  // Calculate position percentage for sliders
  const getPercent = (val) => ((val - min) / (max - min)) * 100;
  
  // Format prices for display
  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price);
  };

  // Handle drag events for slider thumbs
  const handleDrag = (idx, e) => {
    const track = trackRef.current;
    if (!track) return;

    const rect = track.getBoundingClientRect();
    const clientX = e.type === "touchmove" ? e.touches[0].clientX : e.clientX;
    let percent = ((clientX - rect.left) / rect.width) * 100;
    percent = Math.max(0, Math.min(100, percent));
    
    // Convert percent to value within min-max range
    let newValue = Math.round((percent / 100) * (max - min) + min);
    
    // Create new array and update appropriate index
    let newArr = [...value];
    newArr[idx] = newValue;
    
    // Don't allow min thumb to go beyond max thumb and vice versa
    if (idx === 0 && newArr[0] > newArr[1]) newArr[0] = newArr[1];
    if (idx === 1 && newArr[1] < newArr[0]) newArr[1] = newArr[0];
    
    onChange(newArr);
  };

  return (
    <div className="px-2 py-2">
      {/* Price Range Display */}
      <div className="mb-5 text-center">
        <span className="text-xl font-bold text-indigo-600">
          {formatPrice(value[0])} - {formatPrice(value[1])}
        </span>
      </div>
      
      {/* Slider Track */}
      <div
        className="price-slider-container mb-4 relative"
        ref={trackRef}
        style={{ height: 8, background: "#e5e7eb", borderRadius: 9999 }}
      >
        {/* Progress Bar */}
        <div
          className="price-slider-progress"
          style={{
            position: "absolute",
            left: `${getPercent(value[0])}%`,
            right: `${100 - getPercent(value[1])}%`,
            height: "100%",
            background: "linear-gradient(90deg, #6366f1 0%, #818cf8 100%)",
            borderRadius: 9999,
          }}
        />
        
        {/* Slider Thumbs */}
        {[0, 1].map((idx) => (
          <div
            key={idx}
            className="price-slider-thumb"
            style={{
              left: `${getPercent(value[idx])}%`,
              position: "absolute",
              top: "50%",
              transform: "translate(-50%, -50%)",
              width: 20,
              height: 20,
              background: "#ffffff",
              border: "2px solid #6366f1",
              borderRadius: "50%",
              cursor: "pointer",
              boxShadow: "0 1px 3px rgba(0,0,0,0.3)",
              zIndex: 10,
              transition: "transform 0.1s",
              ":hover": {
                transform: "translate(-50%, -50%) scale(1.1)",
              }
            }}
            onMouseDown={(e) => {
              e.preventDefault();
              const move = (ev) => handleDrag(idx, ev);
              const up = () => {
                window.removeEventListener("mousemove", move);
                window.removeEventListener("mouseup", up);
              };
              window.addEventListener("mousemove", move);
              window.addEventListener("mouseup", up);
            }}
            onTouchStart={(e) => {
              e.preventDefault();
              const move = (ev) => handleDrag(idx, ev);
              const up = () => {
                window.removeEventListener("touchmove", move);
                window.removeEventListener("touchend", up);
              };
              window.addEventListener("touchmove", move);
              window.addEventListener("touchend", up);
            }}
          />
        ))}
      </div>
      
      {/* Min/Max Labels */}
      <div className="flex justify-between mb-4 text-sm text-gray-600">
        <span>{formatPrice(min)}</span>
        <span>{formatPrice(max)}</span>
      </div>
      
      {/* Input Fields */}
      <div className="flex items-center space-x-3">
        <div className="relative w-full">
          <input
            type="number"
            value={value[0]}
            min={min}
            max={value[1]}
            onChange={e => onChange([+e.target.value, value[1]])}
            className="w-full pl-2 pr-8 py-2 border border-gray-300 rounded-lg text-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          />
          <span className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 text-xs">₫</span>
        </div>
        <span className="text-gray-400">-</span>
        <div className="relative w-full">
          <input
            type="number"
            value={value[1]}
            min={value[0]}
            max={max}
            onChange={e => onChange([value[0], +e.target.value])}
            className="w-full pl-2 pr-8 py-2 border border-gray-300 rounded-lg text-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          />
          <span className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 text-xs">₫</span>
        </div>
      </div>
    </div>
  );
};

export default PriceSlider; 