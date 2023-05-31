const linksList = [
    {
        data: {
            title: "主页",
            caption: "回到主页",
            icon: "home"
        },
        link: "#/main",
    },
    {
        data: {
            title: "咨询浏览",
            caption: "浏览各种资讯",
            icon: "home",
        },
        children: [
            {
                data: {
                    title: "2022棋手排名",
                    caption: "职业棋手排名信息",
                    icon: "school"
                },
                link: "#/main/rank",
            },
            {
                data: {
                    title: "围棋资讯",
                    caption: "查看围棋资讯",
                    icon: "book"
                },
                link: "#/main/article/list",
            },
            {
                data: {
                    title: "直播推荐",
                    caption: "看看热门围棋直播",
                    icon: "rss_feed"
                },
                link: "#/main/live",
            },
        ]
    },
    {
        data: {
            title: "棋谱播放",
            caption: "看棋谱",
            icon: "code"
        },
        children: [
            {
                data: {
                    title: "远程棋谱播放",
                    caption: "播放远程棋谱",
                    icon: "code"
                },
                link: "#/main/go?remote=1"
            },
            {
                data: {
                    title: "自我博弈",
                    caption: "自我博弈",
                    icon: "code"
                },
                link: "#/main/go"
            }
        ]
    },
    {
        data: {
            title: "围棋咨询",
            caption: "咨询围棋相关事项",
            icon: "public"
        },
        link: "#/main/chat",
    },
    {
        data: {
            title: "登录/注册",
            caption: "登录以使用更多功能",
            icon: "favorite"
        },
        link: "#/main/login",
    },
    // {
    //     data: {
    //         title: "个人信息",
    //         caption: "个人信息页面",
    //         icon: "favorite"
    //     },
    //     link: "#/main/self",
    // },
];

export { linksList }