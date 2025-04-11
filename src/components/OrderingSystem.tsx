import React, { useState } from 'react';

interface Meal {
  id: number;
  name: string;
  price: number;
  description: string;
  image: string;
  dietary: string;
  quantity?: number;
}

interface WeeklyMenu {
  [key: string]: Meal[];
}

const OrderingSystem: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedMeals, setSelectedMeals] = useState<Meal[]>([]);
  const [step, setStep] = useState(1); // 1: 選餐, 2: 填寫資訊, 3: 付款, 4: 確認
  const [userInfo, setUserInfo] = useState({
    name: '',
    invoiceCode: '',
  });

  // 模擬一週的菜單資料
  const weeklyMenu: WeeklyMenu = {
    週一: [
      {
        id: 1,
        name: '雞腿便當',
        price: 80,
        description: '去骨雞腿、季節蔬菜三樣、滷蛋',
        image: 'https://via.placeholder.com/80x60',
        dietary: '葷食',
      },
      {
        id: 2,
        name: '素食便當',
        price: 75,
        description: '什錦菇菜、豆干、炒蔬菜',
        image: 'https://via.placeholder.com/80x60',
        dietary: '蛋奶素',
      },
    ],
    週二: [
      {
        id: 3,
        name: '排骨便當',
        price: 85,
        description: '炸排骨、季節蔬菜三樣、滷蛋',
        image: 'https://via.placeholder.com/80x60',
        dietary: '葷食',
      },
      {
        id: 4,
        name: '麻婆豆腐飯',
        price: 75,
        description: '麻婆豆腐、蔬菜、滷蛋',
        image: 'https://via.placeholder.com/80x60',
        dietary: '葷食(含辣)',
      },
    ],
    週三: [
      {
        id: 5,
        name: '鯖魚便當',
        price: 90,
        description: '鯖魚一片、季節蔬菜三樣',
        image: 'https://via.placeholder.com/80x60',
        dietary: '葷食',
      },
      {
        id: 6,
        name: '雞柳便當',
        price: 80,
        description: '炸雞柳、季節蔬菜三樣',
        image: 'https://via.placeholder.com/80x60',
        dietary: '葷食',
      },
    ],
  };

  const handleDateChange = (date: string) => {
    setSelectedDate(date);
    setSelectedMeals([]);
  };

  const toggleMealSelection = (meal: Meal) => {
    if (selectedMeals.some((m) => m.id === meal.id)) {
      setSelectedMeals(selectedMeals.filter((m) => m.id !== meal.id));
    } else {
      setSelectedMeals([...selectedMeals, { ...meal, quantity: 1 }]);
    }
  };

  const updateQuantity = (id: number, newQuantity: number) => {
    if (newQuantity > 0) {
      setSelectedMeals(
        selectedMeals.map((meal) =>
          meal.id === id ? { ...meal, quantity: newQuantity } : meal
        )
      );
    } else {
      setSelectedMeals(selectedMeals.filter((meal) => meal.id !== id));
    }
  };

  const calculateTotal = () => {
    return selectedMeals.reduce(
      (sum, meal) => sum + meal.price * (meal.quantity || 1),
      0
    );
  };

  const handleUserInfoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserInfo({ ...userInfo, [name]: value });
  };

  const handleNextStep = () => {
    if (step === 1 && selectedMeals.length > 0) {
      setStep(2);
    } else if (step === 2 && userInfo.name && userInfo.invoiceCode) {
      setStep(3);
    } else if (step === 3) {
      // 模擬付款處理
      setStep(4);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <>
            {/* Date Selection */}
            <div className="p-4 bg-white shadow">
              <h2 className="text-lg font-semibold mb-2">選擇用餐日期</h2>
              <div className="flex overflow-x-auto space-x-2 py-2">
                {Object.keys(weeklyMenu).map((date) => (
                  <button
                    key={date}
                    className={`px-4 py-2 rounded-full ${
                      selectedDate === date
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-200'
                    }`}
                    onClick={() => handleDateChange(date)}
                  >
                    {date}
                  </button>
                ))}
              </div>
            </div>

            {/* Meal Selection */}
            {selectedDate && (
              <div className="flex-1 p-4 overflow-auto">
                <h2 className="text-lg font-semibold mb-4">
                  {selectedDate}餐點選擇
                </h2>
                <div className="space-y-4">
                  {weeklyMenu[selectedDate].map((meal) => (
                    <div
                      key={meal.id}
                      className={`p-4 rounded-lg shadow ${
                        selectedMeals.some((m) => m.id === meal.id)
                          ? 'bg-blue-50 border border-blue-200'
                          : 'bg-white'
                      }`}
                    >
                      <div className="flex">
                        <img
                          src={meal.image}
                          alt={meal.name}
                          className="w-20 h-16 rounded object-cover"
                        />
                        <div className="ml-4 flex-1">
                          <div className="flex justify-between">
                            <h3 className="font-semibold">{meal.name}</h3>
                            <span className="text-red-500 font-semibold">
                              ${meal.price}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 mt-1">
                            {meal.description}
                          </p>
                          <div className="flex items-center mt-2">
                            <span className="text-xs px-2 py-1 bg-gray-100 rounded-full">
                              {meal.dietary}
                            </span>
                          </div>
                        </div>
                      </div>

                      {selectedMeals.some((m) => m.id === meal.id) ? (
                        <div className="flex items-center justify-end mt-3">
                          <button
                            className="w-8 h-8 rounded-full bg-blue-100 text-blue-500 flex items-center justify-center"
                            onClick={() => {
                              const current = selectedMeals.find(
                                (m) => m.id === meal.id
                              );
                              updateQuantity(
                                meal.id,
                                (current?.quantity || 1) - 1
                              );
                            }}
                          >
                            -
                          </button>
                          <span className="mx-3">
                            {selectedMeals.find((m) => m.id === meal.id)
                              ?.quantity || 0}
                          </span>
                          <button
                            className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center"
                            onClick={() => {
                              const current = selectedMeals.find(
                                (m) => m.id === meal.id
                              );
                              updateQuantity(
                                meal.id,
                                (current?.quantity || 0) + 1
                              );
                            }}
                          >
                            +
                          </button>
                        </div>
                      ) : (
                        <button
                          className="mt-3 w-full py-2 bg-blue-500 text-white rounded-lg"
                          onClick={() => toggleMealSelection(meal)}
                        >
                          選擇
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        );

      case 2:
        return (
          <div className="p-4">
            <h2 className="text-lg font-semibold mb-4">填寫基本資訊</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  姓名
                </label>
                <input
                  type="text"
                  name="name"
                  value={userInfo.name}
                  onChange={handleUserInfoChange}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  placeholder="請輸入姓名"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  發票載具條碼
                </label>
                <input
                  type="text"
                  name="invoiceCode"
                  value={userInfo.invoiceCode}
                  onChange={handleUserInfoChange}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  placeholder="請輸入載具條碼"
                />
              </div>

              <div className="mt-6">
                <h3 className="font-semibold mb-2">訂單明細</h3>
                {selectedMeals.map((meal) => (
                  <div
                    key={meal.id}
                    className="flex justify-between py-2 border-b"
                  >
                    <span>
                      {meal.name} x {meal.quantity}
                    </span>
                    <span>${meal.price * (meal.quantity || 1)}</span>
                  </div>
                ))}
                <div className="flex justify-between mt-4 font-semibold">
                  <span>總計:</span>
                  <span>${calculateTotal()}</span>
                </div>
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="p-4">
            <h2 className="text-lg font-semibold mb-4">付款</h2>
            <div className="bg-gray-100 p-4 rounded-lg mb-4">
              <h3 className="font-semibold mb-2">訂單資訊</h3>
              <p>姓名: {userInfo.name}</p>
              <p>載具條碼: {userInfo.invoiceCode}</p>
              <p className="mt-4 font-semibold">總計: ${calculateTotal()}</p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  信用卡號碼
                </label>
                <input
                  type="text"
                  className="w-full p-2 border border-gray-300 rounded-md"
                  placeholder="0000 0000 0000 0000"
                />
              </div>
              <div className="flex space-x-4">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    有效期限
                  </label>
                  <input
                    type="text"
                    className="w-full p-2 border border-gray-300 rounded-md"
                    placeholder="MM/YY"
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    CVV
                  </label>
                  <input
                    type="text"
                    className="w-full p-2 border border-gray-300 rounded-md"
                    placeholder="123"
                  />
                </div>
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="p-4 text-center">
            <div className="mb-6">
              <svg
                className="w-16 h-16 mx-auto text-green-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M5 13l4 4L19 7"
                ></path>
              </svg>
            </div>
            <h2 className="text-2xl font-bold mb-2">付款成功</h2>
            <p className="mb-4">感謝您的訂購！</p>
            <div className="bg-gray-100 p-4 rounded-lg mb-6 inline-block">
              <p>
                訂單編號:{' '}
                {Math.floor(Math.random() * 1000000)
                  .toString()
                  .padStart(6, '0')}
              </p>
              <p className="mt-2">總金額: ${calculateTotal()}</p>
            </div>

            <div className="mt-6">
              <button className="px-4 py-2 bg-blue-500 text-white rounded-lg mr-2">
                加入Google行事曆
              </button>
              <button className="px-4 py-2 bg-gray-200 rounded-lg">
                返回LINE主頁
              </button>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-blue-500 text-white p-4 flex items-center">
        {step > 1 && (
          <button className="mr-2" onClick={handleBack}>
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M15 19l-7-7 7-7"
              ></path>
            </svg>
          </button>
        )}
        <h1 className="text-xl font-bold">波麗士之家點餐系統</h1>
      </div>

      {/* Progress Indicator */}
      <div className="bg-white px-4 py-2 flex justify-between">
        {['選擇餐點', '填寫資訊', '付款', '完成'].map((label, idx) => (
          <div
            key={idx}
            className={`flex flex-col items-center ${
              idx + 1 === step
                ? 'text-blue-500'
                : idx + 1 < step
                ? 'text-green-500'
                : 'text-gray-400'
            }`}
          >
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center mb-1 ${
                idx + 1 === step
                  ? 'bg-blue-500 text-white'
                  : idx + 1 < step
                  ? 'bg-green-500 text-white'
                  : 'bg-gray-200'
              }`}
            >
              {idx + 1 < step ? '✓' : idx + 1}
            </div>
            <span className="text-xs">{label}</span>
          </div>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto">{renderStepContent()}</div>

      {/* Footer/Checkout */}
      {step < 4 && (
        <div className="bg-white shadow-top p-4">
          <div className="flex justify-between items-center mb-4">
            <span className="text-gray-700">總計:</span>
            <span className="text-xl font-bold">${calculateTotal()}</span>
          </div>
          <button
            className={`w-full py-3 rounded-lg font-semibold ${
              (step === 1 && selectedMeals.length > 0) ||
              (step === 2 && userInfo.name && userInfo.invoiceCode) ||
              step === 3
                ? 'bg-blue-500 text-white'
                : 'bg-gray-300 text-gray-500'
            }`}
            onClick={handleNextStep}
            disabled={
              (step === 1 && selectedMeals.length === 0) ||
              (step === 2 && (!userInfo.name || !userInfo.invoiceCode))
            }
          >
            {step === 3 ? '確認付款' : '下一步'}
          </button>
        </div>
      )}
    </div>
  );
};

export default OrderingSystem;
