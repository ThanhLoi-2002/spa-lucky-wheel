"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Sparkles,
  Gift,
  Star,
  Heart,
  Settings,
  Plus,
  Trash2,
  Volume2,
  VolumeX,
} from "lucide-react";

interface Prize {
  id: number;
  text: string;
  color: string;
  icon: string;
}

interface SpinHistory {
  phone: string;
  prize: string;
  date: string;
}

const defaultPrizes: Prize[] = [
  { id: 1, text: "Giảm 5% HĐ", color: "#FF6B6B", icon: "💰" },
  { id: 2, text: "Tặng Gương", color: "#4ECDC4", icon: "🪞" },
  { id: 3, text: "Tặng 1 suất trị thâm N-B-M", color: "#45B7D1", icon: "✨" },
  { id: 4, text: "Tặng 1 suất làm hồng Ti-Bi", color: "#96CEB4", icon: "💋" },
  {
    id: 5,
    text: "Tặng voucher trị giá 50k tiền mặt",
    color: "#FFEAA7",
    icon: "🎁",
  },
  { id: 6, text: "Tặng son dưỡng cấp ẩm", color: "#DDA0DD", icon: "💄" },
  { id: 7, text: "Giảm 10% HĐ", color: "#FFB6C1", icon: "🏷️" },
  { id: 8, text: "Tặng lo dưỡng trắng N-B-M", color: "#98FB98", icon: "🧴" },
  {
    id: 9,
    text: "Tặng voucher trị giá 50K tiền mặt",
    color: "#F0E68C",
    icon: "💸",
  },
];

