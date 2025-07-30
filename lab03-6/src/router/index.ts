import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import PassengerDetailsView from '@/views/PassengerDetailsView.vue'
import AirlineDetailsView from '@/views/AirlineDetailsView.vue'
import EditPassengerView from '@/views/EditPassengerView.vue'

const FORCE_RELOAD_PATHS = ['/external-redirect', '/legacy-page'];
const FORCE_RELOAD_DOMAINS = ['https://external.site.com'];       


type CustomRouteMeta = {
  title?: string;
};

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
      meta: {
        title: 'Home - Flight Booking',
      },
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('@/views/AboutView.vue'),
      meta: {
        title: 'About - Flight Booking',
      },
    },
    {
      path: '/passenger/:id',
      name: 'passenger-details',
      component: PassengerDetailsView,
      meta: {
        title: 'Passenger Details - Flight Booking',
      },
    },
    {
      path: '/airline/:airlineId',
      name: 'airline-details',
      component: AirlineDetailsView,
      meta: {
        title: 'Airline Details - Flight Booking',
      },
    },
    {
      path: '/passenger/:id/edit',
      name: 'edit-passenger',
      component: EditPassengerView,
      meta: {
        title: 'Edit Passenger - Flight Booking',
      },
    },
    {
      path: '/resource-not-found',
      name: 'resource-not-found',
      component: () => import('@/views/ResourceNotFoundView.vue'),
      meta: {
        title: 'Resource Not Found - Flight Booking',
      },
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: () => import('@/views/NotFoundView.vue'),
      meta: {
        title: 'Not Found - Flight Booking',
      },
    },
  ],
})

router.afterEach((to) => {
  const defaultTitle = 'Flight Booking';
  const meta = to.meta as CustomRouteMeta;
  document.title = meta.title || defaultTitle;
});

// Improved: Only force reload for specific cases (e.g., when navigating to an external URL or certain routes)
// Avoids unnecessary reloads and reduces resource usage
router.beforeEach((to, _from, next) => {
  if (FORCE_RELOAD_DOMAINS.some(domain => to.fullPath.startsWith(domain))) {
    window.location.href = to.fullPath;
    return;
  }

  if (FORCE_RELOAD_PATHS.includes(to.path)) {
    window.location.href = to.fullPath;
    return;
  }

  next();
});


export default router
