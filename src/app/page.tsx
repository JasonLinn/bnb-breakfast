'use client';

import { useState } from 'react';
import Image from 'next/image';
import toast, { Toaster } from 'react-hot-toast';

interface MenuItem {
  id: number;
  name: string;
  price: number;
  description?: string;
  image?: string;
}

interface DrinkItem {
  id: number;
  name: string;
  icePrice: number;
  hotPrice: number;
  noIcePrice?: number;
  image?: string;
}

interface OrderItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  type?: 'ice' | 'hot' | 'no-ice';
}

export default function Home() {
  const [cart, setCart] = useState<OrderItem[]>([]);
  const [showCart, setShowCart] = useState(false);
  const [deliveryTime, setDeliveryTime] = useState<string>('');
  const [orderDate, setOrderDate] = useState<string>('');
  const [orderNote, setOrderNote] = useState<string>('');

  const menuItems: MenuItem[] = [
    { 
      id: 1, 
      name: '早安拼盤', 
      price: 0, 
      description: '鮮奶吐司+起士火腿+炒蛋+生菜沙拉+地瓜',
      image: 'https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?ixlib=rb-4.0.3&w=400&h=300&fit=crop'
    },
    { 
      id: 2, 
      name: '豬排起司蛋美式漢堡/鮮奶吐司', 
      price: 0,
      image: 'https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?ixlib=rb-4.0.3&w=400&h=300&fit=crop'
    },
    { 
      id: 3, 
      name: '夏威夷嫩雞美式漢堡/鮮奶吐司', 
      price: 0,
      image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?ixlib=rb-4.0.3&w=400&h=300&fit=crop'
    },
    { 
      id: 4, 
      name: '火腿歐姆蛋美式漢堡/鮮奶吐司', 
      price: 0,
      image: 'https://images.unsplash.com/photo-1586190848861-99aa4a171e90?ixlib=rb-4.0.3&w=400&h=300&fit=crop'
    },
    { 
      id: 5, 
      name: '洋蔥燒肉蛋餅', 
      price: 0,
      image: 'https://images.unsplash.com/photo-1506084868230-bb9d95c24759?ixlib=rb-4.0.3&w=400&h=300&fit=crop'
    },
    { 
      id: 6, 
      name: '蔬活蛋素拼盤(素食)', 
      price: 0, 
      description: '雜蛋沙拉四層總匯三明治+生菜沙拉+地瓜',
      image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?ixlib=rb-4.0.3&w=400&h=300&fit=crop'
    },
    { 
      id: 7, 
      name: '兒童餐', 
      price: 0, 
      description: '抹醬吐司:花生/阿華田/草莓/奶酥/奶油+炒蛋+玉米+薯餅+鮮奶茶',
      image: 'https://images.unsplash.com/photo-1590301157890-4810ed352733?ixlib=rb-4.0.3&w=400&h=300&fit=crop'
    },
    { 
      id: 8, 
      name: '豬排蛋鐵板麵(黑胡椒)', 
      price: 0,
      image: 'https://images.unsplash.com/photo-1555126634-323283e090fa?ixlib=rb-4.0.3&w=400&h=300&fit=crop'
    },
    { 
      id: 9, 
      name: '蘑菇', 
      price: 0,
      image: 'https://images.unsplash.com/photo-1518779578993-ec3579fee39f?ixlib=rb-4.0.3&w=400&h=300&fit=crop'
    }
  ];

  const drinks: DrinkItem[] = [
    { 
      id: 1, 
      name: '錫蘭紅茶', 
      icePrice: 0, 
      hotPrice: 0, 
      noIcePrice: 0,
      image: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?ixlib=rb-4.0.3&w=200&h=200&fit=crop'
    },
    { 
      id: 2, 
      name: '錫蘭奶茶', 
      icePrice: 0, 
      hotPrice: 0, 
      noIcePrice: 0,
      image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&w=200&h=200&fit=crop'
    },
    { 
      id: 3, 
      name: '非基改豆乳', 
      icePrice: 0, 
      hotPrice: 0, 
      noIcePrice: 0,
      image: 'https://images.unsplash.com/photo-1544145945-f90425340c7e?ixlib=rb-4.0.3&w=200&h=200&fit=crop'
    }
  ];

  const addToCart = (item: MenuItem | DrinkItem, type?: 'ice' | 'hot' | 'no-ice') => {
    const price = 0; // 不再需要價格計算

    const cartItem: OrderItem = {
      id: item.id,
      name: item.name + (type ? ` (${type === 'ice' ? '冰' : type === 'hot' ? '熱' : '去冰'})` : ''),
      price,
      quantity: 1,
      type
    };

    setCart(prevCart => {
      const existingItem = prevCart.find(cartItem => 
        cartItem.id === item.id && cartItem.type === type
      );
      
      if (existingItem) {
        return prevCart.map(cartItem =>
          cartItem.id === item.id && cartItem.type === type
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        );
      } else {
        return [...prevCart, cartItem];
      }
    });
  };

  const removeFromCart = (id: number, type?: 'ice' | 'hot' | 'no-ice') => {
    setCart(prevCart => prevCart.filter(item => !(item.id === id && item.type === type)));
  };

  const updateQuantity = (id: number, type: 'ice' | 'hot' | 'no-ice' | undefined, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(id, type);
      return;
    }
    
    setCart(prevCart =>
      prevCart.map(item =>
        item.id === id && item.type === type
          ? { ...item, quantity }
          : item
      )
    );
  };

  const getTotalItems = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  const getOrderSummary = () => {
    const summary: { [key: string]: number } = {};
    cart.forEach(item => {
      const itemName = item.name;
      summary[itemName] = (summary[itemName] || 0) + item.quantity;
    });
    return summary;
  };

  const generateTimeSlots = () => {
    const slots = [];
    
    // 早餐時段: 8:00-10:00
    for (let hour = 8; hour <= 10; hour++) {
      slots.push(`${hour}:00`);
      if (hour < 10) {
        slots.push(`${hour}:30`);
      }
    }
    return slots;
  };

  const handleOrderSubmit = async () => {
    // 顯示發送中的 Toast
    const loadingToast = toast.loading('正在送出訂單...');
    
    try {
      const summary = getOrderSummary();
      const orderDetails = Object.entries(summary)
        .map(([item, qty]) => `${item}: ${qty}份`)
        .join('\n');

      const orderData = {
        deliveryTime,
        orderDate: orderDate || '未指定',
        orderNote: orderNote || '無',
        orderDetails,
        totalItems: getTotalItems(),
        timestamp: new Date().toLocaleString('zh-TW'),
        items: cart
      };

      // 發送郵件
      const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
      });

      if (response.ok) {
        const responseData = await response.json();
        
        // 關閉載入中的 Toast 並顯示成功訊息
        toast.dismiss(loadingToast);
        toast.success(
          `🎉 訂單已成功送出！\n送餐時間: ${deliveryTime}${orderDate ? `\n日期: ${orderDate}` : ''}\n總計: ${getTotalItems()}份`,
          {
            duration: 5000,
            style: {
              background: '#10B981',
              color: '#fff',
              fontWeight: 'bold',
            },
          }
        );
        
        // 清空購物車和表單
        setCart([]);
        setDeliveryTime('');
        setOrderDate('');
        setOrderNote('');
        setShowCart(false);
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || '發送失敗');
      }
    } catch (error) {
      // 關閉載入中的 Toast
      toast.dismiss(loadingToast);
      
      // 顯示錯誤 Toast
      const errorMessage = error instanceof Error ? error.message : '未知錯誤';
      toast.error(
        `⚠️ 郵件發送失敗\n錯誤: ${errorMessage}\n請手動聯繫店家確認訂單`,
        {
          duration: 6000,
          style: {
            background: '#EF4444',
            color: '#fff',
            fontWeight: 'bold',
          },
        }
      );
      
      // 依然清空購物車（訂單已記錄）
      setCart([]);
      setDeliveryTime('');
      setOrderDate('');
      setOrderNote('');
      setShowCart(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-orange-50">
      {/* Header */}
      <header className="bg-white shadow-lg sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {/* 預留 Logo 位置 */}
              <div className="w-16 h-16 bg-yellow-200 rounded-full flex items-center justify-center">
                <span className="text-2xl">🍳</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-800">衿日林民宿 x ToDo早午餐 線上點餐</h1>
              </div>
            </div>
            <button
              onClick={() => setShowCart(!showCart)}
              className="relative bg-yellow-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-yellow-600 transition-colors"
            >
              點餐清單 ({getTotalItems()})
              {getTotalItems() > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center">
                  {getTotalItems()}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 主餐區 */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b pb-3">主餐</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {menuItems.map((item) => (
                  <div key={item.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                    {/* 餐點圖片 */}
                    <div className="w-full h-40 bg-gray-200 rounded-lg mb-3 overflow-hidden">
                      {item.image ? (
                        <Image
                          src={item.image}
                          alt={item.name}
                          width={400}
                          height={160}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <span className="text-gray-500">圖片位置</span>
                        </div>
                      )}
                    </div>
                    <h3 className="font-semibold text-lg text-gray-800">{item.name}</h3>
                    {item.description && (
                      <p className="text-sm text-gray-600 mt-1">{item.description}</p>
                    )}
                    <div className="flex justify-between items-center mt-3">
                      <span className="text-sm text-gray-500">
                        數位點餐
                      </span>
                      <button
                        onClick={() => addToCart(item)}
                        className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors"
                      >
                        點餐
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 搭配飲品區 */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b pb-3">搭配飲品(冰、熱)</h2>
              <div className="space-y-4">
                {drinks.map((drink) => (
                  <div key={drink.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        {/* 飲品圖片 */}
                        <div className="flex items-center space-x-4">
                          <div className="w-20 h-20 bg-blue-200 rounded-lg overflow-hidden">
                            {drink.image ? (
                              <Image
                                src={drink.image}
                                alt={drink.name}
                                width={80}
                                height={80}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <span className="text-blue-600">🥤</span>
                              </div>
                            )}
                          </div>
                          <div>
                            <h3 className="font-semibold text-lg text-gray-800">{drink.name}</h3>
                            <p className="text-sm text-gray-600">
                              可選擇：冰 | 溫熱 | 去冰
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => addToCart(drink, 'ice')}
                          className="bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600"
                        >
                          冰
                        </button>
                        <button
                          onClick={() => addToCart(drink, 'hot')}
                          className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600"
                        >
                          熱
                        </button>
                        {drink.noIcePrice !== undefined && (
                          <button
                            onClick={() => addToCart(drink, 'no-ice')}
                            className="bg-gray-500 text-white px-3 py-1 rounded text-sm hover:bg-gray-600"
                          >
                            去冰
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 購物車側邊欄 */}
          <div className="lg:col-span-1">
            {/* 桌面版購物車 */}
            <div className={`hidden lg:block bg-white rounded-xl shadow-lg p-6 sticky top-24 ${showCart ? 'block' : 'hidden'}`}>
              <h2 className="text-xl font-bold text-gray-800 mb-4">點餐清單</h2>
              
              {/* 送餐時間選擇 */}
              <div className="mb-6 p-4 bg-blue-50 rounded-lg">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  選擇送餐時間 *
                </label>
                <select
                  value={deliveryTime}
                  onChange={(e) => setDeliveryTime(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                >
                  <option value="">請選擇送餐時間</option>
                  {generateTimeSlots().map((slot) => (
                    <option key={slot} value={slot}>
                      {slot}
                    </option>
                  ))}
                </select>
              </div>

              {/* 日期選擇 (選填) */}
              <div className="mb-4 p-4 bg-yellow-50 rounded-lg">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  指定日期 (選填)
                </label>
                <input
                  type="date"
                  value={orderDate}
                  onChange={(e) => setOrderDate(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>

              {/* 備註欄位 (選填) */}
              <div className="mb-6 p-4 bg-green-50 rounded-lg">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  備註 (選填)
                </label>
                <textarea
                  value={orderNote}
                  onChange={(e) => setOrderNote(e.target.value)}
                  placeholder="特殊需求、過敏提醒等..."
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 resize-none"
                  rows={3}
                  maxLength={200}
                />
                <div className="text-xs text-gray-500 mt-1">
                  {orderNote.length}/200
                </div>
              </div>

              {cart.length === 0 ? (
                <p className="text-gray-500 text-center py-8">尚未點餐</p>
              ) : (
                <>
                  <div className="space-y-3 mb-6 max-h-64 overflow-y-auto">
                    {cart.map((item, index) => (
                      <div key={`${item.id}-${item.type}-${index}`} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                        <div className="flex-1">
                          <h4 className="font-medium text-sm">{item.name}</h4>
                        </div>
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => updateQuantity(item.id, item.type, item.quantity - 1)}
                            className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center hover:bg-gray-300"
                          >
                            -
                          </button>
                          <span className="w-8 text-center font-semibold">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.id, item.type, item.quantity + 1)}
                            className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center hover:bg-gray-300"
                          >
                            +
                          </button>
                          <button
                            onClick={() => removeFromCart(item.id, item.type)}
                            className="text-red-500 hover:text-red-700 ml-2"
                          >
                            🗑️
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  {/* 訂單統計 */}
                  <div className="border-t pt-4 mb-4">
                    <h3 className="text-lg font-bold text-gray-800 mb-3">訂單統計</h3>
                    <div className="space-y-2 bg-gray-50 p-3 rounded-lg">
                      {Object.entries(getOrderSummary()).map(([itemName, quantity]) => (
                        <div key={itemName} className="flex justify-between text-sm">
                          <span className="text-gray-700">{itemName}</span>
                          <span className="font-semibold text-gray-900">{quantity} 份</span>
                        </div>
                      ))}
                      <div className="border-t pt-2 mt-2">
                        <div className="flex justify-between font-bold">
                          <span>總計：</span>
                          <span className="text-orange-600">{getTotalItems()} 份</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <button 
                    onClick={async () => {
                      if (!deliveryTime) {
                        alert('請選擇送餐時間');
                        return;
                      }
                      await handleOrderSubmit();
                    }}
                    disabled={!deliveryTime}
                    className={`w-full py-3 rounded-lg font-semibold transition-colors ${
                      deliveryTime 
                        ? 'bg-green-500 text-white hover:bg-green-600' 
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }`}
                  >
                    確認送出訂單
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 手機版全螢幕購物車 */}
      <div className={`lg:hidden fixed inset-0 z-50 transform transition-transform duration-300 ease-in-out ${
        showCart ? 'translate-x-0' : 'translate-x-full'
      }`}>
        <div className="absolute inset-0 bg-black bg-opacity-50" onClick={() => setShowCart(false)}></div>
        <div className="absolute right-0 top-0 h-full w-full max-w-sm bg-white shadow-xl">
          <div className="flex flex-col h-full">
            {/* 標題列 */}
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="text-xl font-bold text-gray-800">點餐清單</h2>
              <button
                onClick={() => setShowCart(false)}
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                <span className="text-xl">×</span>
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4">
              {/* 送餐時間選擇 */}
              <div className="mb-6 p-4 bg-blue-50 rounded-lg">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  選擇送餐時間 *
                </label>
                <select
                  value={deliveryTime}
                  onChange={(e) => setDeliveryTime(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                >
                  <option value="">請選擇送餐時間</option>
                  {generateTimeSlots().map((slot) => (
                    <option key={slot} value={slot}>
                      {slot}
                    </option>
                  ))}
                </select>
              </div>

              {/* 日期選擇 (選填) */}
              <div className="mb-4 p-4 bg-yellow-50 rounded-lg">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  指定日期 (選填)
                </label>
                <input
                  type="date"
                  value={orderDate}
                  onChange={(e) => setOrderDate(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>

              {/* 備註欄位 (選填) */}
              <div className="mb-6 p-4 bg-green-50 rounded-lg">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  備註 (選填)
                </label>
                <textarea
                  value={orderNote}
                  onChange={(e) => setOrderNote(e.target.value)}
                  placeholder="特殊需求、過敏提醒等..."
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 resize-none"
                  rows={3}
                  maxLength={200}
                />
                <div className="text-xs text-gray-500 mt-1">
                  {orderNote.length}/200
                </div>
              </div>

              {cart.length === 0 ? (
                <p className="text-gray-500 text-center py-8">尚未點餐</p>
              ) : (
                <>
                  <div className="space-y-3 mb-6">
                    {cart.map((item, index) => (
                      <div key={`${item.id}-${item.type}-${index}`} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                        <div className="flex-1">
                          <h4 className="font-medium text-sm">{item.name}</h4>
                        </div>
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => updateQuantity(item.id, item.type, item.quantity - 1)}
                            className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center hover:bg-gray-300"
                          >
                            -
                          </button>
                          <span className="w-8 text-center font-semibold">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.id, item.type, item.quantity + 1)}
                            className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center hover:bg-gray-300"
                          >
                            +
                          </button>
                          <button
                            onClick={() => removeFromCart(item.id, item.type)}
                            className="text-red-500 hover:text-red-700 ml-2"
                          >
                            🗑️
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  {/* 訂單統計 */}
                  <div className="border-t pt-4 mb-4">
                    <h3 className="text-lg font-bold text-gray-800 mb-3">訂單統計</h3>
                    <div className="space-y-2 bg-gray-50 p-3 rounded-lg">
                      {Object.entries(getOrderSummary()).map(([itemName, quantity]) => (
                        <div key={itemName} className="flex justify-between text-sm">
                          <span className="text-gray-700">{itemName}</span>
                          <span className="font-semibold text-gray-900">{quantity} 份</span>
                        </div>
                      ))}
                      <div className="border-t pt-2 mt-2">
                        <div className="flex justify-between font-bold">
                          <span>總計：</span>
                          <span className="text-orange-600">{getTotalItems()} 份</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
            
            {/* 底部按鈕 */}
            {cart.length > 0 && (
              <div className="p-4 border-t">
                <button 
                  onClick={async () => {
                    if (!deliveryTime) {
                      alert('請選擇送餐時間');
                      return;
                    }
                    await handleOrderSubmit();
                  }}
                  disabled={!deliveryTime}
                  className={`w-full py-3 rounded-lg font-semibold transition-colors ${
                    deliveryTime 
                      ? 'bg-green-500 text-white hover:bg-green-600' 
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  確認送出訂單
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Cart Toggle */}
      <div className="lg:hidden fixed bottom-4 right-4">
        <button
          onClick={() => setShowCart(!showCart)}
          className="bg-yellow-500 text-white p-4 rounded-full shadow-lg hover:bg-yellow-600 transition-colors"
        >
          🛒 {getTotalItems()}
        </button>
      </div>

      {/* Toast 通知元件 */}
      <Toaster
        position="top-center"
        reverseOrder={false}
        gutter={8}
        containerStyle={{
          top: 20,
        }}
        toastOptions={{
          duration: 4000,
          style: {
            background: '#363636',
            color: '#fff',
            borderRadius: '10px',
            padding: '16px',
            fontSize: '14px',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
          },
        }}
      />
    </div>
  );
}
