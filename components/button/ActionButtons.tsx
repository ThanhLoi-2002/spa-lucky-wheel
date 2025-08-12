import React, { FC } from 'react'
import { Button } from '../ui/button';
import { Settings, Volume2, VolumeX } from 'lucide-react';

interface Props {
  playButtonSound: () => void;
  setIsSoundEnabled: (value: boolean) => void;
  isSoundEnabled: boolean;
  isLoggedIn: boolean;
  setIsAdminMode: (value: boolean) => void;
  isAdminMode: boolean;
  setShowLoginForm: (value: boolean) => void;
  showLoginForm: boolean;
  setIsLoggedIn: (value: boolean) => void;
}

const ActionButtons: FC<Props> = ({
  playButtonSound,
  setIsSoundEnabled,
  isSoundEnabled,
  isLoggedIn,
  setIsAdminMode,
  isAdminMode,
  setShowLoginForm,
  showLoginForm,
  setIsLoggedIn,
}) => {
  // Hàm đăng xuất
  const handleLogout = () => {
    setIsLoggedIn(false);
    setIsAdminMode(false);
    localStorage.removeItem("adminLoggedIn");
    playButtonSound();
  };
  return (
    <div className="flex gap-2 justify-end mb-3 sm:mb-4">
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
      {isLoggedIn ? (
        <>
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
          <Button
            onClick={handleLogout}
            variant="outline"
            size="sm"
            className="text-red-500"
          >
            Đăng xuất
          </Button>
        </>
      ) : (
        <Button
          onClick={() => {
            playButtonSound();
            setShowLoginForm(!showLoginForm);
          }}
          variant="outline"
          size="sm"
        >
          Đăng nhập
        </Button>
      )}
    </div>
  );
};

export default ActionButtons
