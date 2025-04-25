import { createRouter, createWebHistory } from 'vue-router';
import AdminLayout from '@/layout/AdmintLayout.vue';
import HomePage from '@/views/home/HomeIndex.vue';
import CompanyPage from '@/views/company/CompanyIndex.vue';
import EmployeePage from '@/views/employee/EmployeeIndex.vue';
import timeRecordPage from '@/views/timeRecord/TimeRecordIndex.vue';
import UserPage from '@/views/users/UserIndex.vue';
<<<<<<< Updated upstream
import Test from '@/components/Test.vue';
import LoginPage from '@/views/auth/AuthIndex.vue';
import admintLayout from "@/layout/AdmintLayout.vue";
=======
import PositionPage from '@/views/position/PositionIndex.vue';
import Test from '@/components/Test.vue'; 
>>>>>>> Stashed changes

const routes = [
  {
    path: '/',
    name: 'Login',
    component: LoginPage,
  },
  {
    path: '/home',
    name: 'Home',
    meta: { requiresAuth: true },
    component: admintLayout,
    children: [
      {
        path: '',
        component: HomePage
      }
    ]
  },
  {
    path: '/user',
    component: AdminLayout,
    meta: { requiresAuth: true },
    children: [
      {
        path: '',
        component: UserPage,
      },
    ],
  },
  {
    path: '/company',
    component: AdminLayout,
    meta: { requiresAuth: true },
    children: [
      {
        path: '',
        component: CompanyPage,
      },
    ],
  },
  {
    path: '/employee',
    component: AdminLayout,
    meta: { requiresAuth: true },
    children: [
      {
        path: '',
        component: EmployeePage,
      },
    ],
  },
  {
    path: '/ponto',
    component: AdminLayout,
    meta: { requiresAuth: true },
    children: [
      {
        path: '',
        component: timeRecordPage,
      },
    ],
  },
  {
<<<<<<< Updated upstream
    path: '/Test',
=======
    path: '/position',
    component: AdminLayout,
    children: [
      {
        path: '',
        component: PositionPage
      }
    ]
  },

  {
    path: '/Test', 
>>>>>>> Stashed changes
    name: 'Test',
    component: Test,
    meta: { requiresAuth: true },
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  const isAuthenticated = !!localStorage.getItem('token');
  console.log('Navigating to:', to.fullPath, 'Authenticated:', isAuthenticated);
  if (to.meta.requiresAuth && !isAuthenticated) {
    next({ name: 'Login', query: { redirect: to.fullPath } });
  } else {
    next();
  }
});
export default router;