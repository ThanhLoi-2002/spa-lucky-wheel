import React, { FC, useEffect, useRef } from "react";
import { Button } from "../ui/button";
import { Gift, Heart, Sparkles, Star } from "lucide-react";
import { Prize } from "@/app/constants/constant";
import { Card } from "../ui/card";

interface Props {
  wheelRef: React.RefObject<HTMLCanvasElement | null>;
  prizes: Prize[];
  isSpinning: boolean;
  spinWheel: () => void;
  result?: string | undefined | null;
}

const Wheel: FC<Props> = ({
  isSpinning,
  spinWheel,
  prizes,
  wheelRef,
  result,
}) => {
  const drawWheel = () => {
    const canvas = wheelRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const numOptions = prizes.length;
    const arcSize = (2 * Math.PI) / numOptions;
    const radius = canvas.width / 2;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.save();
    ctx.translate(radius, radius);

    for (let i = 0; i < numOptions; i++) {
      const option = prizes[i];
      const angle = i * arcSize;

      ctx.beginPath();
      ctx.arc(0, 0, radius - 10, angle, angle + arcSize, false);
      ctx.arc(0, 0, 0, angle + arcSize, angle, true);
      ctx.fillStyle = option.color;
      ctx.fill();

      ctx.save();
      ctx.fillStyle = "white";
      ctx.font = "bold 20px Be Vietnam Pro";
      console.log(ctx.font)
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      const textAngle = angle + arcSize / 2;
      ctx.rotate(textAngle);
      
      let shortenedText = option.text;
      if (option.text.length > 12) {
        shortenedText = option.text.substring(0, 12) + "...";
      }
      ctx.fillText(option.icon, radius * 0.3, 0);
      ctx.fillText(shortenedText, radius * 0.65, 0);
      ctx.restore();
    }

    ctx.beginPath();
    ctx.arc(0, 0, 25, 0, 2 * Math.PI);
    ctx.fillStyle = "white";
    ctx.shadowColor = "rgba(0,0,0,0.2)";
    ctx.shadowBlur = 10;
    ctx.fill();
    ctx.shadowBlur = 0;

    ctx.beginPath();
    ctx.arc(0, 0, 8, 0, 2 * Math.PI);
    ctx.fillStyle = "#d1d5db";
    ctx.fill();
    ctx.restore();
  };

  useEffect(() => {
    drawWheel();
  }, [prizes]);

  return (
    <div className="flex flex-col items-center">
      <div className="relative mb-6 sm:mb-8 flex justify-center">
        <div className="relative w-72 h-72 sm:w-80 sm:h-80 md:w-96 md:h-96 rounded-full border-2 sm:border-4 border-white shadow-2xl">
          <canvas
            ref={wheelRef}
            width={500}
            height={500}
            className="w-full h-full"
          />
          <div className="absolute top-1/2 right-0 z-10">
            <div className="w-0 h-0 border-l-8 border-r-8 border-b-12 rotate-[270deg] border-l-transparent border-r-transparent border-b-red-500 drop-shadow-lg"></div>
          </div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-10 h-10 sm:w-14 sm:h-14 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full border-2 sm:border-4 border-white shadow-xl flex items-center justify-center z-10">
            <span className="text-xl sm:text-2xl">🎯</span>
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
              <span className="text-lg sm:text-xl">Đang quay...</span>
            </span>
          ) : (
            <span className="text-lg sm:text-xl">🎲 QUAY NGAY!</span>
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

export default Wheel;
