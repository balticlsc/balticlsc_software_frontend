<template id="sidebar">
  <div>
      <ul class="navbar-nav bg-gradient-primary sidebar sidebar-dark accordion toggled" id="accordionSidebar">
      <router-link class="sidebar-brand d-flex align-items-center justify-content-center" :to="{name: 'AppStore'}">
        <div class="sidebar-brand-icon mt-2">
          <img src="@/assets/logo_blue.jpg" alt="Smiley face" style="max-width:100%;">
        </div>
        <div class="sidebar-brand-text mx-3">BalticLSC</div>
      </router-link>

      <!-- Divider -->
      <hr class="sidebar-divider my-0">
      <hr class="sidebar-divider">

      <!-- Nav Item - Dashboard -->
      <li class="nav-item active">
        <router-link class="nav-link" :to="{name: 'AppStore'}">
          <i class="fas fa-fw fa-store"></i>
          <span>App store</span>
        </router-link>
      </li>

      <li class="nav-item active">




        <router-link class="nav-link" to="/app-shelf">
          <!-- <i class="fas fa-fw fa-tasks"></i> -->
          <i class="fas fa-tachometer-alt"></i>

          <span>Computation cockpit</span>
        </router-link>
      </li>

      <li class="nav-item active">




        <router-link class="nav-link" to="/data-shelf">
          <!-- <i class="fas fa-fw fa-store"></i> -->
          <i class="fas fa-fw fa-database"></i>

          <span>Data shelf</span>
        </router-link>
      </li>






      <!-- <li class="nav-item active">
        <router-link class="nav-link" to="/resources-shelf">
          <i class="fas fa-fw fa-server"></i>

          <span>Resources shelf</span>
        </router-link>
      </li> -->

      <li class="nav-item active">
        <router-link class="nav-link" to="/development-shelf">
          <!-- <i class="fas fa-fw fa-store"></i> -->
          <i class="fas fa-fw fa-tools"></i>

          <span>Development shelf</span>
        </router-link>
      </li>

      <!-- <li class="nav-item active">
        <router-link class="nav-link" :to="{name: 'AdminPanel'}">
          <i class="fas fa-users-cog"></i>
          <span>Admin panel</span>
        </router-link>
      </li>
      -->

      <li class="nav-item active">
        <a class="nav-link" href="https://www.balticlsc.eu/balticlsc-demo/" target="_blank">
          <i class="fas fa-fw fa-info-circle"></i>

          <span>Help for the Demo</span>
        </a>
      </li>

    </ul>
  </div>
</template>
