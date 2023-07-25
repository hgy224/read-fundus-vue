// router/index.js
import { createRouter, createWebHistory } from 'vue-router'
import FundusDataset from '@/components/FundusDataset'
import DoctorLabel from "@/components/DoctorLabel";
import DiagnosisFundus from "@/components/DiagnosisFundus";
import FundusLabel from "@/components/FundusLabel";
const routes = [
    { path: '/',
      component: FundusDataset,
      children: [
        {
          path: "/doctor",
          component: DoctorLabel,
          meta: {requireAuth: true},
        }
      ]},
    { path: '/diagnosis',
      component: DiagnosisFundus,
      meta: {requireAuth: true}
    },
    { path: '/label',
      component: FundusLabel,
      meta: {requireAuth: true}
    }
  ]

const router = createRouter({
  history: createWebHistory(),
  routes:routes
})

export default router
