import React from 'react'

const Header = () => {
  return (
    <div className="mb-3 sm:mb-4">
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent mb-2 sm:mb-4">
            🌸 Vòng Quay May Mắn 🌸
          </h1>
          <p className="text-lg sm:text-xl text-gray-600 font-medium">
            Lisse Beauty - Quay ngay để nhận ưu đãi hấp dẫn!
          </p>
        </div>
      </div>
    </div>
  );
}

export default Header
