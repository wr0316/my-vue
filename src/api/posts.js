// 小型视频 URL 列表（真实可用的小型视频）
export const getRandomVideoUrl = () => {
  const videoUrls = [
    // 自然风景类
    "https://prod-streaming-video-msn-com.akamaized.net/a8c412fa-f696-4ff2-9c76-e8ed9cdffe0f/604a87fc-e7bc-463e-8d56-cde7e661d690.mp4", // 湖面雨滴 (1.5MB)
    "https://prod-streaming-video-msn-com.akamaized.net/ba258271-89c7-47bc-9742-bcae67c23202/f7ff4fe4-1346-47bb-9466-3f4662c1ac3a.mp4", // 阳光森林溪流 (1.8MB)
    "https://prod-streaming-video-msn-com.akamaized.net/b7014b7e-b38f-4a64-bd95-4a28a8ef6dee/113a2bf3-3a5f-45d4-8b6f-e40ce8559da3.mp4", // 日落沙丘 (2.1MB)

    // 城市生活类
    "https://prod-streaming-video-msn-com.akamaized.net/0b927d99-e38a-4f51-8d1a-598fd4d6ee97/3493c85c-f35a-488f-9a8f-633e747fb141.mp4", // 机场行人 (2.3MB)
    "https://prod-streaming-video-msn-com.akamaized.net/bc3e9341-3243-4d2c-8469-940fef56ca2d/4720a02b-eabd-4593-a1d9-5c5d61916853.mp4", // 咖啡机 (1.7MB)

    // 抽象/动画类
    "https://prod-streaming-video-msn-com.akamaized.net/35960fe4-724f-44fc-ad77-0b91c55195e4/bfd49cd7-a0c6-467e-ae34-8674779e689b.mp4", // 数字城市地图 (1.9MB)
    "https://prod-streaming-video-msn-com.akamaized.net/178161a4-26a5-4f84-96d3-6acea1909a06/2213bcd0-7d15-4da0-a619-e32d522572c0.mp4", // 抽象流动线条 (2.2MB)
  ];

  return videoUrls[Math.floor(Math.random() * videoUrls.length)];
};
// 小型视频 URL 列表（真实可用的小型视频）
export const getRandomImgUrl = () => {
  const ImgUrls = [
    "https://picsum.photos/600/200?random=1",
    "https://picsum.photos/600/350?random=2",
    "https://picsum.photos/600/480?random=3",
    "https://picsum.photos/600/300?random=4",
    "https://picsum.photos/600/450?random=5",
    "https://picsum.photos/600/250?random=6",
    "https://picsum.photos/600/500?random=7",
    "https://picsum.photos/600/380?random=8",
    "https://picsum.photos/600/420?random=9",
    "https://picsum.photos/600/280?random=10",
    "https://picsum.photos/600/330?random=11",
    "https://picsum.photos/600/470?random=12",
    "https://picsum.photos/600/220?random=13",
    "https://picsum.photos/600/400?random=14",
    "https://picsum.photos/600/360?random=15",
    "https://picsum.photos/600/270?random=16",
    "https://picsum.photos/600/490?random=17",
    "https://picsum.photos/600/310?random=18",
    "https://picsum.photos/600/440?random=19",
    "https://picsum.photos/600/240?random=20",
    "https://picsum.photos/600/500?random=21",
    "https://picsum.photos/600/390?random=22",
    "https://picsum.photos/600/430?random=23",
    "https://picsum.photos/600/290?random=24",
    "https://picsum.photos/600/340?random=25",
    "https://picsum.photos/600/460?random=26",
    "https://picsum.photos/600/230?random=27",
    "https://picsum.photos/600/410?random=28",
    "https://picsum.photos/600/370?random=29",
    "https://picsum.photos/600/260?random=30",
    "https://picsum.photos/600/500?random=31",
    "https://picsum.photos/600/320?random=32",
    "https://picsum.photos/600/450?random=33",
    "https://picsum.photos/600/210?random=34",
    "https://picsum.photos/600/480?random=35",
    "https://picsum.photos/600/300?random=36",
    "https://picsum.photos/600/470?random=37",
    "https://picsum.photos/600/250?random=38",
    "https://picsum.photos/600/500?random=39",
    "https://picsum.photos/600/380?random=40",
  ];

  return ImgUrls[Math.floor(Math.random() * ImgUrls.length)];
};

// 模拟 API 请求（实际项目需替换为真实接口）
export const fetchPosts = (params) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const { type, page, pageSize = 10 } = params;

      // 生成模拟数据（图片和视频混合）
      const mockList = Array.from({ length: pageSize }, (_, index) => {
        // 随机决定是图片还是视频（25% 概率是视频）
        const isVideo = Math.random() < 0.25;
        const randomHeight = Math.floor(Math.random() * 300) + 200; // 200-500px 随机高度

        return {
          id: `post-${page}-${index}`,
          type: isVideo ? "video" : "image",
          title: `${isVideo ? "视频" : "图片"} ${page}-${index + 1}`,
          mediaUrl: isVideo
            ? // 真实小型视频示例（来自 Pexels/Mixkit）
              getRandomVideoUrl()
            : // 随机图片
              getRandomImgUrl(),
          height: randomHeight, // 图片/视频高度
          describe: `描述 ${page}-${index + 1}`,
          userName: `用户 ${page}-${index + 1}`,
          likeCount: Math.floor(Math.random() * 50),
          isLiked: Math.random() < 0.5,  // 新增随机布尔字段
        };
      });

      // 模拟分页：前 5 页有数据，第 6 页开始无更多
      const hasMore = page < 5;

      resolve({
        data: {
          list: mockList,
          hasMore,
        },
      });
    }, 800); // 模拟网络延迟
  });
};
