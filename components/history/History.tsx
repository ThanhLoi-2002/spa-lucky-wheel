import React, { FC } from 'react'
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { SpinHistory } from '@/app/constants/constant';

interface Props {
  phone: string;
  setPhone: (value: string) => void;
  isPhoneValid: boolean;
  showHistory: boolean;
  validatePhone: (value: string) => void;
  setShowHistory: (value: boolean) => void;
  spinHistory: SpinHistory[]
}

const History: FC<Props> = ({
  phone,
  setPhone,
  isPhoneValid,
  showHistory,
  validatePhone,
  setShowHistory,
  spinHistory,
}) => {
  return (
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
                <div className="text-green-600 font-medium">{entry.prize}</div>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
};

export default History
