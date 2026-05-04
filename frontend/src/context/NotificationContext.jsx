import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from './AuthContext';
import axios from 'axios';

const NotificationContext = createContext(null);

export const NotificationProvider = ({ children }) => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const socketRef = useRef(null);

  useEffect(() => {
    if (user && user._id) {
      // Connect to the server
      const socket = io('/', {
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
      });

      socketRef.current = socket;

      // Join personal room
      socket.emit('join', user._id);

      // Listen for new notifications
      socket.on('newNotification', (notification) => {
        setNotifications((prev) => [notification, ...prev]);
        setUnreadCount((prev) => prev + 1);
        
        // Optional: Play a sound or trigger a small animation
        console.log('New real-time notification:', notification);
      });

      // Fetch initial notifications
      fetchNotifications();

      return () => {
        socket.disconnect();
      };
    }
  }, [user]);

  const fetchNotifications = async () => {
    try {
      const res = await axios.post('/Notification/isread', { UserId: user._id });
      const allNotifications = res.data;
      setNotifications(allNotifications);
      setUnreadCount(allNotifications.filter(n => !n.IsRead).length);
    } catch (err) {
      console.error('Failed to fetch notifications', err);
    }
  };

  const markAsRead = async () => {
    // In a real app, you'd have an API to mark all or specific ones as read.
    // For now, we'll just clear the unread count locally.
    setUnreadCount(0);
  };

  return (
    <NotificationContext.Provider value={{ notifications, unreadCount, markAsRead }}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => useContext(NotificationContext);
