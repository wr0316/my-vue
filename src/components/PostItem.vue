<template>
  <div class="post-item" v-if="item.type !== 'recommend'">
    <!-- 图片类型 -->
    <div v-if="item.type === 'image'" class="media-container">
      <div v-if="isLoading" class="image-loading" :style="{ height: item.height + 'px' }">
        <div class="spinner"></div>
      </div>

      <img
        v-if="isInView"
        :src="item.mediaUrl"
        :alt="item.title"
        class="post-media"
        @load="handleImageLoad"
        @error="handleImageError"
        :style="{ display: isLoading ? 'none' : 'block' }"
      />
    </div>

    <!-- 视频类型 -->
    <div v-else class="media-container">
      <video
        v-if="isInView || !isLazy"
        ref="videoRef"
        :src="item.mediaUrl"
        controls
        preload="metadata"
        class="post-media"
        @click="togglePlay"
      />

      <div v-else class="video-placeholder" :style="{ height: item.height + 'px' }" @click="loadVideo">
        <i class="fa fa-video-camera"></i>
        <span>点击加载视频</span>
      </div>
    </div>

    <div class="post-info">
      <div class="post-title">{{ item.title }}</div>
      <span class="post-time">{{ item.describe }}</span>
      <div class="user">
        <div class="user-info">
          <img class="avatar" src="../assets/user.png" alt="用户头像" />
          <span class="username">{{ item.userName }}</span>
        </div>
        <div class="like-info">
          <img
            class="like-icon"
            :src="isLiked ? require('../assets/love.png') : require('../assets/like.png')"
            alt="点赞"
            @click="debouncedToggleLike"
          />
          <span class="like-count">{{ likeCount }}</span>
        </div>
      </div>
    </div>
  </div>

  <!-- 优质用户推荐模块 -->
  <div
    v-else
    class="recommend-container"
    @touchstart="onTouchStart"
    @touchmove="onTouchMove"
    @touchend="onTouchEnd"
  >
    <div class="recommend-header">
      优质用户推荐
      <div class="carousel-indicators">
        <span
          v-for="(page, index) in totalPages"
          :key="index"
          :class="['indicator-dot', { active: currentPage === index }]"
          @click="goToPage(index)"
        ></span>
      </div>
    </div>
    <div class="recommend-list">
      <div
        v-for="user in pagedUsers"
        :key="user.id"
        class="recommend-user"
      >
        <img :src="user.avatar" alt="头像" class="recommend-avatar" />
        <div class="recommend-info">
          <div class="recommend-name">{{ user.name }}</div>
          <div class="recommend-desc">{{ user.description }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    item: {
      type: Object,
      required: true,
    },
    isLazy: {
      type: Boolean,
      default: false,
    },
    recommendUsers: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      isLoading: true,
      isPlaying: false,
      isInView: false,
      observer: null,
      isLiked: this.item.isLiked || false,
      likeCount: this.item.likeCount || 0,
      currentPage: 0,
      pageSize: 3,
      autoSlideTimer: null,
      touchStartX: 0,
      touchDeltaX: 0,
    };
  },
  computed: {
    totalPages() {
      return Math.min(3, Math.ceil(this.recommendUsers.length / this.pageSize));
    },
    pagedUsers() {
      const start = this.currentPage * this.pageSize;
      return this.recommendUsers.slice(start, start + this.pageSize);
    },
  },
  created() {
    this.debouncedToggleLike = this.debounce(this.toggleLike, 300);
  },
  mounted() {
    if (this.isLazy && this.item.type !== 'recommend') {
      this.observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              this.isInView = true;
              this.observer.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.1 }
      );
      this.observer.observe(this.$el);
    } else {
      this.isInView = true;
    }

    if (this.item.type === 'video' && this.$refs.videoRef) {
      this.$refs.videoRef.addEventListener('pause', () => {
        this.isPlaying = false;
      });
      this.$refs.videoRef.addEventListener('play', () => {
        this.isPlaying = true;
      });
    }

    if (this.item.type === 'recommend') {
      this.startAutoSlide();
    }
  },
  beforeDestroy() {
    if (this.observer) {
      this.observer.disconnect();
    }
    if (this.$refs.videoRef) {
      this.$refs.videoRef.removeEventListener('pause', null);
      this.$refs.videoRef.removeEventListener('play', null);
    }
    this.stopAutoSlide();
  },
  methods: {
    debounce(func, wait = 300) {
      let timeout;
      return (...args) => {
        if (timeout) clearTimeout(timeout);
        timeout = setTimeout(() => {
          func.apply(this, args);
        }, wait);
      };
    },

    toggleLike() {
      if (this.isLiked) {
        this.isLiked = false;
        this.likeCount = Math.max(0, this.likeCount - 1);
      } else {
        this.isLiked = true;
        this.likeCount += 1;
      }
    },
    handleImageLoad() {
      this.isLoading = false;
    },
    handleImageError() {
      this.isLoading = false;
    },
    togglePlay() {
      if (!this.isInView) return;

      const video = this.$refs.videoRef;

      if (video.paused) {
        this.pauseAllVideos();
        video.play();
        this.isPlaying = true;
      } else {
        video.pause();
        this.isPlaying = false;
      }
    },
    loadVideo() {
      this.isInView = true;
    },
    pauseAllVideos() {
      const videos = document.querySelectorAll('video');
      videos.forEach((video) => {
        if (!video.paused && video !== this.$refs.videoRef) {
          video.pause();
          const component = this.findComponentByElement(video);
          if (component && component.isPlaying) {
            component.isPlaying = false;
          }
        }
      });
    },
    findComponentByElement(element) {
      const comp = this.$parent;
      if (!comp) return null;
      return comp.$children.find(
        (child) => child.$el.contains(element) || element.contains(child.$el)
      );
    },

    // 自动轮播相关方法
    startAutoSlide() {
      this.stopAutoSlide();
      this.autoSlideTimer = setInterval(() => {
        this.currentPage = (this.currentPage + 1) % this.totalPages;
      }, 2000);
    },
    stopAutoSlide() {
      if (this.autoSlideTimer) {
        clearInterval(this.autoSlideTimer);
        this.autoSlideTimer = null;
      }
    },
    restartAutoSlide() {
      this.stopAutoSlide();
      this.startAutoSlide();
    },

    goToPage(index) {
      if (index >= 0 && index < this.totalPages) {
        this.currentPage = index;
        this.restartAutoSlide();
      }
    },

    // 触摸滑动切换
    onTouchStart(event) {
      if (this.item.type !== 'recommend') return;
      this.stopAutoSlide();
      this.touchStartX = event.touches[0].clientX;
      this.touchDeltaX = 0;
      event.preventDefault();
    },
    onTouchMove(event) {
      if (this.item.type !== 'recommend') return;
      const currentX = event.touches[0].clientX;
      this.touchDeltaX = currentX - this.touchStartX;
      event.preventDefault();

    },
    onTouchEnd() {
      if (this.item.type !== 'recommend') return;
      const threshold = 50; // 滑动阈值
      if (this.touchDeltaX > threshold) {
        // 向右滑，上一页
        this.currentPage = (this.currentPage - 1 + this.totalPages) % this.totalPages;
      } else if (this.touchDeltaX < -threshold) {
        // 向左滑，下一页
        this.currentPage = (this.currentPage + 1) % this.totalPages;
      }
      this.restartAutoSlide();
      this.touchStartX = 0;
      this.touchDeltaX = 0;
      event.preventDefault();

    },
  },
};
</script>

