import { createRouter, createWebHistory } from 'vue-router';
import AdminLayout from '@/layout/AdmintLayout.vue';
import HomePage from '@/views/home/HomeIndex.vue';
import CompanyPage from '@/views/company/CompanyIndex.vue';
import EmployeePage from '@/views/employee/EmployeeIndex.vue';
import timeRecordPage from '@/views/timeRecord/TimeRecordIndex.vue';
import UserPage from '@/views/users/UserIndex.vue';
import EmployeeFormTest from '@/components/EmployeeFormTest.vue'; 

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
    path: '/employee',
    component: AdminLayout,
    children: [
      {
        path: '',
        component: EmployeePage
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

  {
    path: '/employee-form-test', // The URL for your test page
    name: 'employee-form-test',
    component: EmployeeFormTest, // Use the test component here
  },

];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;
