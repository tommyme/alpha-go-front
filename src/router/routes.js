// this file is no longer available, please refer to vite-plugin-pages
const routes = [
  {
    path: '/',
    component: () => import('src/pages/MainLayout.vue'),
    children: [
      { path: '', component: () => import('src/pages/main/IndexPage.vue') },
      { path: 'people', component: () => import('src/pages/main/rank.vue') },
      { path: 'play', component: () => import('src/pages/main/go.vue') },
      { path: 'articles', component: () => import('src/pages/main/article/ArticleList.vue') },
      { path: 'article/:id', component: () => import('src/pages/main/article/ViewArticle.vue') },
      { path: 'live', component: () => import('src/pages/main/live.vue') },
      { path: 'code', component: () => import('pages/CodeView.vue') },
      { path: 'chat', component: () => import('src/pages/admin/chat.vue') },
    ]
  },
  { path: '/login', component: () => import('src/pages/main/login.vue') },
  {
    path: '/admin',
    component: () => import('src/layouts/admin.vue'),
    children: [
      { path: 'articles', component: () => import('src/pages/admin/add.vue') },
      { path: 'articles/add', component: () => import('src/pages/admin/list.vue') },
    ]
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('src/pages/[...all].vue')
  }
]

export default routes
