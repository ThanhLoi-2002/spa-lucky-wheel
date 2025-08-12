import React, { FC, useState } from 'react'
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { Input } from '../ui/input';
import { Eye, EyeClosed } from 'lucide-react';

interface Props {
  adminCredentials: { username: string; password: string };
  setAdminCredentials: (value: { username: string; password: string }) => void;
  setIsLoggedIn: (value: boolean) => void;
  setShowLoginForm: (value: boolean) => void;
  playButtonSound: () => void
}

const LoginForm: FC<Props> = ({
  adminCredentials,
  setAdminCredentials,
  setIsLoggedIn,
  setShowLoginForm,
  playButtonSound,
}) => {
  const [loginError, setLoginError] = useState("");
  const [isShowPassword, setIsShowPassword] = useState(false);
  // Hàm xử lý đăng nhập
  const handleLogin = () => {
    // Thông tin đăng nhập mặc định (trong thực tế nên lưu trữ an toàn hơn)
    const validUsername = process.env.NEXT_PUBLIC_ADMIN_ACCOUNT;
    const validPassword = process.env.NEXT_PUBLIC_ADMIN_PASSWORD;

    if (
      adminCredentials.username === validUsername &&
      adminCredentials.password === validPassword
    ) {
      setIsLoggedIn(true);
      setLoginError("");
      setShowLoginForm(false);
      // Lưu trạng thái đăng nhập vào localStorage
      localStorage.setItem("adminLoggedIn", "true");
      playButtonSound();
    } else {
      setLoginError("Tên đăng nhập hoặc mật khẩu không đúng!");
    }
  };
  return (
    <Card className="mb-6 p-4 bg-white/90 backdrop-blur-sm">
      <h3 className="text-xl font-bold mb-4">🔐 Đăng nhập Admin</h3>
      <div className="flex flex-col gap-4 max-w-md mx-auto">
        <div>
          <label className="flex align-items-start mb-1" htmlFor="username">
            Tên đăng nhập
          </label>
          <Input
            id="username"
            placeholder="Tên đăng nhập"
            value={adminCredentials.username}
            onChange={(e) =>
              setAdminCredentials({
                ...adminCredentials,
                username: e.target.value,
              })
            }
          />
        </div>
        <div className="">
          <label className="flex mb-1" htmlFor="password">
            Mật khẩu
          </label>
          <div className="flex relative">
          <Input
            id="password"
            type={isShowPassword ? "text" : "password"}
            placeholder="Mật khẩu"
            value={adminCredentials.password}
            onChange={(e) =>
              setAdminCredentials({
                ...adminCredentials,
                password: e.target.value,
              })
            }
            onKeyDown={(e) => {
              if (e.key === "Enter") handleLogin();
            }}
          />
          <button
            type="button"
            onClick={() => setIsShowPassword(!isShowPassword)}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-700 flex items-center"
          >
            {isShowPassword ? <Eye /> : <EyeClosed />}
          </button>
          </div>
        </div>
        {loginError && <p className="text-red-500 text-sm">{loginError}</p>}
        <Button onClick={handleLogin} className="w-full">
          Đăng nhập
        </Button>
      </div>
    </Card>
  );
};

export default LoginForm
