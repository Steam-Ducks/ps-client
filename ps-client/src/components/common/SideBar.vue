<template>
  <div class="side-bar">
    <img src="@/assets/PontualLogo.png" alt="Logo" class="logo-top">

    <div class="nav-section">
      
      <ul class="nav-bar" >

        <li class="nav-item">
          <router-link to="/" class="nav-link">
            <HomeIcon class="icon" />
            <p>Home</p>
          </router-link>
        </li>

        <li class="nav-item">
          <router-link to="/company" class="nav-link">
            <BuildingOffice2Icon class="icon"/>
            <p>Empresas</p>
          </router-link>
        </li>

        <li class="nav-item">
          <router-link to="/employee" class="nav-link">
            <IdentificationIcon class="icon"/>
            <p> Funcionário </p>
          </router-link>
        </li>

        <li class="nav-item">
          <router-link to="/ponto" class="nav-link">
            <CalendarDateRangeIcon class="icon"/>
            <p> Espelho de ponto </p>
          </router-link>
        </li>

        <li class="nav-item">
          <router-link to="/user" class="nav-link">
            <UserIcon class="icon"/>
            <p> Usuário </p>
          </router-link>
        </li>

      </ul>
    </div>

    <img src="@/assets/SteamDucksLogo.png" alt="Logo" class="logo-bottom">
  </div>
</template>

<script>
import { HomeIcon } from '@heroicons/vue/24/solid'
import { BuildingOffice2Icon } from '@heroicons/vue/24/solid'
import { IdentificationIcon } from '@heroicons/vue/24/solid'
import { CalendarDateRangeIcon } from '@heroicons/vue/24/solid'
import { UserIcon } from '@heroicons/vue/24/solid'

export default {
  name: 'SideBar',

  components: {
    HomeIcon,
    BuildingOffice2Icon,
    IdentificationIcon,
    CalendarDateRangeIcon,
    UserIcon,
  }
};
</script>

<style scoped>

  .side-bar {
    text-align: center;
    background-color: #fff;
    width: 261px;
    height: 100vh;
    position: fixed; 
    top: 0; 
    left: 0;
    border: 1px solid #ccc;
    z-index:2;
    padding: 10px;
    color: #551a8b;
    font-family: Nunito;
  }

  img{
    width: 200px;
  }

  .logo-top {
  width: 200px;
  margin-bottom: 20px;
}

.logo-bottom {
  width: 70px;
  margin-top: 110%;
}

  .nav-bar{
    list-style-type: none;
    border-top: 1px solid #ccc;
    padding: 0;
    margin: 0;
    width: 100%;
  }

  .nav-link{
    display: flex;
    align-items: center;
    text-decoration: none;
    font-size: 18px;
    border-radius: 10px;
    color: #551a8b;
    font-family: Nunito;
    padding: 0 10px 0 10px;
  }

  .nav-link:hover {
    background-color: #f0f0f0;
  }

  .icon {
    width: 28px; 
    height: 28px;
    margin-right: 10px;
  }

  
</style>
