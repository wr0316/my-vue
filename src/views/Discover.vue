<template>
  <div class="discover-page">
    <van-pull-refresh v-model="isRefreshing" @refresh="onRefresh">
      <div v-if="postList.length > 0" class="waterfall-container">
        <div class="waterfall-column" ref="leftColumn">
          <PostItem
            v-for="(item, index) in leftColumnItems"
            :key="item.id"
            :item="item"
            :isLazy="true"
            :recommendUsers="item.type === 'recommend' ? recommendUsers : []"
            class="waterfall-item"
          />
        </div>
        <div class="waterfall-column" ref="rightColumn">
          <PostItem
            v-for="(item, index) in rightColumnItems"
            :key="item.id"
            :item="item"
            :isLazy="true"
            :recommendUsers="item.type === 'recommend' ? recommendUsers : []"
            class="waterfall-item"
          />
        </div>
      </div>

      <div v-else-if="isLoading" class="loading-tip">
        <i class="fa fa-spinner fa-spin"></i> 加载中...
      </div>

      <div v-else class="no-data-tip">
        <i class="fa fa-box-open"></i> 暂无内容，下拉刷新试试~
      </div>

      <div v-if="isLoadingMore && postList.length > 0" class="loading-more-tip">
        <i class="fa fa-spinner fa-spin"></i> 加载更多...
      </div>

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
    PostItem,
  },
  props: {
    type: {
      type: String,
      default: 'mixed',
    },
  },
  data() {
    return {
      postList: [],
      leftColumnItems: [],
      rightColumnItems: [],
      isLoading: true,
      isLoadingMore: false,
      currentPage: 1,
      pageSize: 10,
      hasMore: true,
      isRefreshing: false,

      recommendUsers: [
        {
          id: 'user-1',
          name: '张三',
          avatar: 'https://randomuser.me/api/portraits/men/1.jpg',
          description: '摄影爱好者，分享美图',
        },
        {
          id: 'user-2',
          name: '李四',
          avatar: 'https://randomuser.me/api/portraits/women/2.jpg',
          description: '旅行达人，记录精彩瞬间',
        },
        {
          id: 'user-3',
          name: '王五',
          avatar: 'https://randomuser.me/api/portraits/men/3.jpg',
          description: '美食博主，探索美味世界',
        },
                {
          id: 'user-4',
          name: '用户4',
          avatar: 'https://randomuser.me/api/portraits/men/1.jpg',
          description: '摄影爱好者，分享美图',
        },
        {
          id: 'user-5',
          name: '用户5',
          avatar: 'https://randomuser.me/api/portraits/women/2.jpg',
          description: '旅行达人，记录精彩瞬间',
        },
        {
          id: 'user-6',
          name: '用户6',
          avatar: 'https://randomuser.me/api/portraits/men/3.jpg',
          description: '美食博主，探索美味世界',
        },
                        {
          id: 'user-7',
          name: '用户7',
          avatar: 'https://randomuser.me/api/portraits/men/1.jpg',
          description: '摄影爱好者，分享美图',
        },
        {
          id: 'user-8',
          name: '用户8',
          avatar: 'https://randomuser.me/api/portraits/women/2.jpg',
          description: '旅行达人，记录精彩瞬间',
        },
        {
          id: 'user-9',
          name: '用户9',
          avatar: 'https://randomuser.me/api/portraits/men/3.jpg',
          description: '美食博主，探索美味世界',
        },
      ],
    };
  },
  computed: {
    currentType() {
      return this.type;
    },
  },
  watch: {
    postList: {
      handler() {
        this.assignItemsToColumns();
      },
      deep: true,
    },
    type: {
      handler() {
        this.resetAndLoad();
      },
      immediate: true,
    },
  },
  mounted() {
    window.addEventListener('scroll', this.handleScroll);
  },
  beforeDestroy() {
    window.removeEventListener('scroll', this.handleScroll);
  },
  methods: {
    async resetAndLoad() {
      this.currentPage = 1;
      this.postList = [];
      this.hasMore = true;
      await this.fetchInitialData();
    },
    async fetchInitialData() {
      try {
        this.isLoading = true;
        const res = await fetchPosts({
          type: this.currentType,
          page: this.currentPage,
          pageSize: this.pageSize,
        });
        let list = res.data.list || [];

        // 仅第一页插入推荐模块
        if (this.currentPage === 1 && list.length > 0) {
          // 生成推荐模块对象，id需唯一
          const recommendModule = {
            id: 'recommend-' + Date.now(),
            type: 'recommend',
          };

          // 随机插入位置，范围0~list.length
          const insertIndex = Math.floor(Math.random() * (list.length + 1));
          list.splice(insertIndex, 0, recommendModule);
        }

        this.postList = list;
        this.hasMore = res.data.hasMore || false;
      } catch (error) {
        console.error('数据加载失败:', error);
        this.postList = [];
        this.hasMore = false;
      } finally {
        this.isLoading = false;
      }
    },
    async onRefresh() {
      this.isRefreshing = true;
      this.currentPage = 1;
      await this.fetchInitialData();
      this.isRefreshing = false;
    },
    async loadMore() {
      if (!this.hasMore || this.isLoadingMore) return;

      this.isLoadingMore = true;
      this.currentPage++;

      try {
        const res = await fetchPosts({
          type: this.currentType,
          page: this.currentPage,
          pageSize: this.pageSize,
        });
        this.postList = [...this.postList, ...(res.data.list || [])];
        this.hasMore = res.data.hasMore || false;
      } catch (error) {
        console.error('加载更多失败:', error);
        this.currentPage--;
      } finally {
        this.isLoadingMore = false;
      }
    },
    handleScroll() {
      const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;

      if (scrollTop + windowHeight >= documentHeight - 100) {
        this.loadMore();
      }
    },
    assignItemsToColumns() {
      this.leftColumnItems = [];
      this.rightColumnItems = [];

      this.postList.forEach((item, index) => {
        if (index % 2 === 0) {
          this.leftColumnItems.push(item);
        } else {
          this.rightColumnItems.push(item);
        }
      });
    },
  },
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
}

.loading-tip,
.no-data-tip,
.no-more-tip,
.loading-more-tip {
  text-align: center;
  padding: 20px;
  color: #666;
}

.loading-more-tip {
  padding: 10px;
  font-size: 14px;
}
</style>
