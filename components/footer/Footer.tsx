import React from 'react'

const Footer = () => {
  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 sm:p-6 shadow-lg">
      <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4">
        🏪 Lisse Beauty
      </h3>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 text-gray-700 text-sm sm:text-base">
        <div>
          <p className="font-semibold">📍 Địa chỉ:</p>
          <p>123 Đường ABC, Quận XYZ</p>
        </div>
        <div>
          <p className="font-semibold">📞 Hotline:</p>
          <p>0123.456.789</p>
        </div>
        <div>
          <p className="font-semibold">⏰ Giờ mở cửa:</p>
          <p>8:00 - 22:00 hàng ngày</p>
        </div>
      </div>
    </div>
  );
}

export default Footer