export default function SpaLuckyWheel() {
  const [isSpinning, setIsSpinning] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [rotation, setRotation] = useState(0);
  const [prizes, setPrizes] = useState<Prize[]>(defaultPrizes);
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [newPrize, setNewPrize] = useState({
    text: "",
    color: "#FF6B6B",
    icon: "🎁",
  });
  const [isSoundEnabled, setIsSoundEnabled] = useState(true);
  const [phone, setPhone] = useState("");
  const [isPhoneValid, setIsPhoneValid] = useState(false);
  const [spinHistory, setSpinHistory] = useState<SpinHistory[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const wheelRef = useRef<HTMLDivElement>(null);
  const tickIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const createAudioContext = () => {
    return new (window.AudioContext || (window as any).webkitAudioContext)();
  };

  const playSpinSound = () => {
    if (!isSoundEnabled) return;
    try {
      const audioContext = createAudioContext();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      oscillator.frequency.setValueAtTime(200, audioContext.currentTime);
      oscillator.frequency.exponentialRampToValueAtTime(
        100,
        audioContext.currentTime + 0.5
      );

      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(
        0.01,
        audioContext.currentTime + 0.5
      );

      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.5);
    } catch (error) {
      console.log("Audio not supported");
    }
  };

  const playTickSound = () => {
    if (!isSoundEnabled) return;
    try {
      const audioContext = createAudioContext();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
      oscillator.type = "square";

      gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(
        0.01,
        audioContext.currentTime + 0.1
      );

      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.1);
    } catch (error) {
      console.log("Audio not supported");
    }
  };

  const playWinSound = () => {
    if (!isSoundEnabled) return;
    try {
      const audioContext = createAudioContext();

      // Tạo âm thanh chiến thắng với nhiều tần số
      const frequencies = [523, 659, 784, 1047]; // C5, E5, G5, C6

      frequencies.forEach((freq, index) => {
        setTimeout(() => {
          const oscillator = audioContext.createOscillator();
          const gainNode = audioContext.createGain();

          oscillator.connect(gainNode);
          gainNode.connect(audioContext.destination);

          oscillator.frequency.setValueAtTime(freq, audioContext.currentTime);
          oscillator.type = "sine";

          gainNode.gain.setValueAtTime(0.2, audioContext.currentTime);
          gainNode.gain.exponentialRampToValueAtTime(
            0.01,
            audioContext.currentTime + 0.3
          );

          oscillator.start(audioContext.currentTime);
          oscillator.stop(audioContext.currentTime + 0.3);
        }, index * 100);
      });
    } catch (error) {
      console.log("Audio not supported");
    }
  };

  const playButtonSound = () => {
    if (!isSoundEnabled) return;
    try {
      const audioContext = createAudioContext();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      oscillator.frequency.setValueAtTime(600, audioContext.currentTime);
      oscillator.frequency.setValueAtTime(800, audioContext.currentTime + 0.05);
      oscillator.type = "sine";

      gainNode.gain.setValueAtTime(0.2, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(
        0.01,
        audioContext.currentTime + 0.1
      );

      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.1);
    } catch (error) {
      console.log("Audio not supported");
    }
  };

  const spinWheel = () => {
    if (isSpinning) return;
    if (!isPhoneValid) {
      alert("Vui lòng nhập số điện thoại hợp lệ để quay thưởng!");
      return;
    }

    playSpinSound();
    playButtonSound();

    setIsSpinning(true);
    setResult(null);

    // Random số vòng quay với animation mượt mà hơn
    const spins = Math.floor(Math.random() * 5) + 12; // 8-12 vòng
    const randomAngle = Math.floor(Math.random() * 360);
    const totalRotation = rotation + spins * 360 + randomAngle;

    if (wheelRef.current) {
      wheelRef.current.style.transition =
        "transform 4s cubic-bezier(0.23, 1, 0.32, 1)";
      wheelRef.current.style.transform = `rotate(${totalRotation}deg)`;
    }

    setRotation(totalRotation);

    if (isSoundEnabled) {
      tickIntervalRef.current = setInterval(() => {
        playTickSound();
      }, 150); // Tick mỗi 150ms
    }

    setTimeout(() => {
      if (tickIntervalRef.current) {
        clearInterval(tickIntervalRef.current);
        tickIntervalRef.current = null;
      }

      const segmentAngle = 360 / prizes.length;
      const normalizedAngle = (360 - (totalRotation % 360)) % 360;
      const prizeIndex =
        Math.floor(normalizedAngle / segmentAngle) % prizes.length;
      const selectedPrize = prizes[prizeIndex];

      setIsSpinning(false);
      setResult(selectedPrize.text);

      // Lưu lịch sử quay thưởng
      saveHistory(phone, selectedPrize.text);

      setTimeout(() => {
        playWinSound();
      }, 200);

      createConfetti();
    }, 4000);
  };

  const createConfetti = () => {
    const colors = prizes.map((p) => p.color);

    for (let i = 0; i < 100; i++) {
      const confetti = document.createElement("div");
      confetti.className = "confetti";
      confetti.style.cssText = `
        position: fixed;
        width: ${Math.random() * 8 + 4}px;
        height: ${Math.random() * 8 + 4}px;
        background: ${colors[Math.floor(Math.random() * colors.length)]};
        left: ${Math.random() * 100}vw;
        top: -10px;
        border-radius: 50%;
        animation: confetti-fall ${Math.random() * 2 + 2}s linear forwards;
        z-index: 1000;
      `;
      document.body.appendChild(confetti);
      setTimeout(() => confetti.remove(), 4000);
    }
  };

  const addPrize = () => {
    if (newPrize.text.trim() && prizes.length < 12) {
      playButtonSound();
      const newId = Math.max(...prizes.map((p) => p.id)) + 1;
      setPrizes([...prizes, { ...newPrize, id: newId }]);
      setNewPrize({ text: "", color: "#FF6B6B", icon: "🎁" });
    }
  };

  const removePrize = (id: number) => {
    if (prizes.length > 4) {
      playButtonSound();
      setPrizes(prizes.filter((p) => p.id !== id));
    }
  };

  const resetPrizes = () => {
    playButtonSound();
    setPrizes(defaultPrizes);
  };

  const validatePhone = (value: string) => {
    // Kiểm tra số điện thoại Việt Nam (10 số, bắt đầu bằng 0)
    const isValid = /^(0[3|5|7|8|9])+([0-9]{8})$/.test(value);
    setIsPhoneValid(isValid);
    return isValid;
  };

  // Thêm hàm để lưu và tải lịch sử từ localStorage
  const saveHistory = (phone: string, prize: string) => {
    const newEntry: SpinHistory = {
      phone,
      prize,
      date: new Date().toLocaleString("vi-VN"),
    };

    // Lấy lịch sử hiện tại từ localStorage
    const currentHistory = JSON.parse(
      localStorage.getItem("spinHistory") || "[]"
    );
    const updatedHistory = [newEntry, ...currentHistory];

    // Lưu lại vào localStorage
    localStorage.setItem("spinHistory", JSON.stringify(updatedHistory));
    setSpinHistory(updatedHistory);
  };

  // Thêm hàm để tải lịch sử khi component mount
  const loadHistory = () => {
    try {
      const savedHistory = JSON.parse(
        localStorage.getItem("spinHistory") || "[]"
      );
      setSpinHistory(savedHistory);
    } catch (error) {
      console.error("Error loading history:", error);
      setSpinHistory([]);
    }
  };

  // Thêm useEffect để tải lịch sử khi component mount
  useEffect(() => {
    loadHistory();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-50 to-indigo-100 p-2 sm:p-4">
      <style jsx global>{`
        @keyframes confetti-fall {
          to {
            transform: translateY(100vh) rotate(720deg);
            opacity: 0;
          }
        }

        @keyframes sparkle {
          0%,
          100% {
            opacity: 0;
            transform: scale(0) rotate(0deg);
          }
          50% {
            opacity: 1;
            transform: scale(1) rotate(180deg);
          }
        }

        .sparkle {
          animation: sparkle 2s infinite;
        }

        @keyframes pulse-glow {
          0%,
          100% {
            box-shadow: 0 0 20px rgba(255, 107, 107, 0.5);
          }
          50% {
            box-shadow: 0 0 40px rgba(255, 107, 107, 0.8);
          }
        }
      `}</style>

      <div className="max-w-6xl mx-auto text-center">
        {/* Header with Admin Toggle */}
        <div className="mb-6 sm:mb-8">
          <div className="flex justify-between items-start mb-4">
            <div className="flex-1">
              <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent mb-2 sm:mb-4">
                🌸 Vòng Quay May Mắn 🌸
              </h1>
              <p className="text-lg sm:text-xl text-gray-600 font-medium">
                Lisse Beauty - Quay ngay để nhận ưu đãi hấp dẫn!
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                onClick={() => {
                  playButtonSound();
                  setIsSoundEnabled(!isSoundEnabled);
                }}
                variant="outline"
                size="sm"
                className={isSoundEnabled ? "text-green-600" : "text-gray-400"}
              >
                {isSoundEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
              </Button>
              <Button
                onClick={() => {
                  playButtonSound();
                  setIsAdminMode(!isAdminMode);
                }}
                variant="outline"
                size="sm"
              >
                <Settings size={16} />
              </Button>
            </div>
          </div>
        </div>

        {isAdminMode && (
          <Card className="mb-6 p-4 bg-white/90 backdrop-blur-sm">
            <h3 className="text-xl font-bold mb-4">⚙️ Quản lý Admin</h3>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
              <Input
                placeholder="Tên phần thưởng"
                value={newPrize.text}
                onChange={(e) =>
                  setNewPrize({ ...newPrize, text: e.target.value })
                }
              />
              <Input
                type="color"
                value={newPrize.color}
                onChange={(e) =>
                  setNewPrize({ ...newPrize, color: e.target.value })
                }
              />
              <Input
                placeholder="Icon (emoji)"
                value={newPrize.icon}
                onChange={(e) =>
                  setNewPrize({ ...newPrize, icon: e.target.value })
                }
                maxLength={2}
              />
              <Button onClick={addPrize} className="w-full">
                <Plus size={16} className="mr-1" /> Thêm
              </Button>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-2 mb-4">
              {prizes.map((prize) => (
                <div
                  key={prize.id}
                  className="flex items-center gap-2 p-2 bg-gray-100 rounded"
                >
                  <span>{prize.icon}</span>
                  <span className="flex-1 text-sm truncate">{prize.text}</span>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => removePrize(prize.id)}
                    disabled={prizes.length <= 4}
                  >
                    <Trash2 size={12} />
                  </Button>
                </div>
              ))}
            </div>

            <Button onClick={resetPrizes} variant="outline">
              Khôi phục mặc định
            </Button>
          </Card>
        )}

        <div className="mb-6 sm:mb-8">
          <div className="max-w-sm sm:max-w-md mx-auto">
            <div className="flex flex-col sm:flex-row gap-2 mb-4">
              <Input
                type="tel"
                placeholder="Nhập số điện thoại để quay thưởng"
                value={phone}
                onChange={(e) => {
                  setPhone(e.target.value);
                  validatePhone(e.target.value);
                }}
                className={`${!isPhoneValid && phone ? "border-red-500" : ""}`}
              />
              <Button
                onClick={() => setShowHistory(!showHistory)}
                variant="outline"
                className="whitespace-nowrap"
              >
                {showHistory ? "Ẩn lịch sử" : "Xem lịch sử"}
              </Button>
            </div>
            {!isPhoneValid && phone && (
              <p className="text-red-500 text-sm mb-2">
                Vui lòng nhập số điện thoại hợp lệ (VD: 0912345678)
              </p>
            )}
          </div>

          {showHistory && spinHistory.length > 0 && (
            <Card className="max-w-sm sm:max-w-md mx-auto p-4 mb-4 max-h-60 overflow-auto">
              <h3 className="text-lg font-bold mb-2">Lịch sử quay thưởng</h3>
              <div className="space-y-2">
                {spinHistory.map((entry, index) => (
                  <div key={index} className="text-sm border-b pb-2">
                    <div className="flex justify-between">
                      <span className="font-medium">{entry.phone}</span>
                      <span className="text-gray-500">{entry.date}</span>
                    </div>
                    <div className="text-green-600 font-medium">
                      {entry.prize}
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          )}
        </div>

        {/* Wheel Container */}
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
                  const angle = index * segmentAngle + segmentAngle / 2;

                  return (
                    <div
                      key={prize.id}
                      className="absolute top-1/2 right-1/2 left-1/2 origin-left"
                      style={{
                        transform: `translate(-50%, -50%) rotate(${angle}deg) translateX(60px)`,
                        transformOrigin: "left center",
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
      </div>
    </div>
  );
}
