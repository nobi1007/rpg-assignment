<script setup lang="ts">
import { onMounted } from 'vue'
import { useBlogStore } from '@/stores/blog'

const blogStore = useBlogStore()

onMounted(() => {
  blogStore.fetchBlogs()
})

const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}
</script>

<template>
  <div class="blog-list-container">
    <h2 class="section-title">Recent Blog Posts</h2>

    <div v-if="blogStore.isLoading" class="loading">Loading blogs...</div>

    <div v-else-if="blogStore.blogs.length === 0" class="empty-state">
      <p>No blog posts yet. Be the first to create one!</p>
    </div>

    <div v-else class="blog-grid">
      <div v-for="blog in blogStore.blogs" :key="blog.id" class="blog-card">
        <div class="blog-header">
          <h3 class="blog-title">{{ blog.title }}</h3>
          <span class="blog-date">{{ formatDate(blog.createdAt) }}</span>
        </div>

        <p class="blog-content">{{ blog.content }}</p>

        <div class="blog-footer">
          <div class="author-info">
            <div class="author-details">
              <span class="author-name">{{ blog.authorName }}</span>
              <span class="author-email">{{ blog.authorEmail }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.blog-list-container {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 1rem;
}

.section-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: #000000;
  margin-bottom: 2rem;
}

.loading,
.empty-state {
  text-align: center;
  padding: 3rem 1rem;
  color: #666666;
  font-size: 1rem;
}

.blog-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 1.5rem;
}

.blog-card {
  background: #ffffff;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  padding: 1.5rem;
  transition: box-shadow 0.2s ease;
}

.blog-card:hover {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.blog-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
  gap: 1rem;
}

.blog-title {
  font-size: 1.125rem;
  font-weight: 600;
  color: #000000;
  margin: 0;
  flex: 1;
}

.blog-date {
  font-size: 0.75rem;
  color: #999999;
  white-space: nowrap;
}

.blog-content {
  color: #333333;
  line-height: 1.6;
  margin-bottom: 1.5rem;
  word-wrap: break-word;
}

.blog-footer {
  border-top: 1px solid #e0e0e0;
  padding-top: 1rem;
}

.author-info {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.author-details {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.author-name {
  font-weight: 500;
  color: #000000;
  font-size: 0.875rem;
}

.author-email {
  font-size: 0.75rem;
  color: #666666;
}

@media (max-width: 768px) {
  .blog-grid {
    grid-template-columns: 1fr;
  }

  .section-title {
    font-size: 1.25rem;
  }
}
</style>
