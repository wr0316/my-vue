<template>
  <div class="post-item">
    <!-- 图片类型 -->
    <div v-if="item.type === 'image'" class="media-container">
      <!-- 图片加载中显示 loading -->
      <div v-if="isLoading" class="image-loading" :style="{ height: item.height + 'px' }">
        <div class="spinner"></div>
      </div>

      <!-- 图片 -->
      <img v-if="isInView" :src="item.mediaUrl" :alt="item.title" class="post-media" @load="handleImageLoad"
        @error="handleImageError" :style="{ display: isLoading ? 'none' : 'block' }" />
    </div>

    <!-- 视频类型 -->
    <div v-else class="media-container">
      <!-- 视频懒加载（滚动到可视区域才加载） -->
      <video v-if="isInView || !isLazy" ref="videoRef" :src="item.mediaUrl" controls preload="metadata" class="post-media"
        @click="togglePlay" />

      <!-- 视频未加载时的占位符 -->
      <div v-else class="video-placeholder" :style="{ height: item.height + 'px' }" @click="loadVideo">
        <i class="fa fa-video-camera"></i>
        <span>点击加载视频</span>
      </div>

      <!-- 视频播放按钮覆盖层 -->
      <div v-if="isInView && !isPlaying" class="play-overlay" @click="togglePlay">
        <img class="play-icon" src="../assets/play.png" alt="" />
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
          <img class="like-icon" :src="isLiked ? require('../assets/love.png') : require('../assets/like.png')" alt="点赞"
            @click="debouncedToggleLike" />
          <span class="like-count">{{ likeCount }}</span>
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
  },
  data() {
    return {
      isLoading: true, // 图片加载状态
      isPlaying: false,
      isInView: false,
      observer: null,
      // 新增点赞状态和点赞数，初始值来自 item
      isLiked: this.item.isLiked || false,
      likeCount: this.item.likeCount || 0,
    };
  },
  created() {
    // 创建防抖包装的点赞切换函数，防抖时间300ms
    this.debouncedToggleLike = this.debounce(this.toggleLike, 300);
  },
  mounted() {
    if (this.isLazy) {
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
  },
  beforeDestroy() {
    if (this.observer) {
      this.observer.disconnect();
    }
    if (this.$refs.videoRef) {
      this.$refs.videoRef.removeEventListener('pause', null);
      this.$refs.videoRef.removeEventListener('play', null);
    }
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
        // 取消点赞
        this.isLiked = false;
        this.likeCount = Math.max(0, this.likeCount - 1);
      } else {
        // 点赞
        this.isLiked = true;
        this.likeCount += 1;
      }
      // 这里可以调用接口同步点赞状态
      // 例如：this.syncLikeStatus(this.isLiked);
    },
    handleImageLoad() {
      this.isLoading = false;
    },
    handleImageError() {
      this.isLoading = false;
      // 你可以在这里设置一个默认图片或者错误提示
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
  },
};
</script>

<style scoped>
.post-item {
  width: 100%;
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
