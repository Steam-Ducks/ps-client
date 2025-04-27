<template>
  <div class="side-bar">

    <div>
      <router-link to="/home">
        <img src="@/assets/PontualLogo.png" alt="Logo" class="logo-top">
      </router-link>
    </div>

    <div class="nav-section">

      <ul class="nav-bar" >

        <li class="nav-item">
          <router-link to="/home" class="nav-link">
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
          <router-link to="/position" class="nav-link">
            <BriefcaseIcon class="icon"/> 
            <p> Cargos </p>
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

        <li v-if="isAdmin" class="nav-item">
          <router-link to="/user" class="nav-link">
            <UserIcon class="icon"/>
            <p> Usuário </p>
          </router-link>
        </li>

      </ul>
    </div>

    <div class="nav-footer">
      <img src="@/assets/SteamDucksLogo.png" alt="Logo" class="logo-bottom">
    </div>

  </div>
</template>

<script>
import { HomeIcon, BuildingOffice2Icon, IdentificationIcon, CalendarDateRangeIcon, UserIcon } from '@heroicons/vue/24/solid'
import { BriefcaseIcon } from '@heroicons/vue/24/solid'
import UserService from "@/services/UserService";

export default {
  name: 'SideBar',

  components: {

    HomeIcon,
    BuildingOffice2Icon,
    IdentificationIcon,
    CalendarDateRangeIcon,
    UserIcon,
    BriefcaseIcon,
  },

  data() {
    return {
      isAdmin: false,
    };
  },

  created() {
    this.isAdmin = UserService.getIsAdmin();
  },
};
</script>

<style >
  .side-bar {
    text-align: center;
    background-color: #fff;
    width: 261px;
    height: 100%;
    position: fixed;
    top: 0;
    left: 0;
    border: 1px solid #ccc;
    z-index:2;
    padding: 10px;
    color: #6F08AF;
    font-family: Nunito;
    display: flex;
    flex-direction: column;
  }

  .logo-top {
    width: 70%;
    margin-bottom: 20px;
  }

  .logo-bottom {
    width: 80px;

  }

  .nav-bar{
    list-style-type: none;
    padding: 0;

    width: 100%;
  }

  .nav-link{
    display: flex;
    align-items: center;
    text-decoration: none;
    font-size: 18px;
    border-radius: 10px;
    color: #6F08AF;
    font-family: Nunito;
    padding: 10px; 
    margin-bottom: 5px; 
  }

  .nav-link:hover {
    background-color: #f0f0f0;
  }


  .router-link-exact-active {
    background-color: #e8d4f5; 
    font-weight: bold;
  }

  .icon {
    width: 24px; 
    height: 24px;
    margin-right: 10px;
  }

  .nav-footer{
    margin-top: auto; 
    padding-bottom: 17px; 
  }

  .nav-section{

    overflow-y: auto;
  }
</style>
