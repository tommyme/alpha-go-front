
const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/IndexPage.vue') },
      { path: 'people', component: () => import('pages/PeoplePage.vue') },
      { path: 'play', component: () => import('pages/GoPlay.vue') },
      { path: 'article', component: () => import('pages/ViewArticle.vue') },
      { path: 'live', component: () => import('pages/LiveStream.vue') },
      { path: 'code', component: () => import('pages/CodeView.vue') },
      { path: 'chat', component: () => import('pages/ChatPage.vue') },
    ]
  },
  { path: '/login', component: () => import('pages/LoginPage.vue') },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue')
  }
]

export default routes
