<script setup lang="ts">
import { ref } from 'vue'

interface Notification {
  id: number
  message: string
  type: 'info' | 'success' | 'warning' | 'error'
}

const notifications = ref<Notification[]>([])
let notificationId = 0

const addNotification = (
  message: string,
  type: 'info' | 'success' | 'warning' | 'error' = 'info'
) => {
  const id = notificationId++
  notifications.value.push({ id, message, type })
}

const removeNotification = (id: number) => {
  const index = notifications.value.findIndex((n) => n.id === id)
  if (index > -1) {
    notifications.value.splice(index, 1)
  }
}

defineExpose({
  addNotification
})
</script>

<template>
  <div class="notification-container">
    <TransitionGroup name="notification">
      <div
        v-for="notification in notifications"
        :key="notification.id"
        :class="['notification', `notification-${notification.type}`]"
        @click="removeNotification(notification.id)"
      >
        <div class="notification-message">{{ notification.message }}</div>
        <button class="notification-close" @click.stop="removeNotification(notification.id)">
          ×
        </button>
      </div>
    </TransitionGroup>
  </div>
</template>

<style scoped>
.notification-container {
  position: fixed;
  top: 1rem;
  right: 1rem;
  z-index: 9999;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  max-width: 400px;
}

.notification {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem 1.25rem;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  cursor: pointer;
  transition: all 0.3s ease;
  border-left: 4px solid;
}

.notification:hover {
  transform: translateX(-4px);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2);
}

.notification-info {
  border-left-color: #3b82f6;
}

.notification-success {
  border-left-color: #10b981;
}

.notification-warning {
  border-left-color: #f59e0b;
}

.notification-error {
  border-left-color: #ef4444;
}

.notification-icon {
  font-size: 1.25rem;
  font-weight: bold;
  flex-shrink: 0;
}

.notification-info .notification-icon {
  color: #3b82f6;
}

.notification-success .notification-icon {
  color: #10b981;
}

.notification-warning .notification-icon {
  color: #f59e0b;
}

.notification-error .notification-icon {
  color: #ef4444;
}

.notification-message {
  flex: 1;
  font-size: 0.875rem;
  color: #374151;
  line-height: 1.5;
}

.notification-close {
  background: none;
  border: none;
  font-size: 1.5rem;
  color: #9ca3af;
  cursor: pointer;
  padding: 0;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  transition: all 0.2s;
  flex-shrink: 0;
}

.notification-close:hover {
  background: #f3f4f6;
  color: #374151;
}

.notification-enter-active,
.notification-leave-active {
  transition: all 0.3s ease;
}

.notification-enter-from {
  opacity: 0;
  transform: translateX(100%);
}

.notification-leave-to {
  opacity: 0;
  transform: translateX(100%) scale(0.8);
}

@media (max-width: 640px) {
  .notification-container {
    left: 1rem;
    right: 1rem;
    max-width: none;
  }
}
</style>
