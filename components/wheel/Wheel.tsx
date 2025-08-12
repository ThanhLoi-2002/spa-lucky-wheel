import React, { FC } from 'react'
import { Button } from '../ui/button';
import { Gift, Heart, Sparkles, Star } from 'lucide-react';
import { Prize } from '@/app/constants/constant';
import { Card } from '../ui/card';

interface Props {
  wheelRef: any;
  prizes: Prize[];
  isSpinning: boolean;
  spinWheel: () => void;
  result?: string | undefined | null
}

const Wheel: FC<Props> = ({
  isSpinning,
  spinWheel,
  prizes,
  wheelRef,
  result,
}) => {
  console.log(prizes
                  .map((prize, index) => {
                    const segmentAngle = 360 / prizes.length;
                    return `${prize.color} ${index * segmentAngle}deg ${
                      (index + 1) * segmentAngle
                    }deg`;
                  })
                  .join(", "))
  return (
    <div>
      <div className="relative mb-6 sm:mb-8 flex justify-center">
        <div className="relative">
          <div className="absolute -top-6 -left-6 text-yellow-400 sparkle">
            <Sparkles size={20} />
          </div>
          <div
            className="absolute -top-6 -right-6 text-pink-400 sparkle"
            style={{ animationDelay: "0.5s" }}
          >
            <Star size={20} />
          </div>
          <div
            className="absolute -bottom-6 -left-6 text-purple-400 sparkle"
            style={{ animationDelay: "1s" }}
          >
            <Heart size={20} />
          </div>
          <div
            className="absolute -bottom-6 -right-6 text-blue-400 sparkle"
            style={{ animationDelay: "1.5s" }}
          >
            <Gift size={20} />
          </div>

          <div className="relative w-72 h-72 sm:w-80 sm:h-80 md:w-96 md:h-96">
            <div
              ref={wheelRef}
              className="w-full h-full rounded-full border-4 sm:border-8 border-white shadow-2xl relative overflow-hidden"
              style={{
                background: `conic-gradient(${prizes
                  .map((prize, index) => {
                    const segmentAngle = 360 / prizes.length;
                    return `${prize.color} ${index * segmentAngle}deg ${
                      (index + 1) * segmentAngle
                    }deg`;
                  })
                  .join(", ")})`,
                animation: isSpinning ? "pulse-glow 0.5s infinite" : "none",
              }}
            >
              {prizes.map((prize, index) => {
                const segmentAngle = 360 / prizes.length;
                const angle = (index) * segmentAngle + segmentAngle / 2;
console.log(angle)
                return (
                  <div
                    key={prize.id}
                    className="absolute top-1/2 right-1/2 left-1/2"
                    style={{
                      transform: `translate(-50%, -50%) rotate(${angle}deg) translateX(60px)`,
                      // transformOrigin: "left center",
                    }}
                  >
                    <div className="flex items-center text-white font-bold drop-shadow-lg">
                      <span className="text-lg sm:text-xl mr-2">
                        {prize.icon}
                      </span>
                      <span className="text-xs sm:text-sm text-center whitespace-nowrap">
                        {prize.text.length > 15
                          ? prize.text.substring(0, 15) + "..."
                          : prize.text}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="absolute top-1/2 right-0 z-10">
              <div className="w-0 h-0 border-l-8 border-r-8 border-b-12 rotate-[270deg] border-l-transparent border-r-transparent border-b-red-500 drop-shadow-lg"></div>
            </div>

            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full border-2 sm:border-4 border-white shadow-xl flex items-center justify-center z-10">
              <span className="text-xl sm:text-2xl">🎯</span>
            </div>
          </div>
        </div>
      </div>

      <div className="mb-6 sm:mb-8">
        <Button
          onClick={spinWheel}
          disabled={isSpinning}
          className="px-6 sm:px-8 py-3 sm:py-4 text-lg sm:text-xl font-bold bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white rounded-full shadow-lg transform transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSpinning ? (
            <span className="flex items-center gap-2">
              <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              Đang quay...
            </span>
          ) : (
            "🎲 QUAY NGAY!"
          )}
        </Button>
      </div>

      {result && (
        <Card className="max-w-sm sm:max-w-md mx-auto p-4 sm:p-6 bg-gradient-to-r from-green-400 to-blue-500 text-white border-0 shadow-xl animate-bounce mb-6">
          <div className="text-center">
            <h3 className="text-xl sm:text-2xl font-bold mb-2">
              🎉 Chúc mừng! 🎉
            </h3>
            <p className="text-lg sm:text-xl font-semibold">{result}</p>
            <p className="text-sm mt-2 opacity-90">
              Hãy đến spa để sử dụng ưu đãi nhé!
            </p>
          </div>
        </Card>
      )}
    </div>
  );
};

export default Wheel
