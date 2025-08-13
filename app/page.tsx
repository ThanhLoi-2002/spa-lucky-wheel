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
import Footer from "@/components/footer/Footer";
import { Prize, defaultPrizes, SpinHistory } from "./constants/constant";
import History from "@/components/history/History";
import Wheel from "@/components/wheel/Wheel";
import Header from "@/components/header/Header";
import LoginForm from "@/components/login/LoginForm";
import ActionButtons from "@/components/button/ActionButtons";

export default function SpaLuckyWheel() {
  const [isSpinning, setIsSpinning] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [rotation, setRotation] = useState(0);
  const [prizes, setPrizes] = useState<Prize[]>(defaultPrizes);
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [showLoginForm, setShowLoginForm] = useState(false);
  const [adminCredentials, setAdminCredentials] = useState({
    username: "",
    password: "",
  });
  const [isLoggedIn, setIsLoggedIn] = useState(false);
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
  const wheelRef = useRef<HTMLCanvasElement>(null);
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

    // Kiểm tra trạng thái đăng nhập từ localStorage
    const savedLoginState = localStorage.getItem("adminLoggedIn");
    if (savedLoginState === "true") {
      setIsLoggedIn(true);
    }
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-50 to-indigo-100 p-2 sm:p-4">
      <div className="max-w-6xl mx-auto text-center">
        {/* Header with Admin Toggle */}
        <Header />
        <ActionButtons
          playButtonSound={playButtonSound}
          setIsSoundEnabled={setIsSoundEnabled}
          isSoundEnabled={isSoundEnabled}
          isLoggedIn={isLoggedIn}
          setIsAdminMode={setIsAdminMode}
          isAdminMode={isAdminMode}
          setShowLoginForm={setShowLoginForm}
          showLoginForm={showLoginForm}
          setIsLoggedIn={setIsLoggedIn}
        />

        {/* Form đăng nhập Admin */}
        {showLoginForm && !isLoggedIn && (
          <LoginForm
            adminCredentials={adminCredentials}
            setAdminCredentials={setAdminCredentials}
            setIsLoggedIn={setIsLoggedIn}
            setShowLoginForm={setShowLoginForm}
            playButtonSound={playButtonSound}
          />
        )}

        {isAdminMode && isLoggedIn && (
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

        <History
          phone={phone}
          setPhone={setPhone}
          isPhoneValid={isPhoneValid}
          showHistory={showHistory}
          validatePhone={validatePhone}
          setShowHistory={setShowHistory}
          spinHistory={spinHistory}
        />

        {/* Wheel Container */}
        <Wheel
          wheelRef={wheelRef}
          prizes={prizes}
          isSpinning={isSpinning}
          spinWheel={spinWheel}
          result={result}
        />

        <Footer />
      </div>
    </div>
  );
}
