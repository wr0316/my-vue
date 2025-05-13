<template>
  <div class="discover-page">
    <van-pull-refresh v-model="isRefreshing" @refresh="onRefresh">
      <!-- 双列瀑布流容器 -->
      <div v-if="postList.length > 0" class="waterfall-container">
        <div class="waterfall-column" ref="leftColumn">
          <PostItem
            v-for="(item, index) in leftColumnItems"
            :key="item.id"
            :item="item"
            :isLazy="true" 
            class="waterfall-item"
          />
        </div>
        <div class="waterfall-column" ref="rightColumn">
          <PostItem
            v-for="(item, index) in rightColumnItems"
            :key="item.id"
            :item="item"
            :isLazy="true" 
            class="waterfall-item"
          />
        </div>
      </div>

      <!-- 加载状态提示 -->
      <div v-else-if="isLoading" class="loading-tip">
        <i class="fa fa-spinner fa-spin"></i> 加载中...
      </div>
      
      <!-- 无数据提示 -->
      <div v-else class="no-data-tip">
        <i class="fa fa-box-open"></i> 暂无内容，下拉刷新试试~
      </div>
      
      <!-- 加载更多提示 -->
      <div v-if="isLoadingMore && postList.length > 0" class="loading-more-tip">
        <i class="fa fa-spinner fa-spin"></i> 加载更多...
      </div>
      
      <!-- 无更多数据提示 -->
      <div v-if="!hasMore && postList.length > 0 && !isLoadingMore" class="no-more-tip">
        没有更多内容了~
      </div>
    </van-pull-refresh>
  </div>
</template>

<script>
import { fetchPosts } from '@/api/posts';
import PostItem from '@/components/PostItem.vue';

export default {
  components: {
    PostItem
  },
  data() {
    return {
      postList: [],           // 全部数据
      leftColumnItems: [],    // 左列数据
      rightColumnItems: [],   // 右列数据
      isLoading: true,        // 初始加载状态
      isLoadingMore: false,   // 加载更多状态
      currentPage: 1,         // 当前页码
      pageSize: 10,           // 每页数量
      hasMore: true,          // 是否有更多数据
      isRefreshing: false,    // 下拉刷新状态
      currentType: 'mixed'    // 混合类型（图片+视频）
    };
  },
  watch: {
    // 监听 postList 变化，重新分配左右列数据
    postList: {
      handler() {
        this.assignItemsToColumns();
      },
      deep: true
    }
  },
  mounted() {
    this.fetchInitialData();
    // 监听滚动事件，实现上拉加载
    window.addEventListener('scroll', this.handleScroll);
  },
  beforeDestroy() {
    window.removeEventListener('scroll', this.handleScroll);
  },
  methods: {
    // 初始化加载数据（首次加载10条）
    async fetchInitialData() {
      try {
        this.isLoading = true;
        const res = await fetchPosts({ 
          type: this.currentType, 
          page: this.currentPage,
          pageSize: this.pageSize
        });
        
        this.postList = res.data.list || [];
        this.hasMore = res.data.hasMore || false;
      } catch (error) {
        console.error('数据加载失败:', error);
        this.postList = [];
        this.hasMore = false;
      } finally {
        this.isLoading = false;
      }
    },

    // 下拉刷新
    async onRefresh() {
      this.isRefreshing = true;
      this.currentPage = 1;
      await this.fetchInitialData();
      this.isRefreshing = false;
    },

    // 上拉加载更多（每次加载10条）
    async loadMore() {
      if (!this.hasMore || this.isLoadingMore) return;
      
      this.isLoadingMore = true;
      this.currentPage++;
      
      try {
        const res = await fetchPosts({ 
          type: this.currentType, 
          page: this.currentPage,
          pageSize: this.pageSize
        });
        
        this.postList = [...this.postList, ...(res.data.list || [])];
        this.hasMore = res.data.hasMore || false;
      } catch (error) {
        console.error('加载更多失败:', error);
        this.currentPage--;  // 回退页码
      } finally {
        this.isLoadingMore = false;
      }
    },

    // 处理滚动事件（上拉加载）
    handleScroll() {
      const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      
      // 当滚动到距离底部 100px 时加载更多
      if (scrollTop + windowHeight >= documentHeight - 100) {
        console.log("wr-触底加载");
        
        this.loadMore();
      }
    },

    // 将数据分配到左右两列
    assignItemsToColumns() {
      // 清空左右列
      this.leftColumnItems = [];
      this.rightColumnItems = [];
      
      // 交替分配数据到左右列
      this.postList.forEach((item, index) => {
        if (index % 2 === 0) {
          this.leftColumnItems.push(item);
        } else {
          this.rightColumnItems.push(item);
        }
      });
    }
  }
};
</script>

<style scoped>
.discover-page {
  min-height: 100vh;
  background: #f8f8f8;
}

.waterfall-container {
  display: flex;
  padding: 4px;
  gap: 4px; 
}

.waterfall-column {
  flex: 1; 
  display: flex;
  flex-direction: column;
  gap: 16px; 
}

.waterfall-item {
  background: #fff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  transition: transform 0.2s;
  
  /* 鼠标悬停效果 */
  &:hover {
    transform: translateY(-4px);
  }
}

.loading-tip, .no-data-tip, .no-more-tip, .loading-more-tip {
  text-align: center;
  padding: 20px;
  color: #666;
}

.loading-more-tip {
  padding: 10px;
  font-size: 14px;
}
</style>