import React, { createContext, useContext, useState } from 'react';


const defaultTimerSettings = {
  focusDuration: 25 * 60,
  shortBreakDuration: 5 * 60,
  longBreakDuration: 15 * 60,
  autoStartBreaks: false,
  autoStartFocus: false,
};


const defaultToggleSettings = {
  hideShorts: true,
  hideHome: false,
  hideComments: true,
  hideRecommendations: true,
  hideSidebar: false,
};

const AppContext = createContext(undefined);


export const AppProvider = ({ children }) => {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  const [timerSettings, setTimerSettings] = useState(() => {
    const saved = localStorage.getItem('focustube-timer-settings');
    return saved ? JSON.parse(saved) : defaultTimerSettings;
  });

  const [toggleSettings, setToggleSettings] = useState(() => {
    const saved = localStorage.getItem('focustube-toggle-settings');
    return saved ? JSON.parse(saved) : defaultToggleSettings;
  });

  const [notification, setNotification] = useState(null);

  const openLoginModal = () => setIsLoginModalOpen(true);
  const closeLoginModal = () => setIsLoginModalOpen(false);

  const updateTimerSettings = (settings) => {
    const newSettings = { ...timerSettings, ...settings };
    setTimerSettings(newSettings);
    localStorage.setItem('focustube-timer-settings', JSON.stringify(newSettings));
  };

  const updateToggleSettings = (settings) => {
    const newSettings = { ...toggleSettings, ...settings };
    setToggleSettings(newSettings);
    localStorage.setItem('focustube-toggle-settings', JSON.stringify(newSettings));
  };

  const showNotification = (message, type) => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 5000);
  };

  const clearNotification = () => setNotification(null);

  return (
    <AppContext.Provider
      value={{
        isLoginModalOpen,
        openLoginModal,
        closeLoginModal,
        timerSettings,
        updateTimerSettings,
        toggleSettings,
        updateToggleSettings,
        notification,
        showNotification,
        clearNotification,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);

  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }

  return context;
};
