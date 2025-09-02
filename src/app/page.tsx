'use client';

import { useState } from 'react';
import Image from "next/image";

interface MenuItem {
  id: number;
  name: string;
  price: number;
  description?: string;
}

interface DrinkItem {
  id: number;
  name: string;
  icePrice: number;
  hotPrice: number;
  noIcePrice?: number;
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

  const menuItems: MenuItem[] = [
    { id: 1, name: '早安拼盤', price: 0, description: '鮮奶吐司+起士火腿+炒蛋+生菜沙拉+地瓜' },
    { id: 2, name: '豬排起司蛋美式漢堡/鮮奶吐司', price: 0 },
    { id: 3, name: '夏威夷嫩雞美式漢堡/鮮奶吐司', price: 0 },
    { id: 4, name: '火腿歐姆蛋美式漢堡/鮮奶吐司', price: 0 },
    { id: 5, name: '洋蔥燒肉蛋餅', price: 0 },
    { id: 6, name: '蔬活蛋素拼盤(素食)', price: 0, description: '雜蛋沙拉四層總匯三明治+生菜沙拉+地瓜' },
    { id: 7, name: '兒童餐', price: 0, description: '抹醬吐司:花生/阿華田/草莓/奶酥/奶油+炒蛋+玉米+薯餅+鮮奶茶' },
    { id: 8, name: '豬排蛋鐵板麵(黑胡椒)', price: 0 },
    { id: 9, name: '蘑菇', price: 0 }
  ];

  const drinks: DrinkItem[] = [
    { id: 1, name: '錫蘭紅茶', icePrice: 0, hotPrice: 0, noIcePrice: 0 },
    { id: 2, name: '錫蘭奶茶', icePrice: 0, hotPrice: 0, noIcePrice: 0 },
    { id: 3, name: '非基改豆乳', icePrice: 0, hotPrice: 0, noIcePrice: 0 }
  ];

  const addToCart = (item: MenuItem | DrinkItem, type?: 'ice' | 'hot' | 'no-ice') => {
    const price = 'icePrice' in item ? 
      (type === 'ice' ? item.icePrice : type === 'hot' ? item.hotPrice : item.noIcePrice || 0) : 
      item.price;

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

  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const getTotalItems = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
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
                <h1 className="text-2xl font-bold text-gray-800">ToDo早午餐 利澤店</h1>
                <p className="text-sm text-gray-600">五結鄉親河路一段151號(龍之園餐廳正對面)</p>
                <p className="text-sm text-gray-600">電話: 03-9508077</p>
              </div>
            </div>
            <button
              onClick={() => setShowCart(!showCart)}
              className="relative bg-yellow-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-yellow-600 transition-colors"
            >
              購物車 ({getTotalItems()})
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
                    {/* 預留圖片位置 */}
                    <div className="w-full h-40 bg-gray-200 rounded-lg mb-3 flex items-center justify-center">
                      <span className="text-gray-500">圖片位置</span>
                    </div>
                    <h3 className="font-semibold text-lg text-gray-800">{item.name}</h3>
                    {item.description && (
                      <p className="text-sm text-gray-600 mt-1">{item.description}</p>
                    )}
                    <div className="flex justify-between items-center mt-3">
                      <span className="text-lg font-bold text-orange-600">
                        {item.price === 0 ? '價格請洽詢' : `$${item.price}`}
                      </span>
                      <button
                        onClick={() => addToCart(item)}
                        className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors"
                      >
                        加入購物車
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
                        {/* 預留飲品圖片位置 */}
                        <div className="flex items-center space-x-4">
                          <div className="w-20 h-20 bg-blue-200 rounded-lg flex items-center justify-center">
                            <span className="text-blue-600">🥤</span>
                          </div>
                          <div>
                            <h3 className="font-semibold text-lg text-gray-800">{drink.name}</h3>
                            <p className="text-sm text-gray-600">
                              冰: {drink.icePrice === 0 ? '價格請洽詢' : `$${drink.icePrice}`} | 
                              溫熱: {drink.hotPrice === 0 ? '價格請洽詢' : `$${drink.hotPrice}`}
                              {drink.noIcePrice !== undefined && ` | 去冰: ${drink.noIcePrice === 0 ? '價格請洽詢' : `$${drink.noIcePrice}`}`}
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
            <div className={`bg-white rounded-xl shadow-lg p-6 sticky top-24 ${showCart ? 'block' : 'hidden lg:block'}`}>
              <h2 className="text-xl font-bold text-gray-800 mb-4">訂單詳情</h2>
              {cart.length === 0 ? (
                <p className="text-gray-500 text-center py-8">購物車是空的</p>
              ) : (
                <>
                  <div className="space-y-3 mb-6 max-h-96 overflow-y-auto">
                    {cart.map((item, index) => (
                      <div key={`${item.id}-${item.type}-${index}`} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                        <div className="flex-1">
                          <h4 className="font-medium text-sm">{item.name}</h4>
                          <p className="text-sm text-gray-600">
                            {item.price === 0 ? '價格請洽詢' : `$${item.price}`}
                          </p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => updateQuantity(item.id, item.type, item.quantity - 1)}
                            className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center hover:bg-gray-300"
                          >
                            -
                          </button>
                          <span className="w-8 text-center">{item.quantity}</span>
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
                  <div className="border-t pt-4">
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-lg font-bold">總計:</span>
                      <span className="text-xl font-bold text-orange-600">
                        {getTotalPrice() === 0 ? '價格請洽詢' : `$${getTotalPrice()}`}
                      </span>
                    </div>
                    <button className="w-full bg-green-500 text-white py-3 rounded-lg font-semibold hover:bg-green-600 transition-colors">
                      確認訂單
                    </button>
                  </div>
                </>
              )}
            </div>
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
    </div>
  );
}
