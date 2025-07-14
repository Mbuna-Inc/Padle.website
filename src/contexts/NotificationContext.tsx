import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from './AuthContext';

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  read: boolean;
  createdAt: Date;
  actionUrl?: string;
}

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  addNotification: (notification: Omit<Notification, 'id' | 'read' | 'createdAt'>) => void;
  markAsRead: (notificationId: string) => void;
  markAllAsRead: () => void;
  deleteNotification: (notificationId: string) => void;
  clearAllNotifications: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};

interface NotificationProviderProps {
  children: ReactNode;
}

export const NotificationProvider: React.FC<NotificationProviderProps> = ({ children }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const { user } = useAuth();

  // Load notifications from localStorage on mount
  useEffect(() => {
    if (user) {
      const savedNotifications = localStorage.getItem(`notifications_${user.id}`);
      if (savedNotifications) {
        try {
          const parsedNotifications = JSON.parse(savedNotifications).map((notification: any) => ({
            ...notification,
            createdAt: new Date(notification.createdAt)
          }));
          setNotifications(parsedNotifications);
        } catch (error) {
          console.error('Error parsing saved notifications:', error);
        }
      } else {
        // Create some mock notifications for demonstration
        const mockNotifications: Notification[] = [
          {
            id: '1',
            title: 'Welcome to PlayEasy!',
            message: 'Your account has been created successfully. Start booking your first court!',
            type: 'success',
            read: false,
            createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
            actionUrl: '/'
          },
          {
            id: '2',
            title: 'Booking Confirmed',
            message: 'Your booking for Premium Tennis Court A has been confirmed for tomorrow.',
            type: 'success',
            read: false,
            createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000), // 1 hour ago
            actionUrl: '/profile'
          },
          {
            id: '3',
            title: 'New Court Available',
            message: 'A new premium court has been added to our facilities. Check it out!',
            type: 'info',
            read: true,
            createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
            actionUrl: '/'
          }
        ];
        setNotifications(mockNotifications);
        localStorage.setItem(`notifications_${user.id}`, JSON.stringify(mockNotifications));
      }
    }
  }, [user]);

  // Save notifications to localStorage whenever notifications change
  useEffect(() => {
    if (user && notifications.length > 0) {
      localStorage.setItem(`notifications_${user.id}`, JSON.stringify(notifications));
    }
  }, [notifications, user]);

  const unreadCount = notifications.filter(notification => !notification.read).length;

  const addNotification = (notificationData: Omit<Notification, 'id' | 'read' | 'createdAt'>) => {
    const newNotification: Notification = {
      ...notificationData,
      id: Date.now().toString(),
      read: false,
      createdAt: new Date()
    };
    setNotifications(prev => [newNotification, ...prev]);
  };

  const markAsRead = (notificationId: string) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === notificationId 
          ? { ...notification, read: true }
          : notification
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, read: true }))
    );
  };

  const deleteNotification = (notificationId: string) => {
    setNotifications(prev => prev.filter(notification => notification.id !== notificationId));
  };

  const clearAllNotifications = () => {
    setNotifications([]);
  };

  const value: NotificationContextType = {
    notifications,
    unreadCount,
    addNotification,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    clearAllNotifications
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
}; 