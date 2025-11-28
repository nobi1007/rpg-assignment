<script setup lang="ts">
import { ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useBlogStore } from '@/stores/blog'
import BlogList from '@/components/BlogList.vue'
import AddBlog from '@/components/AddBlog.vue'
import NotificationToast from '@/components/NotificationToast.vue'

const router = useRouter()
const authStore = useAuthStore()
const blogStore = useBlogStore()

const showAddBlogModal = ref(false)
const notificationToast = ref<InstanceType<typeof NotificationToast> | null>(null)

const handleLogout = () => {
  authStore.logout()
  router.push('/login')
}

const openAddBlogModal = () => {
  showAddBlogModal.value = true
}

const closeAddBlogModal = () => {
  showAddBlogModal.value = false
}

watch(
  () => blogStore.newBlogNotification,
  (notification) => {
    if (notification && notificationToast.value) {
      notificationToast.value.addNotification(
        `New blog posted by ${notification.authorName}: "${notification.title}"`,
        'info'
      )
      blogStore.clearNotification()
    }
  }
)
</script>

<template>
  <div class="home-container">
    <div class="home-header">
      <div class="header-content">
        <div class="welcome-section">
          <h1 class="welcome-title">Welcome, {{ authStore.user?.name }}</h1>
          <p class="welcome-subtitle">Share your thoughts with the community</p>
        </div>

        <div class="header-actions">
          <button @click="openAddBlogModal" class="btn btn-create">Create Blog Post</button>
          <button @click="handleLogout" class="btn btn-logout">Logout</button>
        </div>
      </div>
    </div>

    <BlogList />

    <AddBlog :show="showAddBlogModal" @close="closeAddBlogModal" />

    <NotificationToast ref="notificationToast" />
  </div>
</template>

<style scoped>
.home-container {
  min-height: 100vh;
  background: #ffffff;
  padding-bottom: 2rem;
}

.home-header {
  background: #ffffff;
  border-bottom: 1px solid #e0e0e0;
  padding: 1.5rem 1rem;
  margin-bottom: 2rem;
}

.header-content {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 2rem;
  flex-wrap: wrap;
}

.welcome-section {
  flex: 1;
  min-width: 250px;
}

.welcome-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: #000000;
  margin: 0 0 0.5rem 0;
}

.welcome-subtitle {
  color: #666666;
  font-size: 0.875rem;
  margin: 0;
}

.header-actions {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.btn {
  padding: 0.75rem 1.25rem;
  border: 1px solid #000000;
  border-radius: 4px;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;
  background: #ffffff;
}

.btn-create {
  color: #000000;
}

.btn-create:hover {
  background: #f5f5f5;
}

.btn-logout {
  color: #000000;
}

.btn-logout:hover {
  background: #f5f5f5;
}

@media (max-width: 768px) {
  .header-content {
    flex-direction: column;
    align-items: stretch;
  }

  .header-actions {
    width: 100%;
  }

  .btn {
    flex: 1;
  }

  .welcome-title {
    font-size: 1.25rem;
  }
}
</style>
