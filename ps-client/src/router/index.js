import { createRouter, createWebHistory } from 'vue-router';
import AdminLayout from '@/layout/AdmintLayout.vue';
import HomePage from '@/views/home/HomeIndex.vue';
import CompanyPage from '@/views/company/CompanyIndex.vue';
import EmplayeePage from '@/views/employee/EmployeeIndex.vue';
import timeRecordPage from '@/views/timeRecord/TimeRecordIndex.vue';
import UserPage from '@/views/users/UserIndex.vue';

const routes = [
  {
    path: '/',
    component: AdminLayout,
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
    children: [
      {
        path: '',
        component: UserPage
      }
    ]
  },
  {
    path: '/company',
    component: AdminLayout,
    children: [
      {
        path: '',
        component: CompanyPage
      }
    ]
  },
  {
    path: '/emplayee',
    component: AdminLayout,
    children: [
      {
        path: '',
        component: EmplayeePage
      }
    ]
  },
  {
    path: '/ponto',
    component: AdminLayout,
    children: [
      {
        path: '',
        component: timeRecordPage
      }
    ]
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;
