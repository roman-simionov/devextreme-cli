import auth from "./auth";
import { createRouter, createWebHashHistory } from "vue-router";

<%=^empty%>import Home from "./views/home";
import Profile from "./views/profile";
import Tasks from "./views/tasks";
<%=/empty%>import defaultLayout from "./layouts/<%=layout%>";
import simpleLayout from "./layouts/single-card";

function loadView(view) {
  return () => import (/* webpackChunkName: "login" */ `./views/${view}.vue`)
}

const router = new createRouter({
  routes: [<%=#empty%>
    {
      path: "/",
      meta: {
        layout: defaultLayout
      }
    },<%=/empty%><%=^empty%>
    {
      path: "/home",
      name: "home",
      meta: {
        requiresAuth: true,
        layout: defaultLayout
      },
      component: Home
    },
    {
      path: "/profile",
      name: "profile",
      meta: {
        requiresAuth: true,
        layout: defaultLayout
      },
      component: Profile
    },
    {
      path: "/tasks",
      name: "tasks",
      meta: { 
        requiresAuth: true,
        layout: defaultLayout
      },
      component: Tasks
    },<%=/empty%>
    {
      path: "/login-form",
      name: "login-form",
      meta: {
        requiresAuth: false,
        layout: simpleLayout
      },
      component: loadView("login-form"),
      props: {
        layout: {
          title: "Sign In"
        }
      }
    },
    {
      path: "/reset-password",
      name: "reset-password",
      meta: {
        requiresAuth: false,
        layout: simpleLayout
      },
      component:  loadView("reset-password-form"),
      props: {
        layout: {
          title: "Reset Password",
          description: "Please enter the email address that you used to register, and we will send you a link to reset your password via Email."
        }
      }
    },
    {
      path: "/create-account",
      name: "create-account",
      meta: {
        requiresAuth: false,
        layout: simpleLayout
      },
      component: loadView("create-account-form"),
      props: {
        layout: {
          title: "Sign Up"
        }
      }
    },
    {
      path: "/change-password/:recoveryCode",
      name: "change-password",
      meta: {
        requiresAuth: false,
        layout: simpleLayout
      },
      component: loadView("change-password-form"),
      props: {
        layout: {
          title: "Change Password"
        }
      }
    },<%=^empty%>
    {
      path: "/",
      redirect: "/home"
    },
    {
      path: "/recovery",
      redirect: "/home"
    },
    {
      path: "/:pathMatch(.*)*",
      redirect: "/home"
    }<%=/empty%><%=#empty%>
    {
      path: "/:pathMatch(.*)*",
      redirect: "/"
    }<%=/empty%>
  ],
  history: createWebHashHistory()
});

router.beforeEach((to, from, next) => {

  if (to.name === "login-form" && auth.loggedIn()) {
    next({ name: "home" });
  }

  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (!auth.loggedIn()) {
      next({
        name: "login-form",
        query: { redirect: to.fullPath }
      });
    } else {
      next();
    }
  } else {
    next();
  }
});

export default router;