<style scoped>
.post-item {
  width: 100%;
}
.recommend-container {
  width: 100%;
  height: 280px; /* 固定高度 */
  background: #ff891742;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  padding: 16px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  position: relative;
}

.recommend-header {
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 12px;
  border-bottom: 1px solid #eee;
  padding-bottom: 8px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
}

/* 轮播滑块容器，右上角 */
.carousel-indicators {
  display: flex;
  gap: 4px;
  position: absolute;
  right: 0px;
  top: 8px;
}

.indicator-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background-color: #ccc;
  cursor: pointer;
  transition: background-color 0.3s;
}

.indicator-dot.active {
  background-color: #f15e25e0;
}

.recommend-list {
  flex: 1;
  overflow-y: hidden; /* 禁止滚动，固定显示当前页 */
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
}

/* 保持原有推荐用户样式 */
.recommend-user {
  display: flex;
  align-items: center;
  margin-bottom: 12px;
}

.recommend-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
  margin-right: 12px;
  border: 1px solid #ddd;
}

.recommend-info {
  flex: 1;
}

.recommend-name {
  font-size: 14px;
  margin-bottom: 4px;
}

.recommend-desc {
  font-size: 11px;
  color: #918e8e;
  line-height: 1.2;
}

.media-container {
  position: relative;
  width: 100%;
  background: #f5f5f5;
}

.post-media {
  width: 100%;
  height: auto;
  display: block;
}

/* 图片加载中的 loading 样式 */
.image-loading {
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f0f0f0;
  height: 100%;
  min-height: 200px;
  /* 你可以根据需要调整 */
}

/* 简单的 CSS loading 动画 */
.spinner {
  width: 30px;
  height: 30px;
  border: 4px solid #ccc;
  border-top-color: #333;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.lazy-placeholder,
.video-placeholder {
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f0f0f0;
  color: #999;
  font-size: 24px;
}

.video-placeholder span {
  margin-top: 8px;
  font-size: 14px;
}

.play-overlay {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 30px;
  height: 30px;
  background: rgba(0, 0, 0, 0.6);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: rgb(24, 22, 22);
  font-size: 24px;
  cursor: pointer;
  transition: all 0.2s;
}

.play-overlay .play-icon {
  width: 30px;
  height: 30px;
}

.play-overlay:hover {
  transform: translate(-50%, -50%) scale(1.1);
  background: rgba(0, 0, 0, 0.8);
}

.post-info {
  padding: 12px;
}

.user {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 0 0 0;
}

.user-info {
  display: flex;
  align-items: center;
}

.avatar {
  width: 18px;
  height: 18px;
  border-radius: 50%;
  object-fit: cover;
  margin-right: 2px;
}

.username {
  font-size: 11px;
  color: #797777;
}

.like-info {
  display: flex;
  align-items: center;
  cursor: pointer;
  user-select: none;
  line-height: 18px;
}

.like-icon {
  width: 16px;
  height: 16px;
  margin-right: 2px;
}

.like-count {
  font-size: 12px;
  line-height: 16px;
  color: #666;
}

.post-title {
  text-align: left;
  font-size: 14px;
  margin-bottom: 4px;
}

.post-time {
  font-size: 10px;
  padding: 1px;
  background-color: #f2eeee;
  color: #b3b1b1;
}
</style>
